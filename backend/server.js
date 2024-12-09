// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan'; // Для логирования запросов
import path from 'path';  // Для работы с путями файлов
import { getProducts, renderCreateProductForm, createProduct, viewProductDetails, editProductForm, updateProduct, deleteProduct } from './products.js'; // Импортируем функцию для получения продуктов
import {getSystemInfo} from './systemInfo.js';
import { getFileInfo } from './fileInfo.js'
import { handle404Error } from './errorHandler.js'; // Импорт обработчика 404 ошибки

const app = express();
const PORT = process.env.PORT || 3000;


app.set('views', './backend/views'); 
// Настроим шаблонизатор EJS
app.set('view engine', 'ejs');

// Включаем CORS для всех маршрутов
app.use(cors());

// Для парсинга JSON и данных формы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Логирование запросов
app.use(morgan('combined'));

// Указываем Express обслуживать статические файлы из папки 'data'
app.use('/data', express.static(path.resolve('backend/data')));

// Страница для получения информации об операционной системе
app.get('/system-info', getSystemInfo);

// Страница для получения информации из файла
app.get('/file-info', getFileInfo);

// Страница с продуктами
app.get('/products', getProducts);


// Страница для отображения формы создания нового продукта
app.get('/products/create', renderCreateProductForm);

// Обработка POST-запроса для создания нового продукта
app.post('/products/create', createProduct);

//страница для отображение подробной информации о продукте
app.get('/products/:asin', viewProductDetails);

// Страница для редактирования продукта
app.get('/products/edit/:asin', editProductForm);


// Обработка POST-запроса для обновления продукта
app.post('/products/edit/:asin', updateProduct);

// Обработка удаления продукта
app.post('/products/delete/:asin',deleteProduct);


// Обработка ошибок 404
app.use(handle404Error);


// Стартуем сервер
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
