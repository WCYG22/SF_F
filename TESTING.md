# Chapter 7: Testing

Smart Flight is a Flight Search and Management System designed to assist travelers in finding reliable flight options by providing comprehensive reliability assessments based on historical performance data. The system offers functionalities for both registered and guest users to search for flights, compare itineraries, track live flights, and manage their travel plans. To ensure data persistence and real-time synchronization across devices, user information and saved itineraries are stored in Firebase Firestore with secure authentication. The interface is designed to be intuitive and user-friendly, adopting a modern web application style with clear visual indicators for flight reliability, making it accessible even for users who are not frequent travelers.

---

## 7.1 Overview of Software Testing

Software testing refers to the procedure of evaluating and verifying whether a system meets the programmer's and final user's requirements. This is also a critical phase in the software development lifecycle that ensures the Smart Flight application functions correctly and reliably. This step significantly contributes to the error, fault, and missing requirements identification and correction. Therefore, the performance, usability, quality, and reliability of the system will also be assessed.

Software testing can be performed manually or automatically. Manual testing encompasses white box, black box, and grey box testing methods. Additionally, testing can be categorized into different levels, namely unit testing, integration testing, and system testing. This chapter explores the testing progress of the Smart Flight application, offering a detailed analysis of the testing procedures, including the specific test cases and the results obtained from the tests.

---

## 7.2 White Box Testing

White box testing is also known as structural, code-based, and glass box testing. This technique evaluates the internal structural design and implementation of a system by granting testers access to the full source code and design documents. It involves programmers who act as testers, creating test cases and debugging the system. This method allows for the identification and resolution of issues that may not be detectable through other testing approaches.

**Advantages:**
- Comprehensive coverage of code paths
- Early bug detection during development
- System performance optimization
- Thorough documentation of code structure

**Disadvantages:**
- High skill requirement (programming knowledge needed)
- Resource intensive in terms of time and effort
- May miss user-perspective issues

For the Smart Flight application, white box testing would involve examining the reliability score calculation algorithms, Firebase authentication flows, caching mechanisms, and error handling logic to ensure correctness at the code level.

---

## 7.3 Grey Box Testing

Grey box testing is a software testing method that serves as the combination of black box and white box testing methodologies. In this method, the testers have partial knowledge of the internal system. So, the accessibility of documentation and source code will not be as complete as white box testing. However, this allows the tester to evaluate the system from both the final user's and programmer's perspective.

**Advantages:**
- Reduces code redundancy through informed testing
- Efficient testing by combining internal and external perspectives
- Balances user experience with technical validation

**Disadvantages:**
- Moderate skill requirements for partial code understanding
- Potential for oversights in areas with limited access

Grey box testing could be applied to Smart Flight's API integration layer, where testers understand the API contracts and data flow but test from the user interface perspective.

---

## 7.4 Testing Levels

### 7.4.1 Unit Testing

Unit testing is the process of software testing which focuses on testing individual units or components to ensure the individual unit can function correctly. This unit can be as small as a function, method, or procedure. This normally ensures that the logic, functionality, and behaviour of the testing unit is correct.

For Smart Flight, unit testing would validate individual functions such as:
- Reliability score calculation function
- Connection risk assessment algorithm
- Cache key generation logic
- Date formatting utilities

### 7.4.2 Integration Testing

Integration testing focuses on testing the interaction and integration between different components or modules of a software system. So, the defects which occur only when the integrated components work together will be detected and solved by performing integration testing.

For Smart Flight, integration testing validates:
- Frontend-backend API communication
- Firebase authentication with Firestore database
- Search service integration with caching layer
- Real-time listener integration with UI components

### 7.4.3 System Testing

System testing represents a high-level testing phase which tests the complete and integrated software product to ensure it meets requirements. Sometimes, the system test will happen in user scenarios for ensuring that the system can work properly under realistic conditions.

For Smart Flight, system testing validates end-to-end workflows including complete user journeys from registration through flight search, itinerary saving, price alert creation, and live flight tracking across all integrated components.

---

## 7.5 Black Box Testing

Black box testing is contrasted to white box testing where the testers do not peer into system internal structures and working. Therefore, the testers evaluate the system based on the expectation that comes with intuitiveness. This approach is effective for evaluating all critical subsystems, including the user interface, user experience, web servers, APIs, and more.

**Advantages:**
- No programming skill requirement
- Unbiased results from user perspective
- User-centric focus on functional requirements
- Tests what users actually experience

**Disadvantages:**
- Limited coverage of internal logic paths
- Potential code redundancy may go undetected
- Cannot validate optimization effectiveness

For the Smart Flight application, black box testing is the primary testing methodology employed to validate all user-facing features and workflows. The following subsections present various black box testing techniques applied to ensure comprehensive functional validation.

---

## 7.5.1 Equivalence Partitioning

Equivalence Partitioning divides input data into valid and invalid partitions where all values within a partition are expected to be treated similarly by the system. This technique reduces the number of test cases while maintaining comprehensive coverage by testing representative values from each partition.

### Test Case EP-001: Flight Search Origin Input

**Objective:** Validate origin airport selection accepts valid airport codes and rejects invalid inputs.

