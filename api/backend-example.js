// Example backend API implementation
// This file shows how to integrate with a real backend (Node.js/Express example)

/*
// Backend Server Example (Node.js/Express)
// This would be in a separate backend repository

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Database connection (example with MongoDB)
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  title: String,
  slug: String,
  messages: [{
    speaker: String, // 'rabbit-1' or 'rabbit-2'
    text: String,
    timestamp: Date
  }],
  tags: [String],
  createdAt: Date,
  updatedAt: Date
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// API Routes
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ createdAt: -1 });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/conversations/search', async (req, res) => {
  try {
    const { query } = req.body;
    const conversations = await Conversation.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { 'messages.text': { $regex: query, $options: 'i' } }
      ]
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/conversations', async (req, res) => {
  try {
    const conversation = new Conversation({
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/conversations/:id', async (req, res) => {
  try {
    const result = await Conversation.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
*/

// For frontend integration, use axios or fetch:
/*
import axios from 'axios';
import { API_CONFIG } from './config.js';

const api = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout
});

export const conversationAPI = {
  getAll: () => api.get(API_CONFIG.endpoints.conversations),
  getById: (id) => api.get(API_CONFIG.endpoints.conversation(id)),
  search: (query) => api.post(API_CONFIG.endpoints.search, { query }),
  create: (data) => api.post(API_CONFIG.endpoints.create, data),
  update: (id, data) => api.put(API_CONFIG.endpoints.update(id), data),
  delete: (id) => api.delete(API_CONFIG.endpoints.delete(id))
};
*/

export default {};

