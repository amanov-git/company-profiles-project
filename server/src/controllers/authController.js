const db = require('../database');

const {
  hashPassword,
  generateAccessToken,
  generateRefreshToken,
  comparePasswords,
} = require('../scripts/helpers/authHelpers');

const register = async (req, res) => {
  const { username, fullname, password, titleID } = req.body;

  try {
    const checkAlreadyRegisteredQuery = `
      SELECT * FROM users
      WHERE username = $1
    `;

    const { rowCount: checkRegisteredRowCount } = await db.query(checkAlreadyRegisteredQuery, [username]);

    if (checkRegisteredRowCount === 0) {
      const insertUserQuery = `
        INSERT INTO users (username, fullname, password, role_id, title_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `;

      const { rows } = await db.query(insertUserQuery, [username, fullname, hashPassword(password), 2, titleID]);

      const userID = rows[0].id;

      if (userID) {
        const getUserQuery = `
          SELECT u.id, u.username, r.role FROM users u
          LEFT JOIN roles r on r.id = u.role_id
          WHERE u.id = $1
        `;

        const { rows } = await db.query(getUserQuery, [userID]);
        const userData = rows[0];
        const accessToken = await generateAccessToken(userData);
        const refreshToken = await generateRefreshToken(userData);

        res.status(201).json({
          msg: 'User successfully added.',
          user: userData,
          accessToken,
          refreshToken,
        });
      };
    } else {
      res.status(409).send('Conflict.');
    };
  } catch (error) {
    console.log('Error: ', error);
    res.sendStatus(500);
  };
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const getUserQuery = `
    SELECT u.id, u.username, u.password, r.role FROM users u
    LEFT JOIN roles r ON r.id = u.role_id
    WHERE u.username = $1
  `;

  try {
    const { rows, rowCount } = await db.query(getUserQuery, [username]);

    if (rowCount === 0) {
      return res.status(404).send('User not found.');
    };

    const userData = rows[0];

    const isPasswordMatching = comparePasswords(password, userData.password);

    if (isPasswordMatching) {
      delete userData.password;
      const accessToken = await generateAccessToken(userData);
      const refreshToken = await generateRefreshToken(userData);

      return res.status(200).json({
        msg: 'User successfully logged in.',
        user: userData,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(400).send('User password is not correct.');
    };
  } catch (error) {
    res.sendStatus(500);
    console.error('Error: ', error);
  };
};

module.exports = {
  register,
  login,
};