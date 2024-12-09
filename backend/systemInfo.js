import os from 'os';

// Страница для получения информации об операционной системе
export const getSystemInfo = (req, res) => {
    const systemInfo = {
        osType: os.type(),        // Тип операционной системы
        osPlatform: os.platform(), // Платформа
        totalMemory: os.totalmem(), // Общая память
        freeMemory: os.freemem(), // Свободная память
        uptime: os.uptime(), // Время работы системы
    };
    res.render('SystemInfo',{systemInfo}); // Отобразим форму для создания нового продукта
};