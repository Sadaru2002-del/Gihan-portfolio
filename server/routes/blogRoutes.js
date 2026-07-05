import express from 'express';
import { getBlogs, getBlogBySlug, createBlog, updateBlog, deleteBlog, addComment, toggleLike } from '../controllers/blogController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.post('/', auth, createBlog);
router.put('/:id', auth, updateBlog);
router.delete('/:id', auth, deleteBlog);
router.post('/:id/comment', addComment);
router.post('/:id/like', toggleLike);

export default router;
