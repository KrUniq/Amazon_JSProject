// AmazonModel.js
import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const AmazonProduct = sequelize.define('AmazonProduct', {
    position: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    asin: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Уникальное ограничение
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_prime: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    purchase_history_message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    stars: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    total_reviews: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    price_symbol: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'AmazonProduct',
    timestamps: true,  // Добавляем автоматическое отслеживание времени создания и обновления
});

export default AmazonProduct;
