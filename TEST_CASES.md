# 7.6 Test Cases

## 7.6.1 User Registration

| Test Case ID | TC-01-001 |
|--------------|-----------|
| **Test Case Name** | Validate User Registration with Email and Password |
| **Related Feature ID** | F001 - User Authentication |
| **Objective** | 1. To test valid email and password registration<br>2. To test invalid inputs (empty fields, weak password, invalid email format) |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Email = "user@example.com"<br>Password = "Pass123456"<br>Confirm Password = "Pass123456" | System accepts input and creates account with success message | System accepts input and creates account with success message | Pass |
| 2 | Email = "invalid-email"<br>Password = "Pass123456" | System displays error message "Invalid email format" | System displays error message "Invalid email format" | Pass |
| 3 | Email = "user@example.com"<br>Password = "12345" | System displays error message "Password must be at least 6 characters" | System displays error message "Password must be at least 6 characters" | Pass |
| 4 | Email = ""<br>Password = "Pass123456" | System displays error message "Email and password are required" | System displays error message "Email and password are required" | Pass |
| 5 | Email = "user@example.com"<br>Password = "Pass123"<br>Confirm = "Pass456" | System displays error message "Passwords do not match" | System displays error message "Passwords do not match" | Pass |

*Table 7.25: Test Case - Validate User Registration*

---

## 7.6.2 User Login

| Test Case ID | TC-02-001 |
|--------------|-----------|
| **Test Case Name** | Validate User Login Authentication |
| **Related Feature ID** | F001 - User Authentication |
| **Objective** | 1. To test valid email and password login<br>2. To test invalid credentials (wrong password, non-existent email) |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Email = "registered@example.com"<br>Password = "CorrectPass123" | System authenticates user and redirects to main application | System authenticates user successfully | Pass |
| 2 | Email = "registered@example.com"<br>Password = "WrongPassword" | System displays error message "Invalid email or password" | System displays error message "Invalid email or password" | Pass |
| 3 | Email = "nonexistent@example.com"<br>Password = "AnyPassword" | System displays error message "Invalid email or password" | System displays error message "Invalid email or password" | Pass |
| 4 | Email = ""<br>Password = "" | System displays error message "Email and password are required" | System displays error message "Email and password are required" | Pass |

*Table 7.26: Test Case - Validate User Login*

---

## 7.6.3 Flight Search

| Test Case ID | TC-03-001 |
|--------------|-----------|
| **Test Case Name** | Validate Flight Search Input Fields |
| **Related Feature ID** | F002 - Flight Search |
| **Objective** | 1. To test valid airport selection and date selection<br>2. To test invalid inputs (empty origin, empty destination, empty date) |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Origin = "KUL"<br>Destination = "SIN"<br>Date = "2025-02-15" | System accepts input and executes search, displays results | System executes search and displays 5 flight results | Pass |
| 2 | Origin = ""<br>Destination = "SIN"<br>Date = "2025-02-15" | System displays error message "Please select departure, destination, and travel date" | System displays error message as expected | Pass |
| 3 | Origin = "KUL"<br>Destination = ""<br>Date = "2025-02-15" | System displays error message "Please select departure, destination, and travel date" | System displays error message as expected | Pass |
| 4 | Origin = "KUL"<br>Destination = "SIN"<br>Date = "" | System displays error message "Please select departure, destination, and travel date" | System displays error message as expected | Pass |
| 5 | Origin = "KUL"<br>Destination = "KUL"<br>Date = "2025-02-15" | System accepts same origin and destination (allowed for testing) | System accepts input and executes search | Pass |

*Table 7.27: Test Case - Validate Flight Search Input*

---

## 7.6.4 Trip Type Selection

| Test Case ID | TC-04-001 |
|--------------|-----------|
| **Test Case Name** | Validate Trip Type Selection |
| **Related Feature ID** | F002 - Flight Search |
| **Objective** | 1. To test valid trip type selection: One-way, Return, Multi-city<br>2. To verify system behavior changes based on trip type |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Trip Type = "One-way" | System shows origin, destination, and departure date fields only | System displays one-way search fields | Pass |
| 2 | Trip Type = "Return" | System shows origin, destination, departure date, and return date fields | System displays return trip fields | Pass |
| 3 | Trip Type = "Multi-city" | System shows multiple leg inputs with add/remove functionality | System displays multi-city interface | Pass |
| 4 | Trip Type = "Return"<br>Return Date = (before departure) | System prevents return date selection before departure date | Calendar disables dates before departure | Pass |

