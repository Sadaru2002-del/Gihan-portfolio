import { Skills, Certificates, Testimonials, SettingsStore } from '../models/dbStore.js';

// Skills
export const getSkills = async (req, res) => {
  try {
    const list = await Skills.find();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Error retrieving skills', error: e.message });
  }
};

export const createSkill = async (req, res) => {
  try {
    const item = await Skills.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: 'Error creating skill', error: e.message });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const updated = await Skills.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Skill not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Error updating skill', error: e.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const deleted = await Skills.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Skill not found' });
    res.json({ message: 'Skill deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting skill', error: e.message });
  }
};

// Certificates
export const getCertificates = async (req, res) => {
  try {
    const list = await Certificates.find();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Error retrieving certificates', error: e.message });
  }
};

export const createCertificate = async (req, res) => {
  try {
    const item = await Certificates.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: 'Error creating certificate', error: e.message });
  }
};

export const updateCertificate = async (req, res) => {
  try {
    const updated = await Certificates.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Certificate not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Error updating certificate', error: e.message });
  }
};

export const deleteCertificate = async (req, res) => {
  try {
    const deleted = await Certificates.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting certificate', error: e.message });
  }
};

// Testimonials
export const getTestimonials = async (req, res) => {
  try {
    const list = await Testimonials.find();
    res.json(list);
  } catch (e) {
    res.status(500).json({ message: 'Error retrieving testimonials', error: e.message });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const item = await Testimonials.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ message: 'Error creating testimonial', error: e.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const updated = await Testimonials.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Testimonial not found' });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Error updating testimonial', error: e.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const deleted = await Testimonials.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Error deleting testimonial', error: e.message });
  }
};

// Settings
export const getSettings = async (req, res) => {
  try {
    const settings = await SettingsStore.get();
    res.json(settings);
  } catch (e) {
    res.status(500).json({ message: 'Error retrieving settings', error: e.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updated = await SettingsStore.update(req.body);
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: 'Error updating settings', error: e.message });
  }
};
