// validateImageData.js
const { check } = require('express-validator');

module.exports = [
  // Validate image field
  check('image')
    .optional()
    .isString()
    .withMessage('Image must be a base64 string')
    .bail()
    .custom(value => {
      if (!value.startsWith('data:image')) {
        throw new Error('Invalid base64 image format');
      }
      return true;
    }),

  // Validate dict_of_vars field
  check('dictOfVars') // Note: JavaScript typically uses camelCase
    .optional()
    .isObject()
    .withMessage('Variables must be a valid JSON object')
    .bail()
    .customSanitizer(value => {
      try {
        return typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        return {};
      }
    }),

  // Validate either image or file upload exists
  check().custom((_, { req }) => {
    if (!req.body.image && !req.file) {
      throw new Error('Either image file or base64 image required');
    }
    return true;
  })
];