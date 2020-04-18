const low = require('lowdb');
const fileSync = require('lowdb/adapters/FileSync');
const adapter = new fileSync('db.json');
const db = low(adapter);


const dbCRUD = {
  get: table => {
    return db.get(table)
      .value();
  },
}

module.exports = dbCRUD;