import express from 'express';
import {
  getSkills, createSkill, updateSkill, deleteSkill,
  getCertificates, createCertificate, updateCertificate, deleteCertificate,
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getSettings, updateSettings
} from '../controllers/contentController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public readers
router.get('/skills', getSkills);
router.get('/certificates', getCertificates);
router.get('/testimonials', getTestimonials);
router.get('/settings', getSettings);

// Protected writers
router.post('/skills', auth, createSkill);
router.put('/skills/:id', auth, updateSkill);
router.delete('/skills/:id', auth, deleteSkill);

router.post('/certificates', auth, createCertificate);
router.put('/certificates/:id', auth, updateCertificate);
router.delete('/certificates/:id', auth, deleteCertificate);

router.post('/testimonials', auth, createTestimonial);
router.put('/testimonials/:id', auth, updateTestimonial);
router.delete('/testimonials/:id', auth, deleteTestimonial);

router.put('/settings', auth, updateSettings);

export default router;
