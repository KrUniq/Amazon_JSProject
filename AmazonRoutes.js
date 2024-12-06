// AmazonRoutes.js
import express from 'express';
import AmazonProduct from '../AmazonModel.js';

const router = express.Router();

// Маршрут для получения всех продуктов (с фильтрацией и сортировкой)
router.get('/api', async (req, res) => {
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

        // Вычисление статистики
        const avgPrice = (products.reduce((acc, product) => acc + product.price, 0) / products.length).toFixed(2);
        const avgRating = (products.reduce((acc, product) => acc + (product.stars || 0), 0) / products.length).toFixed(2);
        const avgReviews = (products.reduce((acc, product) => acc + (product.total_reviews || 0), 0) / products.length).toFixed(0);

        res.json({
            products,
            avgPrice,
            avgRating,
            avgReviews
        });
    } catch (error) {
        console.error('Ошибка при получении данных с Amazon:', error);
        res.status(500).send('Ошибка при получении данных с Amazon');
    }
});

// Маршрут для получения одного продукта
router.get('/api/:id', async (req, res) => {
    try {
        const product = await AmazonProduct.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }
        res.json(product);
    } catch (error) {
        console.error('Ошибка при получении продукта:', error);
        res.status(500).json({ message: 'Ошибка при получении продукта', error });
    }
});

// Маршрут для создания нового продукта
router.post('/api/create', async (req, res) => {
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
        console.error('Ошибка при создании продукта:', error);
        res.status(500).json({ message: 'Ошибка при создании продукта', error });
    }
});

// Маршрут для редактирования продукта
router.put('/api/edit/:id', async (req, res) => {
    try {
        const product = await AmazonProduct.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }
        const { name, price, stars, total_reviews } = req.body;
        await product.update({ name, price, stars, total_reviews, updatedAt: new Date() });
        res.json(product);
    } catch (error) {
        console.error('Ошибка при редактировании продукта:', error);
        res.status(500).json({ message: 'Ошибка при редактировании продукта', error });
    }
});

// Маршрут для удаления продукта
router.delete('/api/delete/:id', async (req, res) => {
    try {
        const product = await AmazonProduct.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Продукт не найден' });
        }
        await product.destroy();
        res.status(200).json({ message: 'Продукт успешно удален' });
    } catch (error) {
        console.error('Ошибка при удалении продукта:', error);
        res.status(500).json({ message: 'Ошибка при удалении продукта', error });
    }
});

// Для рендеринга страницы Amazon с продуктами (не обязательный пункт, если требуется UI)
router.get('/', async (req, res) => {
    try {
        const products = await AmazonProduct.findAll();

        // Вычисление статистики
        const avgPrice = (products.reduce((acc, product) => acc + product.price, 0) / products.length).toFixed(2);
        const avgRating = (products.reduce((acc, product) => acc + (product.stars || 0), 0) / products.length).toFixed(2);
        const avgReviews = (products.reduce((acc, product) => acc + (product.total_reviews || 0), 0) / products.length).toFixed(0);

        res.render('amazon', {
            products,
            avgPrice,
            avgRating,
            avgReviews
        });
    } catch (error) {
        console.error('Ошибка при получении данных с Amazon:', error);
        res.status(500).send('Ошибка при получении данных с Amazon');
    }
});

export default router;
