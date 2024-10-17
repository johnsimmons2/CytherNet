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

## TODO:
- Character to User attachment via user manager -> characters
  - Add "User character manager" shortcut button in DMaster
- View character on my page
- Owner or admin can modify certain fields, admin only can modify certain fields
- List of "met" characters: a set for each character to each character they have met.
  - Player can add characters they meet or admin can add them on the fly. Player meets character A, admin adds A to characters met list for player.
- Inventory management. Be able to select active user and see their inventory
  - If a player has met another player and that player has their inventory set to public, then other users may see their inventory.
  - Admin may add or remove items, allowing transfer of items. Eventually players should be able to freely transfer items to eachother pending certain restrictions.
- Mobile friendly
- Players can inspect details about fields that have more information, such as class, subclass, spells, etc.
- Player can view full stat sheet, or current "status" which is health, ac, spell slots, other resources, etc.
  - Temporary status elements can be added to ext table that will appear until removed or disabled by admin, 
  so the admin needs a separate management view of the character than the owner does. Such elements could be initiative, status debuffs, etc.
- Basic page of information about the campaign. A summary as well as a link to add private notes. Notes can be set to public, to enable a semi-forum. Players can separately see their notes in the journal tab.


At any given time, a user logged in will have a campaign selected, then and only then they may have a character selected. If neither is true, their movement on the site is restricted until they select or create a campaign. Then they may select a character on their "my characters" tab.
