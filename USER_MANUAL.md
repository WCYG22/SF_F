# USER MANUAL

| Document Title | User Manual |
|----------------|-------------|
| System Name | SmartFlight - Flight Search and Management System |
| Version | 2.0 |
| Target User | Travelers (General Public, Students, Professionals) |
| Platform | Web Application (Any Modern Browser) |
| Search Method | AI-Powered Reliability Assessment |

---

## Quick-Start Guide

Following is a 5-step quick start guide to search your first flight under 2 minutes.

| Step | Action | Description |
|------|--------|-------------|
| 1 | Open Application | Go to https://sf-f.onrender.com in any browser. No login required to search flights. |
| 2 | Enter Route Details | Select origin airport (e.g., KUL), destination airport (e.g., SIN), and travel date from the search form. |
| 3 | Click Search | Click the Search button. The system will find flights and calculate reliability scores automatically. |
| 4 | View Results | Browse flight options sorted by reliability score. Green badges indicate reliable flights, red badges indicate high-risk flights. |
| 5 | Save or Share | Click "View Details" to see complete flight information. Save itinerary (requires login) or share via email. |

---

## 1. Introduction

### 1.1 Purpose of This Manual

This User Manual provides step-by-step guidance for travelers using the **SmartFlight - Flight Search and Management System**. The system helps you find reliable flights by analyzing disruption probabilities, connection risks, and route complexity through any standard web browser.

### 1.2 System Overview

SmartFlight is a web-based application that prioritizes flight reliability over price. Unlike traditional booking platforms that focus on finding the cheapest flights, SmartFlight analyzes multiple factors including:

- **Disruption Probability**: Likelihood of delays or cancellations based on airline performance
- **Connection Risk**: Assessment of whether layover times are sufficient
- **Route Complexity**: Evaluation of multi-leg journey feasibility
- **Reliability Score**: Overall 0-10 rating combining all factors

Once you find a suitable flight, you can save it to your account (requires free registration), set price alerts, track live flight status, and share itineraries via email.

### 1.3 What to Expect from SmartFlight

SmartFlight helps you make informed flight booking decisions by providing:

- **Intelligent Search**: AI-powered flight search with automatic reliability assessment
- **Visual Risk Indicators**: Color-coded badges (green=reliable, yellow=caution, red=high risk)
- **Real-Time Tracking**: Monitor live flight status with radar visualization
- **Saved Itineraries**: Store favorite flights for future reference (requires account)
- **Price Alerts**: Get notified when flight prices drop (requires account)
- **Search History**: Automatic tracking of your searches (requires account)

To get the best results:
- Use valid IATA airport codes (e.g., KUL, SIN, LHR, JFK)
- Search flights at least 7 days in advance for best availability
- Compare multiple itineraries using reliability scores
- Consider connection risk when booking multi-leg flights
- Register for a free account to access advanced features

### 1.4 Intended Audience

This manual is written for:
- **General Travelers**: Anyone planning personal or business trips
- **Students**: Planning holiday travel or study abroad trips
- **Professionals**: Business travelers prioritizing reliability over price
- **Travel Planners**: Organizing trips for groups or families

---

## 2. System Requirements

The system runs entirely in the browser. No software installation is needed. Make sure your device meets the following requirements:

| Component | Requirement |
|-----------|-------------|
| Web Browser | Any modern browser (Chrome, Firefox, Edge, Safari) |
| Internet Connection | Stable broadband connection (minimum 2 Mbps recommended) |
| Operating System | Windows 10/11, macOS 10.14+, iOS 14+, Android 10+ |
| Screen Resolution | 375 × 667 or higher (mobile), 1024 × 768 or higher (desktop) |
| JavaScript | Must be enabled in the browser |

### 2.1 Browser Compatibility

**Recommended Browsers:**
- **Google Chrome** 90+ (Best performance)
- **Mozilla Firefox** 88+
- **Microsoft Edge** 90+
- **Apple Safari** 14+

**Mobile Browsers:**
- Safari on iOS 14+
- Chrome on Android 10+

---

## 3. Accessing the System

