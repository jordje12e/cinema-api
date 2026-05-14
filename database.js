const Database = require('better-sqlite3'); 
const db = new Database('./cinema.db'); 
db.pragma('foreign_keys = ON'); 
console.log('П?дключено'); 
module.exports = db; 
//updated
