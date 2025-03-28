const joi = require('joi');

const companyDetailsSchema = joi.object({
  companyID: joi.number().required().messages({
    "number.base": "{#label} is not applicable.",
    "number.empty": "{#label} should not be empty.",
    "any.required": "{#label} required.",
  }),
});

const addNewCompanyOverviewSchema = joi.object({
  userID: joi.number().required(),
  companyName: joi.string().required().min(3).max(30),
  companyCategory: joi.string().required(),
  location: joi.string().required().min(3).max(60),
  about: joi.string().required().min(5),
  foundedAt: joi.any().optional(),
  numberOfEmployees: joi.any().optional(),
  website: joi.any().optional(),
  companySocialLinks: joi.any().optional(),
  companyLogo: joi.any().optional(),
});

const updateCompanyOverviewSchema = joi.object({
  companyName: joi.string()
    .pattern(/^[a-zA-Z0-9 ]+$/) // Allows only letters, numbers, and spaces
    .required()
    .messages({
      'string.pattern.base': 'Company name can only contain letters, numbers, and spaces.',
      'any.required': 'Company name is required.'
    }),
  foundedAt: joi.any().optional(),
  companyCategory: joi.number().required(),
  numberOfEmployees: joi.any().optional(),
  location: joi.string().required().min(3).max(50),
  website: joi.any().optional(),
  about: joi.string().required().min(5).max(500),
  companySocialLinks: joi.any().optional(),
  companyID: joi.number().required(),
  currentCompanyLogo: joi.string().required().max(100),
  companyLogo: joi.any().optional(),
});

const updateCompanyServiceSchema = joi.object({
  id: joi.number().required(),
  description: joi.string().required().min(3).max(100),
  companyID: joi.number().required(),
  currentServiceImage: joi.string().required().max(100),
  serviceImage: joi.any().optional(),
});

const updateCompanyContactSchema = joi.object({
  contactID: joi.number().required(),
  currentAvatar: joi.string().required(),
  companyID: joi.number().required(),
  fullname: joi.string().required().min(3).max(30),
  titleID: joi.number().required(),
  phone: joi.number().required(),
  socialLinks: joi.any().optional(),
  contactAvatar: joi.any().optional(),
});

module.exports = {
  companyDetailsSchema,
  addNewCompanyOverviewSchema,
  updateCompanyOverviewSchema,
  updateCompanyServiceSchema,
  updateCompanyContactSchema,
};