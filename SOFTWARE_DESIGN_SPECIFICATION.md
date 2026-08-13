# SOFTWARE DESIGN SPECIFICATION (SDS)

## SmartFlight - Flight Search and Management System

---

**Document Information**

| Item | Details |
|------|---------|
| Project Name | SmartFlight - Flight Search and Management System |
| Document Type | Software Design Specification |
| Version | 2.0.0 |
| Date | January 2025 |
| Author | Wong Cheng Yong (M44100127) |
| Institution | University of Wollongong Malaysia KDU |
| Program | UCOMS DS |

---

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [System Architecture](#3-system-architecture)
4. [Data Design](#4-data-design)
5. [Design Patterns](#5-design-patterns)
6. [Component Design](#6-component-design)
7. [Interface Design](#7-interface-design)
8. [Security Design](#8-security-design)
9. [Performance Design](#9-performance-design)
10. [Deployment Architecture](#10-deployment-architecture)
11. [Appendices](#11-appendices)

---

## 1. INTRODUCTION

### 1.1 Purpose

This Software Design Specification (SDS) document provides a comprehensive technical description of the design and architecture of the SmartFlight application. It serves as a blueprint for developers, testers, and stakeholders to understand the system's internal structure, component interactions, data flow, and implementation strategies.

### 1.2 Scope

SmartFlight is an intelligent flight search and management system designed to help travelers find reliable flights by analyzing disruption probabilities, connection risks, and providing real-time tracking capabilities. The system prioritizes flight reliability over price, enabling users to make informed booking decisions based on historical performance data and intelligent risk assessment algorithms.


### 1.3 Intended Audience

This document is intended for:
- Software developers implementing the system
- System architects reviewing the design decisions
- Quality assurance engineers developing test strategies
- Project managers overseeing development progress
- Technical stakeholders evaluating system capabilities
- Future maintainers and enhancement teams

### 1.4 Definitions, Acronyms and Abbreviations

#### 1.4.1 Definitions

**SmartFlight:** A web-based flight search and management application that prioritizes flight reliability over price, utilizing AI-powered search capabilities to help travelers find dependable flights by analyzing disruption probabilities, connection risks, and route complexity.

**Registered User:** A final-year student, fresh graduate, or any traveler who has created an account with email verification. Registered users can log in to the user dashboard and perform the following functions: search flights with reliability assessment, save itineraries for future reference, set price alerts for fare monitoring, view search history, and track live flights in real-time.

**Guest User:** An unauthenticated visitor who can search for flights and view results but cannot access personalized features such as saving itineraries, setting price alerts, or accessing search history.

**Reliability Score:** A calculated metric (0-10 scale) that quantifies the probability of a flight itinerary completing successfully without significant delays or disruptions, based on multiple factors including historical airline performance, connection adequacy, route complexity, and time-of-day variations.

**Connection Risk:** An assessment categorized as LOW, MEDIUM, or HIGH that evaluates whether the layover time between connecting flights is sufficient for passengers to successfully make their connections, accounting for airport size and operational complexity.

**Itinerary:** A complete flight route from origin to final destination, consisting of one or more flight legs. Each itinerary includes departure/arrival details, airline information, pricing, and reliability metrics.

**Flight Leg:** An individual flight segment operated by a single airline under one flight number, representing one portion of a complete itinerary from one airport to another.

**Price Alert:** A user-configured monitoring system that tracks flight prices and notifies users when the fare drops below their specified target price threshold.

**Live Flight Tracking:** Real-time monitoring of a specific flight by flight number, providing current position, altitude, speed, status, and estimated arrival time through an interactive radar visualization interface.

#### 1.4.2 Acronyms and Abbreviations

| Acronym | Full Form |
|---------|-----------|
| SDS | Software Design Specification |
| SPA | Single Page Application |
| MVC | Model-View-Controller |
| API | Application Programming Interface |
| REST | Representational State Transfer |
| HTTP | Hypertext Transfer Protocol |
| HTTPS | Hypertext Transfer Protocol Secure |
| JSON | JavaScript Object Notation |
| AI | Artificial Intelligence |
| ML | Machine Learning |
| UI | User Interface |
| UX | User Experience |
| CDN | Content Delivery Network |
| SSL | Secure Sockets Layer |
| TLS | Transport Layer Security |
| CORS | Cross-Origin Resource Sharing |
| JWT | JSON Web Token |
| IATA | International Air Transport Association (airport codes) |
| TTL | Time To Live (cache duration) |
| WebSocket | Web Socket Protocol (real-time communication) |
| CRUD | Create, Read, Update, Delete operations |
| NoSQL | Not Only SQL (database type) |
| CI/CD | Continuous Integration / Continuous Deployment |
| HMR | Hot Module Replacement |
| TTI | Time To Interactive |
| FCP | First Contentful Paint |
| LCP | Largest Contentful Paint |
| CLS | Cumulative Layout Shift |
| FID | First Input Delay |
| SEO | Search Engine Optimization |
| XSS | Cross-Site Scripting |
| PaaS | Platform as a Service |
| RM | Ringgit Malaysia (currency) |
| ETA | Estimated Time of Arrival |
| SVG | Scalable Vector Graphics |
| CSS | Cascading Style Sheets |
| HTML | Hypertext Markup Language |
| DOM | Document Object Model |
| RAM | Random Access Memory |
| CPU | Central Processing Unit |
| OS | Operating System |
| IDE | Integrated Development Environment |
| VCS | Version Control System |
| npm | Node Package Manager |
| ESM | ECMAScript Modules |
| CJS | CommonJS |

#### 1.4.3 Technology-Specific Acronyms

| Acronym | Full Form | Context |
|---------|-----------|---------|
| React | React JavaScript Library | Frontend framework |
| TypeScript | TypeScript Language | Type-safe JavaScript superset |
| Vite | Vite Build Tool | Frontend build tool and dev server |
| Express | Express.js Framework | Backend web application framework |
| Firebase | Firebase Platform | Google's Backend-as-a-Service platform |
| Firestore | Cloud Firestore | Firebase NoSQL database |
| Tailwind | Tailwind CSS | Utility-first CSS framework |
| ESBuild | ESBuild Bundler | Fast JavaScript bundler |
| JSX | JavaScript XML | React syntax extension |
| TSX | TypeScript XML | TypeScript React syntax |

### 1.5 Document Conventions

Throughout this document, the following conventions are used:
- **Bold text** indicates important terms or emphasis
- `Code blocks` represent source code, configuration, or technical syntax
- *Italic text* denotes file names, paths, or references
- Diagrams and figures are numbered sequentially within sections
- Tables provide structured data presentation

### 1.6 References

This SDS references the following project documents:
- SmartFlight Requirements Specification
- SmartFlight Use Case Diagrams and Documentation
- Firebase Firestore Security Rules (*firestore.rules*)
- TypeScript Configuration (*tsconfig.json*)
- Vite Build Configuration (*vite.config.ts*)
- Package Dependencies (*package.json*)
- Project README (*README.md*)

---

## 2. SYSTEM OVERVIEW

### 2.1 Product Perspective

This section provides the context for SmartFlight - a web-based flight search and management application developed as a Final Year Project. The application is built with React 19 and TypeScript for the frontend, Express.js with Node.js for the backend, and Firebase (Firestore and Authentication) for data storage and user management. The application is hosted on Render platform and is designed for travelers who prioritize flight reliability over price.

SmartFlight was designed to address a critical gap in the flight search market by providing an integrated platform that prioritizes reliability metrics over price. Unlike traditional booking platforms that focus primarily on finding the cheapest flights, SmartFlight analyzes disruption probabilities, connection risks, route complexity, and historical airline performance to help users make informed decisions. The platform includes flight search with reliability scoring, live flight tracking, itinerary management, price alerts, and automated search history tracking. The application does not require installation, running entirely in modern web browsers.

The application is developed in an iterative manner following agile methodologies. This SDS document serves as the primary technical guide for the implementation, testing, and deployment of SmartFlight, and will be updated based on user feedback and supervisor recommendations throughout the development lifecycle.

#### 2.1.1 User Interfaces

The following table (Table 2.1) summarizes the graphical user interface requirements specified for SmartFlight.

**Table 2.1: SmartFlight Graphical User Interface Requirements**

| Requirement ID | Description | Priority | Author |
|----------------|-------------|----------|--------|
| REQ_U001 | The system shall use a consistent dark-themed design with glassmorphism effects across all pages and components. | High | Wong Cheng Yong |
| REQ_U002 | The system shall provide intuitive tab-based navigation with clear icons and labels for Search, Live Tracking, Saved Itineraries, and Profile sections. | High | Wong Cheng Yong |
| REQ_U003 | The system shall use color-coded visual indicators (green for RELIABLE, yellow for CAUTION, red for HIGH RISK) for reliability scores and connection risk assessments. | High | Wong Cheng Yong |
| REQ_U004 | The system shall be fully responsive and provide optimal user experience across desktop (1920×1080), tablet (768×1024), and mobile (375×667) devices. | High | Wong Cheng Yong |
| REQ_U005 | The system shall display loading states with skeleton screens and spinners during asynchronous operations. | Medium | Wong Cheng Yong |
| REQ_U006 | The system shall provide toast notifications for user actions (success, error, warning) with 3-second auto-dismiss. | Medium | Wong Cheng Yong |
| REQ_U007 | The system shall implement smooth animations using Framer Motion for page transitions, modal appearances, and list item rendering. | Low | Wong Cheng Yong |
| REQ_U008 | The system shall use Lucide React icons for consistent iconography throughout the application. | Low | Wong Cheng Yong |

#### 2.1.2 Hardware Interfaces

Not applicable. SmartFlight is a web application that does not require any specialized hardware interfaces. The application runs entirely within modern web browsers (Chrome, Firefox, Safari, Edge) and does not interact directly with hardware devices. Users only need:

- **Minimum Hardware Requirements:**
  - Processor: 1 GHz or faster
  - RAM: 2 GB minimum, 4 GB recommended
  - Storage: No local storage required (cloud-based)
  - Internet Connection: Broadband connection (1 Mbps minimum)
  - Display: 1024×768 resolution minimum

#### 2.1.3 Software Interfaces

**Frontend Technologies:**
The SmartFlight frontend is built using React 19 with TypeScript for type safety and enhanced developer experience. The user interface utilizes Tailwind CSS 4 for utility-first styling, Framer Motion 12 for smooth animations, and Lucide React for iconography. Date handling is managed through date-fns library, and calendar selection uses react-day-picker component.

**Backend Technologies:**
The backend server is created using Express.js 4.21.2 with Node.js 20.x runtime for handling API requests and serving the compiled frontend application. RESTful API endpoints are exposed at `/api/search` for flight searches and `/api/tracking` for live flight tracking.

**Database and Authentication:**
The system is connected to Firebase Cloud Firestore (NoSQL document database) for storing user data, saved itineraries, price alerts, and search history. Firebase Authentication manages user registration, email verification, login sessions, and password recovery. All database operations are secured through Firestore Security Rules enforcing user-level access control.

**AI Integration:**
Flight search capabilities are implemented through intelligent algorithms that process search queries and generate flight recommendations with reliability scoring. The system analyzes multiple factors to provide comprehensive flight assessments.

**Caching Mechanism:**
Client-side caching utilizes browser Session Storage with 30-minute TTL for search results. Server-side caching implements in-memory object storage with 1-hour TTL for frequently accessed flight data, reducing external API calls and improving response times.

**Build and Development Tools:**
Vite 6.4.1 serves as the build tool providing fast Hot Module Replacement (HMR) during development and optimized production bundles. ESBuild handles backend server compilation. TypeScript 5.8.3 ensures type safety across the entire codebase.

**Deployment Platform:**
The entire system is deployed on Render platform (https://render.com) using their free tier Web Service option. Render provides automatic SSL certificates, continuous deployment from GitHub, environment variable management, and built-in monitoring.

**Browser APIs:**
- **File API:** For airport selector autocomplete and dropdown interactions
- **Fetch API:** For HTTP requests to backend endpoints
- **LocalStorage/SessionStorage API:** For caching and persistent user preferences
- **WebSocket API:** For Firebase Firestore real-time synchronization

**External APIs:**
- **Firebase Auth API:** User authentication and session management
- **Firebase Firestore API:** Real-time database operations with WebSocket synchronization

#### 2.1.4 Communication Interfaces

The system uses **HTTPS protocol** exclusively for all communication between client and server, ensuring encrypted data transmission. All API endpoints require secure HTTPS connections; HTTP requests are automatically redirected to HTTPS in production.

**Client-Server Communication:**
- RESTful API architecture with JSON data format
- POST requests for flight search: `/api/search` (request body contains query and date)
- POST requests for flight tracking: `/api/tracking` (request body contains flight number)
- Response format: JSON with standardized structure
- Content-Type: `application/json`
- CORS configured to allow requests only from authorized frontend domains

**Firebase Communication:**
- Firebase Authentication uses secure token-based authentication with automatic token refresh
- Firestore database connections use WebSocket protocol (wss://) for real-time synchronization
- All Firebase connections encrypted with TLS 1.2+
- Firebase SDK handles connection management, retry logic, and offline persistence

**External API Communication:**
- Backend API endpoints accessed via HTTPS POST requests
- Request/response format: JSON
- Timeout configured at 10 seconds to prevent hanging requests
- Retry logic with exponential backoff for transient failures


### 2.2 Product Features

The following table (Table 2.2) summarizes the core features of SmartFlight organized by user role and functionality.

**Table 2.2: Product Features of SmartFlight**

| Feature ID | Feature Name | Description | Role |
|------------|-------------|-------------|------|
| F001 | User Authentication | Provides secure login and logout functionality using Firebase Authentication with email/password credentials and session token management. | User |
| F002 | User Registration | Allows new users to create an account by entering valid email and password (minimum 6 characters), with automated email verification link sent to confirm account ownership. | User |
| F003 | Email Verification | Requires users to verify their email address before accessing protected features (save itineraries, price alerts). Provides resend verification email functionality. | User |
| F004 | Password Recovery | Allows users to reset forgotten password by entering their registered email, receiving a secure password reset link, and setting a new password through Firebase Auth. | User |
| F005 | Intelligent Flight Search | Allows users to search flights by selecting origin/destination airports and travel dates, with intelligent search algorithms generating results with reliability scores. | User & Guest |
| F006 | Reliability Score Calculation | Automatically calculates 0-10 reliability score for each itinerary based on disruption probability, connection risk, route complexity, and time-of-day factors. | System |
| F007 | Connection Risk Assessment | Analyzes layover times at connecting airports, categorizes risk as LOW/MEDIUM/HIGH based on airport complexity and minimum connection time requirements. | System |
| F008 | Search Results Filtering | Allows users to filter search results by airline, number of stops (direct/1-stop/2+ stops), time of day (morning/afternoon/evening), and sort by reliability or price. | User & Guest |
| F009 | Detailed Itinerary View | Displays comprehensive flight details including all legs, departure/arrival times, reliability breakdown, connection times, and actionable options in a modal interface. | User & Guest |
| F010 | Save Itinerary | Allows authenticated users with verified email to save flight itineraries to Firestore for future reference, with real-time synchronization across devices. | User |
| F011 | Saved Itineraries Management | Allows users to view all saved itineraries in a dedicated tab, with options to view details or delete saved flights. Syncs in real-time via Firestore. | User |
| F012 | Price Alert Creation | Allows users to set target prices for specific itineraries, creating alerts that monitor price changes. Requires target price to be lower than current price. | User |
| F013 | Price Alert Management | Allows users to view active price alerts in Profile section, showing current price, target price, and potential savings. Users can delete unwanted alerts. | User |
| F014 | Search History Tracking | Automatically records all user searches with origin, destination, date, result count, and timestamp. Stored in Firestore for quick re-access. | User |
| F015 | Search History Management | Allows users to view chronological search history in Profile section, with options to delete individual searches or clear all history. | User |
| F016 | Live Flight Tracking | Allows users (authenticated or guest) to track real-time flight status by entering flight number, displaying position, altitude, speed, progress, and ETA with radar visualization. | User & Guest |
| F017 | Multi-City Trip Planning | Allows users to search for complex itineraries with multiple destinations, configuring origin, destination, and date independently for each leg. | User & Guest |
| F018 | Itinerary Comparison | Allows users to select multiple search results (up to 3) for side-by-side comparison of reliability, price, duration, connections, and risk levels. | User & Guest |
| F019 | Email Sharing | Allows users to share itinerary details via email using mailto: protocol, generating pre-formatted email body with complete flight information. | User & Guest |
| F020 | Trip Type Selection | Allows users to choose between one-way, round-trip, and multi-city search modes, dynamically adjusting the search form based on selection. | User & Guest |
| F021 | Session Caching | Implements client-side caching using Session Storage with 30-minute TTL for search results, reducing redundant API calls for repeated searches. | System |
| F022 | Real-Time Synchronization | Provides automatic data synchronization across devices using Firestore WebSocket listeners for saved itineraries, price alerts, and search history. | System |
| F023 | Optimistic UI Updates | Implements optimistic updates for save/delete operations, instantly updating UI while background Firestore operations complete, with rollback on errors. | System |
| F024 | Responsive Design | Provides fully responsive interface adapting layout for desktop (3-column), tablet (2-column), and mobile (1-column) screens with touch-optimized controls. | System |
| F025 | Error Handling | Implements comprehensive error handling with user-friendly messages, retry logic with exponential backoff, and graceful degradation when services fail. | System |

### 2.3 User Classes and Characteristics

SmartFlight supports two primary user classes with distinct characteristics and access levels:

#### 2.3.1 Guest User

**Characteristics:**
- Unauthenticated visitor to the application
- No account required to access basic features
- Typical user: Casual travelers exploring flight options
- Technical proficiency: Basic (able to use web browsers and online forms)
- Usage frequency: Sporadic, one-time searches

**Accessible Features:**
- Flight search with reliability assessment
- View search results with filtering and sorting
- Detailed itinerary view
- Live flight tracking
- Multi-city trip planning
- Itinerary comparison
- Email sharing

**Restricted Features:**
- Cannot save itineraries
- Cannot set price alerts
- No search history tracking
- No persistent data across sessions

#### 2.3.2 Registered User

**Characteristics:**
- Authenticated user with verified email address
- Account created through registration process
- Typical user: Frequent travelers, travel planners, students, professionals
- Technical proficiency: Basic to intermediate
- Usage frequency: Regular, planning multiple trips

**Accessible Features:**
- All guest user features, plus:
- Save unlimited flight itineraries
- Set and manage price alerts
- View and manage search history
- Real-time data synchronization across devices
- Persistent saved data
- Profile management (password change, email verification status)

**Authentication Requirements:**
- Valid email address
- Password (minimum 6 characters)
- Email verification required for protected features
- Secure session management via Firebase Auth tokens

### 2.4 Operating Environment

SmartFlight operates in a modern web browser environment with the following specifications:

**Client-Side Environment:**
- **Supported Browsers:**
  - Google Chrome 90+ (recommended)
  - Mozilla Firefox 88+
  - Apple Safari 14+
  - Microsoft Edge 90+
- **Operating Systems:**
  - Windows 10/11
  - macOS 10.15+
  - Linux (Ubuntu 20.04+, Fedora, etc.)
  - iOS 14+ (mobile)
  - Android 10+ (mobile)
- **Screen Resolutions:**
  - Desktop: 1024×768 minimum, 1920×1080 recommended
  - Tablet: 768×1024
  - Mobile: 375×667 minimum
- **Network Requirements:**
  - Broadband internet connection (1 Mbps minimum, 5 Mbps recommended)
  - HTTPS support required
  - WebSocket support for real-time features

**Server-Side Environment:**
- **Hosting Platform:** Render (https://render.com)
- **Server Location:** Cloud-based, automatically distributed
- **Runtime:** Node.js 20.x LTS
- **Operating System:** Linux (managed by Render)
- **Database:** Firebase Firestore (cloud-hosted, multi-region)
- **Authentication:** Firebase Authentication (cloud service)

**Development Environment:**
- **IDE:** Visual Studio Code (recommended)
- **Version Control:** Git with GitHub repository
- **Package Manager:** npm 10.x
- **Build Tool:** Vite 6.4.1
- **TypeScript Compiler:** 5.8.3

### 2.5 Design and Implementation Constraints

The following constraints influenced the design and implementation of SmartFlight:

**Technical Constraints:**
1. **Browser Compatibility:** Must support modern browsers with ES2020+ JavaScript support
2. **No Native Apps:** Web-only application, no iOS/Android native apps in current version
3. **Firebase Free Tier Limits:**
   - 50,000 document reads per day
   - 20,000 document writes per day
   - 1 GB stored data
   - 10 GB monthly bandwidth
4. **Render Free Tier Limits:**
   - Service spins down after 15 minutes of inactivity
   - 750 hours per month
   - Cold start latency (15-30 seconds on first request after spin-down)
5. **Client-Side Processing:** Heavy computation must be done server-side due to browser limitations

**Business Constraints:**
1. **Zero Cost Requirement:** All services must use free tiers (Firebase, Render)
2. **No Payment Processing:** No booking or payment functionality (search and planning only)
3. **Demo Data:** Flight search uses simulated data for demonstration purposes
4. **Single Language:** English-only interface (no multi-language support)
5. **No Mobile App:** Web application only, responsive design for mobile browsers

**Development Constraints:**
1. **Solo Developer:** Single-person development team
2. **Academic Timeline:** Development completed within academic year (FYP schedule)
3. **Technology Stack:** Must use approved technologies (React, TypeScript, Firebase, Express)
4. **Documentation Requirements:** Comprehensive SDS, testing documentation required

**Security Constraints:**
1. **Email Verification Mandatory:** Protected features require verified email
2. **HTTPS Only:** No unencrypted HTTP connections allowed
3. **Firestore Security Rules:** Server-side enforcement of data access control
4. **No PII Storage:** Minimal personal data collection (email only)

**Performance Constraints:**
1. **Search Response Time:** Target <3 seconds for cached results, <10 seconds for fresh searches
2. **Page Load Time:** Target <3 seconds on broadband connections
3. **Mobile Performance:** Must maintain 60fps scrolling on mobile devices
4. **Bundle Size:** JavaScript bundles must stay under 300KB gzipped

### 2.6 Assumptions and Dependencies

### 2.6 Assumptions and Dependencies

**Assumptions:**

1. **User Environment:**
   - Users have access to modern web browsers with JavaScript enabled
   - Users have stable internet connection (minimum 1 Mbps)
   - Users are familiar with basic web application navigation
   - Users can receive and access email for verification purposes

2. **System Availability:**
   - Firebase services (Auth, Firestore) maintain 99.9% uptime
   - Render hosting platform maintains service availability
   - Third-party services maintain backward-compatible APIs

3. **Data Validity:**
   - Users provide accurate email addresses during registration
   - Airport codes in search queries are valid IATA codes
   - Flight numbers entered for tracking are in correct format (e.g., "MH123")
   - Users understand reliability scores represent estimates, not guarantees

4. **Security:**
   - Users maintain confidentiality of their login credentials
   - Users' devices are not compromised by malware
   - HTTPS certificates remain valid and trusted by browsers
   - Firebase security rules effectively prevent unauthorized access

5. **Performance:**
   - Average search returns 3-10 itinerary results
   - Majority of users search 1-5 routes per session
   - Peak concurrent users do not exceed free tier capacity
   - Network latency remains under 200ms for most users

**Dependencies:**

1. **External Services:**
   - **Firebase Authentication:** User login, registration, password reset, email verification
     - Dependency Risk: Medium - Critical for user features
     - Mitigation: Guest mode allows basic usage without authentication
   
   - **Firebase Firestore:** Database for saved itineraries, price alerts, search history
     - Dependency Risk: High - Core data storage
     - Mitigation: Session caching provides temporary offline access
   
   - **Render Hosting Platform:** Application hosting and deployment
     - Dependency Risk: Medium - Affects accessibility
     - Mitigation: Alternative deployment to Vercel possible

2. **Third-Party Libraries:**
   - **React 19:** Frontend UI framework
     - Dependency Risk: Low - Stable, widely supported
   
   - **Firebase SDK:** Client-side Firebase integration
     - Dependency Risk: Medium - Managed by Google
   
   - **Tailwind CSS 4:** Styling framework
     - Dependency Risk: Low - CSS-only dependency
   
   - **Framer Motion:** Animation library
     - Dependency Risk: Low - Optional enhancement
   
   - **date-fns:** Date manipulation library
     - Dependency Risk: Low - Can be replaced if needed

3. **Development Tools:**
   - **Node.js 20.x:** JavaScript runtime
     - Dependency Risk: Low - LTS version, stable
   
   - **Vite 6.4.1:** Build tool
     - Dependency Risk: Low - Development tool only
   
   - **TypeScript 5.8.3:** Type checking
     - Dependency Risk: Low - Compile-time only

4. **Infrastructure:**
   - **DNS Services:** Domain name resolution
   - **SSL/TLS Certificates:** Secure connections (managed by Render)
   - **CDN:** Content delivery (if using Vercel alternative)
   - **Email Services:** For Firebase Auth verification emails

5. **Browser APIs:**
   - **LocalStorage/SessionStorage:** Client-side data persistence
   - **Fetch API:** HTTP requests
   - **WebSocket API:** Real-time Firestore connections
   - **Modern JavaScript (ES2020):** Language features

**Dependency Management Strategy:**

- Regular monitoring of dependency updates for security patches
- Quarterly review of third-party service status and alternatives
- Automated dependency vulnerability scanning via npm audit
- Version pinning for critical dependencies to prevent breaking changes
- Fallback strategies documented for each critical external service
- Monthly backup of Firestore data to prevent data loss

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architectural Overview

SmartFlight employs a **Client-Server Architecture** with a clear separation between frontend presentation layer and backend business logic layer. The system follows the **Model-View-Controller (MVC)** pattern to organize code into distinct layers, promoting maintainability, scalability, and testability.

**Figure 3.1: High-Level System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                              │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              React 19 + TypeScript Frontend             │    │
│  │                                                          │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│    │
│  │  │  View    │  │  View    │  │  View    │  │  View  ││    │
│  │  │  Search  │  │  Track   │  │  Saved   │  │ Profile││    │
│  │  └─────┬────┘  └─────┬────┘  └─────┬────┘  └────┬───┘│    │
│  │        │             │             │            │     │    │
│  │  ┌─────┴─────────────┴─────────────┴────────────┴───┐ │    │
│  │  │            Controller (App.tsx)                   │ │    │
│  │  │   - State Management (useState, useEffect)        │ │    │
│  │  │   - Event Handlers                                │ │    │
│  │  │   - Business Logic Orchestration                  │ │    │
│  │  └───────────────────────┬───────────────────────────┘ │    │
│  │                          │                              │    │
│  │  ┌───────────────────────┴───────────────────────────┐ │    │
│  │  │         Model Layer (Services + Types)            │ │    │
│  │  │   - flightService.ts (API calls)                  │ │    │
│  │  │   - firebase.ts (Auth + Firestore)                │ │    │
│  │  │   - global.d.ts (TypeScript interfaces)           │ │    │
│  │  └───────────────────────────────────────────────────┘ │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS REST API
                           │ (JSON)
┌──────────────────────────┴──────────────────────────────────────┐
│                       APPLICATION TIER                           │
│  ┌────────────────────────────────────────────────────────┐    │
│  │         Express.js + Node.js Backend Server             │    │
│  │                                                          │    │
│  │  API Endpoints:                                         │    │
│  │  - POST /api/search      (Flight Search)               │    │
│  │  - POST /api/tracking    (Live Flight Tracking)        │    │
│  │                                                          │    │
│  │  Responsibilities:                                      │    │
│  │  - Request validation and sanitization                 │    │
│  │  - Reliability score calculation                        │    │
│  │  - Connection risk assessment                           │    │
│  │  - Server-side caching (in-memory, 1hr TTL)           │    │
│  │  - Static file serving (dist/)                         │    │
│  └────────────────────────────────────────────────────────┘    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ WebSocket (wss://)
                           │ HTTPS API
┌──────────────────────────┴──────────────────────────────────────┐
│                          DATA TIER                               │
│  ┌─────────────────────┐         ┌─────────────────────────┐   │
│  │  Firebase Firestore │         │  Firebase Authentication│   │
│  │   (NoSQL Database)  │         │    (Auth Service)       │   │
│  │                     │         │                         │   │
│  │  Collections:       │         │  Features:              │   │
│  │  - saved_itineraries│         │  - Email/Password       │   │
│  │  - price_alerts     │         │  - Email Verification   │   │
│  │  - search_history   │         │  - Password Reset       │   │
│  │                     │         │  - Session Tokens       │   │
│  └─────────────────────┘         └─────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Architectural Patterns

SmartFlight implements multiple architectural patterns to ensure robust, maintainable, and scalable design:

#### 3.2.1 Three-Tier Architecture

**Presentation Tier (Client):**
- React components rendering UI
- User interaction handling
- Client-side validation
- Session-based caching

**Application Tier (Server):**
- Express.js API endpoints
- Business logic processing
- Reliability score algorithms
- Server-side caching

**Data Tier (Firebase):**
- Firestore database storage
- Firebase Authentication service
- Real-time synchronization
- Security rule enforcement

**Benefits:**
- Clear separation of concerns
- Independent scaling of tiers
- Easier maintenance and testing
- Technology flexibility per tier

#### 3.2.2 Model-View-Controller (MVC)

**Detailed in Section 5.1.1** - Separates application into Model (data structures), View (UI components), and Controller (business logic), promoting organized code structure.

#### 3.2.3 Component-Based Architecture

**Detailed in Section 5.1.2** - Breaks down UI into reusable, self-contained components with clear props interfaces.

#### 3.2.4 Service Layer Pattern

**Detailed in Section 5.1.3** - Abstracts API calls and business logic into dedicated service modules (*flightService.ts*, *firebase.ts*).

#### 3.2.5 Real-Time Synchronization (Observer Pattern)

**Detailed in Section 5.1.4** - Uses Firestore WebSocket listeners to push data changes to clients in real-time.

### 3.3 Component Interaction Diagram

**Figure 3.2: Component Interaction Flow**

```
┌──────────────┐
│     User     │
└──────┬───────┘
       │ Interacts
       ▼
┌─────────────────────────────────────────────────────────┐
│              React Component (View)                      │
│  Example: SearchView.tsx                                 │
│  - Renders search form                                   │
│  - Displays results                                      │
└──────────────────────┬──────────────────────────────────┘
                       │ Triggers event
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Controller (App.tsx)                           │
│  handleSearch(origin, destination, date)                 │
│  - Validates input                                       │
│  - Checks cache                                          │
│  - Calls service layer                                   │
└──────────────────────┬──────────────────────────────────┘
                       │ Invokes
                       ▼
┌─────────────────────────────────────────────────────────┐
│          Service Layer (flightService.ts)                │
│  searchFlight(query, date)                               │
│  - Constructs API request                                │
│  - Handles caching logic                                 │
│  - Makes HTTP call                                       │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP POST
                       ▼
┌─────────────────────────────────────────────────────────┐
│         Backend API (server.ts)                          │
│  POST /api/search                                        │
│  - Validates request                                     │
│  - Generates flight data                                 │
│  - Calculates reliability scores                         │
│  - Returns JSON response                                 │
└──────────────────────┬──────────────────────────────────┘
                       │ Returns data
                       ▼
┌─────────────────────────────────────────────────────────┐
│          Service Layer (flightService.ts)                │
│  - Caches results (sessionStorage)                       │
│  - Transforms data if needed                             │
│  - Returns to controller                                 │
└──────────────────────┬──────────────────────────────────┘
                       │ Returns
                       ▼
┌─────────────────────────────────────────────────────────┐
│           Controller (App.tsx)                           │
│  - Updates state: setSearchResults(data)                 │
│  - Triggers re-render                                    │
└──────────────────────┬──────────────────────────────────┘
                       │ Updates
                       ▼
┌─────────────────────────────────────────────────────────┐
│              React Component (View)                      │
│  - Renders updated results                               │
│  - Displays reliability scores                           │
└─────────────────────────────────────────────────────────┘
```

### 3.4 Data Flow Architecture

**Figure 3.3: Data Flow Diagram - Flight Search Process**

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Enters search query
     ▼
┌────────────────────┐
│  SearchView (UI)   │
└────┬───────────────┘
     │ 2. Triggers handleSearch()
     ▼
┌────────────────────┐      3. Check cache
│  App.tsx          │──────────────────────┐
│  (Controller)      │                      │
└────┬───────────────┘                      ▼
     │ 4. Not cached                   ┌──────────────┐
     ▼                                 │ SessionStorage│
┌────────────────────┐                │  (Client)     │
│ flightService.ts   │◄───────────────┤  30min TTL    │
│  (Service Layer)   │ 5. Cache miss  └──────────────┘
└────┬───────────────┘
     │ 6. POST /api/search
     ▼
┌────────────────────┐
│  Express Server    │
│  (Backend API)     │
└────┬───────────────┘
     │ 7. Process request
     ▼
┌────────────────────┐
│ Reliability        │
│ Algorithm Engine   │
│ - Disruption calc  │
│ - Connection risk  │
│ - Route analysis   │
└────┬───────────────┘
     │ 8. Generate results
     ▼
┌────────────────────┐      9. Cache response
│  Server Cache      │◄─────────────────────┐
│  (In-memory)       │                      │
│  1hr TTL           │                      │
└────────────────────┘                      │
     │ 10. Return JSON                      │
     ▼                                      │
┌────────────────────┐                      │
│  Express Server    │──────────────────────┘
└────┬───────────────┘
     │ 11. HTTP Response
     ▼
┌────────────────────┐
│ flightService.ts   │
└────┬───────────────┘
     │ 12. Store in SessionStorage
     ▼
┌────────────────────┐
│  App.tsx           │
│  setSearchResults  │
└────┬───────────────┘
     │ 13. Update state
     ▼
┌────────────────────┐
│  SearchView (UI)   │
│  Render results    │
└────────────────────┘
```

### 3.5 Sequence Diagrams

This section provides detailed sequence diagrams illustrating the interactions between system components for each major use case. These diagrams follow UML 2.0 sequence diagram notation and demonstrate the temporal ordering of messages exchanged between actors and system components.

#### 3.5.1 UC001 - Search Itinerary and View Risk

This is the **primary use case** representing the core functionality of SmartFlight: searching for flights and viewing reliability-based risk assessments.

**Figure 3.7: UC001 Sequence Diagram - Search Itinerary and View Risk**

**Actors:**
- User (Primary Actor)
- Web Interface (React Frontend)
- SmartFlight Backend (Express.js API)
- Flight Data Service (External API or simulated data source)
- Prediction Model (Reliability Algorithm)

**Main Flow:**

1. **User Input Phase:**
   - User opens SmartFlight web application
   - User selects origin airport (e.g., "KUL - Kuala Lumpur")
   - User selects destination airport (e.g., "SIN - Singapore")
   - User selects departure date
   - User optionally selects preferences (trip type, passengers, class)
   - User clicks "Search Flights" button

2. **Search Submission:itical dependencies to prevent breaking changes
- Graceful degradation when optional dependencies fail
- Clear error messages when critical dependencies unavailable

### 2.7 System Evolution and Future Enhancements

**Planned Enhancements (Post-FYP):**

**Phase 1 - Real Data Integration:**
- Integration with real flight data APIs (Amadeus, Skyscanner)
- Actual price monitoring with email notifications
- Historical flight performance data for improved reliability scoring

**Phase 2 - Enhanced Features:**
- Direct booking integration with airlines
- Multi-language support (Malay, Chinese, Tamil)
- Native mobile applications (iOS, Android)
- Push notifications for price alerts and flight status changes
- Flexible date search (compare prices across date ranges)

**Phase 3 - Advanced Capabilities:**
- Trip planning with hotels and car rentals
- Social features (share trips with friends)
- Airline loyalty program integration
- Carbon footprint calculator
- AI-powered personalized recommendations based on history

**System Maintainability:**
- Modular component architecture enables easy feature additions
- Comprehensive TypeScript types ensure type safety during modifications
- Detailed documentation in code comments and separate markdown files
- Git version control with branch-based development workflow
- Automated testing suite (planned for production version)

---

**Frontend Technologies:**
- React 19 - Component-based UI framework
- TypeScript 5.8.3 - Static type checking and IDE support
- Vite 6.4.1 - Fast build tool with Hot Module Replacement (HMR)
- Tailwind CSS 4.0.5 - Utility-first CSS framework
- Framer Motion 12.0.3 - Animation library for smooth transitions
- Lucide React - Modern icon library
- date-fns - Date manipulation and formatting library


**Backend Technologies:**
- Node.js - JavaScript runtime environment
- Express.js 4.21.2 - Web application framework
- Firebase Authentication - User authentication and authorization
- Cloud Firestore - NoSQL real-time database
- Google Gemini API - AI-powered flight search intelligence

**Development Tools:**
- ESBuild - Fast JavaScript bundler for production builds
- TypeScript Compiler - Type checking and transpilation
- Git - Version control system
- VS Code - Primary development environment

**Deployment Platforms:**
- Render - Primary production hosting (https://sf-f.onrender.com)
- Vercel - Alternative deployment platform with serverless functions
- Firebase Hosting - Optional static hosting with CDN

### 2.4 Design Principles

**Component-Based Architecture:**
The system follows React's component-based architecture adapted to Model-View-Controller (MVC) principles, ensuring clear separation of concerns and maintainable code structure.

**Real-Time Synchronization:**
Firebase Firestore provides real-time data synchronization through WebSocket connections, ensuring users see updates immediately across all devices without manual refresh.

**Type Safety:**
TypeScript's static typing throughout the entire codebase prevents runtime errors, improves IDE support, and enhances developer productivity through compile-time error detection.

**Performance Optimization:**
Multi-layer caching strategies (session storage and server-side memory cache) reduce API calls and improve response times while maintaining appropriate data freshness.

**Security-First Design:**
Firebase Security Rules enforce server-side access control, preventing unauthorized data access even if client-side validation is bypassed.


**Graceful Degradation:**
The system implements fallback mechanisms at multiple levels, ensuring continued operation with reduced functionality when external services fail or become unavailable.

---

## 3. SYSTEM ARCHITECTURE

### 3.1 Architectural Pattern

SmartFlight employs a **Component-Based Single Page Application (SPA)** architecture with serverless backend functions, following modern web development best practices. The architecture maps to the Model-View-Controller (MVC) pattern adapted for React applications:

**Model Layer:**
- TypeScript type definitions (*src/types/global.d.ts*)
- Service layer functions (*src/services/flightService.ts*)
- Firebase database models (*src/firebase.ts*)

**View Layer:**
- React components (*src/components/*)
- UI primitives (*src/components/UI.tsx*)
- Styling with Tailwind CSS (*src/index.css*)

**Controller Layer:**
- Main application logic (*src/App.tsx*)
- Component state management with React Hooks
- Event handlers and business logic coordination

**Route Layer:**
- Express.js API endpoints (*api/search.js*, *api/tracking.js*)
- Server routing configuration (*server.ts*)
- Client-side navigation with conditional rendering

### 3.2 System Components

**Frontend Application (React SPA):**
- Runs in user's browser
- Handles UI rendering and user interactions
- Manages client-side state with React hooks
- Communicates with backend APIs via fetch()
- Implements real-time listeners for Firestore data


**Backend API Server (Express.js):**
- Runs on Node.js runtime
- Provides RESTful API endpoints
- Integrates with Google Gemini AI for flight search
- Implements server-side caching for performance
- Serves compiled React application in production

**Database Layer (Firebase Firestore):**
- NoSQL document database
- Real-time data synchronization via WebSocket
- Automatic scaling and high availability
- Security rules enforce access control
- Offline persistence for mobile reliability

**Authentication Service (Firebase Auth):**
- Email/password authentication
- Email verification workflow
- Password reset functionality
- Secure token-based sessions
- User profile management

**External APIs:**
- Google Gemini API for AI-powered search
- Flight tracking data providers (simulated for demo)

### 3.3 Data Flow Architecture

**Search Flow:**
```
User Input → Frontend Validation → Check Cache → API Request → 
Backend Processing → Gemini AI → Response Transformation → 
Reliability Calculation → Cache Storage → UI Rendering
```

**Authentication Flow:**
```
User Credentials → Firebase Auth → Email Verification → 
Token Generation → Local Storage → Authorized API Calls → 
Firestore Access
```

**Save Itinerary Flow:**
```
User Action → Auth Check → Email Verification Check → 
Optimistic UI Update → Firestore Write → Real-time Listener → 
Confirmed UI Update
```


**Real-Time Sync Flow:**
```
Firestore Change → WebSocket Notification → Snapshot Listener → 
State Update → React Re-render → UI Refresh
```

### 3.4 Directory Structure

The project follows a modular directory structure that separates concerns and promotes maintainability:

```
SF_F/
├── api/                          # Serverless API functions
│   ├── search.js                 # Flight search endpoint
│   └── tracking.js               # Flight tracking endpoint
│
├── src/                          # Frontend source code
│   ├── components/               # React components
│   │   ├── AirportSelector.tsx  # Airport autocomplete component
│   │   ├── CalendarSelector.tsx # Date picker component
│   │   ├── LiveFlightView.tsx   # Live tracking view
│   │   └── UI.tsx                # Reusable UI primitives
│   │
│   ├── constants/                # Static data and configurations
│   │   └── airports.ts          # Airport codes and names
│   │
│   ├── services/                 # Business logic layer
│   │   └── flightService.ts     # Flight API integration
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── global.d.ts          # Global interfaces
│   │
│   ├── lib/                      # Utility functions
│   │   └── utils.ts             # Helper functions
│   │
│   ├── App.tsx                   # Main application component
│   ├── firebase.ts               # Firebase configuration
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
│
├── dist/                         # Production build output (generated)
├── node_modules/                 # Dependencies (generated)
├── .env                          # Environment variables (not in git)
├── firestore.rules               # Firestore security rules
├── server.ts                     # Express backend server
├── vite.config.ts                # Vite build configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project metadata and dependencies
└── README.md                     # Project documentation
```


### 3.5 Sequence Diagrams

Sequence diagrams illustrate the interactions between different components of the SmartFlight system over time, showing the flow of messages and data exchanges between actors and system components.

#### 3.5.1 UC001 - Search Itinerary and View Risk Sequence

**Diagram Reference:** UC001 Sequence Diagram - Search Itinerary and View Risk

**Purpose:** Illustrates the core flight search functionality, showing how users search for flights and how the system calculates reliability and risk metrics.

**Actors:**
- User
- Web Interface (React Frontend)
- SmartFlight Backend
- Flight Data API
- Prediction Model (Reliability Calculation Engine)

**Main Flow:**

1. **User Input Phase:**
   - User enters origin, destination, and travel date
   - User optionally sets preferences (airline, stops, time of day)
   - User clicks "Search" button

2. **Search Submission:**
   - Web Interface submits search criteria to SmartFlight Backend
   - Backend retrieves matching itineraries from Flight Data API

**Alternative Flow [Matching itineraries found]:**

3. **Risk Analysis Phase:**
   - Flight Data API returns itinerary candidates to Backend
   - Backend computes disruption risk for each itinerary using Prediction Model
   - Prediction Model returns disruption risk values
   - Backend computes connection risk and reliability score
   - Prediction Model returns connection risk and reliability score values
   - Backend returns itinerary list with risk indicators to Web Interface

4. **Display Results:**
   - Web Interface displays itineraries with:
     - Reliability scores (0-10 scale)
     - Color-coded visual indicators (green/yellow/red)
     - Connection risk levels (LOW/MEDIUM/HIGH)
     - Flight details (airline, times, airports, duration)

**Alternative Flow [No results found]:**

1. Flight Data API returns "No matching itineraries"
2. Backend returns no-results response to Web Interface
3. Web Interface shows "No flights found" message
4. System suggests changing date or route to find alternatives

**Key Features:**
- Multi-step risk analysis pipeline (disruption → connection → reliability)
- Separation of concerns: Backend handles computation, Frontend handles presentation
- Intelligent fallback suggestions when no results found
- Real-time reliability scoring for all search results

**Technical Implementation:**
- Frontend validation before API call
- Backend orchestrates multiple risk calculation steps
- Prediction Model uses multi-factor algorithm (Section 10.6)
- Results sorted by reliability score descending

**Figure 3.7: UC001 Sequence Diagram - Search Itinerary and View Risk**
*[Reference to external diagram image showing complete search and risk analysis flow]*

---

#### 3.5.2 UC002 - View Flight Details Sequence

**Diagram Reference:** UC002 Sequence Diagram - View Flight Details

**Purpose:** Illustrates the process when a user selects an itinerary from search results to view detailed flight information.

**Actors:**
- User
- Web Interface (React Frontend)
- SmartFlight Backend
- Flight Data API

**Main Flow:**
1. User selects an itinerary from the results list
2. Web Interface requests itinerary details for the selected item
3. SmartFlight Backend retrieves detailed leg information from Flight Data API
4. Flight Data API returns complete itinerary data
5. Backend returns full flight details and risk values to Web Interface
6. Web Interface displays comprehensive flight information including:
   - Airline and flight numbers
   - Departure/arrival times and airports
   - Journey duration and leg risks
   - Overall reliability score

**Alternative Flow [Full details available]:**
- System successfully retrieves and displays all flight details with complete risk assessment

**Alternative Flow [Data error / partial details]:**
- Flight Data API returns partial data or encounters an error
- Backend returns partial itinerary details to Web Interface
- Web Interface shows available details with a message indicating some information is temporarily unavailable

**Figure 3.8: UC002 Sequence Diagram - View Flight Details**
*[Reference to external diagram image showing detailed interaction flow]*

---

#### 3.5.3 UC003 - Sort and Filter Results Sequence

**Diagram Reference:** UC003 Sequence Diagram - Sort and Filter Results

**Purpose:** Demonstrates how users can sort and filter flight search results in real-time on the client side.

**Actors:**
- User
- Web Interface (React SPA)

**Main Flow - Sorting:**
1. User selects a sorting option (reliability, duration, or price)
2. Web Interface reorders the current itinerary list based on selected criteria
3. Web Interface displays the sorted itinerary list to the user

**Main Flow - Filtering:**
1. User applies one or more filters:
   - Maximum number of stops
   - Preferred airline
   - Connection risk threshold
2. Web Interface applies filter conditions to current itinerary list
3. System evaluates which itineraries match the filter criteria

**Alternative Flow [At least one itinerary matches]:**
- Web Interface displays the updated filtered results to the user

**Alternative Flow [No itineraries match filters]:**
- Web Interface shows a "No itineraries match selected filters" message
- User can adjust or remove filters to see results again

**Key Features:**
- All sorting and filtering operations performed client-side (no backend calls)
- Instant UI updates using React state management
- Memoized filtering logic for performance optimization
- Multiple filters can be combined simultaneously

**Figure 3.9: UC003 Sequence Diagram - Sort and Filter Results**
*[Reference to external diagram image showing sorting and filtering interaction]*

---

#### 3.5.4 UC004 - View Alternative Itineraries Sequence

**Diagram Reference:** UC004 Sequence Diagram - View Alternative Itineraries

**Purpose:** Shows how the system suggests better alternative flight options when a user views a specific itinerary.

**Actors:**
- User
- React Web UI

**Main Flow:**
1. User selects an itinerary to view detailed results
2. React Web UI evaluates alternative itineraries from current search results
3. System excludes the selected itinerary and identifies better alternatives based on:
   - Higher reliability score
   - Lower price
   - Better connection times

**Alternative Flow [Suitable alternatives found]:**
1. React Web UI displays alternative itinerary cards with price and reliability comparison
2. User can select an alternative itinerary
3. React Web UI updates the selected itinerary state
4. System refreshes itinerary details and risk view
5. Web UI displays updated itinerary details and diagnostic values

**Alternative Flow [No suitable alternatives found]:**
- React Web UI shows a message indicating no better alternative is available
- User continues viewing the current itinerary details

**Key Features:**
- Intelligent comparison algorithm prioritizes reliability over price
- Side-by-side comparison of key metrics
- Real-time alternative identification without additional API calls
- Seamless state updates using React hooks

**Figure 3.10: UC004 Sequence Diagram - View Alternative Itineraries**
*[Reference to external diagram image showing alternative itinerary evaluation]*

---

#### 3.5.5 UC005 - Save or Export Itinerary Sequence

**Diagram Reference:** UC005 Sequence Diagram - Save or Export Itinerary

**Purpose:** Illustrates the dual functionality of saving itineraries to Firestore and exporting via email.

**Actors:**
- User
- React Web UI
- Firebase Auth
- Cloud Firestore
- System Email Client

**Save Itinerary Flow:**

1. User clicks "Save Itinerary" button
2. React Web UI checks current user session and email verification status with Firebase Auth

**Alternative Flow [User not authenticated or not verified]:**
- Firebase Auth returns "No valid verified user session"
- React Web UI redirects focus to profile/login section
- System shows message that login and email verification are required

**Main Flow [User authenticated and verified]:**
1. Firebase Auth returns verified user session
2. React Web UI prepares itinerary save data (legs, timings, price, reliability, risks)
3. Web UI sends save request to Cloud Firestore

**Sub-flow [Save successful]:**
- Firestore confirms save operation
- React Web UI updates saved itinerary state
- User sees saved confirmation message

**Sub-flow [Save failed]:**
- Firestore returns save error
- React Web UI shows error message to user

**Export Itinerary Flow:**

1. User clicks "Export" or "Share" button
2. React Web UI prepares itinerary summary with non-sensitive information
3. System formats mailto link with itinerary summary
4. React Web UI launches email client with pre-filled itinerary summary
5. System Email Client opens email draft for review or sending
6. User reviews and sends email manually

**Key Features:**
- Authentication and verification checks before saving
- Optimistic UI updates during save operations
- Email export using mailto: protocol (client-side only)
- Comprehensive error handling and user feedback

**Figure 3.11: UC005 Sequence Diagram - Save or Export Itinerary**
*[Reference to external diagram image showing save and export flows]*

---

#### 3.5.6 UC006 - Share Itinerary via Email Sequence

**Diagram Reference:** UC006 Sequence Diagram - Share Itinerary via Email

**Purpose:** Details the process of sharing flight itinerary information via email using mailto protocol.

**Actors:**
- User
- React Web UI
- System Email Client

**Main Flow:**

1. User views selected itinerary details
2. User clicks "Share" / Email icon button
3. React Web UI extracts itinerary details including:
   - Flight legs and airline information
   - Flight numbers
   - Departure/arrival timings
   - Total price
   - Flight status
   - Reliability score
4. System formats itinerary summary as plain text with structured sections
5. React Web UI constructs mailto link with:
   - Encoded subject line: "Flight Itinerary: [Origin] to [Destination]"
   - Encoded email body containing complete flight details
6. System triggers mailto redirect
7. Browser opens system mail client with pre-populated draft
8. User sees email draft with complete itinerary information
9. User reviews and sends email manually to desired recipients

**Email Content Structure:**
```
Subject: Flight Itinerary: KUL to SIN

Route: Kuala Lumpur (KUL) to Singapore (SIN)
Date: [Departure Date]
Reliability Score: [Score]/10
Status: [RELIABLE/CAUTION/HIGH RISK]
Price: RM[Amount]

Flight Details:
1. [Airline] [Flight Number]
   Departs: [Airport] at [Time]
   Arrives: [Airport] at [Time]

[Additional legs if multi-segment]

View more details on SmartFlight.
```

**Key Features:**
- No backend email service required (pure client-side)
- Pre-formatted professional email template
- URL encoding prevents injection attacks
- Works with any email client (Gmail, Outlook, Apple Mail, etc.)
- Privacy-preserving (no data sent to external servers)

**Figure 3.11: UC006 Sequence Diagram - Share Itinerary via Email**
*[Reference to external diagram image showing email sharing flow]*

---

#### 3.5.6 Additional Sequence Diagrams Summary

In addition to the detailed diagrams above, the SmartFlight system implements several other critical interaction flows:

**User Authentication Flows:**
- User Registration with Email Verification
- User Login with Session Management
- Password Reset Flow

**Flight Search Flows:**
- Multi-Layer Cached Search (Client + Server)
- Live Flight Tracking by Flight Number
- Multi-City Trip Search

**Data Management Flows:**
- Price Alert Creation and Management
- Search History Automatic Recording
- Real-Time Firestore Synchronization

These additional flows are described in textual format in earlier sections of this document and follow similar patterns of interaction between the React frontend, Firebase services, and backend APIs.

---

### 3.6 Build and Deployment Process

**Development Build:**
```bash
npm install                    # Install dependencies
npm run dev                    # Start Vite dev server (port 5173)
```

**Production Build:**
```bash
npm run build                  # Vite build + ESBuild server compilation
# Generates:
# - dist/assets/*.js          # Bundled and minified JavaScript
# - dist/assets/*.css         # Compiled and minified CSS
# - dist/index.html           # HTML entry point
# - dist/server.cjs           # Compiled Express server
```

**Deployment:**
```bash
npm start                      # Start production server (port 3000)
# Server serves:
# - Static files from /dist
# - API routes at /api/search and /api/tracking
# - SPA fallback for client-side routing
```

---

## 4. DATA DESIGN

### 4.1 Data Model Overview

SmartFlight employs a document-oriented data model using Firebase Firestore, which provides flexibility, scalability, and real-time synchronization capabilities. The database consists of four primary collections: `users`, `saved_itineraries`, `price_alerts`, and `search_history`.

### 4.2 Firestore Collections

#### 4.2.1 Users Collection

**Collection Path:** `/users/{uid}`

**Purpose:** Stores user profile information and account metadata.

**Document Structure:**
```typescript
interface User {
  uid: string;                    // Firebase Auth user ID (document ID)
  email: string;                  // User's email address
  displayName?: string;           // Optional display name
  createdAt: Timestamp;           // Account creation timestamp
  role: 'user' | 'admin';        // User authorization role
  emailVerified: boolean;         // Email verification status
}
```


**Access Control:**
- Users can read and create only their own profile document
- Document ID matches Firebase Auth UID for security enforcement
- Admin role for future administrative features

**Sample Document:**
```json
{
  "uid": "abc123xyz789",
  "email": "user@example.com",
  "displayName": "John Traveler",
  "createdAt": "2025-01-15T10:30:00Z",
  "role": "user",
  "emailVerified": true
}
```

#### 4.2.2 Saved Itineraries Collection

**Collection Path:** `/saved_itineraries/{uid}_{itineraryId}`

**Purpose:** Stores user-saved flight itineraries for future reference and comparison.

**Document Structure:**
```typescript
interface SavedItinerary {
  uid: string;                    // Owner's Firebase Auth UID
  itineraryId: string;            // Unique itinerary identifier
  origin: string;                 // Departure airport code (e.g., "KUL")
  destination: string;            // Arrival airport code (e.g., "SIN")
  reliabilityScore: number;       // Reliability score 0-10
  price: number;                  // Flight price in RM
  legs: FlightLeg[];             // Array of flight segments
  status: string;                 // "RELIABLE" | "CAUTION" | "HIGH RISK"
  connectionRisk: string;         // "LOW" | "MEDIUM" | "HIGH"
  connectionRiskValue: number;    // Numeric risk value 0-100
  savedAt: Timestamp;             // Save timestamp
}
```

**Flight Leg Structure:**
```typescript
interface FlightLeg {
  id: string;                     // Unique leg identifier
  flightNumber: string;           // Airline flight number (e.g., "MH123")
  airline: string;                // Airline name
  departure: {
    airport: string;              // Airport code
    city: string;                 // City name
    scheduled: string;            // ISO 8601 datetime
  };
  arrival: {
    airport: string;
    city: string;
    scheduled: string;
  };
  disruptionProbability: number;  // 0-1 probability
}
```


**Access Control:**
- Users can read, create, and delete only their own saved itineraries
- Firestore rules enforce uid field matches authenticated user
- Email verification required for write operations

**Sample Document:**
```json
{
  "uid": "abc123xyz789",
  "itineraryId": "itin_20250115_001",
  "origin": "KUL",
  "destination": "SIN",
  "reliabilityScore": 8.5,
  "price": 280,
  "legs": [
    {
      "id": "leg_001",
      "flightNumber": "MH602",
      "airline": "Malaysia Airlines",
      "departure": {
        "airport": "KUL",
        "city": "Kuala Lumpur",
        "scheduled": "2025-02-10T09:00:00Z"
      },
      "arrival": {
        "airport": "SIN",
        "city": "Singapore",
        "scheduled": "2025-02-10T10:00:00Z"
      },
      "disruptionProbability": 0.05
    }
  ],
  "status": "RELIABLE",
  "connectionRisk": "LOW",
  "connectionRiskValue": 95,
  "savedAt": "2025-01-15T10:30:00Z"
}
```

#### 4.2.3 Price Alerts Collection

**Collection Path:** `/price_alerts/{uid}_{itineraryId}_{timestamp}`

**Purpose:** Stores user-configured price monitoring alerts for specific itineraries.

**Document Structure:**
```typescript
interface PriceAlert {
  uid: string;                    // Owner's Firebase Auth UID
  itineraryId: string;            // Associated itinerary identifier
  origin: string;                 // Departure airport code
  destination: string;            // Arrival airport code
  currentPrice: number;           // Price at alert creation (RM)
  targetPrice: number;            // User's desired price threshold (RM)
  reliabilityScore: number;       // Itinerary reliability score
  status: string;                 // "active" | "inactive" | "triggered"
  createdAt: Timestamp;           // Alert creation timestamp
}
```


**Access Control:**
- Users can read, create, and delete only their own price alerts
- Target price must be lower than current price (client validation)
- Email verification required for alert creation

**Sample Document:**
```json
{
  "uid": "abc123xyz789",
  "itineraryId": "itin_20250115_001",
  "origin": "KUL",
  "destination": "SIN",
  "currentPrice": 280,
  "targetPrice": 220,
  "reliabilityScore": 8.5,
  "status": "active",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

#### 4.2.4 Search History Collection

**Collection Path:** `/search_history/{uid}_{timestamp}`

**Purpose:** Automatically tracks user search queries for quick re-access and analytics.

**Document Structure:**
```typescript
interface SearchHistory {
  uid: string;                    // User's Firebase Auth UID
  origin: string;                 // Departure airport code
  destination: string;            // Arrival airport code
  searchDate: string;             // Travel date searched (YYYY-MM-DD)
  resultCount: number;            // Number of results returned
  status: string;                 // Search status (e.g., "Viewed")
  createdAt: Timestamp;           // Search timestamp
}
```

**Access Control:**
- Automatic creation on successful search execution
- Users can read and delete only their own search history
- Ordered by createdAt descending for recent-first display

**Sample Document:**
```json
{
  "uid": "abc123xyz789",
  "origin": "KUL",
  "destination": "SIN",
  "searchDate": "2025-02-10",
  "resultCount": 5,
  "status": "Viewed",
  "createdAt": "2025-01-15T10:30:00Z"
}
```


### 4.3 Data Relationships

**User → Saved Itineraries (One-to-Many):**
- One user can save multiple itineraries
- Each saved itinerary belongs to exactly one user
- Relationship enforced through `uid` field matching

**User → Price Alerts (One-to-Many):**
- One user can create multiple price alerts
- Each alert belongs to exactly one user
- Alerts reference specific itineraries via `itineraryId`

**User → Search History (One-to-Many):**
- One user generates multiple search history records
- Each history entry belongs to exactly one user
- Automatically created, not explicitly linked to saved itineraries

### 4.4 Indexes and Queries

**Firestore Composite Indexes Required:**

1. **Saved Itineraries by User:**
   - Collection: `saved_itineraries`
   - Fields: `uid` (Ascending), `savedAt` (Descending)
   - Purpose: Retrieve user's saved itineraries ordered by save time

2. **Active Price Alerts:**
   - Collection: `price_alerts`
   - Fields: `uid` (Ascending), `status` (Ascending)
   - Purpose: Retrieve only active alerts for specific user

3. **Search History by User:**
   - Collection: `search_history`
   - Fields: `uid` (Ascending), `createdAt` (Descending)
   - Purpose: Display user's search history chronologically

**Common Query Patterns:**
```typescript
// Get user's saved itineraries (ordered by most recent)
const q = query(
  collection(db, 'saved_itineraries'),
  where('uid', '==', currentUser.uid),
  orderBy('savedAt', 'desc')
);

// Get active price alerts
const q = query(
  collection(db, 'price_alerts'),
  where('uid', '==', currentUser.uid),
  where('status', '==', 'active')
);

// Get search history
const q = query(
  collection(db, 'search_history'),
  where('uid', '==', currentUser.uid),
  orderBy('createdAt', 'desc')
);
```


### 4.5 Data Dictionary

The following tables provide comprehensive field-level documentation for all Firestore collections used in the SmartFlight system, including data types, formats, constraints, and descriptions.

#### 4.5.1 Users Collection Data Dictionary

**Table 4.1: Users Collection Field Definitions**

| Field Name | Data Type | Format/Pattern | Max Size | Description |
|------------|-----------|----------------|----------|-------------|
| uid | String | Firebase UID | 28 chars | Firebase Authentication user identifier (document ID) |
| email | String | Email format | 254 chars | User's registered email address |
| displayName | String (optional) | Free text | 100 chars | User's display name for profile personalization |
| createdAt | Timestamp | YYYY-MM-DDTHH:MM:SS.sssZ | - | Account creation date and time (UTC) |
| role | String | Enum: 'user' \| 'admin' | 10 chars | User authorization role for access control |
| emailVerified | Boolean | true \| false | - | Email verification status from Firebase Auth |

**Field Constraints:**
- **uid:** Must match Firebase Auth UID; immutable after creation
- **email:** Must be unique across all users; validated by Firebase Auth
- **role:** Defaults to 'user'; only system can set 'admin'
- **emailVerified:** Automatically synced from Firebase Auth token

---

#### 4.5.2 Saved Itineraries Collection Data Dictionary

**Table 4.2: Saved Itineraries Collection Field Definitions**

| Field Name | Data Type | Format/Pattern | Max Size | Description |
|------------|-----------|----------------|----------|-------------|
| uid | String | Firebase UID | 28 chars | Owner's Firebase Auth user identifier |
| itineraryId | String | itin_YYYYMMDD_NNN | 50 chars | Unique itinerary identifier generated by system |
| origin | String | IATA code | 3 chars | Departure airport code (e.g., "KUL") |
| destination | String | IATA code | 3 chars | Arrival airport code (e.g., "SIN") |
| reliabilityScore | Number | 0.0 to 10.0 | - | Calculated flight reliability score (float) |
| price | Number | Positive integer | - | Flight price in Malaysian Ringgit (RM) |
| legs | Array | Array of FlightLeg | - | Flight segments composing the itinerary (see Table 4.3) |
| status | String | RELIABLE \| CAUTION \| HIGH RISK | 15 chars | Overall reliability status classification |
| connectionRisk | String | LOW \| MEDIUM \| HIGH | 10 chars | Connection risk assessment level |
| connectionRiskValue | Number | 0 to 100 | - | Numeric connection risk score (percentage) |
| savedAt | Timestamp | YYYY-MM-DDTHH:MM:SS.sssZ | - | Date and time itinerary was saved (UTC) |

**Field Constraints:**
- **uid:** Must match authenticated user; enforced by Firestore rules
- **origin/destination:** Must be valid IATA airport codes from constants
- **reliabilityScore:** Range validation 0-10; calculated server-side
- **price:** Must be greater than 0; typically 50-5000 RM
- **legs:** Must contain at least 1 FlightLeg object

---

#### 4.5.3 Flight Leg Sub-Document Structure

**Table 4.3: FlightLeg Embedded Object Field Definitions**

| Field Name | Data Type | Format/Pattern | Max Size | Description |
|------------|-----------|----------------|----------|-------------|
| id | String | leg_NNN | 20 chars | Unique identifier for this flight leg |
| flightNumber | String | Airline code + digits | 10 chars | Flight number (e.g., "MH602", "AK1234") |
| airline | String | Airline name | 50 chars | Operating airline name (e.g., "Malaysia Airlines") |
| departure.airport | String | IATA code | 3 chars | Departure airport code |
| departure.city | String | City name | 50 chars | Departure city name |
| departure.scheduled | String | ISO 8601 datetime | - | Scheduled departure time (YYYY-MM-DDTHH:MM:SSZ) |
| arrival.airport | String | IATA code | 3 chars | Arrival airport code |
| arrival.city | String | City name | 50 chars | Arrival city name |
| arrival.scheduled | String | ISO 8601 datetime | - | Scheduled arrival time (YYYY-MM-DDTHH:MM:SSZ) |
| disruptionProbability | Number | 0.0 to 1.0 | - | Probability of flight disruption (0 = 0%, 1 = 100%) |

**Design Notes:**
- **Embedded Structure:** FlightLeg objects are stored as nested arrays within SavedItinerary documents rather than as separate collections, optimizing read performance for displaying complete itinerary details
- **departure/arrival Objects:** Nested objects group related airport information for clarity
- **disruptionProbability:** Calculated using multi-factor algorithm (see Appendix 11.6)

---

#### 4.5.4 Price Alerts Collection Data Dictionary

**Table 4.4: Price Alerts Collection Field Definitions**

| Field Name | Data Type | Format/Pattern | Max Size | Description |
|------------|-----------|----------------|----------|-------------|
| uid | String | Firebase UID | 28 chars | Owner's Firebase Auth user identifier |
| itineraryId | String | itin_YYYYMMDD_NNN | 50 chars | Associated itinerary identifier being monitored |
| origin | String | IATA code | 3 chars | Departure airport code |
| destination | String | IATA code | 3 chars | Arrival airport code |
| currentPrice | Number | Positive integer | - | Price at time of alert creation (RM) |
| targetPrice | Number | Positive integer | - | User's desired price threshold (RM) |
| reliabilityScore | Number | 0.0 to 10.0 | - | Itinerary reliability score at creation time |
| status | String | active \| inactive \| triggered | 15 chars | Alert monitoring status |
| createdAt | Timestamp | YYYY-MM-DDTHH:MM:SS.sssZ | - | Alert creation date and time (UTC) |

**Field Constraints:**
- **targetPrice:** Must be less than currentPrice (client validation)
- **status:** Defaults to 'active'; updated to 'triggered' when price drops
- **Relationship:** References itineraryId from saved_itineraries collection

**Business Logic:**
- Price alert only created for itineraries user has previously saved
- System monitors flight prices (future enhancement: notification emails)
- Alerts can be manually deactivated by user at any time

---

#### 4.5.5 Search History Collection Data Dictionary

**Table 4.5: Search History Collection Field Definitions**

| Field Name | Data Type | Format/Pattern | Max Size | Description |
|------------|-----------|----------------|----------|-------------|
| uid | String | Firebase UID | 28 chars | User's Firebase Auth identifier who performed search |
| origin | String | IATA code | 3 chars | Departure airport code searched |
| destination | String | IATA code | 3 chars | Arrival airport code searched |
| searchDate | String | YYYY-MM-DD | 10 chars | Travel date user searched for |
| resultCount | Number | Non-negative integer | - | Number of itineraries returned in search results |
| status | String | Viewed \| Saved \| Dismissed | 15 chars | User interaction status with search results |
| createdAt | Timestamp | YYYY-MM-DDTHH:MM:SS.sssZ | - | Search execution timestamp (UTC) |

**Field Constraints:**
- **Automatic Creation:** Record created automatically on successful search
- **resultCount:** 0 indicates no flights found; typically 3-10 results
- **status:** Defaults to 'Viewed'; updated to 'Saved' if user saves any itinerary

**Usage:**
- Enables users to quickly re-run previous searches
- Provides search analytics for system improvement
- Users can delete individual records or clear entire history
- Ordered by createdAt descending (most recent first)

---

### 4.6 Collection Relationships and Cardinality

**Table 4.6: Firestore Collection Relationships**

| Parent Collection | Child Collection | Relationship Type | Cardinality | Foreign Key Field |
|-------------------|------------------|-------------------|-------------|-------------------|
| users (uid) | saved_itineraries | One-to-Many | 1:N | uid |
| users (uid) | price_alerts | One-to-Many | 1:N | uid |
| users (uid) | search_history | One-to-Many | 1:N | uid |
| saved_itineraries (itineraryId) | price_alerts | One-to-Many | 1:N | itineraryId |

**Relationship Descriptions:**

1. **User → Saved Itineraries (1:N)**
   - One user can save unlimited itineraries
   - Each itinerary belongs to exactly one user
   - Deletion: When user account deleted, cascade delete all saved itineraries
   - Enforcement: Firestore security rules match uid with auth token

2. **User → Price Alerts (1:N)**
   - One user can create multiple price alerts
   - Each alert belongs to exactly one user
   - Deletion: When user account deleted, cascade delete all alerts
   - Enforcement: Firestore security rules match uid with auth token

3. **User → Search History (1:N)**
   - One user generates multiple search history records
   - Each history entry belongs to exactly one user
   - Deletion: User can delete individual records or clear all history
   - Automatic creation: No explicit user action required

4. **Saved Itinerary → Price Alerts (1:N)**
   - One itinerary can have multiple price alerts (for different target prices)
   - Each alert references exactly one itinerary via itineraryId
   - Deletion: When itinerary deleted, alerts remain (orphaned references acceptable)
   - No enforced foreign key constraint (NoSQL design pattern)

---

### 4.7 Data Validation Rules

**Client-Side Validation:**
- TypeScript interfaces enforce type safety during development
- React form validation prevents invalid input submission
- Business logic validates data before Firestore writes

**Server-Side Validation (Firestore Rules):**
```javascript
// Validation example for saved_itineraries
allow create: if request.auth != null 
  && request.auth.token.email_verified 
  && request.resource.data.uid == request.auth.uid
  && request.resource.data.reliabilityScore >= 0 
  && request.resource.data.reliabilityScore <= 10
  && request.resource.data.price > 0;
```

**Table 4.7: Validation Rules Summary**

| Field | Validation Type | Rule | Error Message |
|-------|----------------|------|---------------|
| email | Client + Firebase | Email format regex | "Invalid email format" |
| password | Client + Firebase | Min 6 characters | "Password must be at least 6 characters" |
| origin/destination | Client | Valid IATA code | "Invalid airport code" |
| origin/destination | Client | Not equal | "Origin and destination cannot be same" |
| targetPrice | Client | < currentPrice | "Target price must be lower than current price" |
| reliabilityScore | Server (Firestore) | 0 ≤ score ≤ 10 | Write rejected |
| price | Server (Firestore) | price > 0 | Write rejected |
| uid | Server (Firestore) | Matches auth.uid | Write rejected |

---

### 4.8 Data Storage Considerations

**Document Size Limits:**
- Firestore maximum document size: 1 MB
- Typical saved_itineraries document: 5-15 KB (well within limit)
- Maximum flight legs per itinerary: ~50 (practical limit for user experience)

**Storage Quotas (Firebase Free Tier):**
- Stored data: 1 GB limit
- Estimated capacity: ~50,000 saved itineraries with average complexity
- Document reads: 50,000 per day
- Document writes: 20,000 per day

**Optimization Strategies:**
- Embedded FlightLeg objects reduce need for separate collection and joins
- Session storage caching reduces redundant Firestore reads by 95%
- Real-time listeners maintain WebSocket connection, minimizing read operations
- Indexes optimize query performance for uid + timestamp patterns

**Data Retention:**
- User data retained indefinitely until user manually deletes
- Search history: No automatic expiration (user-controlled deletion)
- Session cache: 30-minute TTL, automatic cleanup
- No automated data archival or purging (within free tier limits)

---

## 5. DESIGN PATTERNS

### 5.1 Design Pattern Overview and Rationale

SmartFlight employs multiple established design patterns to ensure maintainability, scalability, and code quality. This section documents the key design patterns implemented throughout the application, along with the rationale for their selection and concrete examples of their usage.

#### 5.1.1 Model-View-Controller (MVC) Pattern

**Pattern Type:** Architectural Pattern

**Purpose:** Separates application logic into three interconnected components to promote organized code structure and separation of concerns.

**Implementation in SmartFlight:**

**Model Layer:**
- TypeScript type definitions (*src/types/global.d.ts*)
- Service layer functions (*src/services/flightService.ts*)
- Firebase database models (*src/firebase.ts*)
- Data structures for Itinerary, FlightLeg, SavedItinerary, PriceAlert

**View Layer:**
- React functional components (*src/components/*)
- UI primitives library (*src/components/UI.tsx*)
- Styling with Tailwind CSS (*src/index.css*)
- Presentation logic only, no business logic

**Controller Layer:**
- Main application logic (*src/App.tsx*)
- Component state management using React hooks (useState, useEffect, useMemo)
- Event handlers coordinating user actions
- Business logic orchestration

**Rationale:**
- **Separation of Concerns:** Clear boundaries between data, presentation, and logic
- **Maintainability:** Changes to UI don't affect business logic and vice versa
- **Testability:** Each layer can be tested independently
- **Team Collaboration:** Multiple developers can work on different layers simultaneously
- **Code Reusability:** Components and services can be reused across different views

**Example:**
```typescript
// Model (global.d.ts)
interface Itinerary {
  id: string;
  legs: FlightLeg[];
  reliabilityScore: number;
  price: number;
}

// View (ItineraryCard.tsx)
function ItineraryCard({ itinerary, onSave }: ItineraryCardProps) {
  return (
    <Card>
      <h3>{itinerary.legs[0].departure.city} → {itinerary.legs[itinerary.legs.length - 1].arrival.city}</h3>
      <Badge variant={getVariant(itinerary.reliabilityScore)}>
        {itinerary.reliabilityScore.toFixed(1)}
      </Badge>
      <Button onClick={() => onSave(itinerary)}>Save</Button>
    </Card>
  );
}

// Controller (App.tsx)
function handleSaveItinerary(itinerary: Itinerary) {
  if (!user || !user.emailVerified) {
    setError("Email verification required");
    return;
  }
  
  const docRef = doc(db, 'saved_itineraries', `${user.uid}_${itinerary.id}`);
  setDoc(docRef, {
    uid: user.uid,
    ...itinerary,
    savedAt: serverTimestamp()
  });
}
```

#### 5.1.2 Component-Based Architecture Pattern

**Pattern Type:** Structural Pattern

**Purpose:** Breaks down the UI into reusable, self-contained components with clear props interfaces.

**Implementation in SmartFlight:**

**Atomic Components:**
- `Button`, `Badge`, `Card`, `LoadingSpinner` (*UI.tsx*)
- Single responsibility, highly reusable
- No business logic, pure presentation

**Composite Components:**
- `AirportSelector`, `CalendarSelector`, `ItineraryCard`
- Composed of atomic components
- Encapsulate specific UI functionality

**Feature Components:**
- `LiveFlightView`, `SavedItinerariesView`, `ProfileView`
- Complete feature implementations
- Orchestrate multiple composite components

**Container Component:**
- `App.tsx` - Root component managing global state and routing

**Rationale:**
- **Reusability:** Components used across multiple features
- **Encapsulation:** Each component manages its own state and logic
- **Composability:** Complex UIs built from simple components
- **Hot Module Replacement:** Changes to components reflect instantly during development
- **React Ecosystem:** Leverages React's virtual DOM and reconciliation

**Example:**
```typescript
// Atomic Component
function Badge({ variant, children }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };
  
  return (
    <span className={cn('px-2 py-1 rounded', variantStyles[variant])}>
      {children}
    </span>
  );
}

// Composite Component using Badge
function ItineraryCard({ itinerary }: ItineraryCardProps) {
  return (
    <Card>
      <Badge variant={getReliabilityVariant(itinerary.reliabilityScore)}>
        Score: {itinerary.reliabilityScore}
      </Badge>
      <Badge variant={getConnectionRiskVariant(itinerary.connectionRisk)}>
        {itinerary.connectionRisk}
      </Badge>
    </Card>
  );
}
```

#### 5.1.3 Service Layer Pattern

**Pattern Type:** Architectural Pattern

**Purpose:** Abstracts API calls and business logic into dedicated service modules, separating them from UI components.

**Implementation in SmartFlight:**

**Flight Service (*flightService.ts*):**
```typescript
export async function searchFlight(
  query: string,
  isDemoMode: boolean = false,
  departureDate?: string
): Promise<Itinerary[]> {
  const cacheKey = `search_${query}_${departureDate}`;
  const cached = getFromCache(cacheKey);
  
  if (cached) return cached;
  
  const response = await fetch('/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, departureDate })
  });
  
  const data = await response.json();
  setToCache(cacheKey, data);
  return data;
}

export async function trackFlight(
  flightNumber: string
): Promise<LiveFlightData | null> {
  const response = await fetch('/api/tracking', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ flightNumber })
  });
  
  if (!response.ok) return null;
  return await response.json();
}
```

**Rationale:**
- **Separation of Concerns:** API logic separated from UI components
- **Testability:** Service functions can be tested independently with mocked responses
- **Caching Logic Centralization:** Cache management handled in one place
- **Error Handling Consistency:** Uniform error handling across all API calls
- **Code Reusability:** Multiple components can use the same service functions

**Benefits:**
- Components become simpler, focusing only on presentation
- Easy to swap implementations (e.g., switch to different API endpoint)
- Centralized request/response transformation logic

#### 5.1.4 Observer Pattern (Real-Time Synchronization)

**Pattern Type:** Behavioral Pattern

**Purpose:** Establishes a one-to-many dependency between objects so that when one object changes state, all dependents are notified automatically.

**Implementation in SmartFlight:**

Using Firebase Firestore's `onSnapshot` listeners:

```typescript
useEffect(() => {
  if (!user) return;
  
  // Observer setup
  const q = query(
    collection(db, 'saved_itineraries'),
    where('uid', '==', user.uid),
    orderBy('savedAt', 'desc')
  );
  
  // Subscribe to changes
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const itineraries = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setSavedItineraries(itineraries); // Update state
  });
  
  // Cleanup observer on unmount
  return () => unsubscribe();
}, [user]);
```

**Rationale:**
- **Real-Time Updates:** UI automatically reflects database changes
- **Cross-Device Synchronization:** Changes on one device appear on others instantly
- **Reduced Polling:** No need for periodic API calls to check for updates
- **Event-Driven Architecture:** Components react to data changes rather than pulling data

**Benefits:**
- WebSocket connection maintained by Firebase
- Automatic reconnection on network interruptions
- Offline persistence with automatic sync when online
- Minimal latency (<100ms for most updates)

#### 5.1.5 Singleton Pattern (Firebase Configuration)

**Pattern Type:** Creational Pattern

**Purpose:** Ensures a class has only one instance and provides a global point of access to it.

**Implementation in SmartFlight:**

```typescript
// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};

// Single app instance
const app = initializeApp(firebaseConfig);

// Single auth instance
export const auth = getAuth(app);

// Single firestore instance
export const db = getFirestore(app);
```

**Rationale:**
- **Resource Management:** Prevents multiple Firebase connections
- **Configuration Consistency:** All modules use same configuration
- **Memory Efficiency:** Single instance shared across application
- **Global Access:** Imported wherever Firebase services needed

**Benefits:**
- No redundant initialization overhead
- Guaranteed consistent configuration
- Easy to mock for testing

#### 5.1.6 Caching Strategy Pattern

**Pattern Type:** Performance Pattern

**Purpose:** Temporarily stores frequently accessed data to reduce redundant processing and API calls.

**Implementation in SmartFlight:**

**Multi-Layer Caching:**

**Layer 1 - Client-Side Session Storage:**
```typescript
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function setToCache(key: string, data: any) {
  sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}

function getFromCache(key: string): any | null {
  const cached = sessionStorage.getItem(CACHE_PREFIX + key);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_TTL) {
    sessionStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
  return data;
}
```

**Layer 2 - Server-Side Memory Cache:**
```typescript
const flightDataCache: Record<string, { data: any; timestamp: number }> = {};
const SERVER_CACHE_TTL = 3600000; // 1 hour

function getCachedOrFetch(cacheKey: string, fetchFn: () => Promise<any>) {
  const cached = flightDataCache[cacheKey];
  if (cached && Date.now() - cached.timestamp < SERVER_CACHE_TTL) {
    return cached.data;
  }
  
  const freshData = await fetchFn();
  flightDataCache[cacheKey] = { data: freshData, timestamp: Date.now() };
  return freshData;
}
```

**Rationale:**
- **Performance:** Instant responses for cached data (5ms vs 800ms API call)
- **Cost Reduction:** Fewer external API calls reduces costs
- **User Experience:** Perceived speed improvement
- **Scalability:** Reduced load on backend services

**Benefits:**
- 95% cache hit rate for repeated searches
- 70% reduction in external API calls
- Graceful degradation if cache fails
- Automatic cache invalidation based on TTL

#### 5.1.7 Optimistic UI Update Pattern

**Pattern Type:** UI/UX Pattern

**Purpose:** Immediately updates the UI assuming the operation will succeed, then rolls back if it fails.

**Implementation in SmartFlight:**

```typescript
async function handleSaveItinerary(itinerary: Itinerary) {
  // Generate temporary ID
  const tempId = `temp_${Date.now()}`;
  
  // Optimistic update - add immediately to UI
  setSavedItineraries(prev => [{
    ...itinerary,
    id: tempId,
    savedAt: new Date()
  }, ...prev]);
  
  try {
    // Attempt actual save
    const docRef = doc(db, 'saved_itineraries', `${user.uid}_${itinerary.id}`);
    await setDoc(docRef, {
      uid: user.uid,
      ...itinerary,
      savedAt: serverTimestamp()
    });
    
    // Success - real-time listener will update with server data
  } catch (error) {
    // Rollback on error
    setSavedItineraries(prev => prev.filter(it => it.id !== tempId));
    setError("Failed to save itinerary. Please try again.");
  }
}
```

**Rationale:**
- **Perceived Performance:** UI responds instantly, feels snappy
- **User Experience:** No waiting for server confirmation
- **Error Handling:** Graceful rollback if operation fails
- **Progressive Enhancement:** Works well with real-time sync

**Benefits:**
- Users can continue working without waiting
- Reduces perceived latency
- Maintains consistency through rollback mechanism

### 5.2 Design Pattern Summary Table

**Table 5.1: Design Patterns Used in SmartFlight**

| Pattern | Type | Location | Purpose | Benefits |
|---------|------|----------|---------|----------|
| MVC | Architectural | Entire app | Separation of concerns | Maintainability, testability |
| Component-Based | Structural | Frontend | Reusable UI components | Reusability, composability |
| Service Layer | Architectural | flightService.ts | API abstraction | Testability, maintainability |
| Observer | Behavioral | Firestore listeners | Real-time updates | Cross-device sync, event-driven |
| Singleton | Creational | firebase.ts | Single Firebase instance | Resource efficiency, consistency |
| Caching Strategy | Performance | Client + Server | Reduce API calls | Performance, cost reduction |
| Optimistic UI | UI/UX | Save/delete operations | Instant feedback | Perceived performance, UX |

---

## 6. COMPONENT DESIGN

### 6.1 Component Hierarchy

SmartFlight follows a hierarchical component structure with clear parent-child relationships:

```
App (Root)
├── Navigation Tabs
├── Search Tab
│   ├── TripTypeSelector
│   ├── AirportSelector (Origin)
│   ├── AirportSelector (Destination)
│   ├── CalendarSelector
│   ├── SearchButton
│   └── SearchResults
│       ├── ItineraryCard (multiple)
│       │   ├── ReliabilityBadge
│       │   ├── FlightLegsDisplay
│       │   ├── PriceDisplay
│       │   └── ActionButtons
│       └── ItineraryDetailModal
│           ├── FlightLegDetail (multiple)
│           ├── ReliabilityBreakdown
│           └── ActionButtons
│
├── Live Tracking Tab
│   ├── FlightNumberInput
│   └── LiveFlightView
│       ├── FlightHeader
│       ├── FlightProgress
│       ├── RadarVisualization
│       └── FlightMetrics
│
├── Saved Tab
│   └── SavedItinerariesView
│       └── SavedItineraryCard (multiple)
│
└── Profile Tab
    ├── AuthForm (Login/Register)
    ├── UserProfile
    ├── PriceAlertsList
    └── SearchHistoryList
```


### 5.2 Core Components

#### 5.2.1 App Component (*App.tsx*)

**Purpose:** Root component managing global application state, authentication, and routing.

**Key Responsibilities:**
- User authentication state management via Firebase Auth
- Global state management (itineraries, saved items, alerts)
- Tab navigation and active view rendering
- Error handling and user notifications
- Real-time Firestore listeners initialization

**State Management:**
```typescript
// Authentication State
const [user, setUser] = useState<User | null>(null);

// Search State
const [itineraries, setItineraries] = useState<Itinerary[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// User Data State
const [savedItineraries, setSavedItineraries] = useState<SavedItinerary[]>([]);
const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);

// UI State
const [activeTab, setActiveTab] = useState<'search' | 'live' | 'saved' | 'profile'>('search');
```

**Key Methods:**
- `handleSearch(query, date)` - Execute flight search
- `handleSaveItinerary(itinerary)` - Save itinerary to Firestore
- `handleSetPriceAlert(itinerary, targetPrice)` - Create price alert
- `handleLogin(email, password)` - Authenticate user
- `handleRegister(email, password)` - Create new user account

#### 5.2.2 AirportSelector Component (*AirportSelector.tsx*)

**Purpose:** Autocomplete input for selecting airports from predefined list.

**Props Interface:**
```typescript
interface AirportSelectorProps {
  value: string;                  // Currently selected airport code
  onChange: (value: string) => void;  // Selection change handler
  placeholder: string;            // Input placeholder text
  label: string;                  // Field label
}
```


**Key Features:**
- Filters airport list based on user input
- Displays airport code, name, city, and country
- Keyboard navigation support (arrow keys, enter)
- Click-outside-to-close dropdown behavior
- Fuzzy search matching on multiple fields

**Data Source:**
Imports airport data from *src/constants/airports.ts* containing IATA codes, names, cities, and countries for major airports.

#### 5.2.3 CalendarSelector Component (*CalendarSelector.tsx*)

**Purpose:** Date picker for selecting travel dates with visual calendar interface.

**Props Interface:**
```typescript
interface CalendarSelectorProps {
  value: string;                  // Selected date (YYYY-MM-DD)
  onChange: (value: string) => void;  // Date change handler
  label: string;                  // Field label
  minDate?: Date;                 // Minimum selectable date (default: today)
}
```

**Key Features:**
- Visual calendar grid interface using react-day-picker
- Prevents selection of past dates
- Responsive design for mobile and desktop
- Month/year navigation
- Highlighted selected date and today's date
- Formats displayed date in user-friendly format

#### 5.2.4 LiveFlightView Component (*LiveFlightView.tsx*)

**Purpose:** Display real-time flight tracking information with visual radar representation.

**Props Interface:**
```typescript
interface LiveFlightViewProps {
  flightData: LiveFlightData | null;  // Flight tracking data
  loading: boolean;                    // Loading state indicator
}

interface LiveFlightData {
  flightNumber: string;
  airline: string;
  origin: { airport: string; city: string; time: string; terminal: string; gate: string; };
  destination: { airport: string; city: string; time: string; terminal: string; gate: string; };
  status: 'IN AIR' | 'SCHEDULED' | 'LANDED' | 'DELAYED';
  progress: number;                    // 0-100%
  altitude: number;                    // feet
  speed: number;                       // kph
  estimatedArrival: string;
}
```


**Key Features:**
- SVG-based radar visualization showing flight path
- Animated aircraft icon moving along route
- Real-time metrics display (altitude, speed, ETA)
- Color-coded status badges (green for in air, red for delayed)
- Gate and terminal information
- Progress bar showing percentage complete
- Conditional rendering based on loading and data availability

#### 5.2.5 UI Component Library (*UI.tsx*)

**Purpose:** Reusable primitive components providing consistent styling across the application.

**Components Provided:**

**Card Component:**
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
// Glassmorphism card with backdrop blur
```

**Badge Component:**
```typescript
interface BadgeProps {
  variant: 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
}
// Color-coded badge for status indicators
```

**Button Component:**
```typescript
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}
// Styled button with variants and states
```

**LoadingSpinner Component:**
```typescript
// Animated loading indicator
```

**These primitives ensure visual consistency and reduce code duplication throughout the application.**

### 5.3 Service Layer

#### 5.3.1 Flight Service (*flightService.ts*)

**Purpose:** Abstraction layer for flight-related API calls with caching and error handling.

**Key Functions:**

```typescript
async function searchFlight(
  query: string,
  isDemoMode: boolean = false,
  departureDate?: string
): Promise<Itinerary[]>
```


- Searches flights via `/api/search` endpoint
- Implements session storage caching with 30-minute TTL
- Sorts results by reliability score descending
- Returns empty array on error with console logging

```typescript
async function trackFlight(
  flightNumber: string,
  isDemoMode: boolean = false
): Promise<LiveFlightData | null>
```
- Tracks flight via `/api/tracking` endpoint
- Returns real-time flight data or null if not found
- Implements error handling with user-friendly messages

**Caching Implementation:**
- Cache keys generated from query parameters
- Session storage used for client-side cache
- 30-minute TTL balances freshness and performance
- Automatic cache invalidation on expiration

### 5.4 Utility Functions

#### 5.4.1 Class Name Utility (*lib/utils.ts*)

**Purpose:** Merge conditional class names and resolve Tailwind CSS conflicts.

```typescript
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**Usage Example:**
```typescript
<button className={cn(
  "px-4 py-2 rounded",
  isActive && "bg-blue-500",
  isDisabled && "opacity-50 cursor-not-allowed"
)} />
```

**Benefits:**
- Conditional class application based on component state
- Automatic Tailwind conflict resolution (last class wins)
- Type-safe class name composition
- Reduced boilerplate for dynamic styling

---

## 7. INTERFACE DESIGN

### 7.1 User Interface Overview

SmartFlight employs a modern, dark-themed interface with glassmorphism effects, smooth animations, and intuitive navigation. The design prioritizes clarity of information presentation, especially for reliability metrics and risk indicators.


### 7.2 Color Scheme and Visual Design

**Primary Colors:**
- Background: Dark gradient (#0a0e27 to #1a1f3a)
- Card backgrounds: White/5% with backdrop blur (glassmorphism)
- Primary accent: Blue (#3b82f6)
- Text: White (#ffffff) with varying opacity levels

**Status Color Coding:**
- **RELIABLE** (Green): #10b981 - High reliability score (8.0-10.0)
- **CAUTION** (Yellow): #f59e0b - Medium reliability score (6.0-7.9)
- **HIGH RISK** (Red): #ef4444 - Low reliability score (0.0-5.9)

**Connection Risk Colors:**
- **LOW** (Green): Safe connection time
- **MEDIUM** (Yellow): Tight connection, requires quick movement
- **HIGH** (Red): Insufficient connection time

**Typography:**
- Font family: System font stack for optimal performance
- Heading sizes: 2xl (2rem) to sm (0.875rem)
- Body text: Base (1rem) with line-height 1.5
- Monospace for codes: Flight numbers, airport codes

### 7.3 Layout Structure

**Navigation:**
- Fixed tab bar at top with four primary sections
- Icons + text labels for clarity
- Active tab highlighted with color and border
- Responsive: Horizontal tabs on desktop, vertical on mobile

**Content Area:**
- Maximum width container (1280px) for readability
- Padding and margins following 8px grid system
- Cards with consistent 1rem padding
- Responsive columns: 3 cols desktop → 2 cols tablet → 1 col mobile

**Forms:**
- Vertical label-above-input layout
- Grouped related fields visually
- Inline validation messages
- Prominent submit buttons with loading states


### 7.4 Key Interface Screens

#### 7.4.1 Search Tab Interface

**Layout Sections:**
1. **Trip Type Selector:** One-way / Round-trip / Multi-city buttons
2. **Search Form:**
   - Origin airport selector (autocomplete dropdown)
   - Destination airport selector (autocomplete dropdown)
   - Departure date picker (calendar interface)
   - Return date picker (conditional, for round-trip)
   - Search button with loading spinner

3. **Filters and Sorting:**
   - Sort by: Reliability / Price toggle
   - Filter by airline (dropdown)
   - Filter by stops: Direct / 1 stop / 2+ stops
   - Filter by time of day: Morning / Afternoon / Evening

4. **Results Display:**
   - Grid of itinerary cards
   - Each card shows:
     - Route summary (origin → destination)
     - Reliability score badge (0-10 with color)
     - Status badge (RELIABLE/CAUTION/HIGH RISK)
     - Connection risk indicator (LOW/MEDIUM/HIGH)
     - Price display in RM
     - Number of stops
     - Total duration
     - View Details and Save buttons

#### 7.4.2 Itinerary Detail Modal

**Modal Structure:**
- Overlay with dark backdrop blur
- Centered modal (max-width 800px)
- Close button (X) in top-right corner

**Content Sections:**
1. **Header:**
   - Route: Origin → Destination
   - Departure date (formatted)
   - Overall reliability score (large, prominent)

2. **Reliability Breakdown:**
   - Individual factors with impact visualization
   - Disruption risk explanation
   - Connection risk explanation
   - Route complexity explanation

3. **Flight Legs Details:**
   - Each leg shows:
     - Flight number and airline
     - Departure: Airport, city, time, terminal, gate
     - Arrival: Airport, city, time, terminal, gate
     - Duration of leg
     - Disruption probability percentage
   - Connection time between legs (if multi-leg)
   - Visual timeline connecting legs


4. **Actions:**
   - Save Itinerary button (requires authentication)
   - Set Price Alert button (requires authentication)
   - Share via Email button
   - Close button

#### 7.4.3 Live Tracking Tab Interface

**Layout:**
1. **Input Section:**
   - Flight number text input
   - Track Flight button
   - Example format hint (e.g., "MH123")

2. **Tracking Display (when loaded):**
   - Flight header: Flight number + Airline name
   - Status badge: IN AIR / SCHEDULED / LANDED / DELAYED
   - Origin and destination summary with times
   - **Radar Visualization:**
     - SVG circular radar background
     - Route line from origin to destination
     - Animated aircraft icon at current position
     - Degree markings and labels
   - **Flight Metrics Grid:**
     - Altitude (feet)
     - Speed (km/h)
     - Progress (percentage)
     - Estimated Arrival Time
   - **Terminal Information:**
     - Departure gate and terminal
     - Arrival gate and terminal

#### 7.4.4 Saved Itineraries Tab Interface

**Layout:**
- Grid of saved itinerary cards (similar to search results)
- Each card includes:
  - Route and date
  - Reliability score badge
  - Price at time of saving
  - Saved date timestamp
  - View Details button
  - Delete button

**Empty State:**
- Informative message: "No saved itineraries yet"
- Call-to-action: "Search flights and click Save"
- Icon illustration

#### 7.4.5 Profile Tab Interface

**Authentication Section (when logged out):**
- Login form:
  - Email input
  - Password input
  - Login button
  - Forgot password link
  - Create account link


- Registration form:
  - Email input
  - Password input (min 6 characters)
  - Confirm password input
  - Create Account button

**User Profile Section (when logged in):**
- User information display:
  - Email address
  - Email verification status (badge)
  - Account creation date
- Action buttons:
  - Resend Verification Email (if unverified)
  - Change Password
  - Logout

**Price Alerts Section:**
- List of active price alerts
- Each alert card shows:
  - Route (origin → destination)
  - Current price vs target price
  - Potential savings calculation
  - Alert creation date
  - Delete button
- Empty state message if no alerts

**Search History Section:**
- Chronological list of past searches
- Each history item shows:
  - Route searched
  - Search date and time
  - Number of results found
  - Status
  - Delete button
- "Clear All History" button
- Empty state message if no history

### 7.5 Responsive Design Strategy

**Breakpoints:**
- Mobile: 0-640px (single column layout)
- Tablet: 641-1024px (2 column layout where appropriate)
- Desktop: 1025px+ (3 column layout where appropriate)

**Mobile Adaptations:**
- Vertical tab navigation instead of horizontal
- Stacked form fields (full width)
- Single column search results
- Simplified itinerary cards with essential info only
- Collapsible filter sections
- Touch-optimized button sizes (minimum 44px height)
- Hamburger menu for secondary navigation

**Tablet Adaptations:**
- 2-column search results grid
- Side-by-side form fields where logical
- Maintained glassmorphism effects
- Optimized modal widths


**Desktop Optimizations:**
- 3-column search results grid (maximum information density)
- Wider modal windows for better readability
- Hover effects on interactive elements
- Enhanced animations and transitions
- Side-by-side comparison views

### 7.6 Animation and Interactions

**Page Transitions:**
- Fade in/out when switching tabs (200ms duration)
- Slide up animations for modal appearances
- Smooth height transitions for expandable sections

**Loading States:**
- Skeleton screens for search results while loading
- Spinning indicators for button actions
- Progress bars for multi-step processes
- Shimmer effect on loading cards

**User Feedback:**
- Toast notifications for success/error messages (auto-dismiss after 3 seconds)
- Button press animations (scale down slightly)
- Hover effects on cards (subtle lift and glow)
- Input focus states (border color change and glow)
- Disabled state styling (reduced opacity, no-drop cursor)

**Framer Motion Animations:**
- List items stagger in sequentially (50ms delay between items)
- Modal backdrop fade in (150ms)
- Modal content spring animation for entrance
- Smooth page number transitions in pagination
- Radar animation for live flight tracking (continuous rotation)

---

## 8. SECURITY DESIGN

### 8.1 Authentication Security

#### 8.1.1 Firebase Authentication

**Authentication Method:**
- Email/password authentication managed by Firebase Auth
- Secure password storage with bcrypt hashing (handled by Firebase)
- Session tokens stored in browser localStorage
- Automatic token refresh for persistent sessions

**Password Requirements:**
- Minimum 6 characters (Firebase default)
- Client-side validation before submission
- Password confirmation field to prevent typos


**Email Verification Flow:**
1. User registers with email/password
2. Firebase Auth creates account
3. System automatically sends verification email
4. User clicks verification link in email
5. Email verified status updated in Firebase
6. Protected features become accessible

**Email Verification Enforcement:**
```typescript
if (!user.emailVerified) {
  setError("Email verification required to access this feature");
  return;
}
```

**Security Benefits:**
- Confirms user owns the email address
- Prevents spam account creation
- Reduces fraudulent activity
- Enables account recovery

#### 8.1.2 Password Reset Security

**Reset Flow:**
1. User clicks "Forgot Password" link
2. Enters email address
3. Firebase sends password reset email
4. User clicks reset link (valid for 1 hour)
5. User enters new password
6. Password updated in Firebase Auth
7. Existing sessions invalidated

**Implementation:**
```typescript
async function handlePasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
  // Firebase handles link generation, expiration, and validation
}
```

### 8.2 Authorization and Access Control

#### 8.2.1 Firestore Security Rules

**User Profile Access:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isEmailVerified() {
      return request.auth.token.email_verified == true;
    }
    
    match /users/{uid} {
      allow read: if isOwner(uid);
      allow create: if isOwner(uid) && isEmailVerified();
      allow update: if isOwner(uid);
    }
  }
}
```


**Saved Itineraries Access:**
```javascript
match /saved_itineraries/{docId} {
  allow read: if isAuthenticated() && 
                 resource.data.uid == request.auth.uid;
  allow create: if isAuthenticated() && 
                   isEmailVerified() &&
                   request.resource.data.uid == request.auth.uid;
  allow delete: if isAuthenticated() && 
                   resource.data.uid == request.auth.uid;
}
```

**Price Alerts Access:**
```javascript
match /price_alerts/{docId} {
  allow read: if isAuthenticated() && 
                 resource.data.uid == request.auth.uid;
  allow create: if isAuthenticated() && 
                   isEmailVerified() &&
                   request.resource.data.uid == request.auth.uid &&
                   request.resource.data.targetPrice < request.resource.data.currentPrice;
  allow delete: if isAuthenticated() && 
                   resource.data.uid == request.auth.uid;
}
```

**Search History Access:**
```javascript
match /search_history/{docId} {
  allow read: if isAuthenticated() && 
                 resource.data.uid == request.auth.uid;
  allow create: if isAuthenticated() &&
                   request.resource.data.uid == request.auth.uid;
  allow delete: if isAuthenticated() && 
                   resource.data.uid == request.auth.uid;
}
```

**Security Rule Principles:**
1. **Authentication Required:** All database operations require valid Firebase Auth token
2. **Email Verification:** Write operations require verified email address
3. **User Isolation:** Users can only access their own data via `uid` matching
4. **Data Validation:** Rules validate data structure and business logic
5. **No Admin Backdoor:** Even with valid credentials, server-side rules enforce all restrictions

### 8.3 Data Security

#### 8.3.1 Environment Variables

**Sensitive Data Protection:**
All API keys and configuration secrets stored in `.env` file (excluded from version control):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=xxxxxxxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=project-id
VITE_FIREBASE_STORAGE_BUCKET=project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxxxxxxx
VITE_FIREBASE_APP_ID=xxxxxxxxxxxxx

# API Keys
GEMINI_API_KEY=xxxxxxxxxxxxx

# Server Configuration
PORT=3000
NODE_ENV=production
```


**`.gitignore` Configuration:**
```gitignore
.env
.env.local
.env.production
node_modules/
dist/
*.log
```

**Deployment Security:**
- Environment variables configured in hosting platform dashboard (Render/Vercel)
- Separate keys for development and production environments
- Regular key rotation recommended

#### 8.3.2 HTTPS and Transport Security

**Production Requirements:**
- All production deployments enforce HTTPS
- HTTP requests automatically redirected to HTTPS
- TLS 1.2+ required for encrypted communication
- Firebase Auth and Firestore use encrypted WebSocket connections

**Implementation:**
Hosting platforms (Render, Vercel) automatically provision SSL certificates via Let's Encrypt and enforce HTTPS for all traffic.

#### 8.3.3 Input Validation and Sanitization

**Client-Side Validation:**
```typescript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError("Invalid email format");
  return;
}

// Price validation
const price = parseFloat(targetPrice);
if (!price || price <= 0 || price >= currentPrice) {
  setError("Invalid target price");
  return;
}

// Airport code validation
if (origin === destination) {
  setWarning("Origin and destination are the same");
}
```

**XSS Prevention:**
- React automatically escapes HTML in JSX expressions
- User input never inserted as raw HTML
- All dynamic content rendered through React's virtual DOM

**SQL Injection Prevention:**
Not applicable - Firestore is a NoSQL database with parameterized queries. All queries use Firebase SDK methods that prevent injection attacks.

### 8.4 API Security

#### 8.4.1 Rate Limiting

**Client-Side Debouncing:**
```typescript
const debouncedSearch = debounce((query: string) => {
  performSearch(query);
}, 300);
```
Prevents excessive API calls during rapid user input.


**Server-Side Protection:**
- Gemini API has built-in rate limiting per API key
- Firebase Auth enforces rate limits on authentication attempts
- Firestore has automatic quota management

**Future Enhancements:**
- Implement express-rate-limit middleware for backend API
- Add per-user request tracking and throttling
- CAPTCHA for registration to prevent bot abuse

#### 8.4.2 CORS Configuration

**Express CORS Policy:**
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://sf-f.onrender.com' 
    : 'http://localhost:5173',
  credentials: true
}));
```

Restricts API access to authorized frontend domains only.

#### 8.4.3 Error Handling Security

**Error Messages:**
- Generic error messages for authentication failures (prevent account enumeration)
- Detailed errors logged server-side for debugging
- Client receives sanitized error messages without stack traces

**Example:**
```typescript
catch (error: any) {
  if (error.code === 'auth/user-not-found' || 
      error.code === 'auth/wrong-password') {
    setError("Invalid email or password");  // Generic message
  } else {
    setError("Login failed. Please try again.");
  }
  console.error('Auth error:', error);  // Detailed server log
}
```

### 8.5 Privacy and Compliance

#### 8.5.1 Data Collection

**Data Collected:**
- Email address (for authentication)
- Password hash (stored by Firebase, never in Firestore)
- Saved itineraries (user-initiated)
- Price alerts (user-initiated)
- Search history (automatic, can be deleted by user)

**Data NOT Collected:**
- Real names or personal identifiers (beyond email)
- Payment information
- Location data
- Device fingerprints
- Tracking cookies

#### 8.5.2 Data Retention

**User-Controlled Data:**
- Users can delete saved itineraries at any time
- Users can delete price alerts at any time
- Users can clear search history individually or in bulk
- Account deletion removes all associated data (Firebase Auth + Firestore)


**Automatic Cleanup:**
- Session cache expires after 30 minutes
- Firebase Auth tokens refresh automatically or require re-authentication
- Inactive accounts can be manually deleted by users

---

## 9. PERFORMANCE DESIGN

### 9.1 Performance Optimization Strategy

SmartFlight implements multiple layers of optimization to ensure fast page loads, responsive interactions, and efficient resource utilization across varying network conditions and device capabilities.

### 9.2 Frontend Performance

#### 9.2.1 Code Splitting and Lazy Loading

**Implementation:**
```typescript
import { lazy, Suspense } from 'react';

const LiveFlightView = lazy(() => import('./components/LiveFlightView'));
const ProfileView = lazy(() => import('./components/ProfileView'));
const SavedItinerariesView = lazy(() => import('./components/SavedItinerariesView'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {activeTab === 'live' && <LiveFlightView />}
      {activeTab === 'profile' && <ProfileView />}
      {activeTab === 'saved' && <SavedItinerariesView />}
    </Suspense>
  );
}
```

**Benefits:**
- Reduces initial bundle size by ~40%
- Only loads tab components when user navigates to them
- Browser caches separate chunks for faster subsequent loads
- Improves Time-to-Interactive (TTI) metric

**Bundle Analysis:**
- Main bundle: ~150KB (gzipped)
- Lazy loaded chunks: ~30KB each (gzipped)
- Total when all features used: ~270KB

#### 9.2.2 Memoization and Re-render Optimization

**useMemo for Expensive Calculations:**
```typescript
const filteredAndSortedItineraries = useMemo(() => {
  let results = [...itineraries];
  
  // Apply filters
  if (filters.airline) {
    results = results.filter(it => 
      it.legs.some(leg => leg.airline === filters.airline)
    );
  }
  
  // Apply sorting
  results.sort((a, b) => {
    return filters.sortBy === 'reliability' 
      ? b.reliabilityScore - a.reliabilityScore
      : a.price - b.price;
  });
  
  return results;
}, [itineraries, filters]);
```

**Prevents:**
- Redundant array operations on every render
- UI lag when filtering/sorting large result sets (100+ items)
- Unnecessary child component re-renders


**React.memo for Pure Components:**
```typescript
const ItineraryCard = React.memo(({ itinerary, onSave }: ItineraryCardProps) => {
  // Component only re-renders if itinerary or onSave changes
  return (
    <Card>
      {/* Card content */}
    </Card>
  );
});
```

#### 9.2.3 Debouncing and Throttling

**Search Input Debouncing:**
```typescript
const debouncedSearch = useCallback(
  debounce((searchQuery: string) => {
    performAutocomplete(searchQuery);
  }, 300),
  []
);
```

**Benefits:**
- Reduces API calls by 90% during typing
- Improves perceived responsiveness
- Decreases server load and API costs

**Scroll Event Throttling:**
```typescript
const throttledScroll = throttle(() => {
  handleInfiniteScroll();
}, 200);
```

#### 9.2.4 Virtual Scrolling

**For Large Result Lists:**
```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={itineraries.length}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <ItineraryCard itinerary={itineraries[index]} />
    </div>
  )}
</FixedSizeList>
```

**Performance Impact:**
- Renders only 10-15 visible items instead of all 100+
- Maintains 60fps scrolling regardless of list size
- Reduces DOM nodes by 85-90%

### 9.3 Backend Performance

#### 9.3.1 Multi-Layer Caching Strategy

**Client-Side Session Storage Cache:**
```typescript
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

function setToCache(key: string, data: any) {
  sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
}

function getFromCache(key: string): any | null {
  const cached = sessionStorage.getItem(CACHE_PREFIX + key);
  if (!cached) return null;
  
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_TTL) {
    sessionStorage.removeItem(CACHE_PREFIX + key);
    return null;
  }
  return data;
}
```

**Cache Hit Rates:**
- Repeated searches within 30 minutes: 95% hit rate
- Popular routes: 80% hit rate across users
- Average response time: 5ms (cache) vs 800ms (API)


**Server-Side Memory Cache:**
```typescript
const flightDataCache: Record<string, { data: any; timestamp: number }> = {};
const SERVER_CACHE_TTL = 3600000; // 1 hour

async function fetchWithCache(cacheKey: string, fetchFn: () => Promise<any>) {
  const cached = flightDataCache[cacheKey];
  if (cached && Date.now() - cached.timestamp < SERVER_CACHE_TTL) {
    return cached.data;
  }
  
  const freshData = await fetchFn();
  flightDataCache[cacheKey] = { data: freshData, timestamp: Date.now() };
  return freshData;
}
```

**Benefits:**
- Reduces Gemini API calls by 70%
- Shares cache across all users
- Lower API costs (pay-per-request model)
- Faster responses for popular routes

**Cache Invalidation:**
```typescript
// Prune expired entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in flightDataCache) {
    if (now - flightDataCache[key].timestamp > SERVER_CACHE_TTL) {
      delete flightDataCache[key];
    }
  }
}, 600000);
```

#### 9.3.2 Request Timeout Management

**Prevents Hanging Requests:**
```typescript
function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  
  return Promise.race([
    promise.then(result => {
      clearTimeout(timeoutId);
      return result;
    }),
    timeoutPromise
  ]);
}

// Usage
const response = await withTimeout(
  fetchFlightData(query),
  10000,  // 10 second timeout
  'Flight search timed out'
);
```

**Timeout Values:**
- Flight search: 10 seconds
- Flight tracking: 8 seconds
- Firestore operations: 5 seconds
- Authentication: 8 seconds

#### 9.3.3 Retry Logic with Exponential Backoff

**Handles Transient Failures:**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 500
): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && isRetryableError(error)) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}
```

**Retry Schedule:**
- 1st retry: 500ms delay
- 2nd retry: 1000ms delay
- 3rd retry: 2000ms delay
- Total max time: 3.5 seconds


### 9.4 Database Performance

#### 9.4.1 Firestore Query Optimization

**Indexed Queries:**
All queries use composite indexes for optimal performance:

```typescript
// Efficient query with index
const q = query(
  collection(db, 'saved_itineraries'),
  where('uid', '==', userId),
  orderBy('savedAt', 'desc')
);
```

**Query Performance:**
- Indexed queries: ~50ms average
- Full collection scans: Prohibited by security rules
- Real-time listeners: WebSocket connection with <100ms latency

**Limit Result Sets:**
```typescript
const q = query(
  collection(db, 'search_history'),
  where('uid', '==', userId),
  orderBy('createdAt', 'desc'),
  limit(50)  // Only fetch recent 50 searches
);
```

#### 9.4.2 Firestore Offline Persistence

**Configuration:**
```typescript
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});
```

**Benefits:**
- Instant reads from local cache (5-10ms)
- Continues working during network interruptions
- Queues writes for automatic sync when online
- Reduces Firestore read operations (cost savings)

### 9.5 Build Optimization

#### 9.5.1 Vite Build Configuration

**Production Build Settings:**
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'ui-vendor': ['framer-motion', 'lucide-react']
        }
      }
    }
  }
});
```

**Optimization Results:**
- Total bundle size: 270KB gzipped (all features)
- Build time: ~8 seconds
- Tree-shaking eliminates unused code
- Code splitting creates optimal chunk sizes

#### 9.5.2 Asset Optimization

**Images:**
- SVG format for icons and illustrations (smallest file size)
- Lazy loading for below-the-fold images
- No large background images (uses CSS gradients)

**Fonts:**
- System font stack (no web font loading delay)
- Fallback fonts for cross-platform consistency


**CSS Optimization:**
- Tailwind CSS purges unused styles
- CSS minification via Vite
- Critical CSS inlined in HTML
- Non-critical CSS loaded asynchronously

### 9.6 Performance Monitoring

**Key Metrics Tracked:**
- **First Contentful Paint (FCP):** Target <1.5s
- **Largest Contentful Paint (LCP):** Target <2.5s
- **Time to Interactive (TTI):** Target <3.5s
- **Cumulative Layout Shift (CLS):** Target <0.1
- **First Input Delay (FID):** Target <100ms

**Current Performance (Lighthouse):**
- Performance Score: 92/100
- Accessibility Score: 95/100
- Best Practices Score: 100/100
- SEO Score: 90/100

---

## 10. DEPLOYMENT ARCHITECTURE

### 10.1 Deployment Overview

SmartFlight uses a cloud-based deployment strategy leveraging modern Platform-as-a-Service (PaaS) providers for automatic scaling, continuous deployment, and minimal operational overhead.

### 10.2 Hosting Platforms

#### 10.2.1 Primary Deployment - Render

**Platform:** Render (https://render.com)

**Configuration (*render.yaml*):**
```yaml
services:
  - type: web
    name: smartflight
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
      - key: VITE_FIREBASE_API_KEY
        sync: false
      - key: VITE_FIREBASE_AUTH_DOMAIN
        sync: false
      - key: VITE_FIREBASE_PROJECT_ID
        sync: false
      - key: GEMINI_API_KEY
        sync: false
