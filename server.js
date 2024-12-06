// server.js
import express from 'express';
import cors from 'cors';
import AmazonProduct from './AmazonModel.js'; // Импорт модели сущности AmazonProduct
import bodyParser from 'body-parser';
import morgan from 'morgan'; // Для логирования запросов

const app = express();
const PORT = process.env.PORT || 3000;

// Настроим шаблонизатор EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// Включаем CORS для всех маршрутов
app.use(cors());

// Для парсинга JSON и данных формы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use(morgan('combined'));

// Статические файлы (например, для картинок или стилей)
app.use(express.static('public'));

// Статистика операционной системы
app.get('/os-info', (req, res) => {
    const os = require('os');
    res.json({
        platform: os.platform(),
        architecture: os.arch(),
        cpus: os.cpus(),
        memory: os.totalmem(),
    });
});

// Маршрут для получения всех продуктов (с фильтрацией и сортировкой)
app.get('/products', async (req, res) => {
    try {
        const { sortBy = 'name', filterBy = '' } = req.query;  // Параметры сортировки и фильтрации
        const products = await AmazonProduct.findAll({
            where: {
                name: {
                    [Op.like]: `%${filterBy}%` // Фильтрация по имени
                }
            },
            order: [[sortBy, 'ASC']], // Сортировка
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении данных', error });
    }
});

// Маршрут для получения одного продукта
app.get('/products/:id', async (req, res) => {
    try {
        const product = await AmazonProduct.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении продукта', error });
    }
});

// Маршрут для создания нового продукта
app.post('/products/create', async (req, res) => {
    const { name, asin, price, stars, total_reviews } = req.body;
    try {
        const newProduct = await AmazonProduct.create({
            name,
            asin,
            price,
            stars,
            total_reviews,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании продукта', error });
    }
});

// Маршрут для редактирования продукта
app.put('/products/edit/:id', async (req, res) => {
    try {
        const product = await AmazonProduct.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }
        const { name, price, stars, total_reviews } = req.body;
        await product.update({ name, price, stars, total_reviews, updatedAt: new Date() });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при редактировании продукта', error });
    }
});

// Маршрут для удаления продукта
app.delete('/products/delete/:id', async (req, res) => {
    try {
        const product = await AmazonProduct.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Продукт успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении продукта', error });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер работает на порту ${PORT}`);
});
