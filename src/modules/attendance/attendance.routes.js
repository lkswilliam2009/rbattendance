const router = require('express').Router();
const auth = require('../../middleware/auth');
const controller = require('./attendance.controller');
const multer = require('multer');

const upload = multer({ dest: 'src/uploads/' });

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance API
 */

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Submit attendance (WFO/WFA)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - mode
 *             properties:
 *               type:
 *                 type: string
 *                 example: checkin
 *               mode:
 *                 type: string
 *                 example: WFA
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Attendance success
 *       403:
 *         description: Validation failed
 */
router.post(
  '/',
  auth,
  upload.single('photo'),
  controller.attend
);

module.exports = router;