### 3.1 Opening the Application

1. Open any web browser on your computer, tablet, or smartphone
2. Navigate to: **https://sf-f.onrender.com**
3. The application homepage will load automatically
4. You can start searching flights immediately (no login required)

**Note**: The first load may take 15-30 seconds if the server is "waking up" from inactivity (free hosting limitation).

### 3.2 Guest vs Registered User

**Guest Users (No Account):**
- ✅ Search flights and view reliability scores
- ✅ View detailed itinerary information
- ✅ Filter and sort search results
- ✅ Track live flights by flight number
- ✅ Share itineraries via email
- ❌ Cannot save itineraries
- ❌ Cannot set price alerts
- ❌ No search history tracking

**Registered Users (Free Account):**
- ✅ All guest features, plus:
- ✅ Save unlimited itineraries
- ✅ Set price alerts for routes
- ✅ View search history
- ✅ Real-time sync across devices
- ✅ Manage saved data in profile

### 3.3 Creating an Account (Optional)

| Step | Action | Description |
|------|--------|-------------|
| 1 | Click Profile Tab | Navigate to the Profile tab in the top navigation bar |
| 2 | Select "Register" | Click on the "Create Account" section |
| 3 | Enter Email | Type a valid email address (will be used for verification) |
| 4 | Create Password | Enter a password (minimum 6 characters) |
| 5 | Confirm Password | Re-enter your password to confirm |
| 6 | Click Register | Click the "Create Account" button |
| 7 | Verify Email | Check your email inbox for verification link and click it |
| 8 | Start Using | Once verified, you can save itineraries and set alerts |

**NOTE — Email Verification**
- You must verify your email before saving itineraries or creating price alerts
- Check your spam folder if verification email doesn't arrive within 5 minutes
- Click "Resend Verification Email" if needed

### 3.4 Logging In

| Step | Action | Description |
|------|--------|-------------|
| 1 | Open Profile Tab | Click on the Profile tab in the navigation bar |
| 2 | Enter Email | Type your registered email address |
| 3 | Enter Password | Type your password (case-sensitive) |
| 4 | Click Login | Click the "Login" button |
| 5 | Access Features | You can now save itineraries and access saved data |

**NOTE — Login Issues**
- If you forgot your password, click "Forgot Password" and follow the reset instructions
- After multiple failed attempts, wait a few minutes before trying again
- Ensure your email is verified before accessing protected features

---

## 4. Searching for Flights

Flight search is the core feature of SmartFlight. You can search as a guest or logged-in user.

### 4.1 Basic Flight Search

| Step | Action | Description |
|------|--------|-------------|
| 1 | Select Trip Type | Choose One-way, Round-trip, or Multi-city at the top of the search form |
| 2 | Choose Origin Airport | Click the origin field and type airport name or code (e.g., "Kuala Lumpur" or "KUL"). Select from dropdown. |
| 3 | Choose Destination Airport | Click the destination field and select your arrival airport |
| 4 | Select Departure Date | Click the calendar icon and choose your travel date (cannot select past dates) |
| 5 | Select Return Date (if round-trip) | For round-trip, select return date after departure date |
| 6 | Click Search | Click the "Search Flights" button to begin the search |
| 7 | View Results | Wait 3-10 seconds for results with reliability scores |

### 4.2 Understanding Search Results

Each search result displays:

**Itinerary Card Information:**
- **Route**: Origin → Destination (e.g., KUL → SIN)
- **Reliability Score**: 0-10 score with color-coded badge
  - 🟢 **8.0-10.0** = RELIABLE (Green badge)
  - 🟡 **6.0-7.9** = CAUTION (Yellow badge)
  - 🔴 **0.0-5.9** = HIGH RISK (Red badge)
- **Connection Risk**: LOW / MEDIUM / HIGH
- **Price**: In Malaysian Ringgit (RM)
- **Stops**: Direct flight or number of connections
- **Duration**: Total travel time
- **View Details** button for complete information
- **Save** button (requires login)

### 4.3 Filtering and Sorting Results

**Sort Options:**
- Sort by Reliability (default): Shows most reliable flights first
- Sort by Price: Shows cheapest flights first

