@spectrum @functional @regression @venues
Feature: Venue management

  Background:
    Given the user is logged into Spectrum Back Office
    When the user opens the "Venues" module
    And the venues list is loaded

  @columns
  Scenario: Venue table displays its business columns
    Then the venue table should show its business columns

  @search
  Scenario: Venue search finds an exact venue name
    When the user searches venues for "Rose Bowl Stadium"
    Then the venue results should contain "Rose Bowl Stadium"

  @search
  Scenario: Venue search finds a venue by exact code
    When the user searches venues for "RBS"
    Then the venue results should contain "RBS"

  @search
  Scenario: Venue search finds a partial venue name
    When the user searches venues for "Rose"
    Then the venue results should contain "Rose Bowl Stadium"

  @negative @validation
  Scenario: Unknown venue search returns no data
    When the user searches venues for "AQA_NON_EXISTING_VENUE"
    Then the venue results should show no data

  @search
  Scenario: Clearing venue search restores the venue list
    When the user searches venues for "RBS"
    And the user clears the venue search
    Then the venue pagination summary should be displayed

  @sorting
  Scenario: Venues sort by name ascending
    When the user sorts venues by "Venue" ascending
    Then the venue table should show its business columns

  @sorting
  Scenario: Venues sort by name descending
    When the user sorts venues by "Venue" descending
    Then the venue table should show its business columns

  @sorting
  Scenario: Venues sort by address ascending
    When the user sorts venues by "Address" ascending
    Then the venue table should show its business columns

  @sorting
  Scenario: Venues sort by address descending
    When the user sorts venues by "Address" descending
    Then the venue table should show its business columns

  @sorting
  Scenario: Venues sort by location ascending
    When the user sorts venues by "Location" ascending
    Then the venue table should show its business columns

  @sorting
  Scenario: Venues sort by location descending
    When the user sorts venues by "Location" descending
    Then the venue table should show its business columns

  @sorting
  Scenario: Venues sort by code ascending
    When the user sorts venues by "Code" ascending
    Then the venue table should show its business columns

  @sorting
  Scenario: Venues sort by code descending
    When the user sorts venues by "Code" descending
    Then the venue table should show its business columns

  @refresh
  Scenario: Venue table can be refreshed
    When the user refreshes the venues table
    Then the venue pagination summary should be displayed

  @pagination
  Scenario: Venue table uses the configured page size
    Then the venue page size should show "30"

  @pagination
  Scenario: Venue table displays its pagination summary
    Then the venue pagination summary should be displayed

  @pagination
  Scenario: Venue table exposes the first page
    Then the venue list should expose page number "1"

  @create @validation
  Scenario: Venue creation displays all supported fields
    When the user opens the venue creation form
    Then the venue creation fields should be displayed

  @create @validation
  Scenario: Venue address validation is disabled before an address is entered
    When the user opens the venue creation form
    Then the venue address validation control should be disabled

  @create @validation
  Scenario: Venue save is disabled when mandatory fields are empty
    When the user opens the venue creation form
    Then the venue save button should be disabled

  @create
  Scenario: Venue type selector exposes Indoor and Outdoor options
    When the user opens the venue creation form
    And the user opens the venue type selector
    Then the venue type options should be available

  @create
  Scenario: Indoor venue type can be selected
    When the user opens the venue creation form
    And the user selects venue type "Indoor"
    Then venue type "Indoor" should be selected

  @create
  Scenario: Outdoor venue type can be selected
    When the user opens the venue creation form
    And the user selects venue type "Outdoor"
    Then venue type "Outdoor" should be selected

  @create @validation
  Scenario: Address validation failure is shown for an unvalidated address
    When the user opens the venue creation form
    And the user fills venue name "AQA_UNVALIDATED_VENUE" and code "AQAUV"
    And the user validates venue address "10 Downing Street, London"
    Then the venue address should be marked as not validated
    And the venue save button should be disabled

  @create @validation
  Scenario: Valid coordinates satisfy the venue creation requirement
    When the user opens the venue creation form
    And the user fills venue name "AQA_COORDINATE_VENUE" and code "AQACO"
    And the user enters venue coordinates "34.05" and "-118.25"
    Then the venue save button should be enabled

  @create @negative
  Scenario: Venue remains unsaved when address validation fails
    When the user opens the venue creation form
    And the user fills venue name "AQA_FAILED_ADDRESS" and code "AQAFAD"
    And the user validates venue address "Invalid Address AQA"
    Then the venue address should be marked as not validated

  @create
  Scenario: Venue creation can be cancelled without saving
    When the user opens the venue creation form
    And the user cancels venue creation
    Then the venues list is loaded

  @create @validation
  Scenario: Venue save remains disabled when only name and code are supplied
    When the user opens the venue creation form
    And the user fills venue name "AQA_REQUIRED_FIELDS" and code "AQARF"
    Then the venue save button should be disabled

  @create @validation
  Scenario: Selecting a venue type does not bypass address validation
    When the user opens the venue creation form
    And the user fills venue name "AQA_TYPE_WITHOUT_ADDRESS" and code "AQATWA"
    And the user selects venue type "Outdoor"
    Then the venue save button should be disabled

  @create @validation
  Scenario: Entering an address enables address validation
    When the user opens the venue creation form
    And the user fills venue name "AQA_ADDRESS_READY" and code "AQARDY"
    And the user enters venue address "10 Downing Street, London"
    Then the venue address validation control should be enabled

  @create @validation
  Scenario: Venue coordinates are retained after valid decimal input
    When the user opens the venue creation form
    And the user enters venue coordinates "34.05" and "-118.25"
    Then the venue coordinates should remain "34.05" and "-118.25"

  @create @validation
  Scenario: Venue coordinate boundary values are accepted as form input
    When the user opens the venue creation form
    And the user fills venue name "AQA_BOUNDARY_VENUE" and code "AQABDY"
    And the user enters venue coordinates "-90" and "180"
    Then the venue coordinates should remain "-90" and "180"
    And the venue save button should be enabled

  @create
  Scenario: Changing venue type replaces the previous selection
    When the user opens the venue creation form
    And the user selects venue type "Indoor"
    And the user selects venue type "Outdoor"
    Then venue type "Outdoor" should be selected

  @create @safety
  Scenario: Saving venue creation keeps the entered value in the list
    When the user opens the venue creation form
    And the user fills venue name "AQABBC_SAVED_VENUE" and code "BCBAQASAV"
    And the user selects venue type "Indoor"
    And the user enters venue coordinates "66.4000000000000000" and "44.0000000000000000"
    Then the venue save button should be enabled
    When the user saves venue creation
    And the user confirms the venue creation dialog
    Then the venues list is loaded
    And the venue results should contain "AQAB_SAVED_VENUE"
