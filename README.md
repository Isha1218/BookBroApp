# BookBroApp 📚✨

*Your AI-powered reading companion that keeps you immersed in the story*

## The Problem 🤔

Ever find yourself flipping back pages to remember who a character is? Take a reading break and completely forget what just happened? You're not alone. Traditional ebook readers like Apple Books are great for displaying text, but they don't help you stay connected to the story.

**BookBroApp** solves this by becoming your intelligent reading companion—providing context-aware assistance that's always spoiler-free and based exactly on where you are in the book.

## Features 🚀

### 🔍 **Quick Lookup** 
Instantly access information about characters, places, and events—like Kindle's X-Ray feature, but smarter and available for any EPUB book. No more losing your place while trying to remember who that minor character is.

### 📖 **Chapter Recap**
Get back into the story quickly with AI-generated summaries of previous chapters. Perfect for when you're picking up where you left off after a break.

### 🤖 **Interactive Chatbot**
Your AI reading companion that you can:
- Ask questions about plot points and characters
- Share your reactions and theories
- Discuss predictions about what might happen next
- Get clarification on confusing scenes

### 🎭 **Roleplay Mode** 
Talk directly with book characters based on actual scenes! Experience an entirely new level of story immersion by having conversations with your favorite (or least favorite) characters.

### 🔒 **Spoiler-Free Promise**
All features are contextually aware and will never spoil future events. The AI only knows what you've read up to your current page.

## Screenshots 📸

*Screenshots showcase Fourth Wing (spoiler warning!)*

<img src="https://github.com/user-attachments/assets/7f04d6fb-daff-446b-a17e-90440efbabeb" width="300" />

<img src="https://github.com/user-attachments/assets/2efbfa1b-6538-4589-8805-c71fbe5d44a5" width="300" />

<img src="https://github.com/user-attachments/assets/857c9d23-1027-4a61-9ab5-daaed6ed31d0" width="300" />

<img src="https://github.com/user-attachments/assets/e2027eb0-5980-4195-a6a1-ee33ba137295" width="300" />

<img src="https://github.com/user-attachments/assets/23662386-f8cd-41a5-9cf2-24ffed6dd889" width="300" />

<img src="https://github.com/user-attachments/assets/e8892739-5922-4863-8720-1cd6965da785" width="300" />

## Technology Stack 💻

### Frontend
- **React.js** - Modern, responsive UI
- **Capacitor** - Cross-platform mobile deployment
- **CSS Modules** - Component-scoped styling

### Backend
- **Python** - Core application logic
- **FastAPI** - High-performance REST API
- **LangChain** - LLM integration and prompt management
- **FAISS** - Vector similarity search for content retrieval
- **RAG (Retrieval-Augmented Generation)** - Context-aware AI responses

### File Support
- **EPUB** format support with plans for additional formats

## How It Works 🔧

1. **Content Processing**: When you upload an EPUB, the backend extracts and processes the text, creating embeddings for semantic search
2. **Context Tracking**: The app tracks your reading position and maintains awareness of what content you've seen
3. **AI Integration**: LangChain manages interactions with language models, ensuring responses are contextually appropriate
4. **Vector Search**: FAISS enables quick retrieval of relevant characters, places, and plot points
5. **Spoiler Prevention**: RAG system only uses content from chapters you've already read

## Development Status 🚧

**Currently in active development** - Not yet released publicly

The app is being built with a mobile-first approach using Capacitor, making it available on both iOS and Android devices while maintaining a responsive web interface.

## Installation (Development) 🛠️

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- npm or yarn
- PostgreSQL database
- Google Gemini API key
- AWS S3 bucket (optional, for file storage)

### 1. Clone Repository
```bash
git clone https://github.com/Isha1218/BookBroApp.git
cd BookBroApp
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Configure constants
cp frontend/src/consts/consts.example.js frontend/src/consts/consts.js
# Edit consts.js with your configuration
```

### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure API keys and database
cp consts/api_keys.example.py consts/api_keys.py
cp consts/db_keys.example.py consts/db_keys.py
cp consts/s3_keys.example.py consts/s3_keys.py

# Edit each file with your credentials (see Configuration section below)

# Start FastAPI server
uvicorn main:app --reload
```

### 4. Mobile Development (Optional)
```bash
# Build for mobile
npm run build

# Add platforms
npx cap add ios
npx cap add android

# Sync with native projects
npx cap sync

# Open in native IDE
npx cap open ios
npx cap open android
```

## Configuration 🔧

### Frontend Configuration (`frontend/src/consts/consts.js`)
```javascript
export const IPADDRESS = 'your-backend-ip-address' // e.g., 'localhost' or '192.168.0.19'
export const AWS_S3_URI_BASE = 'https://your-bucket-name.s3.your-region.amazonaws.com/'
```

### Backend API Keys (`backend/consts/api_keys.py`)
```python
# Get your Gemini API key from https://makersuite.google.com/app/apikey
APIKEY = 'your-gemini-api-key-here'
```

### Database Configuration (`backend/consts/db_keys.py`)
```python
HOST = 'localhost'  # or your PostgreSQL host
DBNAME = 'BookBro'  # your database name
USERNAME = 'your-postgres-username'
PASSWORD = 'your-postgres-password'
```

### S3 Configuration (`backend/consts/s3_keys.py`)
```python
BUCKETNAME = 'your-s3-bucket-name'
```

### Required Services Setup

#### 1. PostgreSQL Database
- Install PostgreSQL on your system
- Create a database named `BookBro` (or update `DBNAME` in config)
- Ensure your user has proper permissions

#### 2. Google Gemini API
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Create a new API key
- Add it to your `api_keys.py` file

#### 3. AWS S3 (Optional)
- Create an S3 bucket in AWS
- Configure your AWS credentials (via AWS CLI or environment variables)
- Update the bucket name in your configuration files

## Environment Variables (Alternative Setup)

Instead of editing configuration files directly, you can use environment variables:

```bash
# Frontend
export REACT_APP_BACKEND_IP=localhost
export REACT_APP_S3_BASE_URL=https://your-bucket.s3.region.amazonaws.com/

# Backend
export GEMINI_API_KEY=your-api-key
export DB_HOST=localhost
export DB_NAME=BookBro
export DB_USER=postgres
export DB_PASSWORD=your-password
export S3_BUCKET=your-bucket-name
```

## Security Notes 🔒

**Important**: Never commit sensitive credentials to version control!

- All configuration files with actual credentials should be in `.gitignore`
- Use example/template files for repository sharing
- Consider using environment variables for production deployments
- Rotate API keys regularly and use principle of least privilege for database users

## Roadmap 🗺️

- [ ] Support for additional file formats (PDF, MOBI)
- [ ] Enhanced character relationship mapping
- [ ] Reading analytics and insights
- [ ] Social features (reading groups, discussions)
- [ ] Offline mode for downloaded content
- [ ] Integration with popular ebook libraries

## Contributing 🤝

This project is currently in private development. Once released, contributions will be welcome! Areas where help will be needed:
- UI/UX improvements
- Additional file format support
- Performance optimizations
- Language model fine-tuning

## Feedback Wanted 💭

As a fellow reader, your input is invaluable:

- **Would these features enhance your reading experience?**
- **Which feature would you use most: Quick Lookup, Chapter Recap, Chatbot, or Roleplay Mode?**
- **What other reading pain points should we solve?**

## Contact 📧

Built with ❤️ for book lovers who want to stay immersed in great stories.

---

*Note: This app is designed to enhance, not replace, your love of reading. Happy reading! 📖*
