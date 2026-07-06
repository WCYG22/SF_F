# SmartFlight Project Structure Documentation

---

## 📊 Figure 6.1 - Directory Structure BEFORE Executing System

*This is the initial project structure when you first clone/setup the project.*

```
SF_F/
│
├── .vscode/                        # VS Code editor settings
│   └── settings.json
│
├── api/                            # Serverless API functions
│   ├── search.js                   # Flight search endpoint
│   └── tracking.js                 # Flight tracking endpoint
│
├── src/                            # Source code
│   ├── components/                 # React components
│   │   ├── AirportSelector.tsx
│   │   ├── CalendarSelector.tsx
│   │   ├── LiveFlightView.tsx
│   │   └── UI.tsx
│   ├── constants/                  # Static data
│   │   └── airports.ts
│   ├── lib/                        # Utility functions
│   │   └── utils.ts
│   ├── services/                   # API services
│   │   └── flightService.ts
│   ├── types/                      # TypeScript types
│   │   └── global.d.ts
│   ├── App.tsx
│   ├── firebase.ts
│   ├── index.css
│   └── main.tsx
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── .vercelignore                   # Vercel ignore rules
├── build.sh                        # Build script
├── firebase-applet-config.json     # Firebase app config
├── firebase-blueprint.json         # Firebase blueprint
├── firestore.rules                 # Firestore security rules
├── index.html                      # HTML template
├── metadata.json                   # Project metadata
├── package.json                    # NPM configuration
├── README.md                       # Project documentation
├── render.yaml                     # Render deployment config
├── server.ts                       # Backend server
├── tsconfig.json                   # TypeScript config
├── vercel.json                     # Vercel config
├── vite.config.ts                  # Vite config
├── LIVE_TRACKING_SETUP.md          # Live tracking docs
└── USE_CASE_DIAGRAMS.md            # Use case docs
```

**Note:** At this stage, the following are NOT yet present:
- ❌ `/dist` folder (generated after `npm run build`)
- ❌ `/node_modules` folder (generated after `npm install`)
- ❌ `package-lock.json` (generated after `npm install`)
- ❌ `.env` file (created manually from .env.example)

**Explanation:**

Figure 6.1 illustrates the initial directory structure of the SmartFlight application prior to execution of any build or installation commands, containing only the core source code components including React components, API endpoints, Firebase configuration, and build configuration files that are maintained in version control. Notably absent are auto-generated directories such as `/dist` and `/node_modules`, which will be created during the build and dependency installation phases respectively.

---

## 📊 Figure 6.2 - Directory Structure AFTER Executing System

*This is the structure after running installation and compilation commands.*

```
SF_F/
│
├── .git/                           # ✅ Git version control
├── .vscode/                        # VS Code editor settings
│
├── api/                            # Serverless API functions
│   ├── search.js
│   └── tracking.js
│
├── dist/                           # ✅ GENERATED: Production build
│   ├── assets/
│   │   ├── index-BKgNfXTd.css
│   │   └── index-Clh1-VEU.js
│   ├── index.html
│   ├── server.cjs
│   └── server.cjs.map
│
├── node_modules/                   # ✅ GENERATED: NPM dependencies
│   ├── react/
│   ├── firebase/
│   ├── express/
│   └── ... (337 packages)
│
├── src/                            # Source code
│   ├── components/
│   ├── constants/
│   ├── lib/
│   ├── services/
│   ├── types/
│   ├── App.tsx
│   ├── firebase.ts
│   ├── index.css
│   └── main.tsx
│
├── .env                            # ✅ CREATED: Environment variables
├── .env.example
├── .gitignore
├── .vercelignore
├── build.sh
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
├── index.html
├── metadata.json
├── package.json
├── package-lock.json               # ✅ GENERATED
├── README.md
├── render.yaml
├── server.ts
├── tsconfig.json
├── vercel.json
├── vite.config.ts
├── LIVE_TRACKING_SETUP.md
└── USE_CASE_DIAGRAMS.md
```

**Generated Files/Folders:**
- ✅ `/dist` - Created by `npm run build`
- ✅ `/node_modules` - Created by `npm install`
- ✅ `package-lock.json` - Created by `npm install`
- ✅ `.env` - Manually created for environment variables
- ✅ `.git` - Created by `git init`

**Explanation:**

Figure 6.2 demonstrates the complete directory structure after successful execution of installation and compilation procedures, now including the `/dist` directory with compiled and bundled assets, the `/node_modules` directory containing approximately 337 npm packages, and `package-lock.json` for dependency version management. This expanded structure represents the fully operational system ready for development, testing, or production deployment, transforming from a minimal source code repository into a complete working application with all necessary dependencies and build artifacts in place.

---

## ⚙️ Commands to Transform Structure

### From BEFORE → AFTER

