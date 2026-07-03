# SmartFlight Use Case Activity Diagrams Reference
**Author:** Wong Cheng Yong  
**Project:** SmartFlight (F001 - F013)  
**Date:** May 2026  

This document contains official, highly detailed UML Activity Diagrams for all 6 core Use Cases (UC001 through UC006) defined in the design spec. The diagrams are represented in both **PlantUML** (featuring swimlanes for User/System distinction) and **Mermaid.js** (native state/flow representations), followed by step-by-step process narratives.

---

## UC001: Search Itinerary and View Risk

### Purpose
To enable the user to search for flight itineraries and see disruption and connection risk information before making a booking decision.

### PlantUML Activity Diagram (Swimlanes)

```puml
@startuml
title UC001 - Search Itinerary and View Risk

|System|
start
:Display SmartFlight Home Page;

|User|
:Enter origin, destination,\nand travel date;
:Optionally set preferences\n(e.g. max stops, departure window);
:Click "Search" button;

|System|
:Validate travel date;
if (Travel date valid\nand not earlier than current date?) then (No)
  :Display validation error message\nand highlight date field;
  |User|
  :Correct travel date or\nother criteria;
  :Click "Search" button;
  |System|
  :Validate travel date;
endif

:Retrieve matching itineraries\nfrom flight data API;

if (Any matching itineraries found?) then (No)
  :Display "No flights found" message\nand suggest adjusting date or route;
  stop
else (Yes)
  :Run prediction model to compute\nleg-by-leg disruption and\nconnection risk for each itinerary;
  :Compute overall reliability score\nfor each itinerary;
  :Display itinerary list with\nreliability scores and\ncolour‑coded risk indicators;
  stop
endif

@enduml
```

### UML Activity Diagram (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> Home: User is on SmartFlight home page
    Home --> InputCriteria: User enters origin, destination, and travel date
    InputCriteria --> ConfigurePref: Optionally set preferences (max stops, timings)
    ConfigurePref --> TriggerSearch: User clicks "Search" button
    
    state ValidateDate <<choice>>
    TriggerSearch --> ValidateDate: Validate selected date
    ValidateDate --> ValidationError: Travel date is past/invalid
    ValidateDate --> CallFlightAPI: Travel date is valid (>= current date)
    
    ValidationError --> InputCriteria: Display error msg, re-enable entry
    
    CallFlightAPI --> EvaluateItineraries: Request available flights from API
    
    state CheckAPIResult <<choice>>
    EvaluateItineraries --> CheckAPIResult: Are itineraries returned?
    CheckAPIResult --> NoFlightsFound: Itinerary list is empty
    CheckAPIResult --> RunRiskModel: Matching flights returned (count > 0)
    
    NoFlightsFound --> [*]: Display "No flights found", suggest adjusting date or route
    
    RunRiskModel --> RenderResults: Run prediction model (compute leg-by-leg & route disruption risk)
    RenderResults --> [*]: Display list of itineraries with overall reliability scores & color-coded risk flags
```

### Process Narrative
1. **User Action:** Enters the origin, destination, and travels dates on the home page. Specifies constraints like stops if desired.
2. **System Rules Check:** UI confirms date is current or future. If invalid, blocks execution and warns.
3. **External Gateway:** Calls the flight matching API.
4. **Disruption Assessment Layer:** For each match, feeds schedule variables through the reliability predictor to assign threat values.
5. **Display State:** Renders list view with color-coded safety indicators (Red, Yellow, Green status).

---

## UC002: View Flight Details

### Purpose
To enable the user to view full itinerary details and associated disruption and connection risk values for a selected search result.

### PlantUML Activity Diagram (Swimlanes)

```puml
@startuml
title UC002 - View Flight Details

|User|
start
:Search results visible\n(from UC001);
:Click itinerary in\nresults list;

|System|
:Check itinerary still in\ncurrent results;
if (Itinerary present?) then (No)
  :Show "Results changed,\nplease search again";
  stop
endif

:Get detailed data for\nselected itinerary;

if (All details available?) then (No)
  :Show partial details with\n"Some info unavailable";
else (Yes)
  :Show airline, flight nos,\n times, airports, duration;
endif

:Show leg-by-leg disruption\nand connection risk plus\noverall reliability score;
stop