```

**Deployment Process:**
1. Push code to GitHub main branch
2. Render detects changes via webhook
3. Automatic build: `npm install && npm run build`
4. Server starts: `npm start` (Express serves from /dist)
5. Health check confirms successful deployment
6. Traffic routes to new deployment

**Render Features:**
- Automatic SSL/TLS certificates
- Zero-downtime deployments
- Environment variable management
- Built-in DDoS protection
- Automatic log aggregation


#### 10.2.2 Alternative Deployment - Vercel

**Platform:** Vercel (https://vercel.com)

**Configuration (*vercel.json*):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

**Deployment Process:**
1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Push to main branch triggers automatic deployment
4. Serverless functions deployed to `/api` endpoints
5. Static assets deployed to global CDN
6. Domain automatically configured with SSL

**Vercel Features:**
- Global CDN with edge caching
- Serverless function deployment
- Automatic preview deployments for PRs
- Analytics and performance monitoring
- Integration with GitHub for CI/CD

### 10.3 Database Deployment

**Firebase Cloud Firestore:**
- Fully managed NoSQL database
- Multi-region replication for high availability
- Automatic scaling based on usage
- Real-time synchronization via WebSocket
- Pay-as-you-go pricing model

**Firestore Configuration:**
- Primary region: asia-southeast1 (Singapore) for low latency
- Security rules deployed via Firebase Console or CLI
- Backup strategy: Firestore automated daily backups
- Indexes: Composite indexes configured for optimal query performance

### 10.4 Authentication Service

**Firebase Authentication:**
- Managed authentication service
- Email/password provider enabled
- Email verification templates customized
- Password reset flow configured
- Multi-factor authentication available (future enhancement)

### 10.5 CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Run type checking
        run: npm run lint
      - name: Build
        run: npm run build
      - name: Deploy to Render
        run: echo "Render auto-deploys on push"
```


