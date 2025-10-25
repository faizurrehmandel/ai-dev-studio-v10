# AI Development Studio v10

A professional, chat-based web application for managing and developing software projects with AI assistance.

## Features

- Chat-based interface for project development
- Project management dashboard
- Intelligent model fallback system
- Full CRUD functionality for projects
- Real-time updates
- Responsive design

## Technical Stack

- Frontend: HTML5, CSS3, JavaScript (ES6+)
- Backend: Python with Flask
- Database: SQLite
- AI Models: deepseek-coder with Claude-3 fallback

## Installation

1. Clone the repository
2. Install dependencies:
   bash
   pip install -r requirements.txt
   
3. Set up environment variables:
   - GITHUB_TOKEN
   - OPENROUTER_API_KEY

## Usage

1. Start the server:
   bash
   python main.py
   
2. Open browser at `http://localhost:5000`

## Development

- Frontend code is in `index.html`, `style.css`, and `script.js`
- Backend code is in `main.py` and `database.py`

## Security

- API keys are stored in environment variables
- Input validation and sanitization implemented
- CSRF protection enabled

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## License

MIT License