@enduml
```

### UML Activity Diagram (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> ResultsDisplayed: Search results list is visible (UC001 complete)
    ResultsDisplayed --> ClickItinerary: User selects an itinerary from the list
    
    state VerifyPresence <<choice>>
    ClickItinerary --> VerifyPresence: Rule: Is itinerary still in current search set?
    VerifyPresence --> SetStaleError: No (Results have refreshed/stale)
    VerifyPresence --> RequestLegDetails: Yes (Itinerary is valid)
    
    SetStaleError --> [*]: Return user to home / refresh list
    
    RequestLegDetails --> EvaluateFetchResult: Retrieve individual leg parameters
    
    state EvaluateFetchResult <<choice>>
    EvaluateFetchResult --> PartialDetailsDisplay: Data Fetch Error (incomplete leg data)
    EvaluateFetchResult --> FullDetailsDisplay: Fetch Success (complete details returned)
    
    PartialDetailsDisplay --> CompositeView: Render warning & show available subset only
    FullDetailsDisplay --> CompositeView: Render airline, flight nums, dep/arr times, airports, and duration
    
    CompositeView --> [*]: Render overall reliability score and leg-by-leg disruption/connection threats
```

### Process Narrative
1. **User Action:** Clicks a specific itinerary card from the results list.
2. **Local Session Check:** Ensures selection exists in active UI cache.
3. **Data Retrieval:** Submits query for deep leg objects (tail numbers, terminal transfers, layover times).
4. **Exception Handling:** If API fails on subset of legs, falls back safely to displaying active static fields to avoid total screen failure.
5. **Diagnostic Display:** Shows visual layover connection nodes and risk parameters.

---

## UC003: Sort and Filter Results

### Purpose
To let the user organize and narrow down the list of itineraries according to personal preferences using the currently displayed search results.

### PlantUML Activity Diagram (Swimlanes)

```puml
@startuml
title UC003 - Sort and Filter Results

|User|
start
:Search results visible\n(from UC001);
:Select sorting option (e.g., highest reliability,\nlowest price, shortest duration) or\nadjust filter criteria (stops, airlines, windows);

|System|
:Identify active control trigger;
if (Is Sort Trigger?) then (Yes)
  :Sort displayed itinerary list locally\nbased on selected criteria;
else (No, Filter Trigger)
  :Apply selected filter conditions\nlocally to current itinerary list;
  :Count remaining matching itineraries;
  if (Remaining count > 0?) then (Yes)
    :Hide non-matching itineraries;
  else (No)
    :Show "No itineraries match the\nselected filters" message;
    :Keep filter controls visible and responsive;
  endif
endif

:Refresh results on viewport instantly;
stop
@enduml
```

### UML Activity Diagram (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> SearchFinished: Home list displays current active search results
    SearchFinished --> InteractsControls: User adjusts Sort/Filter controls in Web UI
    
    state DirectAction <<choice>>
    InteractsControls --> DirectAction: Detect active control trigger
    DirectAction --> UserSortTrigger: User adjusts Sorting Dropdown
    DirectAction --> UserFilterTrigger: User toggles Filter Checks
    
    UserSortTrigger --> ReorderLocally: Sort locally by selected metric (reliability, price, duration)
    ReorderLocally --> RefreshListUI: Instantly refresh item order in UI list
    
    UserFilterTrigger --> FilterLocally: Filter locally by stops, airline, or time of day
    FilterLocally --> CheckSubcount: Evaluate resulting filtered array
    
    state CheckSubcount <<choice>>
    CheckSubcount --> EmptySubset: Remaining itineraries count = 0
    CheckSubcount --> ValidSubset: Remaining itineraries count > 0
    
    EmptySubset --> RefreshListUI: Display "No matching filters", keep filters open
    ValidSubset --> RefreshListUI: Keep matched itineraries visible, hide the rest
    
    RefreshListUI --> [*]: List updated on viewport instantaneously with no API call
```

### Process Narrative
1. **User Action:** Initiates a sort alteration (e.g. price) or toggles checkboxes (e.g. direct flights).
2. **Processing Limitation Rule:** Done entirely client-side using stored state arrays without calling external APIs.
3. **Alternate Outcome:** If filters are over-restrictive, the system catches the zero-length result state and renders a "No matching filters" alert, keeping elements accessible to ease adjustments.

---

## UC004: View Alternative Itineraries

### Purpose
To enable the user to review better alternative itineraries from the current search results when a selected itinerary appears less favorable in terms of reliability or price.

### PlantUML Activity Diagram (Swimlanes)

```puml
@startuml
title UC004 - View Alternative Itineraries

|User|
start
:Select itinerary and open detailed view;

