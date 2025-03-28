const handleUndefinedField = (field, elseTo) => {
  return field !== undefined ? field : elseTo;
};

export { handleUndefinedField };