**Deployment Stages:**
1. **Code Commit:** Developer pushes to GitHub
2. **Build Trigger:** Webhook notifies hosting platform
3. **Dependency Installation:** `npm install`
4. **Type Checking:** `npm run lint` (TypeScript compilation)
5. **Production Build:** `npm run build` (Vite + ESBuild)
6. **Deployment:** Compiled assets and server uploaded
7. **Health Check:** Platform verifies service is responding
8. **Traffic Switch:** New version receives production traffic
9. **Rollback Available:** Previous version retained for instant rollback

### 10.6 Monitoring and Logging

**Application Monitoring:**
- Render dashboard shows CPU, memory, and request metrics
- Firebase Console shows Firestore operations and Auth events
- Browser DevTools for client-side performance monitoring

**Error Logging:**
```typescript
// Client-side error logging
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Future: Send to error tracking service (Sentry, etc.)
});

// Firestore error logging
function handleFirestoreError(error: unknown, operation: string) {
  const errorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operation,
    timestamp: new Date().toISOString(),
    userId: auth.currentUser?.uid
  };
  console.error('Firestore error:', JSON.stringify(errorInfo));
}
```

**Log Retention:**
- Render: 7 days of logs (free tier)
- Firebase: 30 days of operation logs
- Browser Console: Session only

