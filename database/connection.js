//connection.js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/database.sqlite',
    dialectOptions: {
        timeout: 20000, 
    },
    retry: {
        max: 5, // Количество повторных попыток
    },
});
export default sequelize;