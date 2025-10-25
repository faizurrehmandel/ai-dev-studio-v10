// State management
let currentProjectId = null;
let projects = [];

// DOM Elements
const elements = {
    sidebar: document.getElementById('sidebar'),
    projectsList: document.getElementById('projectsList'),
    chatContainer: document.getElementById('chatContainer'),
    chatMessages: document.getElementById('chatMessages'),
    chatForm: document.getElementById('chatForm'),
    messageInput: document.getElementById('messageInput'),
    newProjectBtn: document.getElementById('newProjectBtn'),
    newProjectModal: document.getElementById('newProjectModal'),
    newProjectForm: document.getElementById('newProjectForm'),
    cancelProjectBtn: document.getElementById('cancelProjectBtn')
};

// API Functions
const api = {
    async getProjects() {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) throw new Error('Failed to fetch projects');
            return await response.json();
        } catch (error) {
            console.error('Error fetching projects:', error);
            throw error;
        }
    },

    async createProject(projectData) {
        try {
            const response = await fetch('/api/projects/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projectData)
            });
            if (!response.ok) throw new Error('Failed to create project');
            return await response.json();
        } catch (error) {
            console.error('Error creating project:', error);
            throw error;
        }
    },

    async sendMessage(projectId, message) {
        try {
            const response = await fetch(`/api/chat/${projectId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            if (!response.ok) throw new Error('Failed to send message');
            return await response.json();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }
};

// UI Functions
const ui = {
    renderProjects(projects) {
        elements.projectsList.innerHTML = projects.map(project => `
            <div class="project-item ${project.id === currentProjectId ? 'active' : ''}" 
                 data-project-id="${project.id}">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
            </div>
        `).join('');
    },

    addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user' : 'ai'}`;
        messageElement.innerHTML = `<p>${message}</p>`;
        elements.chatMessages.appendChild(messageElement);
        messageElement.scrollIntoView({ behavior: 'smooth' });
    },

    clearChat() {
        elements.chatMessages.innerHTML = '';
    },

    showModal() {
        elements.newProjectModal.classList.add('active');
    },

    hideModal() {
        elements.newProjectModal.classList.remove('active');
        elements.newProjectForm.reset();
    },

    showLoading() {
        // Add loading indicator
        const loader = document.createElement('div');
        loader.className = 'loading';
        loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        elements.chatMessages.appendChild(loader);
    },

    removeLoading() {
        const loader = elements.chatMessages.querySelector('.loading');
        if (loader) loader.remove();
    }
};

// Event Handlers
const handlers = {
    async init() {
        try {
            projects = await api.getProjects();
            ui.renderProjects(projects);
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    },

    async handleProjectClick(event) {
        const projectItem = event.target.closest('.project-item');
        if (!projectItem) return;

        const projectId = projectItem.dataset.projectId;
        currentProjectId = projectId;
        ui.renderProjects(projects);
        ui.clearChat();
        // Load project chat history here if needed
    },

    async handleChatSubmit(event) {
        event.preventDefault();
        if (!currentProjectId) {
            alert('Please select a project first');
            return;
        }

        const message = elements.messageInput.value.trim();
        if (!message) return;

        ui.addMessage(message, true);
        elements.messageInput.value = '';
        ui.showLoading();

        try {
            const response = await api.sendMessage(currentProjectId, message);
            ui.removeLoading();
            ui.addMessage(response.message);
        } catch (error) {
            ui.removeLoading();
            ui.addMessage('Error: Failed to get response from AI');
        }
    },

    async handleNewProject(event) {
        event.preventDefault();
        const formData = new FormData(elements.newProjectForm);
        const projectData = {
            name: formData.get('projectName'),
            description: formData.get('projectDescription')
        };

        try {
            const newProject = await api.createProject(projectData);
            projects.push(newProject);
            ui.renderProjects(projects);
            ui.hideModal();
        } catch (error) {
            alert('Failed to create project');
        }
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', handlers.init);
elements.projectsList.addEventListener('click', handlers.handleProjectClick);
elements.chatForm.addEventListener('submit', handlers.handleChatSubmit);
elements.newProjectBtn.addEventListener('click', ui.showModal);
elements.cancelProjectBtn.addEventListener('click', ui.hideModal);
elements.newProjectForm.addEventListener('submit', handlers.handleNewProject);

// Handle textarea auto-resize
elements.messageInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});
