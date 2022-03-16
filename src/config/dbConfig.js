const DB_DIALECT = 'sqlite';

module.exports = {
	local: {
		dialect: DB_DIALECT,
		storage: './database.sqlite3'
	},
	testing: {
		dialect: DB_DIALECT,
		storage: './test-database.sqlite3'
	}
};
