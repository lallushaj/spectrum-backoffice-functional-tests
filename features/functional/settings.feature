@spectrum @functional @regression @settings
Feature: Application settings

  @system-settings @configuration
  Scenario: System settings expose the system timezone configuration
    Given the user is logged into Spectrum Back Office
    When the user opens the "System Settings" module
    Then the system timezone configuration should be available

  @system-settings @configuration
  Scenario: System settings keep timezone editable without saving before change
    Given the user is logged into Spectrum Back Office
    When the user opens the "System Settings" module
    Then the timezone selector is enabled while Save stays disabled before change

  @general-settings @configuration
  Scenario: General settings expose portal status and opening periods
    Given the user is logged into Spectrum Back Office
    When the user opens the "General Settings" module
    Then the general portal configuration should be available

  @general-settings @configuration
  Scenario: General settings expose portal override and opening periods with controls
    Given the user is logged into Spectrum Back Office
    When the user opens the "General Settings" module
    Then the portal status override and opening periods display with form controls

  @communication-settings @configuration
  Scenario: Communication settings expose sender configuration and email triggers
    Given the user is logged into Spectrum Back Office
    When the user opens the "Communication Settings" module
    Then the communication configuration and email triggers should be available

  @communication-settings @configuration
  Scenario: Communication settings show email trigger table and sender controls
    Given the user is logged into Spectrum Back Office
    When the user opens the "Communication Settings" module
    Then the communication email trigger table and sender controls are visible

  @commands @configuration
  Scenario: Commands expose the supported administrative synchronization options
    Given the user is logged into Spectrum Back Office
    When the user opens the "Commands" module
    Then the administrative command options should be available

  @commands @configuration
  Scenario: Commands open without executing a command
    Given the user is logged into Spectrum Back Office
    When the user opens the "Commands" module
    Then the administrative command dropdown opens without triggering a dialog

  @venue-settings @configuration
  Scenario: Venue settings expose NAD83 coordinate validation boundaries
    Given the user is logged into Spectrum Back Office
    When the user opens the "Venue Settings" module
    Then the venue coordinate configuration should be available

  @venue-settings @configuration
  Scenario: Venue settings expose coordinate inputs and range guidance
    Given the user is logged into Spectrum Back Office
    When the user opens the "Venue Settings" module
    Then the venue coordinate inputs and guidance are visible