**Filter Options:**
- **By Airline**: Select specific airlines from dropdown
- **By Stops**: Direct only, 1 stop, or 2+ stops
- **By Time of Day**: Morning (6am-12pm), Afternoon (12pm-6pm), Evening (6pm-12am)

Filters update results instantly without new search.

### 4.4 Multi-City Search

For complex trips with multiple destinations:

1. Select "Multi-city" trip type
2. Add multiple flight legs (up to 5 legs)
3. For each leg, select:
   - Origin airport
   - Destination airport  
   - Departure date
4. Click "Search Flights"
5. System finds complete multi-city itinerary with overall reliability

---

## 5. Viewing Flight Details

Click "View Details" on any itinerary to see comprehensive flight information.

### 5.1 Itinerary Detail Modal

The detail view shows:

**Header Section:**
- Complete route with all connection points
- Departure date (formatted)
- Overall reliability score (large, prominent)
- Status badge (RELIABLE/CAUTION/HIGH RISK)

**Reliability Breakdown:**
- Disruption Risk: Likelihood of delays/cancellations
- Connection Risk: Assessment of layover times
- Route Complexity: Multi-leg journey evaluation
- Historical Performance: Airline track record

**Flight Legs Details:**
For each flight segment:
- **Flight Number**: e.g., MH602
- **Airline**: e.g., Malaysia Airlines
- **Departure**: Airport (KUL), city (Kuala Lumpur), time (09:00 AM)
- **Arrival**: Airport (SIN), city (Singapore), time (10:00 AM)
- **Duration**: Flight time (1h 0m)
- **Disruption Probability**: Percentage risk (e.g., 5%)

**Connection Information** (for multi-leg flights):
- Layover time between flights
- Connection risk level (LOW/MEDIUM/HIGH)
- Recommended minimum connection time

**Action Buttons:**
- **Save Itinerary**: Store for future reference (requires login + verification)
- **Set Price Alert**: Monitor price changes (requires login + verification)
- **Share via Email**: Send details via email (works for all users)
- **Close**: Return to search results

---

## 6. Saving Itineraries

Save your favorite flight options for future reference.

**Requirements:**
- ✅ Must have a registered account
- ✅ Email must be verified
- ✅ Must be logged in

### 6.1 How to Save an Itinerary

| Step | Action | Description |
|------|--------|-------------|
| 1 | Find Desired Flight | Search for flights and find one you want to save |
| 2 | Click "Save" | Click the "Save" button on the itinerary card OR view details and click "Save Itinerary" |
| 3 | Verify Status | Check for email verification if not already done |
| 4 | Confirm Save | Itinerary appears immediately in "Saved Itineraries" tab |
| 5 | Access Anytime | Navigate to "Saved" tab to view all saved itineraries |

**NOTE — Saved Itineraries**
- Itineraries are saved with all details: price, reliability score, flight numbers
- Saved data syncs in real-time across all your devices
- You can save unlimited itineraries
- Saved itineraries remain until you manually delete them

### 6.2 Managing Saved Itineraries

**Access Saved Itineraries:**
1. Click on "Saved Itineraries" tab in navigation
2. View all your saved flights in a grid layout
3. Each card shows:
   - Route and date
   - Reliability score
   - Price at time of saving
   - Date saved

**Actions Available:**
- **View Details**: Click to see complete flight information
- **Delete**: Remove from saved list (permanent)

---

## 7. Setting Price Alerts

Monitor flight prices and get notified when they drop.

**Requirements:**
- ✅ Must have a registered account
- ✅ Email must be verified
- ✅ Must be logged in

### 7.1 How to Set a Price Alert

| Step | Action | Description |
|------|--------|-------------|
| 1 | View Itinerary Details | Open the detail view for any flight |
| 2 | Click "Set Price Alert" | Click the "Set Price Alert" button |
| 3 | Enter Target Price | Input your desired price (must be lower than current price) |
| 4 | Confirm Alert | Click "Create Alert" to activate monitoring |
| 5 | Check Profile | Navigate to Profile tab to see active alerts |

