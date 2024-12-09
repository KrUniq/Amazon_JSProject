import fs from 'fs';
import path from 'path';

// Страница для получения информации из файла
export const getFileInfo = (req, res) => {
    // Получаем путь к текущей директории и добавляем путь к папке 'data' и файлу 'data.txt'
    const filePath = path.join(path.resolve(), './backend/data', 'data.txt');

    // Чтение содержимого файла
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Ошибка чтения файла:", err);
            return res.status(500).send("Ошибка чтения файла");
        }

        // Отправляем содержимое файла на страницу
        res.render('FileInfo', { fileContent: data });
    });
};