|System|
:Evaluate other itineraries in current result set\n(excluding the currently selected itinerary);
:Filter suitable alternatives based on:\n- Is more reliable?\n- OR is cheaper?;

if (Any suitable alternatives found?) then (No)
  :Display message indicating\nno better alternative is available;
  stop
else (Yes)
  :Display alternative itineraries detailing:\n- Reliability scores and price comparisons\n- Key differences vs selected itinerary;
  
  |User|
  if (Select suggested alternative?) then (Yes)
    |System|
    :Update selected itinerary state;
    :Retrieve and refresh updated details\nand diagnostics for the new selection;
  else (No, keep original)
  endif
  stop
endif

@enduml
```

### UML Activity Diagram (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> MainDetailsSelected: User opens View Flight Details pane (UC002)
    MainDetailsSelected --> ComputeAlternatives: System initiates local comparison process
    ComputeAlternatives --> ApplyExclusion: Exclude selected itinerary from comparison set (Rule)
    ApplyExclusion --> QueryBetterOptions: Look for entries with higher reliability OR lower price
    
    state EvaluateBetterOptions <<choice>>
    QueryBetterOptions --> EvaluateBetterOptions: Are any matching candidates identified?
    EvaluateBetterOptions --> RenderNoAltsMessage: No (Selected is already optimal)
    EvaluateBetterOptions --> RenderAltCardsList: Yes (Found cheaper or more reliable options)
    
    RenderNoAltsMessage --> [*]: Display neutral "No better alternatives available" indicator
    
    RenderAltCardsList --> AwaitUserInteraction: Display cards alongside absolute comparative diffs
    
    state UserChoice <<choice>>
    AwaitUserInteraction --> UserChoice: User responds
    UserChoice --> UserClosesPane: Close Details
    UserChoice --> UserClicksAltCard: Select an alternative suggestion card
    
    UserClosesPane --> [*]: UI returns to raw Search Results
    UserClicksAltCard --> UpdateGlobalSelection: Set alternative as newly selected itinerary
    UpdateGlobalSelection --> MainDetailsSelected: Force re-entry and reload details for chosen alternative
```

### Process Narrative
1. **Pre-processing Hook:** Upon showing details of flight `X`, the system extracts `X`'s cost and danger vectors.
2. **Comparison Logic:** Scans the remaining array subset. Filters records that have lower cost OR significantly better safety ratings.
3. **Comparative Display:** Shows alternative cards showing precisely what is saved (e.g., "+$40 saving", "+12% reliability").
4. **Navigation:** Allows instant swap click, treating the destination option as the new active focus.

---

## UC005: Save or Export Itinerary

### Purpose
To let the user save a selected itinerary to the system for later reference or export its details for external use when booking with airlines or travel agents.

### PlantUML Activity Diagram (Swimlanes)

```puml
@startuml
title UC005 - Save or Export Itinerary

|User|
start
:Viewing details of chosen itinerary;
:Click "Save" or "Export" button;

|System|
:Prepare summary of non-sensitive details\n(flight legs, timings, reliability score);

if (Summary generation successful?) then (No)
  :Display error message\nasking user to try again later;
  stop
else (Yes)
  if (Action selected is Save?) then (Yes)
    :Check user authentication status;
    if (Is authenticated user?) then (No)
      :Display message requesting user\nto sign in or re-verify session;
      stop
    else (Yes)
      :Store summary under current user\nin 'saved_itineraries' Firestore;
      :Update itinerary saved status in UI;
    endif
  else (No, Export / Share Details)
    :Prepare itinerary summary for external use\n(e.g., copy to clipboard or open share drawer);
  endif
  :Display confirmation message\n(Successfully saved or Export ready);
  stop
endif

@enduml
```

