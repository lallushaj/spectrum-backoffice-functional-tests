@spectrum @functional @regression @appointments
Feature: Appointment management

  Background:
    Given the user is logged into Spectrum Back Office
    And the user opens the "Appointments" module
    And the appointments list is loaded

  @columns
  Scenario: Appointment list displays the business columns
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @search
  Scenario: Appointment search accepts an exact reference
    When the user searches appointments for "AQA_APPOINTMENT_REFERENCE"
    Then the appointment results should show no data

  @search
  Scenario: Appointment search accepts a partial reference
    When the user searches appointments for "AQA_APPOINTMENT"
    Then the appointment results should show no data

  @search @negative
  Scenario: Searching for an unknown appointment shows an empty result
    When the user searches appointments for "AQA_NON_EXISTING_APPOINTMENT"
    Then the appointment results should show no data

  @search
  Scenario: Clearing appointment search restores the list state
    When the user searches appointments for "AQA_APPOINTMENT"
    And the user clears the appointment search
    Then the appointment pagination summary should be displayed

  @sorting
  Scenario: Appointment list sorts by ID ascending
    When the user sorts appointments by "ID" ascending
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @sorting
  Scenario: Appointment list sorts by ID descending
    When the user sorts appointments by "ID" descending
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @sorting
  Scenario: Appointment list sorts by organization ascending
    When the user sorts appointments by "Organization" ascending
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @sorting
  Scenario: Appointment list sorts by session ID ascending
    When the user sorts appointments by "Session ID" ascending
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @sorting
  Scenario: Appointment list sorts by date ascending
    When the user sorts appointments by "Date" ascending
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @sorting
  Scenario: Appointment list sorts by venue descending
    When the user sorts appointments by "Venue" descending
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @columns
  Scenario: Appointment column selector displays the selected column count
    When the user opens the appointment column selector
    Then the appointment column selector should show "7" selected columns

  @columns
  Scenario: Appointment list keeps the configured default page size
    Then the appointment page size should show "50"

  @pagination
  Scenario: Appointment page-size selector can be opened
    When the user opens the appointment page-size selector
    Then the appointment page size should show "50"

  @pagination
  Scenario: Appointment list displays pagination summary
    Then the appointment pagination summary should be displayed

  @filter
  Scenario: Appointment filters expose service and venue criteria
    When the user opens appointment filters
    Then the appointment filters should include service and venue

  @filter
  Scenario: Appointment filters can be cancelled without applying changes
    When the user opens appointment filters
    And the user cancels appointment filters
    Then the appointment list should show columns "ID, Organization, Session ID, Date, Time slot, Venue"

  @filter @negative
  Scenario: Appointment list remains empty when no records match the current backend state
    Then the appointment results should show no data

  @create @validation
  Scenario: New appointment starts with organization selection
    When the user starts a new appointment
    Then the new appointment organization step should be displayed

  @create
  Scenario: New appointment organization selector provides available organizations
    When the user starts a new appointment
    And the user opens the organization options
    Then organization options should be available

  @create
  Scenario: Selecting an organization opens the appointment request step
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    Then the appointment request step should be displayed

  @create @business-rule
  Scenario: Appointment creation displays the SNG request selection rule
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    Then the SNG request selection rule should be displayed

  @create @validation
  Scenario: Venue and Date cannot be selected before a request is selected
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    Then the Venue and Date action should be disabled

  @filter
  Scenario: Appointment filters can be confirmed without selecting criteria
    When the user opens appointment filters
    And the user confirms appointment filters
    Then the appointment pagination summary should be displayed

  @filter
  Scenario: Appointment filters can be closed using the drawer close control
    When the user opens appointment filters
    And the user closes appointment filters
    Then the appointment filters should be closed and the list should remain visible

  @create @validation
  Scenario: Cancelling a new appointment from the organization step returns to the list
    When the user starts a new appointment
    And the user cancels the new appointment
    Then the appointment list should be displayed again

  @create @validation
  Scenario: Cancelling a new appointment from the request step returns to the list
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    And the user cancels the new appointment
    Then the appointment list should be displayed again

  @create @business-rule
  Scenario: The request selection step reuses the same service and venue filter criteria
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    And the user opens appointment filters
    Then the appointment filters should include service and venue

  @create @business-rule
  Scenario: Cancelling request-step filters keeps the request selection step visible
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    And the user opens appointment filters
    And the user cancels appointment filters
    Then the appointment request step should be displayed

  @create @negative
  Scenario: The request step shows no data when the selected organization has no bookable requests
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    Then the appointment results should show no data

  @create
  Scenario: Organization search field accepts free text
    When the user starts a new appointment
    And the user searches for organization "Wiz"
    Then the organization search field should contain "Wiz"

  @create @business-rule
  Scenario: Selecting an organization keeps the request selection step visible
    When the user starts a new appointment
    And the user opens the organization options
    And the user selects the first organization
    Then the appointment request step should be displayed