```bash
# Step 1: Install Node.js dependencies
npm install
# Creates: node_modules/ and package-lock.json

# Step 2: Create environment file
copy .env.example .env
# Edit .env with your Firebase and API keys

# Step 3: Build for production
npm run build
# Creates: dist/ folder with compiled assets

# Step 4: Start development server (optional)
npm run dev
# Starts Vite dev server on http://localhost:5173
```

---

## 📊 Comparison: Before vs After Execution

| Item | Before Execution | After Execution | How Generated |
|------|-----------------|-----------------|---------------|
| `/dist` | ❌ Not present | ✅ Present | `npm run build` |
| `/node_modules` | ❌ Not present | ✅ Present (~337 packages) | `npm install` |
| `package-lock.json` | ❌ Not present | ✅ Present | `npm install` |
| `.env` | ❌ Not present | ✅ Created manually | Copy from `.env.example` |
| `.git` | ❌ Not present | ✅ Present | `git init` |

---

## 6.1 File and Directory Descriptions

### 6.1.1 Root Level Files

| **File** | **Explanation** |
|----------|-----------------|
| .env | Stores sensitive environment variables such as Firebase API keys, project IDs, and Gemini API key. |
| .env.example | Template file showing the required environment variables without actual sensitive values. |
| .gitignore | Specifies which files and directories should be excluded from version control. |
| .vercelignore | Specifies which files and directories should be excluded from Vercel deployment. |
| build.sh | Shell script for building and deploying the application. |
| firebase-applet-config.json | Configuration file for Firebase application settings and credentials. |
| firebase-blueprint.json | Firebase project blueprint defining the project structure and services. |
| firestore.rules | Security rules for Firestore database defining read and write permissions. |
| index.html | The main HTML template file that serves as the entry point for the application. |
| metadata.json | Contains project metadata and configuration information. |
| package.json | Contains metadata about the project, including dependencies, scripts, and other configurations. |
| package-lock.json | Automatically generated file that locks the versions of the dependencies. |
| render.yaml | Configuration file for Render deployment platform settings. |
| server.ts | TypeScript file for the Express.js backend server handling API routes. |
| tsconfig.json | TypeScript compiler configuration specifying compilation options and file inclusions. |
| vercel.json | Configuration file for Vercel deployment platform settings and routing rules. |
| vite.config.ts | Vite build tool configuration defining build options and development server settings. |
| README.md | Provides an overview of the project, instructions for setup, usage, and other relevant information. |
| LIVE_TRACKING_SETUP.md | Documentation for setting up and using the live flight tracking feature. |
| USE_CASE_DIAGRAMS.md | Documentation containing use case diagrams and user flow descriptions. |

---

### 6.1.2 Directories

| **Directory** | **Explanation** |
|---------------|-----------------|
| .git | The directory contains version control metadata and history managed by Git. |
| .vscode | The directory contains Visual Studio Code editor configuration and workspace settings. |
| api | The directory contains serverless API functions for flight search and tracking endpoints. |
| dist | The directory contains compiled and bundled production-ready files generated by Vite build process. |
| node_modules | The directory contains all dependencies and packages which the system needed to run. |
| src | The directory contains the source code of the application, including React components, services, constants, and styling. |

*Table 6.2 Directories Overview*

---

## 6.2 Overview of README.md

The README.md file serves as the primary documentation and entry point for developers and users who want to understand, install, and run the SmartFlight application. It provides essential information about the project setup and deployment process.

### Key Sections Covered:

**1. Project Introduction**  
The README begins with a banner image from Google AI Studio and introduces the application as an AI-powered system that can be run and deployed locally.

