@spectrum @functional @regression @organization-types
Feature: Organization type reference management

  Background:
    Given the user is logged into Spectrum Back Office
    When the user opens the "Organizations Types" module
    And the "Organizations Types" reference table is loaded

  @columns
  Scenario: Organization type table displays its reference columns
    Then the "Organizations Types" table should show columns "Code, Name"

  @search
  Scenario: Organization type search finds an exact code
    When the user searches the "Organizations Types" table for "OCOG"
    Then the "Organizations Types" table should contain "OCOG"

  @search
  Scenario: Organization type search finds an exact name
    When the user searches the "Organizations Types" table for "Press"
    Then the "Organizations Types" table should contain "Press"

  @search
  Scenario: Organization type search finds a partial name
    When the user searches the "Organizations Types" table for "Olympic"
    Then the "Organizations Types" table should contain "Olympic"

  @search @negative
  Scenario: Unknown organization type search returns no data
    When the user searches the "Organizations Types" table for "AQA_NON_EXISTING_ORGANIZATION_TYPE"
    Then the "Organizations Types" table should show no data

  @search
  Scenario: Clearing organization type search restores the list
    When the user searches the "Organizations Types" table for "OCOG"
    And the user clears the "Organizations Types" table search
    Then the "Organizations Types" table pagination summary should be displayed

  @sorting
  Scenario: Organization types sort by code ascending
    When the user sorts the "Organizations Types" table by "Code" ascending
    Then the "Organizations Types" table should show columns "Code, Name"

  @sorting
  Scenario: Organization types sort by code descending
    When the user sorts the "Organizations Types" table by "Code" descending
    Then the "Organizations Types" table should show columns "Code, Name"

  @sorting
  Scenario: Organization types sort by name ascending
    When the user sorts the "Organizations Types" table by "Name" ascending
    Then the "Organizations Types" table should show columns "Code, Name"

  @sorting
  Scenario: Organization types sort by name descending
    When the user sorts the "Organizations Types" table by "Name" descending
    Then the "Organizations Types" table should show columns "Code, Name"

  @refresh
  Scenario: Organization type table can be refreshed
    When the user refreshes the "Organizations Types" table
    Then the "Organizations Types" table pagination summary should be displayed

  @pagination
  Scenario: Organization type table uses the configured page size
    Then the "Organizations Types" table page size should show "30"

  @pagination
  Scenario: Organization type table displays its single-page summary
    Then the "Organizations Types" table pagination summary should be displayed

  @pagination
  Scenario: Organization type table exposes its first page
    Then the "Organizations Types" table should expose page number "1"
