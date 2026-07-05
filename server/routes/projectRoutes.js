import express from 'express';
import { getProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, deleteProject);

export default router;
