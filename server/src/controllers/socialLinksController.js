const db = require('../database');

const getAllSocialMediaTypes = async (req, res) => {
  const getSocialMediaQuery = `
    SELECT smt.id, smt.type FROM social_media_types smt 
  `;

  try {
    const { rows } = await db.query(getSocialMediaQuery);
    res.status(200).json(rows);
  } catch (error) {
    res.sendStatus(500);
    console.error('Error: ', error);
  };
};

module.exports = {
  getAllSocialMediaTypes,
};