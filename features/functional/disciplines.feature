@spectrum @functional @regression @disciplines
Feature: Discipline reference management

  Background:
    Given the user is logged into Spectrum Back Office
    When the user opens the "Disciplines" module
    And the "Disciplines" reference table is loaded

  @columns
  Scenario: Discipline table displays its reference columns
    Then the "Disciplines" table should show columns "Name, Code, Sport Code, International Federation"

  @search
  Scenario: Discipline search finds an exact discipline name
    When the user searches the "Disciplines" table for "3x3 Basketball"
    Then the "Disciplines" table should contain "3x3 Basketball"

  @search
  Scenario: Discipline search finds a partial discipline name
    When the user searches the "Disciplines" table for "Basketball"
    Then the "Disciplines" table should contain "Basketball"

  @search
  Scenario: Discipline search finds a discipline by code
    When the user searches the "Disciplines" table for "BK3"
    Then the "Disciplines" table should contain "BK3"

  @search @negative
  Scenario: Unknown discipline search returns no data
    When the user searches the "Disciplines" table for "AQA_NON_EXISTING_DISCIPLINE"
    Then the "Disciplines" table should show no data

  @search
  Scenario: Clearing discipline search restores the paginated list
    When the user searches the "Disciplines" table for "BK3"
    And the user clears the "Disciplines" table search
    Then the "Disciplines" table pagination summary should be displayed

  @sorting
  Scenario: Disciplines sort by name ascending
    When the user sorts the "Disciplines" table by "Name" ascending
    Then the "Disciplines" table should show columns "Name, Code, Sport Code, International Federation"

  @sorting
  Scenario: Disciplines sort by name descending
    When the user sorts the "Disciplines" table by "Name" descending
    Then the "Disciplines" table should show columns "Name, Code, Sport Code, International Federation"

  @sorting
  Scenario: Disciplines sort by code ascending
    When the user sorts the "Disciplines" table by "Code" ascending
    Then the "Disciplines" table should show columns "Name, Code, Sport Code, International Federation"

  @sorting
  Scenario: Disciplines sort by sport code descending
    When the user sorts the "Disciplines" table by "Sport Code" descending
    Then the "Disciplines" table should show columns "Name, Code, Sport Code, International Federation"

  @sorting
  Scenario: Disciplines sort by international federation ascending
    When the user sorts the "Disciplines" table by "International Federation" ascending
    Then the "Disciplines" table should show columns "Name, Code, Sport Code, International Federation"

  @refresh
  Scenario: Discipline table can be refreshed
    When the user refreshes the "Disciplines" table
    Then the "Disciplines" table pagination summary should be displayed

  @pagination
  Scenario: Discipline table uses the configured page size
    Then the "Disciplines" table page size should show "30"

  @pagination
  Scenario: Discipline table displays its pagination summary
    Then the "Disciplines" table pagination summary should be displayed

  @pagination
  Scenario: Discipline table exposes the first page
    Then the "Disciplines" table should expose page number "1"

  @pagination
  Scenario: Discipline table exposes the fifth page
    Then the "Disciplines" table should expose page number "5"