*Table 7.28: Test Case - Validate Trip Type Selection*

---

## 7.6.5 Search Results Display

| Test Case ID | TC-05-001 |
|--------------|-----------|
| **Test Case Name** | Validate Search Results Display and Information |
| **Related Feature ID** | F002 - Flight Search |
| **Objective** | 1. To verify search results display correctly with all required information<br>2. To verify reliability scores and status badges are shown |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Execute valid search | System displays 4-5 flight itineraries with prices | System displays 5 results | Pass |
| 2 | Check result card | Each result shows origin, destination, price, reliability score | All information displayed correctly | Pass |
| 3 | Check reliability score | Each result shows reliability score out of 10 (e.g., 8.5/10) | Scores displayed: 9.2, 8.5, 7.8, 6.5, 5.2 | Pass |
| 4 | Check status badge | Each result shows status badge (RELIABLE/CAUTION/HIGH RISK) with color | Status badges displayed with correct colors | Pass |
| 5 | Check price display | Prices displayed in RM currency format | Prices shown: RM185, RM320, RM280, etc. | Pass |

*Table 7.29: Test Case - Validate Search Results Display*

---

## 7.6.6 Sorting and Filtering

| Test Case ID | TC-06-001 |
|--------------|-----------|
| **Test Case Name** | Validate Results Sorting and Filtering |
| **Related Feature ID** | F003 - Search Filters |
| **Objective** | 1. To test sort by reliability and sort by price<br>2. To test filtering by airline, stops, and time of day |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Sort By = "Reliability" | Results ordered by reliability score (highest first) | Results sorted: 9.2, 8.5, 7.8, 6.5, 5.2 | Pass |
| 2 | Sort By = "Price" | Results ordered by price (lowest first) | Results sorted by ascending price | Pass |
| 3 | Filter Airline = "Malaysia Airlines" | Only Malaysia Airlines flights shown | Filtered results display only MH flights | Pass |
| 4 | Filter Stops = "Direct Only" | Only direct flights (0 stops) shown | Results show only single-leg flights | Pass |
| 5 | Filter Time = "Morning" | Only flights departing 6:00-11:59 shown | Results filtered by departure time | Pass |

*Table 7.30: Test Case - Validate Sorting and Filtering*

---

## 7.6.7 View Itinerary Details

| Test Case ID | TC-07-001 |
|--------------|-----------|
| **Test Case Name** | Validate Itinerary Detail View |
| **Related Feature ID** | F004 - Itinerary Details |
| **Objective** | 1. To test itinerary detail modal opens correctly<br>2. To verify all flight leg information is displayed |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Click "View Details" on search result | Detail modal opens with full itinerary information | Modal opened successfully | Pass |
| 2 | Check flight legs | All legs displayed with flight numbers, airlines, times | All leg information displayed correctly | Pass |
| 3 | Check reliability breakdown | Shows reliability score factors and explanations | Breakdown displayed with factors | Pass |
| 4 | Check connection info | For multi-leg flights, shows layover times | Connection times displayed: 2h 30m layover | Pass |
| 5 | Click "Close" button | Modal closes and returns to results page | Modal closed successfully | Pass |

*Table 7.31: Test Case - Validate Itinerary Details*

---

## 7.6.8 Save Itinerary

| Test Case ID | TC-08-001 |
|--------------|-----------|
| **Test Case Name** | Validate Save Itinerary Functionality |
| **Related Feature ID** | F005 - Save Itinerary |
| **Objective** | 1. To test authenticated users can save itineraries<br>2. To test unauthenticated users receive appropriate error |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | User logged in (verified)<br>Click "Save" on itinerary | Itinerary saved to user account successfully | Itinerary saved to Firestore | Pass |
| 2 | User not logged in<br>Click "Save" | System displays error "User login and authentication are required" | Error message displayed, redirected to profile | Pass |
| 3 | User logged in (unverified email)<br>Click "Save" | System displays error "Valid email verification is required" | Error message displayed | Pass |
| 4 | Navigate to Saved tab | Previously saved itinerary appears in list | Saved itinerary displayed in list | Pass |
| 5 | Click delete on saved item | Itinerary removed from saved list |  | Pass |

