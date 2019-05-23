const environment = require('./.env');
const migrations = require('./utils/migrations.js');

const mysql = require('./config/mysql.js');

const mysql_connection = mysql.init();


const create_migration_file = function(file_data, table_name) {
  console.log('Creating file');
}

let tables = [];
mysql.get_database_tables(mysql_connection).then((result) => {
  tables = result.map(r => r[`Tables_in_${environment.DATABASE}`]);

  // Iterate the tables
  tables.forEach((table_name) => {
    mysql.get_table_definition(mysql_connection, table_name).then((table_definition) => {
      // Generate migration
      const migration_data = migrations.generate_table_migration(table_definition);
      create_migration_file(migration_data, table_name);
    }).catch(() => {
      console.log('--- Error getting table definition ---');
    });
  });
}).catch(() => {
  console.log('Error getting database tables');
});
