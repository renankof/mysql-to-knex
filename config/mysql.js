const environment = require('../.env');
const mysql = require('mysql');

const init = function() {
  // MySQL connection
  const mysql_connection = mysql.createConnection({
    host: environment.SERVER,
    user: environment.USER,
    password: environment.PASS,
    database: environment.DATABASE,
  });

  return mysql_connection;
};

const get_database_tables = async function(mysql_connection) {
  return new Promise((resolve, reject) => {
    const query = 'SHOW FULL TABLES WHERE Table_Type != "VIEW"';

    mysql_connection.query(query, async function(err, tables) {
      if (err) {
        console.log('Error when getting database tables');
        console.log(err);
        reject(null);
      }

      resolve(tables);
    });
  });
};

const get_table_definition = async function(mysql_connection, table) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?';

    mysql_connection.query(query, [environment.DATABASE, table], async function(err, definition) {
      if (err) {
        console.log('Error when getting table definition');
        console.log(err);
        reject(null);
      }

      let result = '';
      if (definition.length) {
        result = definition[0];
      } else {
        result = null;
      }

      resolve(result);
    });
  });
};

module.exports = {
  init,
  get_database_tables,
  get_table_definition,
};
