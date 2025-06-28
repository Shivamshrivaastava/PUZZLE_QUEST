# 🧩 Puzzle Quest - Daily Brain Challenge

A modern brain training web application that challenges users with AI-generated puzzles, tracks IQ progress, and builds daily streaks. Train your mind with logic puzzles, math problems, word games, and pattern recognition challenges.

---
### Deployed APP - https://the-puzzle-quest.netlify.app/
### walkthrough - https://youtu.be/kw7BKOV7y84
---
## ✨ Features

### 🎮 Core Gameplay

- **Daily Challenges**: Get 3 new AI-generated puzzles every day
- **Practice Mode**: Unlimited puzzles with customizable difficulty levels
- **Multiple Puzzle Types**: Logic, Math, Word, and Pattern puzzles
- **Difficulty Levels**: Easy (10 XP) → Medium (25 XP) → Hard (50 XP) → Expert (100 XP)

### 📊 Progress Tracking

- **IQ Tracking**: Real-time IQ calculation based on performance
- **Streak System**: Daily login streaks and session streaks
- **XP & Levels**: Earn experience points and level up your brain
- **Detailed Analytics**: Performance breakdown by difficulty and puzzle type
- **Achievements**: Unlock badges for milestones and accomplishments

### 🤖 AI Integration

- **Gemini AI**: Generates unique puzzles using Google's Gemini 2.0 Flash
- **AI Chatbot**: Get hints, tips, and encouragement from your AI assistant
- **Smart Fallbacks**: Local puzzle library ensures uninterrupted gameplay

### 📱 User Experience

- **Clean Design**: Modern, elegant interface without AI-generated clutter
- **Real-time Updates**: Live stats that update immediately after solving puzzles
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark Theme**: Beautiful purple gradient design optimized for focus

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **JavaScript (JSX)** - Pure JavaScript implementation, no TypeScript
- **Vite** - Fast build tool and development server
- **React Router 6** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework

### Styling & UI

- **Custom Components** - Hand-crafted components without UI library dependencies
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications

### Data & Storage

- **Local Storage** - Client-side data persistence
- **Gemini AI API** - Google's generative AI for puzzle creation
- **React Query** - Data fetching and caching

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd puzzle-quest
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure AI API** (Optional)

   - The app works with fallback puzzles by default
   - For AI-generated puzzles, update the Gemini API key in `src/lib/gemini.js`

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Navigate to `http://localhost:8080`
   - Create an account and start solving puzzles!

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run typecheck` - Type checking (if needed)

## 📁 Project Structure

```
puzzle-quest/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Button.jsx       # Custom button component
│   │   ├── Card.jsx         # Card components
│   │   ├── BaseComponents.jsx # Essential UI primitives
│   │   ├── DailyPuzzles.jsx # Main puzzle interface
│   │   ├── PuzzleCard.jsx   # Individual puzzle display
│   │   ├── LiveStatsDisplay.jsx # Real-time statistics
│   │   ├── ProgressTracker.jsx # Progress visualization
│   │   ├── Chatbot.jsx      # AI assistant
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── Index.jsx        # Landing page
│   │   ├── Login.jsx        # Authentication
│   │   ├── Signup.jsx       # User registration
│   │   ├── Dashboard.jsx    # Main game dashboard
│   │   └── NotFound.jsx     # 404 page
│   ├── lib/                 # Utility functions and services
│   │   ├── gemini.js        # AI puzzle generation
│   │   ├── localStorage.js  # Data persistence
│   │   ├── gameLogic.js     # Game mechanics and scoring
│   │   └── utils.js         # Helper functions
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and variables
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # TailwindCSS configuration
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## 🎯 How to Play

### Getting Started

1. **Sign Up**: Create your account on the clean, elegant signup page
2. **Daily Challenge**: Solve 3 daily puzzles for consistent progress
3. **Practice Mode**: Generate unlimited puzzles at your preferred difficulty
4. **Track Progress**: Watch your IQ score and stats improve over time

### Puzzle Types