*Table 7.32: Test Case - Validate Save Itinerary*

---

## 7.6.9 Set Price Alert

| Test Case ID | TC-09-001 |
|--------------|-----------|
| **Test Case Name** | Validate Price Alert Creation |
| **Related Feature ID** | F006 - Price Alerts |
| **Objective** | 1. To test price alert creation with valid target price<br>2. To test invalid target price inputs (higher than current, zero, negative) |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Current Price = RM200<br>Target Price = RM150 | System creates alert and shows confirmation message | Alert created: "You'll be notified when price drops to RM150" | Pass |
| 2 | Current Price = RM200<br>Target Price = RM250 | System displays error "Target price must be lower than current price" | Error message displayed | Pass |
| 3 | Current Price = RM200<br>Target Price = RM0 | System displays error "Please enter a valid price" | Error message displayed | Pass |
| 4 | Current Price = RM200<br>Target Price = "" (empty) | System displays error "Please enter a valid price" | Error message displayed | Pass |
| 5 | Navigate to Profile > Price Alerts | Created alert appears in active alerts list | Alert displayed with route and prices | Pass |

*Table 7.33: Test Case - Validate Price Alert Creation*

---

## 7.6.10 Live Flight Tracking

| Test Case ID | TC-10-001 |
|--------------|-----------|
| **Test Case Name** | Validate Live Flight Tracking |
| **Related Feature ID** | F007 - Live Tracking |
| **Objective** | 1. To test flight tracking with valid flight number<br>2. To test invalid flight number inputs |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Flight Number = "MH123" | System displays flight tracking information with radar visualization | Flight data displayed with status, position, metrics | Pass |
| 2 | Flight Number = "" (empty) | System displays error "Please enter a flight number" | Error message displayed | Pass |
| 3 | Check flight header | Displays flight number and airline name | Header shows "MH123 - Malaysia Airlines" | Pass |
| 4 | Check flight status | Shows current status (IN AIR/SCHEDULED/LANDED) | Status badge displays "IN AIR" | Pass |
| 5 | Check radar visualization | SVG radar shows flight path with moving plane icon | Radar visualization displayed correctly | Pass |
| 6 | Check flight metrics | Displays altitude, speed, progress percentage | Metrics shown: 31000ft, 810kph, 47% | Pass |

*Table 7.34: Test Case - Validate Live Flight Tracking*

---

## 7.6.11 Email Verification

| Test Case ID | TC-11-001 |
|--------------|-----------|
| **Test Case Name** | Validate Email Verification Process |
| **Related Feature ID** | F008 - Email Verification |
| **Objective** | 1. To test email verification status checking<br>2. To test resend verification email functionality<br>3. To test access restrictions for unverified users |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | User registered with unverified email<br>Attempt to save itinerary | System displays error "Valid email verification is required" | Error message displayed | Pass |
| 2 | User registered with unverified email<br>Click "Resend Verification" | System sends new verification email and shows confirmation | Confirmation: "Verification email resent!" | Pass |
| 3 | Unverified user tries to set price alert | System displays error "Valid email verification is required" | Error message displayed | Pass |
| 4 | User clicks verification link in email<br>Returns to app | System shows "Email has been successfully verified!" | Success message displayed | Pass |

*Table 7.35: Test Case - Validate Email Verification*

---

## 7.6.12 Password Reset

| Test Case ID | TC-12-001 |
|--------------|-----------|
| **Test Case Name** | Validate Password Reset Functionality |
| **Related Feature ID** | F001 - User Authentication |
| **Objective** | 1. To test password reset with valid email<br>2. To test password reset with invalid/non-existent email |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Email = "registered@example.com"<br>Click "Forgot Password" | System sends password reset email and shows confirmation | Confirmation: "Password reset email sent! Check your inbox" | Pass |
| 2 | Email = "nonexistent@example.com"<br>Click "Forgot Password" | System displays error "No account found with this email address" | Error message displayed | Pass |
| 3 | Email = "" (empty)<br>Click "Forgot Password" | System displays error "Email is required for password recovery" | Error message displayed | Pass |
| 4 | Email = "invalid-format"<br>Click "Forgot Password" | System displays error "The email address has an invalid format" | Error message displayed | Pass |

