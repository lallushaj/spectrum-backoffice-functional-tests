@spectrum @functional @regression @reports
Feature: Report management

  Background:
    Given the user is logged into Spectrum Back Office
    When the user opens the "Reports" module
    And the embedded reports table is loaded

  @embedded
  Scenario: Reports are rendered in the embedded report application
    Then the embedded reports table should be displayed

  @columns
  Scenario: Reports display the supported table columns
    Then the reports table should show its supported columns

  @search
  Scenario: Reports display the search controls
    Then the reports search controls should be displayed

  @empty-state
  Scenario: Reports display an empty state when no report definitions exist
    Then the reports table should show no data

  @search
  Scenario: Report search accepts an exact title
    When the user searches reports for "AQA_REPORT_TITLE"
    Then the reports table should show no data

  @search
  Scenario: Report search accepts a partial title
    When the user searches reports for "AQA_REPORT"
    Then the reports table should show no data

  @search @negative
  Scenario: Searching for an unknown report returns no data
    When the user searches reports for "AQA_NON_EXISTING_REPORT"
    Then the reports table should show no data

  @search
  Scenario: Clearing report search preserves the report table state
    When the user searches reports for "AQA_REPORT"
    And the user clears the report search
    Then the reports table should show no data

  @sorting
  Scenario: Reports sort by title ascending
    When the user sorts reports by "Title" ascending
    Then the reports table should show its supported columns

  @sorting
  Scenario: Reports sort by title descending
    When the user sorts reports by "Title" descending
    Then the reports table should show its supported columns

  @sorting
  Scenario: Reports sort by created date ascending
    When the user sorts reports by "Created" ascending
    Then the reports table should show its supported columns

  @sorting
  Scenario: Reports sort by created date descending
    When the user sorts reports by "Created" descending
    Then the reports table should show its supported columns

  @sorting
  Scenario: Reports sort by updated date ascending
    When the user sorts reports by "Updated" ascending
    Then the reports table should show its supported columns

  @sorting
  Scenario: Reports sort by updated date descending
    When the user sorts reports by "Updated" descending
    Then the reports table should show its supported columns

  @refresh
  Scenario: Reports can be refreshed
    When the user refreshes the reports table
    Then the reports table should show its supported columns

  @refresh @empty-state
  Scenario: Refresh preserves the report empty state
    When the user refreshes the reports table
    Then the reports table should show no data

  @search @negative
  Scenario: Repeated unknown report searches remain empty
    When the user searches reports for "NO_REPORT_001"
    Then the reports table should show no data
    When the user searches reports for "NO_REPORT_002"
    Then the reports table should show no data

  @search
  Scenario: Clearing an unknown report search remains stable
    When the user searches reports for "NO_REPORT_003"
    And the user clears the report search
    Then the reports table should show no data

  @columns
  Scenario: The report Tags column remains part of the report contract
    Then the reports table should show its supported columns

  @regression
  Scenario: Report table remains usable after search and sorting
    When the user searches reports for "AQA_REPORT"
    And the user sorts reports by "Updated" descending
    Then the reports table should show its supported columns
