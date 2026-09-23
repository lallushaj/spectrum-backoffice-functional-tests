@spectrum @functional @regression @requests
Feature: Request management

  Background:
    Given the user is logged into Spectrum Back Office
    When the user opens the "Requests" module
    And the requests list is loaded

  @columns
  Scenario: All requests display every business column
    Then the request table should display all business columns

  @tabs
  Scenario: All requests and cancelled requests views are available
    When the user selects the "Cancelled Requests" request view
    Then the request list should show status "Cancelled"

  @cancelled
  Scenario: Cancelled requests view contains only cancelled records
    When the user selects the "Cancelled Requests" request view
    Then the request list should show status "Cancelled"
    And the request pagination summary should be displayed

  @cancelled @columns
  Scenario: Cancelled requests retain the complete request table columns
    When the user selects the "Cancelled Requests" request view
    Then the request table should display all business columns

  @cancelled @search
  Scenario: Cancelled request search finds an exact request identifier
    When the user selects the "Cancelled Requests" request view
    And the user searches requests for "WIZ_SAL_RBS_02092026_0012"
    Then the request results should contain "WIZ_SAL_RBS_02092026_0012"

  @cancelled @search
  Scenario: Cancelled request search finds a partial identifier
    When the user selects the "Cancelled Requests" request view
    And the user searches requests for "WIZ_SAL_RBS"
    Then the request results should contain "WIZ_SAL_RBS"

  @cancelled @search @negative
  Scenario: Unknown cancelled request search returns no data
    When the user selects the "Cancelled Requests" request view
    And the user searches requests for "AQA_NON_EXISTING_CANCELLED_REQUEST"
    Then the request results should show no data

  @cancelled @search
  Scenario: Clearing cancelled request search restores the cancelled list
    When the user selects the "Cancelled Requests" request view
    And the user searches requests for "WIZ_SAL_RBS"
    And the user clears the request search
    Then the request list should show status "Cancelled"

  @search
  Scenario: All-request search finds an exact request identifier
    When the user searches requests for "WIZ_CAM_OTH_08092026_0005"
    Then the request results should contain "WIZ_CAM_OTH_08092026_0005"

  @search
  Scenario: All-request search finds a partial identifier
    When the user searches requests for "WIZ_CAM_OTH"
    Then the request results should contain "WIZ_CAM_OTH"

  @negative @search
  Scenario: An unknown request search returns no matching business record
    When the user searches requests for "AQA_NON_EXISTING_REQUEST"
    Then the request results should show no data

  @search
  Scenario: Clearing all-request search restores the request list
    When the user searches requests for "WIZ_CAM_OTH"
    And the user clears the request search
    Then the request pagination summary should be displayed

  @sorting
  Scenario: Requests sort by request ID ascending
    When the user sorts requests by "Request ID" ascending
    Then the request table should display all business columns

  @sorting
  Scenario: Requests sort by request ID descending
    When the user sorts requests by "Request ID" descending
    Then the request table should display all business columns

  @sorting
  Scenario: Requests sort by status ascending
    When the user sorts requests by "Status" ascending
    Then the request table should display all business columns

  @sorting
  Scenario: Requests sort by date ascending
    When the user sorts requests by "Date" ascending
    Then the request table should display all business columns

  @sorting
  Scenario: Requests sort by user descending
    When the user sorts requests by "User" descending
    Then the request table should display all business columns

  @sorting
  Scenario: Requests sort by organization ascending
    When the user sorts requests by "Organization" ascending
    Then the request table should display all business columns

  @sorting
  Scenario: Requests sort by service descending
    When the user sorts requests by "Service" descending
    Then the request table should display all business columns

  @sorting
  Scenario: Requests sort by venue ascending
    When the user sorts requests by "Venue" ascending
    Then the request table should display all business columns

  @filter
  Scenario: Request filters expose all business filter fields
    When the user opens request filters
    Then the request filters should include service status venue and organization

  @filter
  Scenario: Request filters can be cancelled
    When the user opens request filters
    And the user cancels request filters
    Then the request pagination summary should be displayed

  @filter
  Scenario: Request filters can be confirmed without changing the list contract
    When the user opens request filters
    And the user confirms request filters
    Then the request pagination summary should be displayed

  @pagination
  Scenario: Requests use a page size of fifty by default
    Then the request page size should show "50"

  @pagination
  Scenario: All requests display a pagination summary
    Then the request pagination summary should be displayed

  @pagination
  Scenario: All requests expose the first page
    Then the request list should expose page number "1"

  @pagination
  Scenario: All requests expose the fifth page
    Then the request list should expose page number "5"

  @cancelled @pagination
  Scenario: Cancelled requests display their single-page pagination summary
    When the user selects the "Cancelled Requests" request view
    Then the request pagination summary should be displayed

  @actions
  Scenario: Request toolbar actions are available
    Then the request toolbar actions should be available

  @details
  Scenario: A request identifier opens request details
    When the user opens the first request result
    Then the request details should be displayed

  @details @status
  Scenario: Request status action state is exposed on the details page
    When the user opens the first request result
    Then the request status action should be disabled
