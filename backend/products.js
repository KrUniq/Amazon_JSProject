import AmazonProduct from '../database/AmazonModel.js'; // Импорт модели AmazonProduct
import { Op } from 'sequelize'; // Импортируем операторы для Sequelize

export const getProducts = async (req, res) => {
    try {
        // Получаем фильтры и параметры сортировки из запроса
        let { sortBy = 'name', sortOrder = 'ASC', filterPriceMin, filterPriceMax, filterRatingMin, filterRatingMax } = req.query;

        // Устанавливаем значения по умолчанию для фильтров
        filterPriceMin = filterPriceMin || 0; // Минимальная цена по умолчанию 0
        filterPriceMax = filterPriceMax || Infinity; // Максимальная цена по умолчанию Infinity
        filterRatingMin = filterRatingMin || 0; // Минимальный рейтинг по умолчанию 0
        filterRatingMax = filterRatingMax || 5; // Максимальный рейтинг по умолчанию 5

        // Создаем условия для фильтрации
        const whereCondition = {
            price: {
                [Op.gte]: filterPriceMin, // Больше или равно минимальной цене
                [Op.lte]: filterPriceMax  // Меньше или равно максимальной цене
            },
            stars: {
                [Op.gte]: filterRatingMin, // Больше или равно минимальному рейтингу
                [Op.lte]: filterRatingMax  // Меньше или равно максимальному рейтингу
            }
        };

        // Получаем все продукты с фильтрацией и сортировкой
        const products = await AmazonProduct.findAll({
            where: whereCondition, // Применяем фильтрацию
            order: [[sortBy, sortOrder]] // Применяем сортировку
        });

        // Отправляем данные на страницу через EJS
        res.render('Amazon', { 
            products, 
            sortBy, 
            sortOrder, 
            filterPriceMin, 
            filterPriceMax, 
            filterRatingMin, 
            filterRatingMax 
        });
    } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
        res.status(500).send('Ошибка при получении продуктов');
    }
};

// Отображение формы создания нового продукта
export const renderCreateProductForm = (req, res) => {
    res.render('AmazonCreate', { products: {}, errorMessage: '' });
};

export const createProduct = async (req, res) => {
    const { name, asin, price, stars, total_reviews } = req.body;

    // Проверка уникальности ASIN
    const existingProduct = await AmazonProduct.findOne({ where: { asin } });
    
    if (existingProduct) {
        // Если продукт с таким ASIN уже существует, показываем ошибку
        return res.render('AmazonCreate', {
            errorMessage: 'Продукт с таким ASIN уже существует!',
            products: { name, asin, price, stars, total_reviews } // Передаем данные для формы
        });
    }

    // Если ASIN уникален, создаём новый продукт
    try {
        await AmazonProduct.create({ name, asin, price, stars, total_reviews });
        res.redirect('/products'); // Перенаправляем на список продуктов
    } catch (error) {
        console.error('Ошибка при создании продукта:', error);
        res.status(500).send('Ошибка при создании продукта');
    }
};

// Страница для отображения подробной информации о продукте
export const viewProductDetails = async (req, res) => {
    try {
        const product = await AmazonProduct.findOne({ where: { asin: req.params.asin } });
        
        if (!product) {
            return res.status(404).send('Продукт не найден' );
        }

        // Отображаем страницу с подробной информацией о продукте
        res.render('AmazonDetail', { product });
    } catch (error) {
        console.error('Ошибка при получении продукта:', error);
        res.status(500).send('Ошибка при получении данных' );
    }
};

// Страница для редактирования продукта
export const editProductForm = async (req, res) => {
    try {
        const product = await AmazonProduct.findOne({ where: { asin: req.params.asin } });

        if (!product) {
            return res.status(404).send('Продукт не найден' );
        }

        // Отображаем форму редактирования с данными продукта
        res.render('AmazonEdit', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Ошибка при получении данных');
    }
};

// Обработка POST-запроса для обновления продукта
export const updateProduct = async (req, res) => {
    const { name, price, stars, total_reviews } = req.body;
    try {
        const product = await AmazonProduct.findOne({
            where: { asin: req.params.asin } // Ищем по asin
        });

        if (!product) {
            return res.status(404).send('Продукт не найден' );
        }

        // Обновляем продукт
        await product.update({
            name,
            price,
            stars,
            total_reviews,
            updatedAt: new Date(),
        });

        // Перенаправляем на страницу списка продуктов после успешного обновления
        res.redirect('/products');
    } catch (error) {
        console.error(error);
        res.status(500).send( 'Ошибка при обновлении продукта', error );
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await AmazonProduct.findOne({
            where: { asin: req.params.asin } // Ищем по asin
        });

        if (!product) {
            return res.status(404).send( 'Продукт не найден' );
        }

        // Удаляем продукт
        await product.destroy();

        // Перенаправляем на страницу с продуктами после удаления
        res.redirect('/products');
    } catch (error) {
        console.error(error);
        res.status(500).send( 'Ошибка при удалении продукта', error );
    }
};