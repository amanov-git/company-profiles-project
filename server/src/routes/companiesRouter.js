const router = require('express').Router();
const {
  getAllCompanies,
  getCompanyDetails,
  addNewCompanyOverview,
  addNewCompanyServices,
  getUserCompanies,
  updateCompanyOverview,
  getCompanyOverview,
  getCompanyServices,
  deleteCompany,
  updateCompanyService,
  getAdminCompanies,
  getSearchCompanies,
  addNewCompanyContact,
  updateCompanyContact,
  getCompanyContacts,
} = require('../controllers/companiesController');
const authenticate = require('../scripts/helpers/authenticate');
const { validateParams, validateBody } = require('../scripts/helpers/schemaValidate');
const {
  companyDetailsSchema,
  addNewCompanyOverviewSchema,
  updateCompanyOverviewSchema,
  updateCompanyServiceSchema,
  updateCompanyContactSchema,
} = require('../scripts/schemas/companiesSchemas');
const { multerMemoryStorage } = require('../scripts/helpers/generalHelpers');
const checkRoleMiddleware = require('../scripts/helpers/checkRoleMiddleware');
const checkUserIdMiddleware = require('../scripts/helpers/checkUserIdMiddleware');

const memoryStorageUploader = multerMemoryStorage();




/**
 * @swagger
 * components: 
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   name: Companies
 *   description: Companies API
 * /companies/get-all-companies:
 *   get:
 *     summary: Lists all companies
 *     tags: [Companies]
 *     responses:
 *       200:
 *         description: The list of companies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 components:
 *                   schemas:
 *                     Companies:
 *                       properties:
 * /companies/get-company-details/{id}:
 *   get:
 *     summary: Lists all companies
 *     tags: [Companies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: company id
 *     responses:
 *       200:
 *         description: Company details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               items:
 *                 components:
 *                   schemas:
 *                     Companies:
 *                       properties:
 * 
 * 
 * 
 * 
 * 
 * /companies/add-new-company-overview:
 *   post:
 *     summary: Add company overview
 *     tags: [Companies]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema: 
 *             type: object
 *             properties:
 *               userID:
 *                 type: integer
 *                 description: user id
 *               companyName: 
 *                 type: string
 *                 description: Company name
 *               foundedAt:
 *                 type: string
 *                 description: Founded date
 *               companyCategory:
 *                 type: integer
 *                 description: company category
 *               numberOfEmployees:
 *                 type: integer
 *                 description: Number of employees
 *               location:
 *                 type: string
 *                 description: Location
 *               website:
 *                 type: string
 *                 description: website
 *               about:
 *                 type: string
 *                 description: about
 *               companySocialLinks:
 *                 type: array
 *                 description: company social links
 *               companyLogo:
 *                 type: string
 *                 format: binary
 *                 description: company logo
 *     responses:
 *       200:
 *         description: successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: 
 *                   type: string
 *                   example: Logo uploaded successfully
 *                 logoUrl:
 *                   type: string
 *                   description: URL of uploaded logo
 */





router.get('/get-all-companies', getAllCompanies);

router.get('/get-company-details/:companyID', validateParams(companyDetailsSchema), getCompanyDetails);

// Add new company overview
router.post(
  '/add-new-company-overview',
  authenticate,
  memoryStorageUploader.fields([
    {
      name: 'companyLogo',
      maxCount: 1
    }]),
  validateBody(addNewCompanyOverviewSchema),
  addNewCompanyOverview,
);

// Add new company services
router.post(
  '/add-new-company-services',
  authenticate,
  memoryStorageUploader.fields([
    {
      name: 'servicesImages',
      maxCount: 3,
    },
  ]),
  addNewCompanyServices,
);

// Add new company contacts
router.post(
  '/add-new-company-contact',
  authenticate,
  memoryStorageUploader.single('contactAvatar'),
  addNewCompanyContact,
);

// Update company overview
router.put(
  '/update-company-overview',
  authenticate,
  memoryStorageUploader.single('companyLogo'),
  validateBody(updateCompanyOverviewSchema),
  updateCompanyOverview,
);

// Update company service
router.put(
  '/update-company-service',
  authenticate,
  memoryStorageUploader.single('serviceImage'),
  validateBody(updateCompanyServiceSchema),
  updateCompanyService,
);

// Update company contact
router.put(
  '/update-company-contact',
  memoryStorageUploader.single('contactAvatar'),
  authenticate,
  validateBody(updateCompanyContactSchema),
  updateCompanyContact,
);

router.get('/get-user-companies/?:userID', authenticate, checkUserIdMiddleware, getUserCompanies);

router.get('/get-company-overview/:companyID', authenticate, getCompanyOverview);

router.get('/get-company-services/:companyID', authenticate, getCompanyServices);

router.get('/get-company-contacts/:companyID', authenticate, getCompanyContacts);

router.delete('/delete-company/:companyID', authenticate, deleteCompany);

router.get('/get-admin-companies', authenticate, checkRoleMiddleware(['admin']), getAdminCompanies);

router.get('/get-search-companies', getSearchCompanies);

module.exports = router;