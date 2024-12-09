// validators.js

// Проверка уникальности ASIN (можно добавить запрос к базе данных для проверки уникальности)
export const validateAsin = async (asin, AmazonProduct) => {
    if (!asin) {
        return 'Поле ASIN не должно быть пустым';
    }
    
    // Проверка уникальности ASIN в базе данных
    const existingProduct = await AmazonProduct.findOne({ where: { asin } });
    if (existingProduct) {
        return 'ASIN уже существует';
    }

    return null;
};