**2. AI Studio Integration**  
Includes a direct link to view the app in AI Studio (https://ai.studio/apps/bfcd7c46-d091-4f8d-9d80-ce1a90cf5e59), indicating the project's integration with Google's AI development platform.

**3. Prerequisites**  
Specifies that Node.js is required to run the application locally, ensuring developers have the necessary runtime environment installed before proceeding with setup.

**4. Installation Instructions**  
Provides a clear three-step process to get the application running:
- Step 1: Install all required dependencies using `npm install`
- Step 2: Configure the Gemini API key in the `.env.local` file for AI functionality
- Step 3: Start the development server with `npm run dev`

The README.md is intentionally concise and focused on the essential steps needed to get started with the SmartFlight application, making it accessible for developers of all experience levels to quickly set up and begin working with the flight search and tracking system.

---

## 📁 Detailed Directory Breakdown

### `/src` - Source Code
The heart of the application containing all React components, services, and utilities.

**Key Files:**
- `App.tsx` - Main app with routing, auth, and state management
- `firebase.ts` - Firebase initialization and configuration
- `main.tsx` - React app entry point with StrictMode
- `index.css` - Tailwind CSS imports and global styles

---

### `/src/components` - React Components
Reusable and feature-specific UI components.

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `UI.tsx` | Reusable UI primitives | Card, Badge, Button components |
| `AirportSelector.tsx` | Airport search autocomplete | Dropdown with search functionality |
| `CalendarSelector.tsx` | Date picker | react-day-picker integration |
| `LiveFlightView.tsx` | Flight tracking page | Real-time flight radar |

---

### `/src/services` - Business Logic
API integration and data processing.

**flightService.ts**
- Handles flight search requests
- Interfaces with backend `/api/search` endpoint
- Transforms and validates response data

---

### `/src/constants` - Static Data
Configuration data that doesn't change.

**airports.ts**
- List of airports with codes, names, cities, countries
- Used by AirportSelector for autocomplete
- Format: `{ code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia' }`

---

### `/src/lib` - Utility Functions
Helper functions used across the app.

**utils.ts**
- `cn()` - TailwindCSS class name merger (uses clsx + tailwind-merge)
- Date formatters
- String helpers

---

### `/api` - Serverless Functions
Vercel/Render serverless API endpoints (JavaScript).

**search.js**
- POST `/api/search`
- Generates simulated flight data
- Returns: Array of flight itineraries with reliability scores

**tracking.js**
- POST `/api/tracking`
- Generates simulated flight tracking data
- Returns: Flight status, position, altitude, speed

---

### `/dist` - Build Output
Compiled production-ready files (generated by `npm run build`).

**Contents:**
- Bundled JavaScript (minified)
- Compiled CSS (Tailwind processed)
- Optimized HTML
- Source maps

**Build Process:**
```bash
npm run build
# Runs: vite build && esbuild server.ts
```

---

### `/node_modules` - Dependencies
337 installed packages (~400MB).

**Major Dependencies:**
```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "firebase": "^11.2.0",
  "@google/genai": "^0.22.0",
  "express": "^4.21.2",
  "framer-motion": "^12.0.3",
  "tailwindcss": "^4.0.5",
  "vite": "^6.4.1",
  "typescript": "^5.8.3"
}
```

---

## 🏗️ Architecture Overview

### Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite (Build Tool)
- Tailwind CSS 4
- Framer Motion (Animations)

**Backend:**
- Node.js + Express.js
- Serverless Functions (Vercel/Render)

**Database:**
- Firebase Firestore

**Authentication:**
- Firebase Auth

**AI:**
- Google Gemini API

**Hosting:**
- Render (Primary)
- Vercel (Alternative)

**Design Pattern:** Component-based SPA with serverless backend  
**State Management:** React Hooks + Context  
**Styling:** Utility-first CSS with Tailwind  
**Build Tool:** Vite (fast HMR)  

---

## 🔍 What Gets Generated vs What You Create

### You Create (Version Controlled)
✅ `/api` - Your serverless functions  
✅ `/src` - Your React source code  
✅ `index.html` - Your HTML template  
✅ `server.ts` - Your backend server  
✅ `package.json` - Your dependencies list  
✅ `tsconfig.json` - Your TypeScript config  
✅ `vite.config.ts` - Your build config  
✅ `vercel.json` - Your deployment config  
✅ `.gitignore` - What to ignore  
✅ `README.md` - Your documentation

### Auto-Generated (NOT in Git)
❌ `/dist` - Generated by Vite  
❌ `/node_modules` - Generated by npm  
❌ `package-lock.json` - Generated by npm  
❌ `.env` - Created from .env.example (contains secrets)

### `.gitignore` Should Include:
```gitignore
node_modules/
dist/
.env
*.log
.DS_Store
```

---

## 📈 Project Statistics

| Metric | Before Execution | After Execution |
|--------|-----------------|-----------------|
| Total Folders | 6 | 8+ |
| Total Files | ~30 | 3500+ (with node_modules) |
| Disk Space | ~2 MB | ~400 MB |
| Source Files | ~20 | ~20 |
| Dependencies | 0 | 337 packages |
| Built Assets | 0 | ~1.1 MB (dist/) |

---

## 🚀 Getting Started

### Installation
```bash
# Step 1: Clone repository
git clone <repository-url>
cd SF_F

# Step 2: Install dependencies (creates node_modules/)
npm install

# Step 3: Create environment file
copy .env.example .env
# Edit .env with your configuration

# Step 4: Start development server
npm run dev
# Opens: http://localhost:5173
```

**Result:** Directory structure transforms from BEFORE to AFTER state

### Production Build
```bash
npm run build
# Outputs to: dist/
```

### Deployment Targets
1. **Render** (primary)
   - Manual deployment
   - Full Node.js server
   - Uses `render.yaml` config

2. **Vercel** (alternative)
   - Auto-deploys from GitHub main branch
   - Serverless functions in `/api`
   - Uses `vercel.json` config

---

**Last Updated:** January 2025  
**Project:** SmartFlight - Flight Search & Tracking Application  
**Tech Stack:** React + TypeScript + Vite + Firebase + Express.js
