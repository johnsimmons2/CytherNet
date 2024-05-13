# App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.5.

## Build & Deploy (Web)

Run `ng serve` for a static dev server. Navigate to `http://localhost:4200/`.

For a production build `npm run build-prod` and `npm run start`

For local development with hot reload via nodemon, `npm run start-local`

Using Express, an API proxy forwards local requests on `/api` to port `:5000`, where the API runs by default. The web can be accessed via localhost on `:8080`.

## Build & Deploy (API)
Navigate to subdirectory `/CytherApi`, the API is a Python Flask project. To run the API (default port `:5000`) run `flask run` or simply `python3 app.py`.

### Migrations
#### Adding a migration
After schema / model changes within SQLAlchemy code, close the API and run `alembic revision --autogenerate -m "commit message"`, this will create a migration script in `/migrations/versions`.

#### Running a migration
After creating a migration, to synchronize the Database with the Code, run `alembic upgrade head`.

#### Undo a Migration
If the migration has already been run, you can use `alembic downgrade -1` to undo the last 1 migration.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