### 7.2 Managing Price Alerts

**View Active Alerts:**
1. Go to Profile tab
2. Scroll to "Price Alerts" section
3. See all active alerts with:
   - Route (origin → destination)
   - Current price
   - Your target price
   - Potential savings
   - Date created

**Actions Available:**
- **Delete Alert**: Remove price monitoring (click trash icon)

**NOTE — Price Alert Notifications**
- Price monitoring is set up but notifications are planned for future release
- Current version: Check Profile tab manually to compare current vs target prices
- Future version: Email notifications when price drops below target

---

## 8. Live Flight Tracking

Track real-time flight status by flight number.

### 8.1 How to Track a Flight

| Step | Action | Description |
|------|--------|-------------|
| 1 | Go to Live Tracking Tab | Click "Live Tracking" in the navigation bar |
| 2 | Enter Flight Number | Type the flight number (e.g., "MH602", "AK1234") |
| 3 | Click "Track Flight" | Click the track button to search |
| 4 | View Flight Data | See real-time position, status, and details |

### 8.2 Understanding Flight Tracking Display

**Flight Status Badges:**
- 🟢 **IN AIR**: Flight currently airborne
- 🔵 **SCHEDULED**: Flight not yet departed
- 🟢 **LANDED**: Flight has arrived
- 🔴 **DELAYED**: Flight delayed from schedule

**Radar Visualization:**
- SVG circular radar display
- Route line from origin to destination
- Animated aircraft icon at current position
- Position updates in real-time

**Flight Metrics:**
- **Altitude**: Current height in feet (e.g., 35,000 ft)
- **Speed**: Ground speed in km/h (e.g., 850 km/h)
- **Progress**: Percentage complete (e.g., 65%)
- **ETA**: Estimated arrival time

**Airport Information:**
- **Departure**: Airport code, city, scheduled time, terminal, gate
- **Arrival**: Airport code, city, expected time, terminal, gate

**NOTE — Live Tracking**
- Works for guest users (no login required)
- Demo data is used for demonstration purposes
- Production version would integrate with real flight APIs

---

## 9. Search History

Automatically track all your flight searches (requires account).

### 9.1 Accessing Search History

1. Log in to your account
2. Navigate to Profile tab
3. Scroll to "Search History" section
4. View chronological list of past searches

**Each History Entry Shows:**
- Route searched (origin → destination)
- Travel date searched
- Number of results found
- Search timestamp
- Status (e.g., "Viewed")

### 9.2 Managing Search History

**Actions Available:**
- **Delete Individual Search**: Click trash icon next to any search
- **Clear All History**: Click "Clear All" button to remove entire history
- **Re-run Search**: Click on any history entry to repeat that search

**NOTE**
- Search history is created automatically when logged in
- Guest searches are not saved
- History syncs across all your devices in real-time

---

## 10. Sharing Itineraries

Share flight details with friends or family via email.

### 10.1 How to Share an Itinerary

| Step | Action | Description |
|------|--------|-------------|
| 1 | View Itinerary Details | Open any flight's detail view |
| 2 | Click Share Button | Click "Share via Email" button |
| 3 | Email Client Opens | System opens your default email application with pre-filled content |
| 4 | Add Recipients | Enter recipient email addresses |
| 5 | Send Email | Review and send the email |

**Shared Email Contains:**
- Complete route information
- Flight numbers and airlines
- Departure and arrival times
- Reliability score and status
- Price
- All connection details

**NOTE**
- Uses browser `mailto:` protocol (no external email service)
- Works with any email client (Gmail, Outlook, Apple Mail, etc.)
- No itinerary data is stored on external servers
- Available to both guest and logged-in users

---

## 11. User Profile Management

### 11.1 Viewing Your Profile

1. Click on "Profile" tab in navigation
2. View your account information:
   - Email address
   - Email verification status
   - Account creation date

### 11.2 Email Verification

**If Not Verified:**
1. Look for "Email Not Verified" warning
2. Click "Resend Verification Email" button
3. Check your inbox (and spam folder)
4. Click verification link in email
5. Return to SmartFlight and refresh

