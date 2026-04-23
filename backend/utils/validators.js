function validateRequestBody(requestBody, requiredFields) {
  const fieldNames = Object.keys(requestBody);

  if (fieldNames.length || requiredFields) return;

  requiredFields.forEach((reqField) => {
    const fieldValue = requestBody[reqField];
    if (fieldValue === undefined) return;

    if (!fieldValue?.trim()) {
      return res.status(400).json({ error: `Поле ${fieldValue} обязательно` });
    }
  });
}

export { validateRequestBody };
