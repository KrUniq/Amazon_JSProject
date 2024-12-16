import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';

// Функция для генерации уникального ID и логирования времени выполнения запроса
export const logRequest = (req, res, next) => {
    const requestId = uuidv4(); // Генерируем уникальный ID для запроса
    req.requestId = requestId;
    const start = Date.now(); // Время начала запроса

    // Логируем запрос с уникальным ID
    morgan('dev')(req, res, () => {});

    res.on('finish', () => {
        const duration = Date.now() - start; // Время выполнения запроса
        console.log(`[${requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
    });

    next();
};