### UML Activity Diagram (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> ItineraryDetailsOpen: User is viewing details (UC002)
    ItineraryDetailsOpen --> ActionSelected: User clicks "Save" or "Export" on details page
    
    actionPreparation: Generate non-sensitive itinerary text / data summary
    ActionSelected --> actionPreparation
    
    state ValidationSuccess <<choice>>
    actionPreparation --> ValidationSuccess: Did summary compile successfully?
    ValidationSuccess --> DisplayGenError: No (Formatting/State failure)
    ValidationSuccess --> RoutingAction: Yes (Payload is prepared)
    
    DisplayGenError --> [*]: Display "Error generating summary. Please try again."
    
    state RoutingAction <<choice>>
    RoutingAction --> SaveExecution: User chose Save Itinerary
    RoutingAction --> ExportExecution: User chose Export / Share Details
    
    SaveExecution --> CheckSession: Query session authentication status
    
    state SessionSuccess <<choice>>
    CheckSession --> SessionSuccess: Is user authenticated?
    SessionSuccess --> PromptAuthError: No (No verified UID)
    SessionSuccess --> WriteFirestore: Yes (Session is verified and active)
    
    PromptAuthError --> [*]: Display "Please sign in or register to save itineraries"
    WriteFirestore --> UpdateSaveUIState: Save record to 'saved_itineraries' Firestore collection
    UpdateSaveUIState --> DispatchSuccessAlert: Mark active item as saved in UI list
    
    ExportExecution --> ExecuteWebShare: Invoke browser clipboard or share drawer
    ExecuteWebShare --> DispatchSuccessAlert: Show "Itinerary copied/exported!" toast
    
    DispatchSuccessAlert --> [*]: Display success message to User
```

### Process Narrative
1. **Trigger:** User chooses to save (cloud bookmark) or export (clipboard copy/export).
2. **Cleansing filter:** Synthesizes a record containing times, airports, and scores. Excludes payment or credentials.
3. **Authentication Check:** If user chooses "Save In App", verifies active Firebase credential. If missing, blocks save and displays registration popover.
4. **Storage Phase:** Commits object to the cloud synced with user account id.

---

## UC006: Email Itinerary Summary

### Purpose
To allow the user to share or email a selected itinerary’s details and risk overview for later reference or external use through the device’s default email client.

### PlantUML Activity Diagram (Swimlanes)

```puml
@startuml
title UC006 - Email Itinerary Summary

|User|
start
:Viewing details of selected itinerary;
:Click the "Share" email icon;

|System|
:Extract non-sensitive itinerary details\n(flights, timings, airports, price, risk rating);

if (Summary text compilation successful?) then (No)
  :Display summary generation error message;
  stop
else (Yes)
  :Format details into email-ready text\nand URL-encode into a 'mailto:' link\nwith pre-populated subject and body;
  
  :Attempt to open system default email client;
  if (Default email client successfully triggered?) then (No / Unavailable)
    :Display message indicating client unavailable;
    :Suggest copying itinerary details manually\n(Automatically copies text to clipboard);
  else (Yes)
    :Open device’s default email client\nwith pre-populated draft;
    |User|
    :Review draft in external email client;
    :Send email manually;
  endif
  stop
endif

@enduml
```

### UML Activity Diagram (Mermaid)

```mermaid
stateDiagram-v2
    [*] --> DeepDetailsOpen: User is viewing specific details (UC002)
    DeepDetailsOpen --> ShareEmailClicked: User clicks the mail icon or share button
    
    ShareEmailClicked --> CompileEmailBody: Extract itinerary data and format standard plaintext body
    
    state ConversionSuccess <<choice>>
    CompileEmailBody --> ConversionSuccess: Successful extraction?
    ConversionSuccess --> DisplayMailFormatError: No (Data structure is corrupt)
    ConversionSuccess --> BuildMailtoLink: Yes (Data validated and text-bound)
    
    DisplayMailFormatError --> [*]: Display "Unable to generate summary. Try again."
    
    BuildMailtoLink --> InvokeMailto: Encode text payload into system 'mailto:' URI string
    
    state ClientCheck <<choice>>
    InvokeMailto --> ClientCheck: Browser requests OS handler for mailto draft
    ClientCheck --> FailureMailFallback: OS handler/Mail Client is absent or rejects request
    ClientCheck --> SuccessDraftOpened: Default mail program successfully handles request
    
    FailureMailFallback --> [*]: Alert user, automatically copy pre-formatted body text to fallback clipboard
    
    SuccessDraftOpened --> [*]: Display populated draft. User reviews and sends manually.
```

### Process Narrative
1. **Trigger:** User triggers standard email share hook on an itinerary detail card.
2. **Extraction Engine:** Compiles legible structural text comprising airport codes, flight numbers, transfer layovers, and reliability scores.
3. **Protocol Layer:** Forms a well-formed RFC 6068 `mailto:` URI, URL-encoding text into `%20`/`%0D%0A` formatting.
4. **Channel Execution:** Launches target URI in system runtime context. If no client is captured, invokes safety backup (dumps formatted summary straight to copyable clipboard to prevent process block).
5. **Closure:** Handed off to device mail application where the user makes the final "Send" action.