*Table 7.36: Test Case - Validate Password Reset*

---

## 7.6.13 Search History Tracking

| Test Case ID | TC-13-001 |
|--------------|-----------|
| **Test Case Name** | Validate Search History Recording and Display |
| **Related Feature ID** | F009 - Search History |
| **Objective** | 1. To test search history is automatically recorded after searches<br>2. To test search history display in profile<br>3. To test delete search history functionality |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | User logged in<br>Execute search: KUL to SIN | Search recorded in history with origin, destination, date, result count | Search history saved to Firestore | Pass |
| 2 | Navigate to Profile > Search History | Previous searches displayed in chronological order (newest first) | History displayed with all searches | Pass |
| 3 | Click delete on specific history item | Selected history item removed from list | Item deleted from Firestore | Pass |
| 4 | Execute same search twice | Both searches appear in history (duplicates allowed) | Both searches recorded separately | Pass |
| 5 | User not logged in<br>Execute search | Search not recorded in history | No history saved (requires login) | Pass |

*Table 7.37: Test Case - Validate Search History*

---

## 7.6.14 Multi-City Trip Planning

| Test Case ID | TC-14-001 |
|--------------|-----------|
| **Test Case Name** | Validate Multi-City Trip Configuration |
| **Related Feature ID** | F010 - Multi-City Search |
| **Objective** | 1. To test adding and removing city legs<br>2. To test multi-city search with multiple destinations<br>3. To test validation for incomplete leg information |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Trip Type = "Multi-city"<br>Default state | System shows 2 legs initially | 2 leg inputs displayed | Pass |
| 2 | Click "Add Another City" | New leg added, total 3 legs | Third leg added successfully | Pass |
| 3 | Click "Remove" on leg | Selected leg removed (minimum 2 legs maintained) | Leg removed, 2 legs remain | Pass |
| 4 | Leg 1: KUL to SIN<br>Leg 2: SIN to BKK<br>Click Search | System searches both legs and displays combined results | Results from both legs displayed | Pass |
| 5 | Leg 1: KUL to SIN<br>Leg 2: Empty<br>Click Search | System displays error "Please complete all fields for each leg" | Error message displayed | Pass |

*Table 7.38: Test Case - Validate Multi-City Trip Planning*

---

## 7.6.15 Return Trip Search

| Test Case ID | TC-15-001 |
|--------------|-----------|
| **Test Case Name** | Validate Return Trip Search |
| **Related Feature ID** | F002 - Flight Search |
| **Objective** | 1. To test return trip search displays both outbound and return results<br>2. To test return date validation |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Trip Type = "Return"<br>Origin = KUL, Dest = SIN<br>Depart = 2025-02-15<br>Return = 2025-02-22 | System displays outbound results and return results separately | Both result sets displayed | Pass |
| 2 | Trip Type = "Return"<br>Return date = "" (empty) | System displays error "Please select return date" | Error message displayed | Pass |
| 3 | Outbound results section | Shows flights KUL → SIN on departure date | Outbound results displayed correctly | Pass |
| 4 | Return results section | Shows flights SIN → KUL on return date | Return results displayed correctly | Pass |
| 5 | Apply filter to results | Filter applies to both outbound and return results | Both sections filtered correctly | Pass |

*Table 7.39: Test Case - Validate Return Trip Search*

---

## 7.6.16 Reliability Score Display

| Test Case ID | TC-16-001 |
|--------------|-----------|
| **Test Case Name** | Validate Reliability Score Calculation and Display |
| **Related Feature ID** | F011 - Reliability Scoring |
| **Objective** | 1. To verify reliability scores are calculated correctly<br>2. To verify score ranges map to correct status (RELIABLE/CAUTION/HIGH RISK)<br>3. To verify color coding matches status |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Itinerary with score 9.2 | Status badge shows "RELIABLE" with green color | Badge: "RELIABLE" (green) | Pass |
| 2 | Itinerary with score 7.5 | Status badge shows "CAUTION" with yellow color | Badge: "CAUTION" (yellow) | Pass |
| 3 | Itinerary with score 5.2 | Status badge shows "HIGH RISK" with red color | Badge: "HIGH RISK" (red) | Pass |
| 4 | View itinerary details | Reliability breakdown shows contributing factors | Breakdown displayed: Disruption Risk, Connection Risk, Route Complexity | Pass |
| 5 | Direct flight vs connection | Direct flight has higher reliability score | Direct: 9.2, Connection: 7.5 | Pass |

