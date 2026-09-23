@spectrum @functional @regression @bulk-import
Feature: Request import support

  Scenario: Import list displays request import history
    Given the user is logged into Spectrum Back Office
    When the user opens the "Import" module
    Then the request import list should be displayed

  Scenario: Import process details can be opened from the import list
    Given the user is logged into Spectrum Back Office
    When the user opens the "Import" module
    And the user opens the first request import process
    Then the request import details should be displayed
