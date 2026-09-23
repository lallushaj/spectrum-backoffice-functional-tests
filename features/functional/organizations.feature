@spectrum @functional @regression @organizations
Feature: Organization reference management

  Background:
    Given the user is logged into Spectrum Back Office
    When the user opens the "Organizations" module
    And the "Organizations" reference table is loaded

  @columns
  Scenario: Organization table displays its reference columns
    Then the "Organizations" table should show columns "Code, Name, Organization Type"

  @search
  Scenario: Organization search finds an exact organization code
    When the user searches the "Organizations" table for "UGA"
    Then the "Organizations" table should contain "UGA"

  @search
  Scenario: Organization search finds an exact organization name
    When the user searches the "Organizations" table for "Uganda"
    Then the "Organizations" table should contain "Uganda"

  @search
  Scenario: Organization search finds a partial organization name
    When the user searches the "Organizations" table for "Game"
    Then the "Organizations" table should contain "Game"

  @search @negative
  Scenario: Unknown organization search returns no data
    When the user searches the "Organizations" table for "AQA_NON_EXISTING_ORGANIZATION"
    Then the "Organizations" table should show no data

  @search
  Scenario: Clearing organization search restores the paginated list
    When the user searches the "Organizations" table for "UGA"
    And the user clears the "Organizations" table search
    Then the "Organizations" table pagination summary should be displayed

  @sorting
  Scenario: Organizations sort by code ascending
    When the user sorts the "Organizations" table by "Code" ascending
    Then the "Organizations" table should show columns "Code, Name, Organization Type"

  @sorting
  Scenario: Organizations sort by code descending
    When the user sorts the "Organizations" table by "Code" descending
    Then the "Organizations" table should show columns "Code, Name, Organization Type"

  @sorting
  Scenario: Organizations sort by name ascending
    When the user sorts the "Organizations" table by "Name" ascending
    Then the "Organizations" table should show columns "Code, Name, Organization Type"

  @sorting
  Scenario: Organizations sort by name descending
    When the user sorts the "Organizations" table by "Name" descending
    Then the "Organizations" table should show columns "Code, Name, Organization Type"

  @sorting
  Scenario: Organizations sort by organization type ascending
    When the user sorts the "Organizations" table by "Organization Type" ascending
    Then the "Organizations" table should show columns "Code, Name, Organization Type"

  @refresh
  Scenario: Organization table can be refreshed
    When the user refreshes the "Organizations" table
    Then the "Organizations" table pagination summary should be displayed

  @pagination
  Scenario: Organization table uses the configured page size
    Then the "Organizations" table page size should show "30"

  @pagination
  Scenario: Organization table displays its pagination summary
    Then the "Organizations" table pagination summary should be displayed

  @pagination
  Scenario: Organization table exposes the first page
    Then the "Organizations" table should expose page number "1"

  @pagination
  Scenario: Organization table exposes the fifth page
    Then the "Organizations" table should expose page number "5"
