const router = require('express').Router();
const { getAllCategories } = require('../controllers/categoriesController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - category_name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the category
 *           example: 1
 *         category_name:
 *           type: string
 *           description: The name of the category
 *           example: "Top companies"
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: The Categories managing API
 * /categories/get-all-categories:
 *   get:
 *     summary: Lists all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: The list of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */

router.get('/get-all-categories', getAllCategories);

module.exports = router;