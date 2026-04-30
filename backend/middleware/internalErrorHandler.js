export const internalErrorHandler = (err, req, res, next) => {
  console.error(`Ошибка в ${req.method} ${req.path}:`, error);
  res.status(500).json({ error: `Internal server error` });
};