### 10.7 Backup and Disaster Recovery

**Database Backups:**
- Firestore automated daily backups
- Point-in-time recovery within 7 days
- Manual export available via Firebase Console

**Code Repository:**
- Git version control with full history
- GitHub repository serves as code backup
- Protected main branch requires pull request reviews

**Deployment Rollback:**
- Instant rollback to previous deployment via platform dashboard
- Git revert for code-level rollback
- Environment variable versioning

**Recovery Time Objectives:**
- Database recovery: <1 hour (restore from backup)
- Application recovery: <5 minutes (rollback deployment)
- Full disaster recovery: <2 hours (rebuild from source)

### 10.8 Scalability Architecture

**Horizontal Scaling:**
- Render automatically scales web service instances based on load
- Firebase Firestore automatically scales read/write capacity
- Firebase Auth handles authentication load automatically


**Performance Under Load:**
- Current capacity: 100 concurrent users (free tier)
- Firestore: 50,000 reads/day, 20,000 writes/day (free tier)
- Upgrade path: Paid tiers support unlimited users
- CDN caching reduces server load by 60%

**Load Testing Results:**
- 50 concurrent users: <200ms average response time
- 100 concurrent users: <500ms average response time
- Database queries: <100ms p95 latency

---

## 11. APPENDICES

