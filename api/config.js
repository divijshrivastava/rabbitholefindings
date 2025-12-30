// Backend API Configuration
// This file handles all API communication

const API_CONFIG = {
  // In production, this would point to your actual backend
  // For now, we'll use a mock/local API structure
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  endpoints: {
    conversations: '/conversations',
    conversation: (id) => `/conversations/${id}`,
    search: '/conversations/search',
    create: '/conversations',
    update: (id) => `/conversations/${id}`,
    delete: (id) => `/conversations/${id}`
  }
};

// Mock data service (will be replaced with actual API calls)
class ConversationService {
  constructor() {
    this.conversations = this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem('rabbithole_conversations');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error loading from storage:', e);
    }
    return this.getDefaultConversations();
  }

  saveToStorage() {
    try {
      localStorage.setItem('rabbithole_conversations', JSON.stringify(this.conversations));
    } catch (e) {
      console.error('Error saving to storage:', e);
    }
  }

  getDefaultConversations() {
    // This will be populated from the HTML initially
    return [];
  }

  async getAll() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.conversations);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const conversation = this.conversations.find(c => c.id === id);
        resolve(conversation || null);
      }, 200);
    });
  }

  async search(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = this.conversations.filter(conv => {
          const searchText = `${conv.title} ${conv.messages.map(m => m.text).join(' ')}`.toLowerCase();
          return searchText.includes(query.toLowerCase());
        });
        resolve(results);
      }, 200);
    });
  }

  async create(conversation) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConv = {
          id: Date.now().toString(),
          ...conversation,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.conversations.push(newConv);
        this.saveToStorage();
        resolve(newConv);
      }, 300);
    });
  }

  async update(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.conversations.findIndex(c => c.id === id);
        if (index !== -1) {
          this.conversations[index] = {
            ...this.conversations[index],
            ...updates,
            updatedAt: new Date().toISOString()
          };
          this.saveToStorage();
          resolve(this.conversations[index]);
        } else {
          resolve(null);
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.conversations.findIndex(c => c.id === id);
        if (index !== -1) {
          this.conversations.splice(index, 1);
          this.saveToStorage();
          resolve(true);
        } else {
          resolve(false);
        }
      }, 300);
    });
  }
}

export { API_CONFIG, ConversationService };