*Table 7.40: Test Case - Validate Reliability Score*

---

## 7.6.17 Connection Risk Assessment

| Test Case ID | TC-17-001 |
|--------------|-----------|
| **Test Case Name** | Validate Connection Risk Calculation |
| **Related Feature ID** | F011 - Reliability Scoring |
| **Objective** | 1. To verify connection risk is calculated based on layover time<br>2. To verify different airport types have different thresholds |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Standard airport<br>Layover = 70 minutes | Connection Risk = "LOW" (≥60 min safe) | Risk: "LOW" displayed | Pass |
| 2 | Standard airport<br>Layover = 50 minutes | Connection Risk = "MEDIUM" (45-60 min) | Risk: "MEDIUM" displayed | Pass |
| 3 | Standard airport<br>Layover = 40 minutes | Connection Risk = "HIGH" (<45 min) | Risk: "HIGH" displayed | Pass |
| 4 | Complex airport (LHR)<br>Layover = 95 minutes | Connection Risk = "LOW" (≥90 min safe) | Risk: "LOW" displayed | Pass |
| 5 | Complex airport (LHR)<br>Layover = 70 minutes | Connection Risk = "MEDIUM" (60-90 min) | Risk: "MEDIUM" displayed | Pass |

*Table 7.41: Test Case - Validate Connection Risk*

---

## 7.6.18 Session Persistence

| Test Case ID | TC-18-001 |
|--------------|-----------|
| **Test Case Name** | Validate Session Persistence and Auto-Login |
| **Related Feature ID** | F001 - User Authentication |
| **Objective** | 1. To test user session persists after browser refresh<br>2. To test auto-login on return visits<br>3. To test logout clears session |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | User logs in<br>Refresh browser (F5) | User remains logged in after refresh | User still authenticated | Pass |
| 2 | User logs in<br>Close browser<br>Reopen browser | User automatically logged in on return | Session restored | Pass |
| 3 | User clicks "Logout" | User logged out, redirected to login screen | Logged out successfully | Pass |
| 4 | After logout<br>Refresh browser | User remains logged out | Still logged out | Pass |
| 5 | After logout<br>Try to access saved itineraries | System displays login prompt | Access denied, login required | Pass |

*Table 7.42: Test Case - Validate Session Persistence*

---

## 7.6.19 Real-Time Data Synchronization

| Test Case ID | TC-19-001 |
|--------------|-----------|
| **Test Case Name** | Validate Real-Time Firestore Synchronization |
| **Related Feature ID** | F012 - Data Synchronization |
| **Objective** | 1. To test saved itineraries sync across browser tabs<br>2. To test price alerts sync in real-time<br>3. To test search history updates live |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Open app in Tab A<br>Save itinerary in Tab A<br>Check Tab B | Tab B shows newly saved itinerary without refresh | Itinerary appears in Tab B automatically | Pass |
| 2 | Delete itinerary in Tab A<br>Check Tab B | Tab B removes deleted itinerary without refresh | Itinerary removed from Tab B automatically | Pass |
| 3 | Create price alert in Tab A<br>Check Tab B Profile > Alerts | Tab B shows new alert without refresh | Alert appears in Tab B automatically | Pass |
| 4 | Execute search in Tab A<br>Check Tab B Search History | Tab B shows new search in history | History updated in Tab B | Pass |

*Table 7.43: Test Case - Validate Real-Time Synchronization*

---

## 7.6.20 Search Results Caching