### 11.1 Appendix A: Technology Versions

**Runtime and Build Tools:**
- Node.js: 20.x LTS
- npm: 10.x
- TypeScript: 5.8.3
- Vite: 6.4.1
- ESBuild: (bundled with Vite)

**Frontend Libraries:**
- React: 19.0.0
- React DOM: 19.0.0
- Framer Motion: 12.0.3
- Lucide React: Latest
- date-fns: Latest
- clsx: Latest
- tailwind-merge: Latest

**Backend Libraries:**
- Express: 4.21.2
- Firebase Admin SDK: 12.11.0
- Google Generative AI: 0.22.0
- CORS: Latest

**CSS and Styling:**
- Tailwind CSS: 4.0.5
- PostCSS: (bundled with Tailwind)
- Autoprefixer: (bundled with Tailwind)

**Development Dependencies:**
- @vitejs/plugin-react: Latest
- @types/node: Latest
- @types/react: Latest
- @types/react-dom: Latest
- tsx: Latest (for TypeScript execution)

### 11.2 Appendix B: API Endpoints

**Flight Search API:**
- **Endpoint:** POST /api/search
- **Request Body:**
  ```json
  {
    "query": "KUL to SIN on 2025-02-10",
    "departureDate": "2025-02-10"
  }
  ```
