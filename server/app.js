const express = require('express');
const app = express();
const morgan = require('morgan');
const ENV = require('./src/config');
const PORT = ENV.PORT || 3500;
const cors = require('cors');
const path = require('path');
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Serve static files
app.use('/files', express.static(path.join(__dirname, '/src/files')));

// Routes
app.use('/titles', require('./src/routes/titlesRouter'));
app.use('/auth', require('./src/routes/authRouter'));
app.use('/categories', require('./src/routes/categoriesRouter'));
app.use('/companies', require('./src/routes/companiesRouter'));
app.use('/', require('./src/routes/socialMediaRouter'));

// Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info:{
      title: 'Company profiles',
      version: '0.1',
    },
    servers: [
      {
        url: `http://localhost:3500`
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const spacs = swaggerjsdoc(options);

app.use(
  '/api-docs',
  swaggerui.serve,
  swaggerui.setup(spacs),
);

// Activating server
app.listen(PORT, () => {
  console.log(`Server is successfully running on port http://localhost:${PORT}`);
});