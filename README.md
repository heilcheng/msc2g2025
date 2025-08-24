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
<img width="480" height="400" alt="Screenshot 2025-08-25 at 12 08 45 am" src="https://github.com/user-attachments/assets/5a943b8e-3d95-4cf5-83ee-899cd1624f4f" />

<img width="480" height="400" alt="Screenshot 2025-08-25 at 12 13 37 am" src="https://github.com/user-attachments/assets/8900c9ef-2b36-48aa-833d-04b3c39472c9" />


A web application designed to facilitate English learning for K3 children through parent-child collaboration, volunteer support, and NGO administration.

## Overview
<img width="480" height="400" alt="Screenshot 2025-08-24 at 11 15 24 pm" src="https://github.com/user-attachments/assets/9e1f1402-686e-4dc0-981d-a9feac6a8197" />


This platform connects multiple stakeholders in the English learning ecosystem:
- **Students & Parents**: Interactive learning activities and progress tracking
- **Volunteers**: Community support and mentoring system
- **NGO Administrators**: Comprehensive management and analytics dashboard

## Features

### For Parents and Students
<img width="480" height="480" alt="Screenshot 2025-08-24 at 10 59 28 pm" src="https://github.com/user-attachments/assets/1b30bf3d-1b4c-4f81-b554-f2a045b23f77" />


**Socratic-like AI & teacher feedback integration**: I use Ollama + LLaVA:7B to power multimodal AI grading: a lightweight yet effective vision-language model that reads K3 students’ worksheets more accurately than traditional OCR-only pipelines, while also generating meaningful AI feedback for parents!
- **Personalized Dashboard**: Weekly missions, AI-generated daily challenges, and clear progress indicators
- **Progress Tracking**: Skills radar chart, worksheet submission records
- **Forums**: Forums, resources, Quora-like Q&A section for parents
- **Duolingo-like Leaderboard System & Habitica-like RPG Gamification**: Parent-child team competition, co-op missions, avatars, and social reactions


### For Volunteers
<img width="480" height="480" alt="Screenshot 2025-08-24 at 11 04 16 pm" src="https://github.com/user-attachments/assets/cc9af01a-812f-4318-916c-0db623e76e2c" />

**Rewards System ([Time Auction](https://timeauction.org/)):**  
Volunteers earn service hours by assisting low-income families with homework guidance. These hours can be redeemed via [Time Auction](https://timeauction.org/): a charity platform where volunteer hours are exchanged for real-life rewards, such as mentorship sessions with professionals, unique experiences, and public recognition. This creates a sustainable incentive model where volunteers give back, families benefit, and NGOs can track impact.
- **Volunteer Dashboard**: Service hour tracking, personal contribution stats, AI-suggested families to help
- **Builds a sustainable cycle**: volunteers give back, families benefit, and NGOs track impact


### For NGO Administrators
<img width="480" height="400" alt="Screenshot 2025-08-24 at 11 24 38 pm" src="https://github.com/user-attachments/assets/06dd33aa-c2fa-4a9b-9904-e9633949136b" />


I analyze student data to identify those who are falling behind or whose parents have not used the app for a while; in such cases, NGO volunteers reach out to provide support and improve engagement.
- **Admin Dashboard**: Student watchlist, parent engagement monitor, KPI visualization for donors
- **Analytics & Reporting**: Regional learning trends, subject performance comparison, intervention alert system for students who cannot catch up

### Accessibility Support
- Clean webapp fits all platforms: PC, iOS & Android devices
- Complete English and Chinese localization, dynamic language switching
- Accessible design for diverse populations (Large font, dark/light mode, high contrast mode, low-battery mode, etc.)

## The Philosophy Behind the App
- The philosophy behind this platform comes from my experience as a tutor for SEN students, where I saw that families often hesitate to reach out for help, even when they are struggling. To lower this barrier, I designed the system so parents can first access AI-powered feedback in a private, non-judgmental way, and then be seamlessly connected to supportive tutors or volunteers who are motivated to help.
- For parents, I know how difficult it can be to keep up with assignments and learning progress while managing daily responsibilities. That’s why I focused on building a clean, intuitive UI/UX so they always know what to do next with their kids. Gamified features, like RPG-style (I really like [Habitica](https://habitica.com/), a platform that "gamify" your life) missions, avatars, and leaderboards (inspired by Duolingo ofc!) make the learning journey engaging and rewarding for both children and parents.
- At the same time, the platform addresses the needs of NGOs like REACH, which require tools to analyze student data, identify children at risk, notify staff when interventions are needed, and generate KPI dashboards and annual reports for donors. By combining these features, the platform not only supports families and volunteers but also strengthens NGOs’ ability to demonstrate measurable impact.
- For volunteers, I integrated a [Time Auction](https://timeauction.org/) (A very cool org!) rewards system, where service hours earned through tutoring can be redeemed for mentorship opportunities, unique experiences, or public recognition. This not only sustains motivation for volunteers but also ensures that families consistently receive the support they need.
- Finally, accessibility was central to my design philosophy. By building this as a lightweight web application, it works on all devices and supports diverse groups of families with features like large fonts, dark/light mode, high contrast, and even low-battery mode. At its core, the project lowers barriers, empowers parents, motivates children, engages volunteers, and equips NGOs with the tools they need to sustain meaningful impact.


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

### Backend Tech Stack / Tools
- **Framework**: FastAPI
- **Database**: MongoDB
- **Database Driver**: Motor (for asynchronous access)
- **Data Validation**: Pydantic
- **AI Model**: LLaVA:7b / LLama3.2-vision / Ollama
- **Containerization**: Docker
- **Reverse Proxy**: Nginx

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

## License

This project is developed for educational and non-profit purposes.