- **🧠 Logic**: Reasoning, deduction, and critical thinking puzzles
- **🔢 Math**: Arithmetic, sequences, and mathematical problem solving
- **📝 Word**: Anagrams, vocabulary, and language-based challenges
- **🎨 Pattern**: Visual and sequential pattern recognition

### Scoring System

- **XP Points**: Earn experience based on difficulty level
- **IQ Calculation**: Dynamic IQ score based on accuracy, speed, and difficulty
- **Streaks**: Daily streaks for consistent play, session streaks for consecutive correct answers
- **Levels**: Progress through levels as you earn XP

## 🤖 AI Configuration

### Gemini AI Setup

The app uses Google's Gemini AI for generating unique puzzles. To enable AI features:

1. **Get API Key**: Obtain a Gemini API key from Google AI Studio
2. **Update Configuration**: Replace the API key in `src/lib/gemini.js`
3. **Test Generation**: Use the "🤖 Generate AI Puzzles" button in the app

### Fallback System

- **Local Puzzles**: 60+ hand-crafted puzzles ensure the app works without AI
- **Rotation System**: Different puzzle sets rotate daily and for practice sessions
- **Seamless Experience**: Users can enjoy the full experience even without AI access

## 🎨 Design Philosophy

### Clean & Professional

- **No AI-Generated Look**: Custom-designed components that feel handcrafted
- **Minimal Interface**: Focus on essential features without information overload
- **Consistent Theme**: Beautiful purple gradient theme throughout
- **User-Centric**: Every element designed for optimal user experience

### Performance First

- **Fast Loading**: Optimized bundle size with custom components
- **Real-time Updates**: Immediate feedback on all user actions
- **Responsive Design**: Smooth experience across all devices
- **Efficient State Management**: Smart local storage with real-time synchronization

## 🔧 Development

### Code Style

- **JavaScript First**: Pure JSX implementation for simplicity
- **Component-Based**: Modular, reusable component architecture
- **Custom Components**: No external UI library dependencies
- **Clean Imports**: Flat component structure without nested folders

### Testing

```bash
npm test                    # Run all tests
npm run test:watch         # Run tests in watch mode
```

### Building for Production

```bash
npm run build              # Create production build
npm run preview            # Preview production build locally
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow our code style and component patterns
4. **Test your changes**: Ensure all tests pass
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Guidelines

- Use descriptive commit messages
- Follow the existing code style
- Add tests for new features
- Keep components small and focused
- Update documentation as needed

## 📊 Features in Detail

### Real-time Statistics

- **Live Updates**: All stats update immediately after solving puzzles
- **Comprehensive Tracking**: Total solved, accuracy, streaks, timing
- **Visual Feedback**: Progress bars, trends, and achievement notifications
- **Performance Analytics**: Detailed breakdown by difficulty and puzzle type

### User Progress

- **IQ Evolution**: Track your cognitive improvement over time
- **Streak Motivation**: Daily and session streaks keep you engaged
- **Achievement System**: Unlock badges for various milestones
- **Level Progression**: Clear advancement through experience points

### AI Assistant

- **Helpful Hints**: Get guidance without revealing answers
- **Motivational Support**: Encouraging messages based on your progress
- **Contextual Help**: Assistance tailored to your current performance
- **Graceful Fallbacks**: Helpful responses even when AI quota is exceeded

## 🌟 Why Puzzle Quest?

- **🧠 Science-Based**: Built on cognitive training principles
- **🎯 Personalized**: Adaptive difficulty and personalized feedback
- **📈 Progress-Focused**: Clear metrics and improvement tracking
- **🎮 Engaging**: Game-like elements make brain training fun
- **🚀 Modern**: Built with the latest web technologies
- **🎨 Beautiful**: Elegant design that's pleasant to use daily

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for puzzle generation capabilities
- **React Team** for the amazing framework
- **TailwindCSS** for the utility-first CSS approach
- **Lucide** for the beautiful icon library
- **All Contributors** who help make this project better

---

**Ready to train your brain?** 🧩 Start your puzzle quest today and join thousands of users improving their cognitive abilities one puzzle at a time!

_Made with 💜 by passionate developers for brain enthusiasts_
