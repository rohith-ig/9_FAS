const express = require('express');
const router = express.Router();
const { check } = require('../middlewares/roleCheck.js');
const { getAvailability, createAvailability, deleteAvailability } = require('../controllers/availController.js');

router.get('/', check, getAvailability);
router.post('/', check, createAvailability);
router.post('/busy', check, deleteAvailability);

module.exports = router;