**Verification is Required For:**
- Saving itineraries
- Setting price alerts
- All write operations to database

### 11.3 Password Management

**Change Password:**
Currently handled through Firebase Authentication. For password reset:
1. Log out from your account
2. On login screen, click "Forgot Password"
3. Enter your registered email
4. Check email for password reset link
5. Follow instructions to set new password

### 11.4 Logging Out

| Step | Action | Description |
|------|--------|-------------|
| 1 | Go to Profile Tab | Click on Profile in navigation |
| 2 | Click Logout | Click the "Logout" button at bottom of profile section |
| 3 | Session Ended | You will be logged out and returned to guest mode |

**SECURITY REMINDER**
- Always log out when using public or shared computers
- Do not share your login credentials with anyone
- System auto-logs out after 30 minutes of inactivity

---

## 12. Reliability Score Explained

SmartFlight's reliability score (0-10) is calculated using multiple factors:

### 12.1 Score Components

**1. Disruption Probability (Weight: 5x)**
- Historical airline performance
- Route-specific delay patterns
- Seasonal weather impact
- Time-of-day variations

**2. Connection Risk (Weight: varies)**
- **LOW Risk (0 penalty)**: Layover ≥ 90 min (major airports) or ≥ 60 min (smaller airports)
- **MEDIUM Risk (-1.5 penalty)**: Tight connection, requires quick movement
- **HIGH Risk (-3.0 penalty)**: Insufficient time, high chance of missing connection

**3. Route Complexity (Weight: 0.5 per connection)**
- Each additional connection reduces score slightly
- Direct flights scored highest
- 2+ connections penalized more

**4. Time-of-Day Adjustments (Weight: 0.3)**
- Early morning (before 6 AM) or late night (after 10 PM) flights penalized
- Peak hours (8 AM - 6 PM) scored neutrally

### 12.2 Score Interpretation

| Score Range | Status | Badge Color | Recommendation |
|-------------|--------|-------------|----------------|
| 8.0 - 10.0 | RELIABLE | 🟢 Green | Book with confidence |
| 6.0 - 7.9 | CAUTION | 🟡 Yellow | Consider alternatives |
| 0.0 - 5.9 | HIGH RISK | 🔴 Red | High chance of issues |

**Example Calculations:**

**Direct Flight, Reputable Airline, Afternoon:**
- Base Score: 10.0
- Disruption Probability: 5% = -0.25
- Connections: 0
- Time: Afternoon = 0
- **Final Score: 9.75 (RELIABLE)**

**Two Connections, Tight Layovers:**
- Base Score: 10.0
- Disruption Probability: 10% = -0.50
- Connection 1 Risk: MEDIUM = -1.5
- Connection 2 Risk: HIGH = -3.0
- Route Complexity: 2 connections = -1.0
- **Final Score: 4.0 (HIGH RISK)**

---

## 13. Understanding Connection Risk

Connection risk assesses whether layover times are sufficient to make connecting flights.

### 13.1 Risk Levels

**LOW RISK** 🟢
- **Major Airports** (JFK, LAX, LHR, CDG, DXB, HKG): ≥ 90 minutes
- **Smaller Airports**: ≥ 60 minutes
- Plenty of time for immigration, security, gate changes
- Low stress, recommended

**MEDIUM RISK** 🟡
- **Major Airports**: 60-89 minutes
- **Smaller Airports**: 45-59 minutes
- Requires quick movement through airport
- May be stressful if delays occur
- Consider only if experienced traveler

**HIGH RISK** 🔴
- **Major Airports**: < 60 minutes
- **Smaller Airports**: < 45 minutes
- Very tight connection, high chance of missing flight
- Not recommended unless same terminal and no immigration
- Airline may not guarantee connection

### 13.2 Factors Considered

- **Airport Size**: Major hubs need more connection time
- **Terminal Changes**: Different terminals require extra time
- **Immigration**: International connections need 30+ extra minutes
- **Security Screening**: Time needed for re-screening
- **Airline Policies**: Minimum connection times vary

---

## 14. Responsive Design

