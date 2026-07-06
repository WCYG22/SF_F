# FYP 2 Project

## Wong Cheng Yong (UCOMS) DS

### System Introduction

SmartFlight, a flight search and tracking system, aims to enhance and improve travel planning for customers in the airline industry. Besides that, the information provided will be recorded in Firebase to ensure the transparency of transaction on this system. The functionalities provided and accessibility rules are as following:

**Accessibility Rules: User**

- USER:
  - Sign Up (FR01)
  - Login (FR02)
  - Search Flights (FR03)
  - View Flight Details (FR04)
  - Filter Flights by Reliability (FR05)
  - View Live Flight Tracking (FR06)
  - Save Trips (FR07)
  - Set Price Alerts (FR08)
  - View Saved Trips (FR09)
  - Delete Saved Trips (FR10)
  - View Profile (FR11)
  - Sign Out (FR12)

### Installation Requirements

- Node.js
  - Follow the install instructions at https://nodejs.org/en/
  - Recommended using the latest LTS version

- Firebase
  - Follow the instructions at https://firebase.google.com/docs/web/setup
  - Make sure the latest versions of the SDK are used with SQLite pre-installed

### Using this Template

To get started, you should run the system as following:

- Run 'npm install' from the project directory to install all the node packages.
- Run 'npm run dev' to execute the development server.

Test the app by browsing to:

- http://localhost:5173

The application uses a single-page design with tab-based navigation:
- Search Flights (main page)
- Live Tracking (click 'Live' tab)
- Saved Trips (click 'Saved' tab)
- Profile (click profile icon)

To deploy the project, please ensure the dist/, node_modules are not exist in the directory left.

To reset the system (Reset everything to default):

Delete the directories 'dist/' and 'node_modules/' (delete Firebase data if needed)

### Languages, Framework, Tools

- System Architecture: SPA (Single Page Application)
- Languages: HTML, CSS, JavaScript, TypeScript
- Frameworks: React.js (Frontend), Express.js (Backend), Tailwind CSS (Styling)
- Tools: Vite, Node.js, Firebase

### Database Manipulation

For displaying the database in Firebase:

- Navigate to Firebase Console to access the Firestore database
- Run queries in the Firebase Console to view table when retrieve data
- Use Firebase SDK to ensure the data can be displayed in application
- Use Firestore security rules to control read and write access for data retrieval

### API Integration

The system integrates with the following APIs:

- Custom Flight Search API (api/search.js)
- Custom Flight Tracking API (api/tracking.js)
- Firebase Authentication API
- Firebase Firestore API

### Deployment

The application is deployed on Render at:
https://sf-f.onrender.com

To deploy the application:

1. Ensure all environment variables are configured
2. Run 'npm run build' to create production build
3. Push changes to GitHub repository
4. Render will automatically detect changes and deploy

### Environment Variables Required

The following environment variables must be configured:

```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
PORT=3000
NODE_ENV=production
```

### Project Structure

```
SF_F/
├── api/                    # Serverless API functions
│   ├── search.js          # Flight search endpoint
│   └── tracking.js        # Flight tracking endpoint
├── src/                   # Application source code
│   ├── components/        # React components
│   ├── constants/         # Static data
│   ├── lib/              # Utility functions
│   ├── services/         # API services
│   ├── types/            # TypeScript definitions
│   ├── App.tsx           # Main application
│   ├── firebase.ts       # Firebase configuration
│   └── main.tsx          # Entry point
├── dist/                 # Build output
├── node_modules/         # Dependencies
├── .env                  # Environment variables
├── index.html           # HTML template
├── server.ts            # Backend server
├── package.json         # Project configuration
└── vite.config.ts       # Build configuration
```

### Key Features

**Reliability-First Search**
- Flights ranked by reliability score (0-10)
- Connection risk analysis (LOW/MEDIUM/HIGH)
- Disruption probability calculation
- Alternative flight suggestions

**Live Flight Tracking**
- Real-time flight position monitoring
- Altitude, speed, and heading display
- Departure and arrival status
- Flight path visualization

**User Management**
- Firebase Authentication
- Email/Password and Google Sign-In
- Profile management
- Trip history tracking

**Smart Features**
- Intelligent flight search
- Natural language processing
- Smart flight recommendations

### Technology Stack Details

**Frontend Technologies:**
- React 19.0.0
- TypeScript 5.8.3
- Vite 6.4.1
- Tailwind CSS 4.0.5
- Framer Motion 12.0.3

**Backend Technologies:**
- Node.js (v18.17.0+)
- Express.js 4.21.2
- TypeScript

**Database & Authentication:**
- Firebase Firestore 11.2.0
- Firebase Authentication

**APIs:**
- Custom Flight Search API
- Custom Flight Tracking API

### Running the Application

**Development Mode:**
```
npm run dev
```
Application will be available at http://localhost:5173

**Production Build:**
```
npm run build
```
Compiled output will be in dist/ directory

**Production Server:**
```
npm start
```

**Type Checking:**
```
npm run lint
```

### Contact Information

**Developer:** Wong Chun Yong
**Student ID:** B1LM27
**Program:** METS
**Repository:** https://github.com/WCYG22/sf_f_22
**Live Application:** https://sf-f.onrender.com

**Last Updated:** January 2025
