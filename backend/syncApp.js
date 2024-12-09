// syncApp.js
import AmazonProduct from '../database/AmazonModel.js'; // Импортируем модель базы данных для продуктов Amazon
import sequelize from '../database/connection.js'; // Подключаем объект подключения к базе данных

(async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('База данных синхронизирована.');
        process.exit(0);
    } catch (error) {
        console.error('Ошибка при синхронизации базы данных:', error);
        process.exit(1);
    }
})();