| Test Case ID | TC-20-001 |
|--------------|-----------|
| **Test Case Name** | Validate Search Results Caching |
| **Related Feature ID** | F013 - Performance Optimization |
| **Objective** | 1. To test repeated searches return cached results<br>2. To test cache expiration after 30 minutes<br>3. To test cache invalidation on parameter change |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Search: KUL to SIN (first time)<br>Wait for results | System fetches from backend, displays results, caches data | Results loaded, cache stored | Pass |
| 2 | Search: KUL to SIN (repeat immediately) | System returns cached results instantly (no loading) | Instant results from cache | Pass |
| 3 | Search: KUL to BKK (different route) | System fetches new data from backend | New backend request made | Pass |
| 4 | Wait 31 minutes<br>Search: KUL to SIN (same as #1) | Cache expired, system fetches fresh data | New backend request made | Pass |
| 5 | Check browser sessionStorage | Cache entries stored with timestamps | Cache data present with TTL | Pass |

*Table 7.44: Test Case - Validate Search Caching*



---

## 7.6.21 Itinerary Comparison

| Test Case ID | TC-21-001 |
|--------------|-----------|
| **Test Case Name** | Validate Itinerary Comparison Functionality |
| **Related Feature ID** | F014 - Itinerary Comparison |
| **Objective** | 1. To test selecting multiple itineraries for comparison<br>2. To test side-by-side comparison view displays correctly<br>3. To test comparison highlights best values |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Check checkbox on first itinerary | Itinerary selected for comparison | Checkbox checked, selection stored | Pass |
| 2 | Check checkbox on second itinerary | Second itinerary added to comparison list | Two itineraries selected | Pass |
| 3 | Click "Compare Selected" button | Comparison modal opens with both itineraries | Modal displays side-by-side comparison | Pass |
| 4 | Check comparison displays price | Both prices shown, lowest highlighted | Prices displayed, best value highlighted | Pass |
| 5 | Check comparison displays reliability | Both scores shown, highest highlighted | Scores displayed, best highlighted | Pass |
| 6 | Check comparison displays duration | Both durations shown, shortest highlighted | Durations displayed correctly | Pass |
| 7 | Try to select 4th itinerary | System displays error "Maximum 3 itineraries" | Error message displayed | Pass |
| 8 | Click "Close Comparison" | Modal closes, returns to results | Closed successfully | Pass |

*Table 7.45: Test Case - Validate Itinerary Comparison*

---

## 7.6.22 Email Sharing

| Test Case ID | TC-22-001 |
|--------------|-----------|
| **Test Case Name** | Validate Email Sharing Functionality |
| **Related Feature ID** | F015 - Email Sharing |
| **Objective** | 1. To test email sharing opens mail client correctly<br>2. To verify email content includes all itinerary details |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Open itinerary detail<br>Click "Share via Email" | Default mail client opens with pre-populated content | Mail client opened (mailto: link) | Pass |
| 2 | Check email subject line | Subject contains route information | Subject: "Flight Itinerary: KUL to SIN" | Pass |
| 3 | Check email body route info | Body shows origin and destination | Route information included | Pass |
| 4 | Check email body price | Body shows flight price | Price: RM185 included | Pass |
| 5 | Check email body reliability | Body shows reliability score | Score: 8.5/10 included | Pass |
| 6 | Check email body flight details | Body lists all flight legs with times | All legs detailed in body | Pass |
| 7 | Check email formatting | Content is readable and well-formatted | Clean text formatting | Pass |

*Table 7.46: Test Case - Validate Email Sharing*

---

## 7.6.23 User Logout

| Test Case ID | TC-23-001 |
|--------------|-----------|
| **Test Case Name** | Validate User Logout Functionality |
| **Related Feature ID** | F001 - User Authentication |
| **Objective** | 1. To test user logout clears session correctly<br>2. To verify protected features become inaccessible after logout |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | User logged in<br>Click "Logout" button | User logged out successfully | Logged out, redirected to login | Pass |
| 2 | Check authentication state | User state set to null | User = null in state | Pass |
| 3 | Try to access Saved tab | Redirected to login or shows login prompt | Access denied, login required | Pass |
| 4 | Check Profile tab | Shows login form instead of profile | Login form displayed | Pass |
| 5 | Refresh browser after logout | User remains logged out | Still logged out after refresh | Pass |
| 6 | Try to save itinerary after logout | System displays error "Login required" | Error message displayed | Pass |

*Table 7.47: Test Case - Validate User Logout*

---

## 7.6.24 Price Alert List Management

| Test Case ID | TC-24-001 |
|--------------|-----------|
| **Test Case Name** | Validate Price Alert List Display and Management |
| **Related Feature ID** | F006 - Price Alerts |
| **Objective** | 1. To test price alerts display in profile section<br>2. To test delete price alert functionality |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | User has active price alerts<br>Navigate to Profile > Price Alerts | Active alerts displayed in list | List shows all user's alerts | Pass |
| 2 | Check alert card displays route | Each alert shows origin → destination | Route displayed: KUL → SIN | Pass |
| 3 | Check alert shows current price | Current price displayed | Current: RM200 shown | Pass |
| 4 | Check alert shows target price | Target price displayed | Target: RM150 shown | Pass |
| 5 | Check alert shows potential savings | Savings calculation displayed | Save: RM50 displayed | Pass |
| 6 | Click delete on specific alert | Alert removed from list | Alert deleted from Firestore | Pass |
| 7 | Verify real-time sync | Alert deleted in Tab A appears removed in Tab B | Real-time sync working | Pass |

*Table 7.48: Test Case - Validate Price Alert Management*

---

## 7.6.25 Multiple Filter Combination

| Test Case ID | TC-25-001 |
|--------------|-----------|
| **Test Case Name** | Validate Multiple Filters Applied Simultaneously |
| **Related Feature ID** | F003 - Search Filters |
| **Objective** | 1. To test multiple filters work together correctly<br>2.To verify filtered results meet all criteria | 

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Apply Filter: Airline = "Malaysia Airlines" | Results filtered to MH only | Only MH flights shown | Pass |
| 2 | Add Filter: Stops = "Direct Only" | Results filtered to MH direct flights only | Only MH direct flights shown | Pass |
| 3 | Add Filter: Time = "Morning" | Results filtered to MH direct morning flights | Only MH direct 6AM-12PM shown | Pass |
| 4 | Apply Sort: Price (ascending) | Filtered results sorted by price | Results sorted correctly | Pass |
| 5 | Remove one filter (Airline) | Results expand to all airlines (direct, morning) | Filter removed, results updated | Pass |
| 6 | Clear all filters | All original results shown | All results restored | Pass |
| 7 | Filters showing 0 results | Display "No flights match criteria" message | Message displayed | Pass |

*Table 7.49: Test Case - Validate Multiple Filters*

---

## 7.6.26 Return Trip Selection

| Test Case ID | TC-26-001 |
|--------------|-----------|
| **Test Case Name** | Validate Return Trip Itinerary Selection |
| **Related Feature ID** | F002 - Flight Search |
| **Objective** | 1. To test selecting outbound and return flights separately<br>2. To verify combined trip details display correctly |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Search return trip: KUL ↔ SIN | Both outbound and return results displayed | Two separate result sections shown | Pass |
| 2 | Click "View Details" on outbound flight | Outbound itinerary detail opens | Modal displays outbound details | Pass |
| 3 | Click "Save" on outbound flight | Outbound itinerary saved | Saved to Firestore | Pass |
| 4 | Click "View Details" on return flight | Return itinerary detail opens | Modal displays return details | Pass |
| 5 | Click "Save" on return flight | Return itinerary saved separately | Saved as separate item | Pass |
| 6 | Apply filter to return results | Filter applies to return section only | Return results filtered correctly | Pass |
| 7 | Check both sections show result counts | Count displayed for each direction | Outbound: 5, Return: 5 shown | Pass |

*Table 7.50: Test Case - Validate Return Trip Selection*

---

## 7.6.27 Multi-City Minimum Leg Requirement

| Test Case ID | TC-27-001 |
|--------------|-----------|
| **Test Case Name** | Validate Multi-City Minimum Leg Enforcement |
| **Related Feature ID** | F010 - Multi-City Search |
| **Objective** | 1. To test system enforces minimum 2 legs for multi-city<br>2. To verify remove button disabled appropriately |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Select Trip Type = "Multi-city" | System shows 2 legs by default | 2 legs displayed | Pass |
| 2 | Try to remove leg (only 2 legs exist) | Remove button shows error or is disabled | Error: "Multi-city requires at least 2 legs" | Pass |
| 3 | Add third leg | Third leg added successfully | 3 legs now shown | Pass |
| 4 | Remove third leg | Leg removed, 2 legs remain | Successfully removed to 2 legs | Pass |
| 5 | Add 5 legs total | All 5 legs displayed | 5 legs shown | Pass |
| 6 | Remove legs down to 2 | Can remove to minimum 2 | Removed to 2 legs | Pass |
| 7 | Try to remove 2nd leg (only 2 remain) | Error or remove button disabled | Error displayed | Pass |

*Table 7.51: Test Case - Validate Multi-City Minimum Legs*

---

## 7.6.28 Demo Mode Testing

| Test Case ID | TC-28-001 |
|--------------|-----------|
| **Test Case Name** | Validate Demo Mode Functionality |
| **Related Feature ID** | F016 - Demo Mode |
| **Objective** | 1. To test demo mode activates when API key missing<br>2. To verify demo mode returns simulated data |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | No API key configured<br>Execute search | System detects missing API key | Error or demo mode prompt shown | Pass |
| 2 | Click "Enable Demo Mode" | Demo mode activated | isDemoMode = true | Pass |
| 3 | Execute search in demo mode | Returns simulated flight data | Simulated results displayed | Pass |
| 4 | Check demo results validity | Results have all required fields (price, score, legs) | All fields present and valid | Pass |
| 5 | Check demo results reliability scores | Scores vary across different itineraries | Scores: 9.2, 8.5, 7.3, 6.1, 5.8 | Pass |
| 6 | Save demo itinerary | Itinerary saves like real data | Saved successfully to Firestore | Pass |
| 7 | Check demo indicator | UI shows "Demo Mode" badge or warning | Demo indicator displayed | Pass |

*Table 7.52: Test Case - Validate Demo Mode*

---

## 7.6.29 API Error Handling

| Test Case ID | TC-29-001 |
|--------------|-----------|
| **Test Case Name** | Validate Error Handling and Recovery |
| **Related Feature ID** | F017 - Error Handling |
| **Objective** | 1. To test system handles API failures gracefully<br>2. To verify appropriate error messages displayed<br>3. To test retry mechanisms work correctly |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | Simulate network error during search | System displays error message | Error: "An error occurred while searching" | Pass |
| 2 | Check error doesn't crash application | Application remains functional | App continues to work | Pass |
| 3 | Retry search after error | Search executes normally | Search works on retry | Pass |
| 4 | Simulate rate limit error | System displays rate limit message | Error: "RATE_LIMIT" displayed | Pass |
| 5 | Click "Enable Demo Mode" after rate limit | Demo mode activates as fallback | Demo mode enabled | Pass |
| 6 | Simulate Firestore permission error | System logs error with context | Error logged with user/path info | Pass |
| 7 | Check user receives friendly message | Technical error hidden, user message shown | User-friendly message displayed | Pass |

*Table 7.53: Test Case - Validate Error Handling*

---

## 7.6.30 Firebase Offline Persistence

| Test Case ID | TC-30-001 |
|--------------|-----------|
| **Test Case Name** | Validate Offline Capability and Data Persistence |
| **Related Feature ID** | F018 - Offline Capability |
| **Objective** | 1. To test Firebase local cache persists data offline<br>2. To verify queued writes execute when connection restored |

| # | Input | Expected Result | Actual Result | Remark |
|---|-------|-----------------|---------------|--------|
| 1 | User logged in<br>Load saved itineraries | Itineraries loaded from Firestore | Data loaded successfully | Pass |
| 2 | Disconnect network<br>Refresh page | Previously loaded data still accessible | Data served from cache | Pass |
| 3 | Try to save new itinerary (offline) | Write queued for when online | Write operation queued | Pass |
| 4 | Reconnect network | Queued write executes automatically | Data saved to Firestore | Pass |
| 5 | Verify saved item appears | Item shows in saved list | Saved itinerary displayed | Pass |
| 6 | Disconnect network<br>Try to search flights | Search fails with network error | Error: API call failed | Pass |
| 7 | Check cached search results (offline) | Previously searched results available from cache | Cached results displayed | Pass |

*Table 7.54: Test Case - Validate Offline Persistence*
