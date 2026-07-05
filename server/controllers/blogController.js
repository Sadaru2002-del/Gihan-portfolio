import { Blogs } from '../models/dbStore.js';

export const getBlogs = async (req, res) => {
  try {
    const list = await Blogs.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blogs', error: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blogs.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: 'Article not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blog', error: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const data = { ...req.body, slug };
    const newBlog = await Blogs.create(data);
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const updated = await Blogs.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Blog post not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating blog', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blogs.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blog post not found' });
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting blog', error: error.message });
  }
};

export const addComment = async (req, res) => {
  const { name, email, content } = req.body;
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });

    const newComment = { name, email, content, createdAt: new Date() };
    const comments = blog.comments || [];
    comments.push(newComment);

    await Blogs.findByIdAndUpdate(req.params.id, { comments });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog post not found' });

    const updated = await Blogs.findByIdAndUpdate(req.params.id, {
      likes: (blog.likes || 0) + 1
    });
    res.json({ likes: (blog.likes || 0) + 1 });
  } catch (error) {
    res.status(500).json({ message: 'Error updating likes', error: error.message });
  }
};
