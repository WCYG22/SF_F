# ✈️ Smart Flight

**Intelligent Flight Search with Reliability Insights**

Smart Flight is a modern flight search platform that helps users find reliable flights by analyzing disruption probabilities, connection risks, and providing real-time tracking. Built with React, TypeScript, Firebase, and powered by AI-driven search capabilities.

---

## 🌟 Features

### 🔍 **Intelligent Flight Search**
- **Multi-route support**: One-way, round-trip, and multi-city itineraries
- **Real-time results**: Search flights with live pricing and availability
- **Reliability scoring**: 0-10 score based on historical data and disruption analysis
- **Connection risk analysis**: Visual indicators for layover safety (LOW/MEDIUM/HIGH)
- **Alternative suggestions**: Get higher reliability or better price alternatives

### 📊 **Flight Reliability Insights**
- **Disruption probability**: Per-leg risk assessment
- **Connection risk calculator**: Analyzes tight connections and potential delays
- **Visual risk indicators**: Color-coded badges and progress bars
- **Flight status tracking**: Real-time updates on delays and gate changes

### 🔔 **Price Alerts**
- **Set target prices**: Get notified when flights drop to your desired price
- **Real-time monitoring**: Automated price tracking via Firestore
- **Alert management**: View, edit, and delete active price alerts
- **Success notifications**: Floating toast confirmations for alert creation

### 💾 **Save & Track**
- **Save itineraries**: Bookmark favorite flights for quick access
- **Search history**: Automatically tracks your searches with timestamps and result counts
- **User profiles**: Secure authentication with Firebase Auth and email verification
- **Cross-device sync**: Access saved data from any device in real-time

### 🛫 **Live Flight Tracking**
- **Real-time tracking**: Monitor flights in progress
- **Aircraft details**: Model, registration, age, and specifications
- **Flight progress**: Visual progress bar with altitude and speed
- **Gate & terminal info**: Departure and arrival gate assignments

### 🎨 **Modern UI/UX**
- **Dark mode design**: Sleek, modern interface with glassmorphism effects
- **Responsive layout**: Optimized for desktop, tablet, and mobile
- **Smooth animations**: Framer Motion for delightful interactions
- **Toast notifications**: Real-time feedback for user actions

---

## 🚀 Tech Stack

### **Frontend**
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **date-fns** - Date formatting and manipulation

### **Backend & Database**
- **Firebase Authentication** - User auth with email verification
- **Cloud Firestore** - Real-time NoSQL database
- **Firebase Security Rules** - Data access control
- **Google Gemini AI** - Flight search intelligence

### **APIs**
- **Custom Flight Search API** - Powered by Google Gemini
- **Flight Tracking API** - Real-time flight status

---

## 📦 Installation

### **Prerequisites**
- Node.js (v20+ recommended)
- npm or yarn
- Firebase project with Firestore enabled

### **Setup**

1. **Clone the repository**
```bash
git clone https://github.com/WCYG22/SF_F.git
cd SF_F
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

GEMINI_API_KEY=your_gemini_api_key
PORT=3000
NODE_ENV=development
```

4. **Deploy Firestore Rules**

