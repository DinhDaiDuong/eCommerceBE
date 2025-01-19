const { Sequelize } = require('sequelize');

class Database {
    constructor() {
        this.sequelize = new Sequelize('ecom', 'root', null, {
            host: 'localhost',
            dialect: 'mysql',
            logging: false,
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    getSequelize() {
        return this.sequelize;
    }
}
module.exports = Database.getInstance();