SmartFlight adapts to your device screen size automatically.

### 14.1 Desktop View (1024px+)
- 3-column search results grid
- Full navigation bar at top
- Large charts and visualizations
- Hover effects on buttons and cards
- Side-by-side comparison views

### 14.2 Tablet View (641-1024px)
- 2-column search results grid
- Maintained navigation bar
- Optimized modal sizes
- Touch-friendly button sizes

### 14.3 Mobile View (375-640px)
- Single column layout
- Vertical tab navigation
- Touch-optimized buttons (minimum 44px)
- Collapsible filter sections
- Simplified itinerary cards
- Full-screen modals

---

## 15. Troubleshooting

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Page loads slowly on first visit | Server "cold start" from inactivity | Wait 15-30 seconds for initial load (Render free tier limitation) |
| Cannot find airport | Incorrect code or name | Use common name (e.g., "Kuala Lumpur") or IATA code (e.g., "KUL") |
| No search results | Invalid date or route | Check date is in future, airports are correct |
| Cannot save itinerary | Email not verified | Check Profile tab, click "Resend Verification Email" |
| Cannot set price alert | Target price too high | Target price must be lower than current price |
| Page not loading | Browser cache issue | Clear browser cache (Ctrl+Shift+Delete) and refresh |
| Saved data not appearing | Not logged in or sync delay | Ensure logged in, wait 2-3 seconds for sync |
| Search results not filtering | Browser JavaScript disabled | Enable JavaScript in browser settings |
| Email not received | Spam folder or wrong email | Check spam, verify email address in profile |

---

## 16. Glossary

| Term | Definition |
|------|------------|
| **SmartFlight** | Web-based flight search system prioritizing reliability over price |
| **Reliability Score** | 0-10 rating indicating probability of successful, on-time flight completion |
| **Connection Risk** | Assessment (LOW/MEDIUM/HIGH) of whether layover time is sufficient |
| **Disruption Probability** | Likelihood (0-100%) of delays, cancellations, or other issues |
| **IATA Code** | Three-letter airport identifier (e.g., KUL, SIN, LHR) |
| **Itinerary** | Complete flight route including all legs from origin to destination |
| **Flight Leg** | Single flight segment with one flight number and airline |
| **Layover** | Time between connecting flights at intermediate airport |
| **Guest User** | Unauthenticated visitor who can search but not save data |
| **Registered User** | Account holder who can save itineraries and set alerts |
| **Email Verification** | Process confirming account email ownership via link |
| **Price Alert** | User-configured monitoring for fare changes on specific route |
| **Search History** | Automatic record of past flight searches (requires login) |
| **Live Tracking** | Real-time monitoring of flight position and status |
| **Firestore** | Cloud database storing user data with real-time sync |

---

## 17. Frequently Asked Questions (FAQ)

**Q: Is SmartFlight free to use?**  
A: Yes, completely free. No hidden fees or premium tiers.

**Q: Do I need to create an account?**  
A: No, you can search flights as a guest. Account is optional for saving data.

**Q: Can I book flights through SmartFlight?**  
A: No, SmartFlight is a search and planning tool. Use information to book with airlines directly.

**Q: How accurate are reliability scores?**  
A: Scores are estimates based on multiple factors. Always verify with airlines before booking.

**Q: Why do I need email verification?**  
A: Prevents spam accounts and ensures price alert notifications reach you (future feature).

**Q: Does SmartFlight store my payment information?**  
A: No, SmartFlight does not process payments or store financial data.

**Q: Can I use SmartFlight on my phone?**  
A: Yes, fully responsive design works on all mobile browsers.

**Q: Is my data private?**  
A: Yes, data is secured with Firebase. Only you can access your saved itineraries and alerts.

**Q: What happens if I forget my password?**  
A: Use "Forgot Password" on login screen to receive reset link via email.

**Q: Can I delete my account?**  
A: Contact support to request account deletion. All your data will be permanently removed.

---

## 18. Tips for Best Results

