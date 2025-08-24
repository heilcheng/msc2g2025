# Morgan Stanley Code to Give 2025 @ Hong Kong

## Problem Statment
Design and develop a centralized, real-time, collaborative digital platform that offers resources and guidance needed for parents to 
actively participate in their child's educational development. Include these features: 
 
1. The solution should work like a centralized digital platform to host all learning materials and allow parents to upload 
completed work, forming a student portfolio to help staff monitor progress, give feedback, and keep parents aligned with 
the child’s learning journey. 
2. Having a gamified point-based system to encourage timely homework uploads by rewarding parents and children. 
Points will appear on a school-wide leaderboard, promoting friendly competition and recognizing consistent effort with 
tangible rewards.

## Multi-Stakeholder English Learning Platform
A web application designed to facilitate English learning for K3 children through parent-child collaboration, volunteer support, and NGO administration.

## Overview
<img width="480" height="480" alt="ChatGPT Image Aug 24, 2025 at 05_08_26 AM" src="https://github.com/user-attachments/assets/9a0982db-f292-462f-83be-fb26672b3236" />

This platform connects multiple stakeholders in the English learning ecosystem:
- **Students & Parents**: Interactive learning activities and progress tracking
- **Volunteers**: Community support and mentoring system
- **NGO Administrators**: Comprehensive management and analytics dashboard

## Features

### For Parents and Students

#### Home Dashboard
- Personalized learning path with weekly missions
- AI-generated daily challenges based on student progress
- Progress tracking with visual indicators
- Task prioritization with urgency management

#### Progress Tracking
- Skills breakdown across multiple subjects (Alphabet, Sight Words, Vocabulary, Phonics)
- Interactive radar chart visualization
- Weekly worksheet submission records (Weeks 1-11)
- AI reports and teacher feedback integration
- Performance analytics and trend analysis

#### Leaderboard System
- League-based competition (Bronze, Silver, Gold, Diamond)
- Parent-child team formation with custom names and avatars
- Co-op mission scoring system
- Social interaction features (high-five reactions)
- Team profile modals with skills visualization

### For Volunteers

#### Volunteer Dashboard
- Personal contribution summary and statistics
- AI-recommended families to assist
- Time Auction rewards redemption system
- Service hour tracking and impact metrics
- Family assistance queue with priority indicators

#### Support Tools
- Family profile access with learning insights
- Communication tools for parent guidance
- Progress monitoring for assigned families
- Volunteer leaderboard and recognition system

### For NGO Administrators

#### Admin Dashboard
- Student watchlist and attention alerts
- Inactive parent monitoring and engagement tools
- Key performance indicators (Engagement, Progress, Retention)
- Data visualization and trend analysis
- Comprehensive student directory

#### Analytics and Reporting
- Learning trend analysis across regions and demographics
- Subject performance comparisons
- Student progress tracking with detailed profiles
- Performance alerts and intervention recommendations
- Export capabilities for reports and data

#### Student Management
- Individual student profiles with complete learning history
- Assignment tracking and grading management
- Parent communication tools
- Performance trend monitoring
- Intervention planning and tracking

## Technical Architecture

### Frontend
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom design system
- **Internationalization**: react-i18next (English/Chinese support)
- **State Management**: React Context API
- **Authentication**: Custom auth system with role-based access

### Design System
- **Theme**: iOS-Duo-Style (iOS aesthetics + Duolingo gamification)
- **Colors**: Custom green palette with warm accents
- **Typography**: System fonts with clean, readable hierarchy
- **Components**: Reusable UI components with consistent styling
- **Dark Mode**: Full dark mode support across all interfaces

### Key Components
- **TopNavbar**: Global navigation with language switching
- **MobileNavigation**: Bottom navigation for mobile devices
- **SkillsRadarChart**: Custom visualization for student progress
- **LanguageSwitcher**: Dynamic language selection
- **Settings Management**: User preferences and privacy controls

## Installation and Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/heilcheng/msc2g2025.git
cd msc2g2025
```

2. Install dependencies:
```bash
cd frontend
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:3000 in your browser

### Production Build

```bash
npm run build
npm start
```

## Configuration

### Environment Variables
Create a `.env.local` file in the frontend directory with necessary configuration variables.

### Internationalization
The application supports English and Chinese languages with complete translation coverage across all interfaces.

### Authentication
Role-based access control with three user types:
- Parent (access to home, progress, leaderboard)
- Volunteer (access to volunteer dashboard and tools)
- Admin (access to comprehensive admin dashboard)

## Key Functionality

### Learning Management
- Adaptive learning paths based on AI analysis
- Progress tracking across multiple skill areas
- Worksheet submission and automated grading
- Performance alerts and intervention recommendations

### Gamification
- League system with promotion/relegation
- Team-based scoring and achievements
- Social features for community engagement
- Reward system integration with Time Auction platform

### Analytics and Insights
- Real-time performance monitoring
- Predictive analytics for learning outcomes
- Comprehensive reporting for stakeholders
- Data-driven intervention recommendations

### Multi-Language Support
- Complete English and Chinese localization
- Dynamic language switching
- Cultural adaptation for different user groups
- Accessible design for diverse populations

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

This project follows standard web development practices with emphasis on:
- Component reusability
- Accessibility compliance
- Performance optimization
- Clean code architecture

## License

This project is developed for educational and non-profit purposes.