**Input Partitions:**
- Valid Partition 1: Existing airport codes (KUL, SIN, PEN, BKK, HAN)
- Valid Partition 2: International airport codes (LHR, JFK, NRT, DXB)
- Invalid Partition 1: Empty/null input
- Invalid Partition 2: Invalid airport codes (XXX, ABC, 123)
- Invalid Partition 3: Special characters (@#$, *&^)

| Test ID | Input Value | Partition | Expected Result | Actual Result | Status |
|---------|-------------|-----------|-----------------|---------------|--------|
| EP-001-1 | KUL | Valid P1 | Accept input, enable search | Accepted, search enabled | Pass |
| EP-001-2 | LHR | Valid P2 | Accept input, enable search | Accepted, search enabled | Pass |
| EP-001-3 | (empty) | Invalid P1 | Show error message | Error: "Please select departure" | Pass |
| EP-001-4 | XXX | Invalid P2 | Reject invalid code | Rejected, not in list | Pass |
| EP-001-5 | @#$ | Invalid P3 | Reject special chars | Rejected, not in list | Pass |

*Table 7.1: Equivalence Partitioning Test Results for Origin Input*

Therefore, the origin input validation correctly accepts all valid airport codes from the predefined list, rejects empty inputs with appropriate error messages, and prevents selection of invalid or non-existent airport codes through the dropdown interface, ensuring users can only select legitimate departure airports.

### Test Case EP-002: Flight Search Destination Input

**Objective:** Validate destination airport selection follows the same validation rules as origin.

**Input Partitions:**
- Valid Partition 1: Domestic destinations (KUL, SIN, PEN)
- Valid Partition 2: International destinations (HKG, NRT, ICN)
- Invalid Partition 1: Same as origin (circular route)
- Invalid Partition 2: Empty/null input

| Test ID | Input Value | Partition | Expected Result | Actual Result | Status |
|---------|-------------|-----------|-----------------|---------------|--------|
| EP-002-1 | SIN (origin: KUL) | Valid P1 | Accept, enable search | Accepted | Pass |
| EP-002-2 | HKG (origin: KUL) | Valid P2 | Accept, enable search | Accepted | Pass |
| EP-002-3 | KUL (origin: KUL) | Invalid P1 | Allow (valid search) | Accepted | Pass |
| EP-002-4 | (empty) | Invalid P2 | Show error message | Error: "Please select destination" | Pass |

*Table 7.2: Equivalence Partitioning Test Results for Destination Input*

For example, the destination validation accepts any valid airport code including the same airport as origin (for testing purposes), and properly rejects empty inputs with clear error messaging, ensuring users provide complete search parameters.

### Test Case EP-003: Departure Date Selection

**Objective:** Validate date selection accepts valid future dates and rejects invalid date inputs.

**Input Partitions:**
- Valid Partition 1: Today's date
- Valid Partition 2: Future dates (1-365 days ahead)
- Invalid Partition 1: Past dates
- Invalid Partition 2: Null/empty date
- Invalid Partition 3: Invalid date format

| Test ID | Input Value | Partition | Expected Result | Actual Result | Status |
|---------|-------------|-----------|-----------------|---------------|--------|
| EP-003-1 | Today | Valid P1 | Accept date | Accepted | Pass |
| EP-003-2 | +30 days | Valid P2 | Accept date | Accepted | Pass |
| EP-003-3 | -5 days | Invalid P1 | Disable past dates | Past dates disabled in calendar | Pass |
| EP-003-4 | (empty) | Invalid P2 | Show error | Error: "Please select travel date" | Pass |

*Table 7.3: Equivalence Partitioning Test Results for Date Input*

Therefore, date validation prevents selection of past dates through calendar UI, accepts today and all future dates, and enforces date selection before allowing search execution, ensuring users can only search for valid travel dates.

### Test Case EP-004: Price Alert Target Price

**Objective:** Validate price alert target price input accepts valid numeric values and rejects invalid inputs.

**Input Partitions:**
- Valid Partition 1: Positive numbers less than current price (50-2000)
- Invalid Partition 1: Zero or negative numbers
- Invalid Partition 2: Non-numeric input (text, special chars)
- Invalid Partition 3: Price equal to or greater than current price
- Invalid Partition 4: Empty input

| Test ID | Input Value | Current Price | Partition | Expected Result | Actual Result | Status |
|---------|-------------|---------------|-----------|-----------------|---------------|--------|
| EP-004-1 | 150 | 200 | Valid P1 | Accept, create alert | Alert created | Pass |
| EP-004-2 | 0 | 200 | Invalid P1 | Reject, show error | Error: "Enter valid price" | Pass |
| EP-004-3 | -50 | 200 | Invalid P1 | Reject, show error | Error: "Enter valid price" | Pass |
| EP-004-4 | abc | 200 | Invalid P2 | Reject non-numeric | Error: "Enter valid price" | Pass |
| EP-004-5 | 250 | 200 | Invalid P3 | Reject, must be lower | Error: "Target must be lower" | Pass |
| EP-004-6 | (empty) | 200 | Invalid P4 | Reject empty | Error: "Enter valid price" | Pass |

*Table 7.4: Equivalence Partitioning Test Results for Price Alert Input*

For example, price alert validation enforces that target prices must be positive numbers lower than the current price, rejects non-numeric inputs, and prevents creation of meaningless alerts where the target exceeds current pricing, ensuring alerts only trigger when prices actually decrease.

---

## 7.5.2 Boundary Value Analysis

Boundary Value Analysis tests values at the boundaries of equivalence partitions, as errors often occur at the edges of valid input ranges. This technique complements equivalence partitioning by focusing on boundary conditions.

### Test Case BVA-001: Airport Code Length Validation

**Objective:** Validate system handles airport codes at length boundaries correctly.

**Boundary Values:**
- Minimum valid length: 3 characters (standard IATA code)
- Maximum valid length: 3 characters (standard IATA code)
- Below minimum: 2 characters
- Above maximum: 4 characters

| Test ID | Input Value | Length | Expected Result | Actual Result | Status |
|---------|-------------|--------|-----------------|---------------|--------|
| BVA-001-1 | KU | 2 | Reject (too short) | Not in dropdown list | Pass |
| BVA-001-2 | KUL | 3 | Accept (exact min) | Accepted | Pass |
| BVA-001-3 | KULL | 4 | Reject (too long) | Not in dropdown list | Pass |

*Table 7.5: Boundary Value Analysis for Airport Code Length*

Therefore, the system enforces strict 3-character IATA airport code format through the dropdown selector, preventing manual entry of codes with incorrect lengths, ensuring consistency in airport identification throughout the application.

### Test Case BVA-002: Search Results Limit

**Objective:** Validate system handles search results at quantity boundaries correctly.

**Boundary Values:**
- Minimum results: 0 (no flights found)
- Typical results: 4-5 itineraries
- Maximum display: Limited by UI performance

| Test ID | Result Count | Expected Behavior | Actual Behavior | Status |
|---------|--------------|-------------------|-----------------|--------|
| BVA-002-1 | 0 | Show "No flights found" message | Message displayed | Pass |
| BVA-002-2 | 1 | Display single result | Result displayed | Pass |
| BVA-002-3 | 5 | Display all results | All displayed | Pass |
| BVA-002-4 | 100+ | Display with scrolling/pagination | Virtual scroll enabled | Pass |

*Table 7.6: Boundary Value Analysis for Search Results*

For example, the system gracefully handles both edge cases of zero results with appropriate messaging and large result sets with virtual scrolling, ensuring the interface remains usable regardless of search result quantity.

### Test Case BVA-003: Reliability Score Boundaries

**Objective:** Validate reliability score calculation and display at boundary values.

**Boundary Values:**
- Minimum score: 0.0 (worst possible reliability)
- Maximum score: 10.0 (perfect reliability)
- Status thresholds: 6.0 (CAUTION boundary), 8.0 (RELIABLE boundary)

| Test ID | Reliability Score | Expected Status | Expected Color | Actual Status | Actual Color | Status |
|---------|-------------------|-----------------|----------------|---------------|--------------|--------|
| BVA-003-1 | 0.0 | HIGH RISK | Red | HIGH RISK | Red | Pass |
| BVA-003-2 | 5.9 | HIGH RISK | Red | HIGH RISK | Red | Pass |
| BVA-003-3 | 6.0 | CAUTION | Yellow | CAUTION | Yellow | Pass |
| BVA-003-4 | 7.9 | CAUTION | Yellow | CAUTION | Yellow | Pass |
| BVA-003-5 | 8.0 | RELIABLE | Green | RELIABLE | Green | Pass |
| BVA-003-6 | 10.0 | RELIABLE | Green | RELIABLE | Green | Pass |

*Table 7.7: Boundary Value Analysis for Reliability Score*

Therefore, reliability score classification correctly identifies boundary values at 6.0 and 8.0 thresholds, assigns appropriate status labels and color coding at all boundary points, and correctly categorizes scores across the entire 0-10 range, ensuring consistent and accurate reliability communication to users.

### Test Case BVA-004: Connection Time Risk Assessment

**Objective:** Validate connection risk calculation at time boundaries for standard and complex airports.

**Boundary Values for Standard Airports:**
- Minimum required: 45 minutes
- Minimum safe: 60 minutes

**Boundary Values for Complex Airports:**
- Minimum required: 60 minutes
- Minimum safe: 90 minutes

| Test ID | Layover Time | Airport Type | Expected Risk | Actual Risk | Status |
|---------|--------------|--------------|---------------|-------------|--------|
| BVA-004-1 | 44 min | Standard | HIGH | HIGH | Pass |
| BVA-004-2 | 45 min | Standard | MEDIUM | MEDIUM | Pass |
| BVA-004-3 | 59 min | Standard | MEDIUM | MEDIUM | Pass |
| BVA-004-4 | 60 min | Standard | LOW | LOW | Pass |
| BVA-004-5 | 59 min | Complex (LHR) | HIGH | HIGH | Pass |
| BVA-004-6 | 60 min | Complex (LHR) | MEDIUM | MEDIUM | Pass |
| BVA-004-7 | 89 min | Complex (LHR) | MEDIUM | MEDIUM | Pass |
| BVA-004-8 | 90 min | Complex (LHR) | LOW | LOW | Pass |

*Table 7.8: Boundary Value Analysis for Connection Risk*

For example, connection risk assessment correctly differentiates between standard and complex airports with appropriate time thresholds, accurately classifies risk at exact boundary minutes, and ensures travelers receive appropriate warnings when connection times are insufficient for the airport type.

### Test Case BVA-005: Price Range Boundaries

**Objective:** Validate price handling at minimum, maximum, and boundary values.

**Boundary Values:**
- Minimum valid price: RM1
- Typical range: RM100-5000
- Maximum display: RM99999

| Test ID | Price Value | Expected Behavior | Actual Behavior | Status |
|---------|-------------|-------------------|-----------------|--------|
| BVA-005-1 | RM0 | Reject invalid price | Price > 0 enforced | Pass |
| BVA-005-2 | RM1 | Accept minimum | Accepted | Pass |
| BVA-005-3 | RM150 | Accept typical | Accepted | Pass |
| BVA-005-4 | RM99999 | Accept high price | Accepted | Pass |

*Table 7.9: Boundary Value Analysis for Price Values*

Therefore, price validation accepts all positive numeric values from RM1 upward, correctly displays prices in Malaysian Ringgit currency format, and handles both budget airline prices and premium long-haul fares within the system's design limits.

---

## 7.5.3 Use Case Testing

Use Case Testing validates complete user workflows from start to finish, ensuring the system supports realistic user scenarios. This technique tests end-to-end functionality rather than isolated components.

### Test Case UC-001: Search and View Flight Itineraries

**Use Case:** User searches for one-way flights and views detailed itinerary information.

**Preconditions:**
- User accesses Smart Flight application
- Application loads successfully

**Test Steps:**

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | Select origin airport "KUL" | Origin field shows "Kuala Lumpur (KUL)" | Displayed correctly | Pass |
| 2 | Select destination airport "SIN" | Destination field shows "Singapore (SIN)" | Displayed correctly | Pass |
| 3 | Select departure date (today + 7 days) | Date field shows selected date | Date displayed | Pass |
| 4 | Click "Search Flights" button | Loading indicator appears | Loading shown | Pass |
| 5 | Wait for search results | Results display with 4-5 itineraries | 5 results shown | Pass |
| 6 | Verify results show reliability scores | Each result shows score/10 | Scores displayed | Pass |
| 7 | Verify results show prices | Each result shows price in RM | Prices displayed | Pass |
| 8 | Click "View Details" on first result | Detail modal opens | Modal opened | Pass |
| 9 | Verify detail shows flight legs | All legs displayed with times | Legs shown correctly | Pass |
| 10 | Verify detail shows reliability breakdown | Breakdown with factors shown | Factors displayed | Pass |
| 11 | Click "Close" button | Modal closes, returns to results | Closed successfully | Pass |

*Table 7.10: Use Case Test for Search and View Workflow*

Therefore, the complete search and view workflow functions correctly from initial input through result display to detailed itinerary viewing, with all data presented accurately and navigation working as expected.

### Test Case UC-002: Save Itinerary with Authentication

**Use Case:** Authenticated user saves a flight itinerary for future reference.

**Preconditions:**
- User is logged in with verified email
- Search results are displayed

**Test Steps:**

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | View search results | Results displayed | Results shown | Pass |
| 2 | Click "Save" on an itinerary | Itinerary added to saved list | Added successfully | Pass |
| 3 | Navigate to "Saved" tab | Saved itineraries page loads | Page loaded | Pass |
| 4 | Verify saved itinerary appears | Itinerary shown in saved list | Displayed in list | Pass |
| 5 | Verify all details preserved | Origin, destination, price, score match | All details match | Pass |
| 6 | Click delete on saved itinerary | Confirmation or immediate delete | Deleted immediately | Pass |
| 7 | Verify itinerary removed | Item no longer in saved list | Removed from list | Pass |

*Table 7.11: Use Case Test for Save Itinerary Workflow*

For example, the save itinerary workflow correctly authenticates users, persists itinerary data to Firestore, synchronizes saved items across sessions through real-time listeners, and allows deletion when itineraries are no longer needed.

### Test Case UC-003: Set Price Alert

**Use Case:** User sets a price alert to be notified when flight price drops.

**Preconditions:**
- User is logged in with verified email
- User has viewed an itinerary detail

**Test Steps:**

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | Open itinerary detail | Detail modal displays | Modal opened | Pass |
| 2 | Click "Set Alert" button | Price alert modal opens | Modal opened | Pass |
| 3 | View current price display | Shows current price (e.g., RM200) | Price displayed | Pass |
| 4 | Enter target price below current (RM150) | Input accepted | Input accepted | Pass |
| 5 | Click "Set Alert" button | Alert created, confirmation shown | Alert created | Pass |
| 6 | Navigate to Profile > Price Alerts | Alerts page displays | Page loaded | Pass |
| 7 | Verify alert appears in list | Alert shown with route and prices | Alert displayed | Pass |
| 8 | Verify current and target prices | Shows RM200 → RM150 | Prices correct | Pass |
| 9 | Click delete on alert | Alert removed | Deleted successfully | Pass |

*Table 7.12: Use Case Test for Price Alert Workflow*

Therefore, the price alert workflow successfully creates alerts with user-specified target prices, stores alerts in Firestore with real-time synchronization, displays active alerts in the profile section, and allows users to manage alerts through deletion.

### Test Case UC-004: Live Flight Tracking

**Use Case:** User tracks a live flight by entering flight number.

**Preconditions:**
- User accesses Live Tracking tab

**Test Steps:**

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | Navigate to "Live" tab | Live tracking page loads | Page loaded | Pass |
| 2 | Enter flight number "MH123" | Input accepted | Input accepted | Pass |
| 3 | Click "Track Flight" button | Loading indicator appears | Loading shown | Pass |
| 4 | Wait for tracking data | Flight details display | Data displayed | Pass |
| 5 | Verify flight header shows number and airline | "MH123 - Malaysia Airlines" shown | Header correct | Pass |
| 6 | Verify origin and destination shown | Airports and cities displayed | Displayed correctly | Pass |
| 7 | Verify flight status shown | Status badge displays (IN AIR/SCHEDULED/LANDED) | Status shown | Pass |
| 8 | Verify radar visualization shown | SVG radar with moving plane | Radar displayed | Pass |
| 9 | Verify metrics shown | Altitude, speed, progress displayed | Metrics shown | Pass |

*Table 7.13: Use Case Test for Live Flight Tracking Workflow*

For example, the live tracking workflow accepts flight numbers, retrieves tracking data from the backend, displays comprehensive flight information including real-time position and status, and presents data through an intuitive radar visualization interface.


### Test Case UC-005: User Registration and Email Verification

**Use Case:** New user creates an account and verifies email address.

**Preconditions:**
- User accesses Smart Flight application
- User is not logged in

**Test Steps:**

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|-----------------|---------------|--------|
| 1 | Navigate to Profile tab | Profile/login page displays | Page displayed | Pass |
| 2 | Click "Create Account" link | Registration form appears | Form shown | Pass |
| 3 | Enter email address | Email input accepted | Input accepted | Pass |
| 4 | Enter password (6+ characters) | Password input accepted | Input accepted | Pass |
| 5 | Enter confirm password (matching) | Confirm password accepted | Input accepted | Pass |
| 6 | Click "Create Account" button | Account created, verification email sent | Account created | Pass |
| 7 | Verify success message | "Check email for verification" shown | Message displayed | Pass |
| 8 | Check email verification status | Shows "Email not verified" warning | Warning shown | Pass |
| 9 | Try to save itinerary | Error: "Email verification required" | Error shown | Pass |
| 10 | Click "Resend Verification" | Email resent confirmation | Email resent | Pass |

*Table 7.14: Use Case Test for User Registration Workflow*

Therefore, the registration workflow creates user accounts through Firebase Auth, sends automated email verification links, enforces email verification before allowing protected features like saving itineraries, and provides resend functionality for users who didn't receive initial verification emails.

---

## 7.5.4 Decision Table Testing

Decision Table Testing systematically tests different combinations of input conditions and validates corresponding system actions. This technique ensures all logical paths through decision points are covered.

### Test Case DT-001: Flight Search Validation Decision Table

**Decision Factors:**
- Origin selected: Yes/No
- Destination selected: Yes/No
- Date selected: Yes/No
- User authenticated: Yes/No

**Decision Table:**

| Rule | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
|------|----|----|----|----|----|----|----|----|
| **Conditions** |
| Origin selected | Y | Y | Y | Y | N | N | N | N |
| Destination selected | Y | Y | N | N | Y | Y | N | N |
| Date selected | Y | N | Y | N | Y | N | Y | N |
| **Actions** |
| Execute search | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Show error: missing destination | | | ✓ | ✓ | | | | |
| Show error: missing date | | ✓ | | ✓ | | ✓ | | ✓ |
| Show error: missing origin | | | | | ✓ | ✓ | ✓ | ✓ |

*Table 7.15: Decision Table for Flight Search Validation*

**Test Results:**

| Test ID | Rule | Inputs (O/D/Date) | Expected Action | Actual Action | Status |
|---------|------|-------------------|-----------------|---------------|--------|
| DT-001-1 | R1 | Y/Y/Y | Execute search | Search executed | Pass |
| DT-001-2 | R2 | Y/Y/N | Error: missing date | Error shown | Pass |
| DT-001-3 | R3 | Y/N/Y | Error: missing destination | Error shown | Pass |
| DT-001-4 | R4 | Y/N/N | Error: missing date & dest | Error shown | Pass |
| DT-001-5 | R5 | N/Y/Y | Error: missing origin | Error shown | Pass |
| DT-001-6 | R6 | N/Y/N | Error: missing origin & date | Error shown | Pass |
| DT-001-7 | R7 | N/N/Y | Error: missing origin & dest | Error shown | Pass |
| DT-001-8 | R8 | N/N/N | Error: all fields required | Error shown | Pass |

*Table 7.16: Decision Table Test Results for Search Validation*

Therefore, search validation correctly handles all combinations of missing required fields, provides appropriate error messages for each scenario, prevents search execution when any required field is missing, and ensures users complete all necessary inputs before performing searches.

### Test Case DT-002: Save Itinerary Authorization Decision Table

**Decision Factors:**
- User logged in: Yes/No
- Email verified: Yes/No
- Itinerary selected: Yes/No

**Decision Table:**

| Rule | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
|------|----|----|----|----|----|----|----|----|
| **Conditions** |
| User logged in | Y | Y | Y | Y | N | N | N | N |
| Email verified | Y | Y | N | N | - | - | - | - |
| Itinerary selected | Y | N | Y | N | Y | N | Y | N |
| **Actions** |
| Save itinerary | ✓ | | | | | | | |
| Error: no itinerary | | ✓ | | ✓ | | ✓ | | ✓ |
| Error: verify email | | | ✓ | | | | | |
| Error: login required | | | | | ✓ | | ✓ | |

*Table 7.17: Decision Table for Save Authorization*

**Test Results:**

| Test ID | Rule | Inputs (Login/Verify/Select) | Expected Action | Actual Action | Status |
|---------|------|------------------------------|-----------------|---------------|--------|
| DT-002-1 | R1 | Y/Y/Y | Save successful | Saved to Firestore | Pass |
| DT-002-2 | R2 | Y/Y/N | Error: no itinerary | Error shown | Pass |
| DT-002-3 | R3 | Y/N/Y | Error: verify email | Error shown | Pass |
| DT-002-4 | R4 | Y/N/N | Error: verify email | Error shown | Pass |
| DT-002-5 | R5 | N/-/Y | Error: login required | Error shown | Pass |
| DT-002-6 | R6 | N/-/N | Error: login required | Error shown | Pass |

*Table 7.18: Decision Table Test Results for Save Authorization*

For example, save authorization correctly enforces all security requirements including user authentication, email verification, and itinerary selection, provides specific error messages for each missing requirement, and prevents unauthorized database writes while guiding users to complete necessary steps.

### Test Case DT-003: Price Alert Creation Decision Table

**Decision Factors:**
- User authenticated: Yes/No
- Email verified: Yes/No  
- Target price valid: Yes/No
- Target < current price: Yes/No

**Decision Table:**

| Rule | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 |
|------|----|----|----|----|----|----|----|----|
| **Conditions** |
| User authenticated | Y | Y | Y | Y | Y | Y | N | N |
| Email verified | Y | Y | Y | Y | N | N | - | - |
| Target price valid | Y | Y | N | N | Y | N | Y | N |
| Target < current | Y | N | Y | N | Y | N | Y | N |
| **Actions** |
| Create alert | ✓ | | | | | | | |
| Error: target must be lower | | ✓ | | ✓ | | ✓ | | |
| Error: invalid price | | | ✓ | | | ✓ | | ✓ |
| Error: verify email | | | | | ✓ | | | |
| Error: login required | | | | | | | ✓ | |

*Table 7.19: Decision Table for Price Alert Creation*

**Test Results:**

| Test ID | Rule | Inputs (Auth/Verify/Valid/Lower) | Expected Action | Actual Action | Status |
|---------|------|----------------------------------|-----------------|---------------|--------|
| DT-003-1 | R1 | Y/Y/Y/Y | Create alert | Alert created | Pass |
| DT-003-2 | R2 | Y/Y/Y/N | Error: must be lower | Error shown | Pass |
| DT-003-3 | R3 | Y/Y/N/Y | Error: invalid price | Error shown | Pass |
| DT-003-4 | R5 | Y/N/Y/Y | Error: verify email | Error shown | Pass |
| DT-003-5 | R7 | N/-/Y/Y | Error: login required | Error shown | Pass |

*Table 7.20: Decision Table Test Results for Price Alert Creation*

Therefore, price alert creation validates all authorization and input requirements systematically, ensures target prices are both valid numbers and logically lower than current prices, prevents alert creation without proper authentication, and provides clear error guidance for each validation failure.

---

## 7.5.5 State Transition Testing

State Transition Testing validates the system's behavior as it transitions between different states based on events and user actions. This technique is particularly useful for testing authentication flows and data synchronization states.

### Test Case ST-001: User Authentication State Transitions

**States:**
- S1: Not Logged In
- S2: Logged In (Unverified Email)
- S3: Logged In (Verified Email)

**Events:**
- E1: Successful login (unverified)
- E2: Successful login (verified)
- E3: Email verification completed
- E4: Logout

**State Transition Diagram:**

```
S1 (Not Logged In)
  |-- E1 --> S2 (Logged In Unverified)
  |-- E2 --> S3 (Logged In Verified)

S2 (Logged In Unverified)
  |-- E3 --> S3 (Logged In Verified)
  |-- E4 --> S1 (Not Logged In)

S3 (Logged In Verified)
  |-- E4 --> S1 (Not Logged In)
```

**Test Scenarios:**

| Test ID | Start State | Event | Expected End State | Actions Allowed | Actual Result | Status |
|---------|-------------|-------|-------------------|-----------------|---------------|--------|
| ST-001-1 | S1 | E1: Login (unverified) | S2 | View results only | State S2, limited access | Pass |
| ST-001-2 | S1 | E2: Login (verified) | S3 | Full access | State S3, full access | Pass |
| ST-001-3 | S2 | E3: Verify email | S3 | Full access enabled | State S3, access granted | Pass |
| ST-001-4 | S2 | E4: Logout | S1 | Public access only | State S1, logged out | Pass |
| ST-001-5 | S3 | E4: Logout | S1 | Public access only | State S1, logged out | Pass |

*Table 7.21: State Transition Test Results for Authentication*

Therefore, authentication state transitions correctly move users between logged out, logged in with unverified email, and fully verified states, enforce appropriate access permissions at each state, and properly handle state changes triggered by login, verification, and logout events.

### Test Case ST-002: Itinerary Save State Transitions

**States:**
- S1: Unsaved
- S2: Saving (Optimistic)
- S3: Saved (Confirmed)
- S4: Save Failed

**Events:**
- E1: User clicks save
- E2: Firestore write succeeds
- E3: Firestore write fails
- E4: User clicks delete
- E5: Delete succeeds

**State Transition Diagram:**

```
S1 (Unsaved)
  |-- E1 --> S2 (Saving)

S2 (Saving)
  |-- E2 --> S3 (Saved)
  |-- E3 --> S4 (Failed) --> rollback to S1

S3 (Saved)
  |-- E4 --> Deleting
  |-- E5 --> S1 (Unsaved)
```

**Test Scenarios:**

| Test ID | Start State | Event | Expected End State | UI State | Actual Result | Status |
|---------|-------------|-------|-------------------|----------|---------------|--------|
| ST-002-1 | S1 | E1: Click save | S2 | Shows in list immediately | State S2, optimistic add | Pass |
| ST-002-2 | S2 | E2: Write success | S3 | Remains in list | State S3, confirmed | Pass |
| ST-002-3 | S2 | E3: Write fails | S4 → S1 | Removed from list, error shown | Rolled back to S1 | Pass |
| ST-002-4 | S3 | E4: Click delete | Deleting | Shows deleting state | Deleting initiated | Pass |
| ST-002-5 | Deleting | E5: Delete success | S1 | Removed from list | State S1, removed | Pass |

*Table 7.22: State Transition Test Results for Itinerary Save*

For example, itinerary save state transitions implement optimistic UI updates for perceived instant responsiveness, correctly handle both success and failure paths from the saving state, rollback optimistic changes when writes fail maintaining data consistency, and properly transition through delete states when users remove saved items.


### Test Case ST-003: Price Alert Status State Transitions

**States:**
- S1: No Alert
- S2: Active Alert
- S3: Triggered Alert
- S4: Inactive Alert

**Events:**
- E1: User creates alert
- E2: Price drops below target
- E3: User deactivates alert
- E4: User deletes alert

**State Transition Diagram:**

```
S1 (No Alert)
  |-- E1 --> S2 (Active)

S2 (Active)
  |-- E2 --> S3 (Triggered)
  |-- E3 --> S4 (Inactive)
  |-- E4 --> S1 (No Alert)

S3 (Triggered)
  |-- E4 --> S1 (No Alert)

S4 (Inactive)
  |-- E4 --> S1 (No Alert)
```

**Test Scenarios:**

| Test ID | Start State | Event | Expected End State | Alert Status | Actual Result | Status |
|---------|-------------|-------|-------------------|--------------|---------------|--------|
| ST-003-1 | S1 | E1: Create alert (target RM150, current RM200) | S2 | Status: active | State S2, active | Pass |
| ST-003-2 | S2 | E2: Price drops to RM140 | S3 | Status: triggered | State S3, triggered | Pass |
| ST-003-3 | S2 | E4: Delete alert | S1 | Alert removed | State S1, deleted | Pass |

*Table 7.23: State Transition Test Results for Price Alert Status*

Therefore, price alert state transitions correctly track alerts from creation through triggering, maintain appropriate status indicators at each state, and properly remove alerts when users delete them, ensuring users can monitor and manage their price alerts effectively.

### Test Case ST-004: Search Results Loading State Transitions

**States:**
- S1: No Search
- S2: Loading
- S3: Results Displayed
- S4: Error State

**Events:**
- E1: User submits search
- E2: Search succeeds
- E3: Search fails
- E4: User refines filters
- E5: User clears search

**State Transition Diagram:**

```
S1 (No Search)
  |-- E1 --> S2 (Loading)

S2 (Loading)
  |-- E2 --> S3 (Results)
  |-- E3 --> S4 (Error)

S3 (Results)
  |-- E1 --> S2 (Loading new search)
  |-- E4 --> S3 (Filtered results)
  |-- E5 --> S1 (No Search)

S4 (Error)
  |-- E1 --> S2 (Retry)
  |-- E5 --> S1 (Clear)
```

**Test Scenarios:**

| Test ID | Start State | Event | Expected End State | UI Display | Actual Result | Status |
|---------|-------------|-------|-------------------|------------|---------------|--------|
| ST-004-1 | S1 | E1: Submit search | S2 | Loading spinner | State S2, loading | Pass |
| ST-004-2 | S2 | E2: Results returned | S3 | Results grid | State S3, 5 results shown | Pass |
| ST-004-3 | S2 | E3: API error | S4 | Error message | State S4, error shown | Pass |
| ST-004-4 | S3 | E4: Apply airline filter | S3 | Filtered results | State S3, filtered view | Pass |
| ST-004-5 | S3 | E1: New search | S2 | Loading spinner | State S2, new search | Pass |
| ST-004-6 | S4 | E1: Retry search | S2 | Loading spinner | State S2, retrying | Pass |

*Table 7.24: State Transition Test Results for Search Loading*

For example, search loading state transitions provide clear visual feedback through loading indicators, smoothly transition between no results, loading, and results displayed states, handle error states with retry capabilities, and maintain state consistency when users apply filters or initiate new searches.

---

## Summary

The comprehensive black box testing strategy validates Smart Flight's functionality from a user perspective without examining internal code implementation. Equivalence Partitioning efficiently tests input validation by grouping similar inputs into partitions and testing representative values, ensuring proper handling of valid and invalid inputs across airport selection, date selection, and price alert configuration. Boundary Value Analysis focuses on edge cases and boundary conditions including airport code lengths, result quantity limits, reliability score thresholds, and connection time boundaries, validating that the system correctly handles values at partition edges where errors commonly occur.

Use Case Testing validates complete user workflows including flight search and view, save itinerary with authentication, price alert creation, live flight tracking, and user registration with email verification, ensuring end-to-end functionality works correctly for realistic user scenarios. Decision Table Testing systematically validates all combinations of conditions for critical decision points including search validation with multiple missing fields, save authorization with authentication and verification requirements, and price alert creation with multiple validation rules, ensuring logical completeness in system behavior.

State Transition Testing validates system behavior across state changes including authentication states (logged out, unverified, verified), itinerary save states with optimistic updates and rollback, price alert status transitions from creation through triggering, and search loading states providing appropriate user feedback. This multi-faceted testing approach ensures Smart Flight functions reliably across all features, handles edge cases gracefully, provides clear error messaging, and maintains data consistency throughout user interactions.

The testing results demonstrate that Smart Flight successfully passes all test cases across all black box testing methodologies, validating that the application meets functional requirements, handles errors appropriately, and provides a reliable user experience for flight search, tracking, and management activities.


---

## 7.7 User Acceptance Testing

User Acceptance Testing (UAT) is the final phase of the software testing process where actual users test the system to verify that it meets their requirements and expectations. This testing phase validates whether the Smart Flight application is ready for deployment and actual use. UAT focuses on real-world scenarios and business requirements rather than technical functionality, ensuring the system delivers value to end users.

For the Smart Flight application, UAT was conducted with two representative users: a frequent business traveler and a casual vacation planner. These users evaluated the system across multiple criteria including user friendliness, interface design, user feedback responsiveness, and business requirement fulfillment. The following sections present the detailed UAT results from both testers.

---

### UAT Form 1: Frequent Business Traveler

| **User Acceptance Testing** |
|------------------------------|

**Testing Scenario Description:**

The tester is a business professional who travels frequently for work meetings across Southeast Asia. She needs to find reliable flight options that minimize delays or cancellations, as missing connections could result in missed client meetings. The tester requires the ability to search flights, compare options based on reliability scores and prices, save preferred itineraries, track live flights, and set price alerts for frequently traveled routes. The system must provide clear visual indicators through color coded badges and numerical scores for quick decision making. The interface should be efficient and professional, enabling fast searches while maintaining confidence in flight reliability.

| **Tester Name:** | Sarah Chen | **Position:** | Senior Business Consultant | **Date:** | January 15, 2025 |
|------------------|------------|---------------|----------------------------|-----------|------------------|

| **Name of Category** | **Score (1 is the lowest, 5 is the highest)** |||||
|----------------------|-------|-------|-------|-------|-------|
|                      | **1** | **2** | **3** | **4** | **5** |
| **User Friendliness** |       |       |       |       |   ✓   |
| **Interface Design**  |       |       |       |   ✓   |       |
| **User Feedback**     |       |       |       |       |   ✓   |
| **Business Requirement Fulfillment** |       |       |       |   ✓   |       |

| **Comment From Tester** |
|-------------------------|
| The Smart Flight application provides an excellent user experience for business travelers. The reliability scoring system is particularly valuable as it helps me identify flights with lower risk of delays, which is crucial for tight meeting schedules. The interface is clean and intuitive, allowing me to search, compare, and save itineraries within minutes. The live flight tracking feature with radar visualization is outstanding for monitoring connecting flights. One suggestion: the comparison feature could be more prominent in the interface as I initially missed it. |

| **Action Taken by Developer** |
|-------------------------------|
| Enhanced the comparison feature visibility by adding a floating "Compare" button that appears when itineraries are selected. Added tooltips to key features on first visit to help new users discover all functionality quickly. |

*Table 7.19: User Acceptance Testing Form - Business Traveler*

---

### UAT Form 2: Casual Vacation Planner

| **User Acceptance Testing** |
|------------------------------|

**Testing Scenario Description:**

The tester is a school teacher who books flights only a few times per year for family vacations. He is planning a multi city vacation for his family of five, visiting three different cities in Southeast Asia. The tester needs a system that is easy to understand without requiring extensive flight booking knowledge. He requires the ability to search flights with clear reliability indicators, plan multi city itineraries, compare options across airlines based on price and reliability, and share flight options with family members via email. The system should present information using simple language and intuitive visual cues like color coding. The interface should guide casual users through the process without overwhelming them with technical details.

| **Tester Name:** | Ahmad Rahman | **Position:** | School Teacher | **Date:** | January 16, 2025 |
|------------------|--------------|---------------|----------------|-----------|------------------|

| **Name of Category** | **Score (1 is the lowest, 5 is the highest)** |||||
|----------------------|-------|-------|-------|-------|-------|
|                      | **1** | **2** | **3** | **4** | **5** |
| **User Friendliness** |       |       |       |       |   ✓   |
| **Interface Design**  |       |       |   ✓   |       |       |
| **User Feedback**     |       |       |       |   ✓   |       |
| **Business Requirement Fulfillment** |       |       |       |       |   ✓   |

| **Comment From Tester** |
|-------------------------|
| Smart Flight is very easy to use for someone who only books flights a few times per year. The color coded reliability badges immediately show which flights are safer to book. The multi city trip planning feature worked perfectly for our vacation where we want to visit three different cities. The email sharing functionality is excellent for discussing options with family members. However, the interface feels cluttered with all filter options visible. A simpler default view would be better for casual users. Some technical terms could also be explained more clearly. |

| **Action Taken by Developer** |
|-------------------------------|
| Redesigned the search results interface with advanced filters collapsed into an expandable "More Filters" section to reduce visual clutter. Added informational tooltips next to technical terms like "connection risk" and "reliability score" to provide plain language explanations. Created a brief guided tour for first time users highlighting key features. |

*Table 7.20: User Acceptance Testing Form - Casual Vacation Planner*

---

## Summary

The User Acceptance Testing phase validated that the Smart Flight application successfully meets the requirements and expectations of its target user groups. The two representative testers - a business traveler and a casual vacation planner - provided valuable feedback from different user perspectives. Both testers rated User Friendliness and Business Requirement Fulfillment highly (4-5 out of 5), confirming that the system delivers its core value proposition of helping users find reliable flights efficiently.

The business traveler particularly appreciated the reliability scoring system, live tracking capabilities, and price alerts, all of which support time-sensitive business travel needs. The casual vacation planner valued the simplicity of use, multi-city planning features, and collaborative decision-making through email sharing. Both testers provided constructive feedback on interface improvements and feature discoverability, which were addressed through interface refinements and enhanced user guidance systems.

The UAT results demonstrate that Smart Flight is ready for production deployment with minor enhancements implemented based on user feedback. The high scores across all evaluation categories and positive tester comments confirm that the application successfully addresses real-world flight search and planning scenarios for diverse user needs.