**Search Strategy:**
- ✅ Search flights 2-4 weeks in advance for best options
- ✅ Compare multiple airlines for same route
- ✅ Check reliability scores before focusing on price
- ✅ Consider direct flights for higher reliability
- ✅ Avoid connections with MEDIUM or HIGH risk if possible

**Connection Tips:**
- ✅ Allow 2+ hours for international connections
- ✅ Check if terminals differ for connections
- ✅ Consider visa requirements for layover countries
- ✅ Book all legs on one ticket when possible

**Using Reliability Scores:**
- ✅ Prioritize flights with 8.0+ scores for important trips
- ✅ Review detailed breakdown to understand risk factors
- ✅ Consider 7.0-7.9 scores acceptable for flexible travel
- ✅ Avoid <6.0 scores unless no alternatives exist

**Account Features:**
- ✅ Verify email immediately after registration
- ✅ Save promising itineraries for comparison
- ✅ Set realistic target prices for alerts
- ✅ Review search history to track price trends

---

## 19. Privacy and Data Security

**Data Collection:**
- Email address (for authentication only)
- Saved itineraries (user-initiated)
- Price alerts (user-initiated)
- Search history (automatic for logged-in users)

**Data NOT Collected:**
- Real names or personal identifiers (beyond email)
- Payment information (no booking functionality)
- Location data or device tracking
- Browsing history outside SmartFlight

**Data Protection:**
- HTTPS encryption for all communications
- Firebase Authentication for secure login
- Firestore Security Rules prevent unauthorized access
- Data cannot be accessed by other users

**Your Rights:**
- View all your saved data in Profile tab
- Delete itineraries, alerts, or history anytime
- Request account deletion (contact support)
- Data is NOT shared with third parties

---

## 20. Support & Contact

For questions, issues, or feedback:

**Project Information:**
- **System**: SmartFlight - Flight Search and Management System
- **Version**: 2.0
- **Platform**: Web Application
- **Live URL**: https://sf-f.onrender.com
- **GitHub**: https://github.com/WCYG22/SF_F

**Developer Contact:**
- **Name**: Wong Cheng Yong
- **Email**: wongchengyong100@gmail.com
- **GitHub**: @WCYG22
- **Institution**: University of Wollongong Malaysia KDU

**Support Channels:**
- **Bug Reports**: GitHub Issues (https://github.com/WCYG22/SF_F/issues)
- **Feature Requests**: Email or GitHub Issues
- **General Questions**: Email support

**Academic Project Note:**
SmartFlight is a Final Year Project (FYP) developed for academic purposes. The system demonstrates flight search with reliability assessment using modern web technologies. Demo data is used for demonstration purposes.

---

## 21. Known Limitations

**Current Limitations:**
- Search uses demo/simulated flight data (not real-time airline data)
- Price alerts are set up but email notifications not yet implemented
- No actual booking functionality (search and planning only)
- English language only (no multi-language support)
- Limited to free tier hosting (may have cold start delays)

**Planned Enhancements (Future Versions):**
- Integration with real flight data APIs
- Email notifications for price alerts
- Multi-language support (Malay, Chinese, Tamil)
- Native mobile apps (iOS and Android)
- Trip planning with hotels and car rentals
- Social features (share trips with friends)

---

## 22. Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | December 2024 | Initial release with basic flight search |
| 1.5 | December 2024 | Added save itinerary and price alert features |
| 2.0 | January 2025 | Complete system with live tracking, search history, and enhanced UI |

---

## 23. Acknowledgments

**Technologies Used:**
- **Frontend**: React 19, TypeScript 5.8, Tailwind CSS 4
- **Backend**: Express.js 4.21, Node.js 20
- **Database**: Firebase Cloud Firestore
- **Authentication**: Firebase Authentication
- **Hosting**: Render Platform
- **Build Tools**: Vite 6.4, ESBuild

**Special Thanks:**
- University of Wollongong Malaysia KDU
- Project supervisors and mentors
- Firebase and Render for free tier services
- Open source community for libraries and tools

---

**End of User Manual — SmartFlight Flight Search and Management System**

**Version 2.0 | January 2025**

For the latest updates and documentation, visit: https://github.com/WCYG22/SF_F