Go to [Firebase Console](https://console.firebase.google.com) → Firestore Database → Rules, and paste the content from `firestore.rules`.

5. **Run development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🏗️ Project Structure

```
SF_F/
├── api/                    # Serverless API functions
│   ├── search.js          # Flight search endpoint
│   └── tracking.js        # Flight tracking endpoint
├── src/
│   ├── components/        # React components
│   │   ├── AirportSelector.tsx
│   │   ├── CalendarSelector.tsx
│   │   ├── LiveFlightView.tsx
│   │   └── UI.tsx
│   ├── constants/         # Static data
│   │   └── airports.ts
│   ├── services/          # API services
│   │   └── flightService.ts
│   ├── types/             # TypeScript types
│   │   └── global.d.ts
│   ├── lib/               # Utilities
│   │   └── utils.ts
│   ├── App.tsx            # Main app component
│   ├── firebase.ts        # Firebase configuration
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── firestore.rules        # Firestore security rules
├── server.ts              # Express server for production
├── vite.config.ts         # Vite configuration
└── package.json
```

---

## 🔥 Firebase Collections

### **users**
```typescript
{
  uid: string;
  email: string;
  displayName?: string;
  createdAt: Timestamp;
  role: 'user' | 'admin';
}
```

### **saved_itineraries**
```typescript
{
  uid: string;
  itineraryId: string;
  origin: string;
  destination: string;
  reliabilityScore: number;
  price: number;
  legs: FlightLeg[];
  status: 'RELIABLE' | 'CAUTION' | 'HIGH RISK';
  connectionRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  connectionRiskValue: number;
  savedAt: Timestamp;
}
```

### **price_alerts**
```typescript
{
  uid: string;
  itineraryId: string;
  origin: string;
  destination: string;
  currentPrice: number;
  targetPrice: number;
  reliabilityScore: number;
  status: 'active' | 'inactive' | 'triggered';
  createdAt: Timestamp;
}
```

### **search_history**
```typescript
{
  uid: string;
  origin: string;
  destination: string;
  searchDate: string;
  resultCount: number;
  status: string;
  createdAt: Timestamp;
}
```

---

## 🎯 Usage

### **Search for Flights**
1. Select trip type (One-way, Round-trip, Multi-city)
2. Enter departure and destination airports
3. Choose travel date(s)
4. Click "Search Flights"
5. View results sorted by reliability score

### **Set Price Alerts**
1. Find a flight you're interested in
2. Click "Set Alert" button
3. Enter your target price (lower than current price)
4. See floating toast confirmation
5. Manage alerts in Profile tab

### **Save Itineraries**
1. Browse search results
2. Click "Save Itinerary" on any flight
3. Access saved flights from the "Saved" tab
4. View details or remove trips

### **Track Live Flights**
1. Go to "Live" tab
2. Enter flight number (e.g., MH123)
3. View real-time tracking information
4. Monitor altitude, speed, and progress

### **View Search History**
1. Go to Profile tab
2. Click "View Full History"
3. See all your past searches with timestamps
4. Select and delete unwanted history

---

## 🛠️ Development

### **Available Scripts**

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Check TypeScript types
npm run clean        # Remove build artifacts
```

### **Development Workflow**

1. **Make changes** in `src/` directory
2. **Hot reload** automatically reflects changes
3. **Check types** with `npm run lint`
4. **Build** with `npm run build`
5. **Test production** with `npm start`

---

## 🚢 Deployment

### **Deploy to Render**

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
4. Add environment variables from `.env`
5. Deploy automatically on push to main

### **Deploy to Vercel**

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

**Live Application**: https://sf-f.onrender.com

---

## 🔒 Security

### **Authentication**
- Email/password with verification required
- Secure password reset flow
- Firebase Auth token management

### **Database Security**
- Firestore Security Rules enforce access control
- Users can only access their own data
- Admin role for elevated permissions

### **Environment Variables**
- Sensitive keys stored in `.env`
- Never committed to version control
- Separate configs for dev/production

### **Data Validation**
- Client-side input validation
- Firestore rules validate all writes
- Type-safe TypeScript throughout

---

## 🐛 Troubleshooting

### **Blank page after deployment**
- Check browser console for errors
- Verify all environment variables are set
- Ensure Firestore rules are deployed

### **Firebase permission denied**
- Update Firestore rules in Firebase Console
- Check user is authenticated
- Verify email is verified

### **Price alerts not working**
- Ensure Firestore rules include `price_alerts` collection
- Check browser console for errors
- Verify user is logged in and email verified

### **Search history not showing**
- Deploy `search_history` rules to Firebase Console
- Perform a search to populate history
- Check user authentication status

---

## 📝 Recent Updates

### **v2.0.0** (January 2025)
- ✅ Implemented real search history tracking with Firestore
- ✅ Added floating toast notifications for price alerts
- ✅ Fixed price alert modal state management
- ✅ Added Firestore security rules for all collections
- ✅ Enhanced error handling and debug logging
- ✅ Improved UI/UX with better feedback

### **v1.5.0** (December 2024)
- ✅ Added price alert functionality
- ✅ Implemented save itinerary feature
- ✅ Enhanced flight reliability scoring
- ✅ Added live flight tracking

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Wong Cheng Yong**
- GitHub: [@WCYG22](https://github.com/WCYG22)
- Email: wongchengyong100@gmail.com
- Student ID: B1LM27
- Program: METS (UCOMS DS)

---

## 🙏 Acknowledgments

- **Google Gemini AI** - Flight search intelligence
- **Firebase** - Backend infrastructure
- **Lucide Icons** - Beautiful icon library
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling framework

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on [GitHub](https://github.com/WCYG22/SF_F/issues)
- Email: wongchengyong100@gmail.com

---

**Made with ❤️ and ✈️ by Smart Flight Team**