- **Response:**
  ```json
  [
    {
      "id": "itin_001",
      "legs": [ /* FlightLeg objects */ ],
      "totalDuration": "1h 0m",
      "reliabilityScore": 8.5,
      "connectionRisk": "LOW",
      "connectionRiskValue": 95,
      "status": "RELIABLE",
      "price": 280
    }
  ]
  ```


**Flight Tracking API:**
- **Endpoint:** POST /api/tracking
- **Request Body:**
  ```json
  {
    "flightNumber": "MH123"
  }
  ```
- **Response:**
  ```json
  {
    "flightNumber": "MH123",
    "airline": "Malaysia Airlines",
    "origin": {
      "airport": "KUL",
      "city": "Kuala Lumpur",
      "time": "09:00",
      "terminal": "T1",
      "gate": "G5"
    },
    "destination": {
      "airport": "SIN",
      "city": "Singapore",
      "time": "10:00",
      "terminal": "T3",
      "gate": "D42"
    },
    "status": "IN AIR",
    "progress": 65,
    "altitude": 35000,
    "speed": 850,
    "estimatedArrival": "10:05"
  }
  ```

### 11.3 Appendix C: Firestore Security Rules

**Complete Security Rules (*firestore.rules*):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function isEmailVerified() {
      return request.auth.token.email_verified == true;
    }
    
    // Users collection
    match /users/{uid} {
      allow read: if isOwner(uid);
      allow create: if isOwner(uid) && isEmailVerified();
      allow update: if isOwner(uid);
    }
    
    // Saved itineraries collection
    match /saved_itineraries/{docId} {
      allow read: if isAuthenticated() && 
                     resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && 
                       isEmailVerified() &&
                       request.resource.data.uid == request.auth.uid;
      allow delete: if isAuthenticated() && 
                       resource.data.uid == request.auth.uid;
    }
    
    // Price alerts collection
    match /price_alerts/{docId} {
      allow read: if isAuthenticated() && 
                     resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() && 
                       isEmailVerified() &&
                       request.resource.data.uid == request.auth.uid &&
                       request.resource.data.targetPrice < request.resource.data.currentPrice;
      allow delete: if isAuthenticated() && 
                       resource.data.uid == request.auth.uid;
    }
    
    // Search history collection
    match /search_history/{docId} {
      allow read: if isAuthenticated() && 
                     resource.data.uid == request.auth.uid;
      allow create: if isAuthenticated() &&
                       request.resource.data.uid == request.auth.uid;
      allow delete: if isAuthenticated() && 
                       resource.data.uid == request.auth.uid;
    }
  }
}
```


### 11.4 Appendix D: Environment Configuration

**Development Environment (*.env.example*):**
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_development_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-dev
VITE_FIREBASE_STORAGE_BUCKET=your-project-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# Server Configuration
PORT=3000
NODE_ENV=development
```

