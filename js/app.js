// Main Application Controller
// Handles all UI interactions and state management

import { ConversationService } from '../api/config.js';

class RabbitHoleApp {
  constructor() {
    this.service = new ConversationService();
    this.conversations = [];
    this.currentFilter = 'all';
    this.searchQuery = '';
    this.theme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.loadConversationsFromDOM();
    await this.loadConversations();
    this.render();
    this.applyTheme(this.theme);
  }

  loadConversationsFromDOM() {
    // Extract conversations from existing HTML
    const wrappers = document.querySelectorAll('.rabbit-hole-chat-wrapper');
    const conversations = [];

    wrappers.forEach(wrapper => {
      const id = wrapper.id;
      const title = wrapper.querySelector('h2')?.textContent || id;
      const messages = [];
      
      const rabbit1Messages = wrapper.querySelectorAll('.rabbit-1');
      const rabbit2Messages = wrapper.querySelectorAll('.rabbit-2');

      rabbit1Messages.forEach(msg => {
        const text = msg.querySelector('.rabbit-1-text')?.textContent?.trim();
        if (text) {
          messages.push({ speaker: 'rabbit-1', text });
        }
      });

      rabbit2Messages.forEach(msg => {
        const text = msg.querySelector('.rabbit-2-text')?.textContent?.trim();
        if (text) {
          messages.push({ speaker: 'rabbit-2', text });
        }
      });

      if (messages.length > 0) {
        conversations.push({
          id,
          title,
          slug: this.slugify(title),
          messages,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    });

    // Save to service
    this.service.conversations = conversations;
    this.service.saveToStorage();
    this.conversations = conversations;
  }

  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async loadConversations() {
    this.showLoading();
    try {
      this.conversations = await this.service.getAll();
      this.hideLoading();
    } catch (error) {
      this.showError('Failed to load conversations');
      console.error(error);
    }
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilter(e.target.dataset.filter);
      });
    });

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const navHeight = 80;
          const offsetTop = targetElement.offsetTop - navHeight;
          window.scrollTo({
            top: Math.max(0, offsetTop),
            behavior: 'smooth'
          });
        }
      });
    });

    // Scroll-based nav shrinking
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.handleScroll();
          this.updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  handleSearch(query) {
    this.searchQuery = query;
    if (query.length > 0) {
      this.performSearch(query);
    } else {
      this.render();
    }
  }

  async performSearch(query) {
    this.showLoading();
    try {
      const results = await this.service.search(query);
      this.displaySearchResults(results, query);
      this.hideLoading();
    } catch (error) {
      this.showError('Search failed');
      console.error(error);
    }
  }

  displaySearchResults(results, query) {
    const container = document.querySelector('.conversations-container') || document.querySelector('.wrapper');
    const searchResults = document.getElementById('search-results');
    
    if (results.length === 0) {
      if (searchResults) {
        searchResults.innerHTML = `<div class="no-results">No conversations found for "${query}"</div>`;
      }
      return;
    }

    // Highlight search results
    results.forEach(conv => {
      const element = document.getElementById(conv.id);
      if (element) {
        element.classList.add('search-highlight');
        // Scroll to first result
        if (results.indexOf(conv) === 0) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  handleFilter(filter) {
    this.currentFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.render();
  }

  handleScroll() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
      nav?.classList.add('nav-scrolled');
    } else {
      nav?.classList.remove('nav-scrolled');
    }
  }

  updateActiveNav() {
    const sections = document.querySelectorAll('.rabbit-hole-chat-wrapper');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const scrollPos = window.scrollY + 120;

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme(this.theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  }

  render() {
    // Remove search highlights
    document.querySelectorAll('.search-highlight').forEach(el => {
      el.classList.remove('search-highlight');
    });

    // Filter and display conversations
    let filtered = this.conversations;
    
    if (this.currentFilter !== 'all') {
      // Add filter logic here if needed
    }

    // Update UI based on filtered results
    this.updateConversationVisibility(filtered);
  }

  updateConversationVisibility(conversations) {
    const allWrappers = document.querySelectorAll('.rabbit-hole-chat-wrapper');
    allWrappers.forEach(wrapper => {
      const id = wrapper.id;
      const shouldShow = conversations.some(c => c.id === id);
      wrapper.style.display = shouldShow ? 'grid' : 'none';
    });
  }

  showLoading() {
    let loader = document.getElementById('loading-indicator');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'loading-indicator';
      loader.className = 'loading-indicator';
      loader.innerHTML = '<div class="spinner"></div><p>Loading...</p>';
      document.body.appendChild(loader);
    }
    loader.style.display = 'flex';
  }

  hideLoading() {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
      loader.style.display = 'none';
    }
  }

  showError(message) {
    let errorDiv = document.getElementById('error-message');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.id = 'error-message';
      errorDiv.className = 'error-message';
      document.body.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new RabbitHoleApp();
  });
} else {
  window.app = new RabbitHoleApp();
}

export default RabbitHoleApp;

