import { Injectable } from "@angular/core";
import Dexie from "dexie";


@Injectable({
  providedIn: 'root'
})
export class DatabaseService extends Dexie {

  table_definitions: { [key: string]: string } = {
    'db_version': '++id, updated, version',
    'users': '&id, &username, &email, firstName, lastName, lastOnline, created, roles',
    'characters': '&id, &name, &statsheetId, classId, subclassId, raceId, languages, speed, type, proficiencyBonus',
    'notes': '&id, name, description, type, creator, created, updated, tags, directory',
  };

  constructor() {
    super('CytherDatabase');
    this.version(1).stores(this.table_definitions);
  }

}
