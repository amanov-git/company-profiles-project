const db = require('../database');

const getAllCategories = async (req, res) => {
  const getCategoriesQuery = `
    SELECT cc.id, cc.category_name 
    FROM company_categories cc
    ORDER BY cc.id
  `;

  try {
    const { rows } = await db.query(getCategoriesQuery);
    return res.status(200).json(rows);
  } catch (error) {
    console.log('Error: ', error);
    return res.sendStatus(500);
  };
};

module.exports = {
  getAllCategories,
};