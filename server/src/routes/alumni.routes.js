const { Router } = require('express');
const multer = require('multer');
const storage = require('../config/cloudinary');
const upload = multer({ storage });

const router = Router();
const alumniController = require('../controllers/alumni.controller');
const { createAlumnusSchema, queryAlumnusSchema } = require('../schemas/alumni.schemas');
const { validateBody, validateQuery } = require('../middlewares/validate.middleware');

router.get('/', validateQuery(queryAlumnusSchema), alumniController.listAlumni);

// Adicionamos o middleware upload.single
router.post(
  '/',
  upload.single('profilePicture'),
  validateBody(createAlumnusSchema),
  alumniController.createAlumnus
);

module.exports = router;