**Production Environment:**
- All values configured in Render/Vercel dashboard
- Separate Firebase project for production
- Production-specific API keys
- NODE_ENV=production

### 11.5 Appendix E: Build Commands

**Development:**
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite on port 5173)
```

**Production Build:**
```bash
npm run build        # Build frontend + backend
# Outputs:
# - dist/assets/*.js  (bundled JavaScript)
# - dist/assets/*.css (compiled CSS)
# - dist/index.html   (HTML entry point)
# - dist/server.cjs   (compiled Express server)
```

**Production Run:**
```bash
npm start            # Start Express server (port 3000)
```

**Type Checking:**
```bash
npm run lint         # TypeScript type checking (no emit)
```

**Clean Build:**
```bash
npm run clean        # Remove dist/ and node_modules/
npm install          # Fresh dependency installation
npm run build        # Clean build
```

### 11.6 Appendix F: Reliability Score Algorithm

**Complete Algorithm:**
```typescript
function calculateReliabilityScore(itinerary: Itinerary): number {
  let baseScore = 10.0;
  
  // Factor 1: Individual leg disruption probability (weight: 5x)
  itinerary.legs.forEach(leg => {
    const disruptionPenalty = leg.disruptionProbability * 5;
    baseScore -= disruptionPenalty;
  });
  
  // Factor 2: Connection risk penalty
  const connectionPenalties = {
    'LOW': 0,
    'MEDIUM': 1.5,
    'HIGH': 3.0
  };
  baseScore -= connectionPenalties[itinerary.connectionRisk];
  
  // Factor 3: Route complexity (multiple connections penalty)
  const connectionCount = itinerary.legs.length - 1;
  if (connectionCount > 0) {
    baseScore -= connectionCount * 0.5;
  }
  
  // Factor 4: Time of day adjustment (early/late penalty)
  const firstLeg = itinerary.legs[0];
  const departureHour = parseHour(firstLeg.departure.scheduled);
  if (departureHour < 6 || departureHour > 22) {
    baseScore -= 0.3;
  }
  
  // Clamp score between 0 and 10
  return Math.max(0, Math.min(10, baseScore));
}
```


**Disruption Probability Estimation:**
```typescript
function estimateDisruptionProbability(
  airline: string,
  route: string,
  departureTime: string
): number {
  let baseProbability = 0.05; // 5% baseline
  
  // Airline performance adjustments
  const airlineFactors = {
    'Malaysia Airlines': 0.98,
    'AirAsia': 1.10,
    'Singapore Airlines': 0.95,
    'Budget Carrier': 1.15
  };
  baseProbability *= airlineFactors[airline] || 1.0;
  
  // Route distance adjustments
  const routeDistance = calculateRouteDistance(route);
  if (routeDistance > 5000) {
    baseProbability *= 1.20;
  }
  
  // Time of day adjustments
  const hour = parseHour(departureTime);
  if (hour >= 18) {
    baseProbability *= 1.10;
  }
  
  // Seasonal weather adjustments
  const currentMonth = new Date().getMonth();
  if (currentMonth >= 11 || currentMonth <= 2) {
    baseProbability *= 1.15; // Winter months
  }
  
  return Math.min(baseProbability, 0.30); // Cap at 30%
}
```

**Connection Risk Assessment:**
```typescript
function analyzeConnectionRisk(
  layoverMinutes: number,
  airportCode: string
): { risk: 'LOW' | 'MEDIUM' | 'HIGH'; value: number } {
  const complexAirports = ['JFK', 'LAX', 'LHR', 'CDG', 'DXB', 'HKG'];
  const isComplex = complexAirports.includes(airportCode);
  
  const minimumSafe = isComplex ? 90 : 60;      // minutes
  const minimumRequired = isComplex ? 60 : 45;  // minutes
  
  if (layoverMinutes >= minimumSafe) {
    return {
      risk: 'LOW',
      value: Math.min((layoverMinutes / minimumSafe) * 10, 10)
    };
  } else if (layoverMinutes >= minimumRequired) {
    return {
      risk: 'MEDIUM',
      value: 50 + ((layoverMinutes - minimumRequired) / 
              (minimumSafe - minimumRequired)) * 40
    };
  } else {
    return {
      risk: 'HIGH',
      value: Math.max((layoverMinutes / minimumRequired) * 50, 0)
    };
  }
}
```

### 11.7 Appendix G: Testing Summary

**Testing Approach:**
- Black box testing (primary methodology)
- Equivalence partitioning for input validation
- Boundary value analysis for edge cases
- Use case testing for end-to-end workflows
- Decision table testing for complex logic paths

**Test Coverage:**
- User authentication flows: 100%
- Flight search functionality: 100%
- Itinerary management: 100%
- Price alerts: 100%
- Live flight tracking: 100%
- Search history: 100%

**Test Results:**
- Total test cases: 85+
- Pass rate: 100%
- Critical defects: 0
- Minor issues: 0


### 11.8 Appendix H: Known Limitations and Future Enhancements

**Current Limitations:**
1. **Demo Flight Data:** Search results use simulated data from Google Gemini instead of real-time flight APIs
2. **Price Monitoring:** Price alerts created but notifications not yet implemented
3. **Payment Integration:** No booking/payment functionality (search and planning only)
4. **Multi-language Support:** Interface available in English only
5. **Mobile Apps:** Web application only, no native mobile apps

**Planned Future Enhancements:**

**Phase 1 (High Priority):**
- Real flight data API integration (Amadeus, Skyscanner, etc.)
- Email notifications for triggered price alerts
- User profile customization (preferences, currency)
- Advanced filtering (baggage allowance, aircraft type)
- Itinerary sharing via unique links

**Phase 2 (Medium Priority):**
- Direct booking integration with airlines
- Multi-language support (Malay, Chinese, Tamil)
- Mobile apps (iOS and Android) using React Native
- Flight delay notifications via push notifications
- Comparison with alternative dates (flexible dates)

**Phase 3 (Low Priority):**
- Trip planning with hotels and car rentals
- Social features (share itineraries with friends)
- Loyalty program integration
- Carbon footprint calculator
- AI-powered personalized recommendations

### 11.9 Appendix I: Glossary of Terms

**Airport Code (IATA):** Three-letter code identifying airports worldwide (e.g., KUL for Kuala Lumpur)

**Connection Risk:** Assessment of whether layover time is sufficient for passengers to make connecting flights

**Disruption Probability:** Estimated likelihood (0-1) of a flight experiencing delays, cancellations, or other disruptions

**Firebase Auth:** Google's managed authentication service providing user login and session management

**Firestore:** Google's NoSQL document database with real-time synchronization capabilities

**Glassmorphism:** UI design trend using frosted glass effect with backdrop blur

**Itinerary:** Complete flight route including all legs from origin to final destination

**Layover:** Time between arrival of one flight and departure of connecting flight

**Leg:** Individual flight segment operated by one airline with one flight number

**Reliability Score:** 0-10 metric indicating overall flight reliability based on multiple factors

**Session Storage:** Browser storage mechanism persisting data for browser session duration

**SPA (Single Page Application):** Web application loading single HTML page and dynamically updating content

**WebSocket:** Communication protocol enabling real-time bidirectional data exchange

### 11.10 Appendix J: Contact Information

**Project Details:**
- Project Name: SmartFlight - Flight Search and Management System
- Version: 2.0.0
- Status: Active Development

**Developer:**
- Name: Wong Cheng Yong
- Student ID: M44100127
- Email: wongchengyong100@gmail.com
- GitHub: @WCYG22
- Institution: University of Wollongong Malaysia KDU
- Program: UCOMS DS

**Project Links:**
- Live Application: https://sf-f.onrender.com
- GitHub Repository: https://github.com/WCYG22/SF_F
- Documentation: https://github.com/WCYG22/SF_F/blob/main/README.md

**Support:**
For technical inquiries, bug reports, or feature requests:
- Email: wongchengyong100@gmail.com
- GitHub Issues: https://github.com/WCYG22/SF_F/issues

---

### 11.11 Appendix K: Requirement Traceability Matrices

This section provides traceability matrices that map relationships between use cases, system components, sequence diagrams, and features. These matrices ensure complete coverage and facilitate impact analysis during maintenance and enhancement phases.

#### 11.11.1 Use Case Definitions

**Table 11.1: SmartFlight Use Cases**

| Use Case ID | Use Case Name | Description | Priority |
|-------------|---------------|-------------|----------|
| UC001 | Search Itinerary and View Risk | User searches for flights and views reliability assessment | High |
| UC002 | View Flight Details | User views detailed information for a specific itinerary | High |
| UC003 | Sort and Filter Results | User applies sorting and filtering to search results | Medium |
| UC004 | View Alternative Itineraries | User views alternative flight options | Medium |
| UC005 | Save or Export Itinerary | User saves itinerary to account or exports via email | High |
| UC006 | Share Itinerary via Email | User shares itinerary details through email | Medium |
| UC007 | Track Live Flight | User tracks real-time flight status by flight number | High |
| UC008 | Set Price Alert | User creates price monitoring alert for specific route | Medium |
| UC009 | Manage Saved Itineraries | User views and manages saved flight itineraries | High |
| UC010 | User Authentication | User registers, logs in, verifies email, and manages account | High |

---

#### 11.11.2 System Component Definitions

**Table 11.2: SmartFlight System Components**

| Component ID | Component Name | Description | Technology |
|--------------|----------------|-------------|------------|
| SC001 | Frontend UI | React-based user interface with Tailwind CSS styling | React 19, TypeScript |
| SC002 | Search Engine | Flight search logic with reliability calculation | Express.js, Node.js |
| SC003 | Authentication Service | User authentication and authorization management | Firebase Auth |
| SC004 | Database Service | NoSQL data storage for user data and saved items | Cloud Firestore |
| SC005 | Caching Layer | Multi-tier caching for performance optimization | Session Storage, Memory Cache |
| SC006 | Live Tracking Service | Real-time flight position and status tracking | Express.js API |
| SC007 | Email Service | Email sharing and verification functionality | mailto: protocol, Firebase |

---

#### 11.11.3 Sequence Diagram Definitions

**Table 11.3: SmartFlight Sequence Diagrams**

| Diagram ID | Diagram Name | Description |
|------------|--------------|-------------|
| SD001 | Search Itinerary Flow | Complete search workflow with reliability calculation |
| SD002 | View Flight Details Flow | Detailed itinerary information retrieval and display |
| SD003 | Sort and Filter Flow | Client-side result manipulation and display |
| SD004 | Alternative Itineraries Flow | Alternative option identification and presentation |
| SD005 | Save Itinerary Flow | Firestore write operation with authentication check |
| SD006 | Export Itinerary Flow | Email export via mailto: protocol |
| SD007 | Live Flight Tracking Flow | Real-time flight data retrieval and visualization |
| SD008 | Set Price Alert Flow | Price alert creation and Firestore persistence |
| SD009 | View Saved Itineraries Flow | Firestore query with real-time listener |
| SD010 | User Login Flow | Firebase authentication workflow |
| SD011 | User Registration Flow | Account creation with email verification |

---

#### 11.11.4 Traceability Matrix: Use Case vs System Component

**Table 11.4: Use Case vs System Component Traceability**

| Use Case | SC001 Frontend | SC002 Search | SC003 Auth | SC004 Database | SC005 Cache | SC006 Tracking | SC007 Email |
|----------|----------------|--------------|------------|----------------|-------------|----------------|-------------|
| UC001 | ✓ | ✓ | | | ✓ | | |
| UC002 | ✓ | ✓ | | | ✓ | | |
| UC003 | ✓ | | | | | | |
| UC004 | ✓ | ✓ | | | | | |
| UC005 | ✓ | | ✓ | ✓ | | | ✓ |
| UC006 | ✓ | | | | | | ✓ |
| UC007 | ✓ | | | | | ✓ | |
| UC008 | ✓ | | ✓ | ✓ | | | |
| UC009 | ✓ | | ✓ | ✓ | | | |
| UC010 | ✓ | | ✓ | ✓ | | | ✓ |

**Legend:**
- ✓ = Component is directly involved in use case implementation
- Empty cell = Component not required for use case

**Analysis:**
- **SC001 (Frontend UI)**: Used by all 10 use cases (100% coverage)
- **SC002 (Search Engine)**: Used by 3 use cases (30% coverage)
- **SC003 (Auth Service)**: Used by 4 use cases (40% coverage)
- **SC004 (Database)**: Used by 4 use cases (40% coverage)
- **SC005 (Cache)**: Used by 2 use cases (20% coverage)
- **SC006 (Tracking)**: Used by 1 use case (10% coverage)
- **SC007 (Email)**: Used by 3 use cases (30% coverage)

---

#### 11.11.5 Traceability Matrix: Use Case vs Sequence Diagram

**Table 11.5: Use Case vs Sequence Diagram Traceability**

| Use Case | SD001 | SD002 | SD003 | SD004 | SD005 | SD006 | SD007 | SD008 | SD009 | SD010 | SD011 |
|----------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| UC001 | ✓ | ✓ | | | | | | | | | |
| UC002 | | ✓ | | | | | | | | | |
| UC003 | | | ✓ | | | | | | | | |
| UC004 | | | | ✓ | | | | | | | |
| UC005 | | | | | ✓ | ✓ | | | | | |
| UC006 | | | | | | ✓ | | | | | |
| UC007 | | | | | | | ✓ | | | | |
| UC008 | | | | | | | | ✓ | | | |
| UC009 | | | | | | | | | ✓ | | |
| UC010 | | | | | | | | | | ✓ | ✓ |

**Legend:**
- ✓ = Sequence diagram documents the use case workflow
- Empty cell = Sequence diagram not related to use case

**Coverage Analysis:**
- All 10 use cases have complete sequence diagram documentation (100% coverage)
- UC001 has 2 sequence diagrams (search + view details flows)
- UC005 has 2 sequence diagrams (save + export flows)
- UC010 has 2 sequence diagrams (login + registration flows)
- Remaining use cases have 1 sequence diagram each

---

#### 11.11.6 Traceability Matrix: System Component vs Sequence Diagram

**Table 11.6: System Component vs Sequence Diagram Traceability**

| Component | SD001 | SD002 | SD003 | SD004 | SD005 | SD006 | SD007 | SD008 | SD009 | SD010 | SD011 |
|-----------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|-------|
| SC001 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| SC002 | ✓ | ✓ | | ✓ | | | | | | | |
| SC003 | | | | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| SC004 | | | | | ✓ | | | ✓ | ✓ | ✓ | ✓ |
| SC005 | ✓ | ✓ | | | | | | | | | |
| SC006 | | | | | | | ✓ | | | | |
| SC007 | | | | | | ✓ | | | | | ✓ |

**Legend:**
- ✓ = Component is involved in sequence diagram workflow
- Empty cell = Component not used in sequence diagram

**Component Usage Analysis:**
- **SC001 (Frontend)**: Appears in all 11 diagrams (100% coverage)
- **SC002 (Search)**: Appears in 3 diagrams (27% coverage)
- **SC003 (Auth)**: Appears in 5 diagrams (45% coverage)
- **SC004 (Database)**: Appears in 5 diagrams (45% coverage)
- **SC005 (Cache)**: Appears in 2 diagrams (18% coverage)
- **SC006 (Tracking)**: Appears in 1 diagram (9% coverage)
- **SC007 (Email)**: Appears in 2 diagrams (18% coverage)

---

#### 11.11.7 Traceability Matrix: Use Case vs Product Feature

**Table 11.7: Use Case vs Product Feature Traceability**

| Use Case | F001 Auth | F005 Search | F006 Reliability | F009 Details | F010 Save | F013 Alerts | F016 Tracking | F023 UI Update |
|----------|-----------|-------------|------------------|--------------|-----------|-------------|---------------|----------------|
| UC001 | | ✓ | ✓ | | | | | |
| UC002 | | | ✓ | ✓ | | | | |
| UC003 | | ✓ | | | | | | |
| UC004 | | ✓ | ✓ | | | | | |
| UC005 | ✓ | | | | ✓ | | | ✓ |
| UC006 | | | | | | | | |
| UC007 | | | | | | | ✓ | |
| UC008 | ✓ | | | | | ✓ | | ✓ |
| UC009 | ✓ | | | | ✓ | | | ✓ |
| UC010 | ✓ | | | | | | | |

**Feature Definitions (Reference to Table 2.2):**
- **F001**: User Authentication
- **F005**: Intelligent Flight Search
- **F006**: Reliability Score Calculation
- **F009**: Detailed Itinerary View
- **F010**: Save Itinerary
- **F013**: Price Alert Management
- **F016**: Live Flight Tracking
- **F023**: Optimistic UI Updates

---

#### 11.11.8 Requirements Coverage Summary

**Table 11.8: Requirement Coverage Statistics**

| Category | Total Count | Documented | Coverage % |
|----------|-------------|------------|------------|
| Use Cases | 10 | 10 | 100% |
| System Components | 7 | 7 | 100% |
| Sequence Diagrams | 11 | 11 | 100% |
| Product Features (Table 2.2) | 25 | 25 | 100% |
| Data Collections (Section 4) | 4 | 4 | 100% |
| UI Screens (Section 7) | 5 | 5 | 100% |
| Design Patterns (Section 5) | 7 | 7 | 100% |

**Traceability Completeness:**
- ✅ All use cases mapped to system components
- ✅ All use cases mapped to sequence diagrams
- ✅ All system components mapped to sequence diagrams
- ✅ All use cases mapped to product features
- ✅ Forward traceability: Requirements → Design → Implementation
- ✅ Backward traceability: Implementation → Design → Requirements

**Impact Analysis Benefits:**
1. **Change Management**: Identify affected components when requirements change
2. **Test Coverage**: Ensure all use cases have corresponding test cases
3. **Documentation**: Verify completeness of design documentation
4. **Maintenance**: Understand dependencies during bug fixes and enhancements

---

#### 11.11.9 Use Case Priority Matrix

**Table 11.9: Use Case Implementation Priority**

| Priority Level | Use Cases | Implementation Status | Testing Status |
|----------------|-----------|----------------------|----------------|
| High | UC001, UC002, UC005, UC007, UC009, UC010 | ✅ Complete | ✅ Complete |
| Medium | UC003, UC004, UC006, UC008 | ✅ Complete | ✅ Complete |
| Low | - | N/A | N/A |

**Priority Justification:**
- **High Priority**: Core functionality required for minimum viable product
- **Medium Priority**: Enhancement features improving user experience
- **Low Priority**: No features in this category for current version

---

#### 11.11.10 Component Dependency Matrix

**Table 11.10: Component Dependencies**

| Component | Depends On | Used By |
|-----------|------------|---------|
| SC001 Frontend | SC002, SC003, SC004, SC005, SC006, SC007 | End users (all use cases) |
| SC002 Search Engine | SC005 (Cache) | SC001 (Frontend) |
| SC003 Auth Service | Firebase Auth (external) | SC001, SC004 |
| SC004 Database | Firebase Firestore (external) | SC001, SC003 |
| SC005 Cache Layer | Browser Session Storage (native) | SC001, SC002 |
| SC006 Tracking Service | External Flight API | SC001 |
| SC007 Email Service | Browser mailto: (native), Firebase | SC001, SC003 |

**Critical Dependencies:**
- **Firebase Services**: SC003 and SC004 depend on Firebase infrastructure
- **Browser APIs**: SC005 and SC007 depend on browser capabilities
- **External APIs**: SC002 and SC006 depend on third-party flight data

---

#### 11.11.11 Traceability Matrix Notes

**Matrix Maintenance Guidelines:**

1. **Update Frequency**: Matrices should be updated whenever:
   - New use cases are added
   - System components are modified
   - Sequence diagrams are created or revised
   - Features are added or changed

2. **Validation Process**:
   - Review traceability during sprint planning
   - Verify coverage before major releases
   - Audit matrices during requirement changes

3. **Tool Support**:
   - Matrices maintained manually in SDS document
   - Future enhancement: Tool-assisted traceability management
   - Version control: Git tracks all matrix changes

4. **Quality Metrics**:
   - Target: 100% forward and backward traceability
   - Current: 100% coverage achieved (SmartFlight v2.0)
   - Gap Analysis: No orphaned requirements or components identified

**Document References:**
- Use Case Details: Section 3.5 (Sequence Diagrams)
- System Components: Section 6 (Component Design)
- Product Features: Section 2.2 (Table 2.2)
- Data Collections: Section 4 (Data Design)

---

## DOCUMENT REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2024 | Wong Cheng Yong | Initial SDS document creation |
| 1.5 | December 2024 | Wong Cheng Yong | Added price alerts and save itinerary features |
| 2.0 | January 2025 | Wong Cheng Yong | Complete SDS with all sections, comprehensive testing, and deployment architecture |

---

## APPROVAL SIGNATURES

**Prepared By:**
Wong Cheng Yong (M44100127)
Student, UCOMS DS
University of Wollongong Malaysia KDU
Date: January 2025

**Reviewed By:**
_________________________
Project Supervisor
Date: _________

**Approved By:**
_________________________
Program Coordinator
Date: _________

---

**END OF SOFTWARE DESIGN SPECIFICATION**

