// Обработка ошибок 404
export const handle404Error = (req, res) => {
    res.status(404).send("Страница не найдена");
};