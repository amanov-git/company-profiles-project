const db = require('../database');

const getAllTitles = async (req, res) => {
  const getTitlesQuery = `
    SELECT t.id, t.title FROM titles t
  `;

  try {
    const { rows } = await db.query(getTitlesQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.sendStatus(500);
    console.error('Error: ', error);
  };
};

module.exports = {
  getAllTitles,
};