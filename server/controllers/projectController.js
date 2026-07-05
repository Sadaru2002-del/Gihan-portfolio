import { Projects } from '../models/dbStore.js';

export const getProjects = async (req, res) => {
  try {
    const list = await Projects.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving projects', error: error.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Projects.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving project', error: error.message });
  }
};

export const createProject = async (req, res) => {
  try {
    const newProject = await Projects.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updated = await Projects.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleted = await Projects.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};
