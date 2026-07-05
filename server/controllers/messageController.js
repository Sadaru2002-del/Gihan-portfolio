import { Messages } from '../models/dbStore.js';

export const getMessages = async (req, res) => {
  try {
    const list = await Messages.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error: error.message });
  }
};

export const createMessage = async (req, res) => {
  const { name, email, subject, category, content } = req.body;
  
  if (!name || !email || !subject || !content) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '';
    const newMessage = await Messages.create({
      name,
      email,
      subject,
      category,
      content,
      ipAddress
    });
    
    res.status(201).json({
      message: 'Message sent successfully! We will get in touch shortly.',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({ message: 'Error saving message', error: error.message });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const updated = await Messages.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Message not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating message status', error: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const deleted = await Messages.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};
