import { catchError, from, map, Observable, of, switchMap, tap } from "rxjs";
import { ApiResult } from "../model/apiresult";
import { ApiService } from "./api.service";
import { Table } from 'dexie';
import { DatabaseService } from "./database.service";


export abstract class BaseService<T> {

  private readonly DATABASE_REFRESH_TIME: number = 1000 * 60 * 1; // 1 minute

  protected table!: Table<T, number>;

  constructor(
    protected database: DatabaseService,
    protected apiService: ApiService,
  ) {
    this.initializeTable();
  }

  protected abstract getTableName(): string;

  private initializeTable() {
    const tableName: string = this.getTableName();
    this.table = this.database.table<T, number>(tableName);
  }

  private async _getAll(): Promise<T[]> {
    return this.table.toArray();
  }

  private async _getById(id: number): Promise<T | undefined> {
    return this.table.get(id);
  }

  private async _getByKeyValue(key: string, value: any): Promise<T | undefined> {
    return this.table.where(key).equals(value).first();
  }

  private async _save(item: T): Promise<number> {
    return this.table.add(item);
  }

  private async _delete(id: number): Promise<void> {
    return this.table.delete(id);
  }

  private async _update(id: number, item: T): Promise<number | undefined> {
    const exists = await this._getById(id);
    if (exists) {
      return this.table.put(item);
    } else {
      return undefined;
    }
  }

  private _fetchAndCache(endpoint: string, options?: any): Observable<T[]> {
    return this.apiService.get(endpoint, options).pipe(
      map((res: ApiResult) => {
        if (res.success) {
          const data = res.data;
          let items: T[] = [];
          if (Array.isArray(data)) {
            items = data;
          } else {
            items = [data];
          }
          this.table.clear();
          this.table.bulkAdd(items);
          return items;
        } else {
          return [];
        }
      }),

      catchError((error) => {
        console.error(`Error fetching and caching ${endpoint}`, error);
        return of([]);
      })
    );
  }

  private updateDatabaseTimestamp(): any {
    const version = {
      updated: new Date(),
      version: 1
    }
    this.database.table("db_version").clear();
    this.database.table("db_version").add(version);
    return version;
  }

  private pullIfDatabaseOutOfDate(): Observable<void> {
    /**
     * Checks if the update date on db_version is older than the DATABASE_REFRESH_TIME
     * If so, clear the table so that the next process step pulls fresh.
     */
    return from(this.database.table("db_version").toArray()).pipe(
      switchMap((dbVersion: any[]) => {
        if (dbVersion.length === 0) {
          return of(this.updateDatabaseTimestamp());
        }
        return of(dbVersion[0]);
      }),
      tap(async (dbVersion: any) => {
        const lastUpdate = dbVersion.updated || 0;
        const now = Date.now();
        if (now - lastUpdate > this.DATABASE_REFRESH_TIME) {
          console.log(`Database ${this.getTableName()} is out of date. Last updated: ${dbVersion.updated}`);
          await this.table.clear();
          await this.updateDatabaseTimestamp();
        }
      }),
      catchError((error) => {
        console.error("Error pulling from database", error);
        return of(undefined);
      })
    );
  }

  protected delete(endpoint: string, id: number): Observable<ApiResult> {
    return this.apiService.delete(`${endpoint}`).pipe(
      tap(async (res: ApiResult) => {
        if (res.success) {
          await this._delete(id);
        }
      })
    );
  }

  /**
   * Base Service wrapper to get data from backend if the local database is out of date or the data is missing
   * @param endpoint endpoint to hit, including full route and query parameters.
   * @returns list of the objects that were found.
   */
  protected getAll(endpoint: string, options?: any): Observable<T[]> {
    return this.pullIfDatabaseOutOfDate().pipe(
      switchMap(() => {
        return from(this._getAll()).pipe(
          switchMap((items: T[]) => {
            if (items.length > 0) {
              return of(items);
            }
            return this._fetchAndCache(endpoint, options);
          })
        )
      }),
      catchError((error) => {
        console.error(`Error fetching and caching ${endpoint}`, error);
        return of([]);
      })
    );
  }

  protected getAllNoCache(endpoint: string, options?: any): Observable<T[]> {
    return this.pullIfDatabaseOutOfDate().pipe(
      switchMap(() => {
        return this._fetchAndCache(endpoint, options);
      }),
      catchError((error) => {
        console.error(`Error fetching and caching ${endpoint}`, error);
        return of([]);
      })
    );
  }

  /**
   * Base Service wrapper to get data from backend if the local database is out of date or the data is missing
   * @param endpoint endpoint to hit, including full route and query parameters.
   * @param kvp the key value pair to search in the table for first.
   * @returns list of the objects that were found.
   */
  protected get(endpoint: string, kvp: {[key: string]: any}, options?: any): Observable<T[]> {
    return this.pullIfDatabaseOutOfDate().pipe(
      switchMap(() => {
        //
        const [key, value] = [Object.keys(kvp)[0], Object.values(kvp)[0]];
        return from(this._getByKeyValue(key, value)).pipe(
          switchMap((item: T | undefined) => {
            if (item) {
              return of([item]);
            }
            return this._fetchAndCache(endpoint, options);
          })
        )
      })
    );
  }

  protected create(endpoint: string, item: T): Observable<T | undefined> {
    return this.apiService.post(endpoint, item).pipe(
      map((res: ApiResult) => {
        if (res.success) {
          this._save(item);
          return item;
        }
        throw new Error(`Failed to create ${endpoint}`);
      }),
      catchError((error) => {
        console.error(`Error creating ${endpoint}`, error);
        return of(undefined);
      })
    );
  }

  protected update(endpoint: string, id: number, updates: Partial<T>): Observable<ApiResult> {
    return this.apiService.patch(`${endpoint}`, updates).pipe(
      switchMap((res: ApiResult) => {
        if (res.success) {
          return from(this._getById(id)).pipe(
            switchMap((exists: T | undefined) => {
              if (exists) {
                const updated = { ...exists, ...updates };
                return from(this.table.put(updated)).pipe(
                  map(() => res)
                );
              } else {
                return of(res);
              }
            })
          );
        }
        throw new Error(`Failed to update item at ${endpoint}/${id}`);
      }),
      catchError((error) => {
        console.error(`Error updating item at ${endpoint}/${id}:`, error);
        throw error;
      })
    );
  }

}
