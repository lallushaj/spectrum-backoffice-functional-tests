# Spectrum Back Office Functional Tests

Independent functional automation for Spectrum Back Office. The project uses Playwright for browser automation, Cucumber for BDD execution, TypeScript for implementation, and Page Object Model for UI ownership.

This repository is designed to live beside the existing automation project. It has its own `package.json`, configuration, environment file, browser lifecycle, features, steps, reports, and test data. It does not depend on the existing repository at runtime.

## Contents

- [Technology](#technology)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment configuration](#environment-configuration)
- [Authentication flow](#authentication-flow)
- [Project architecture](#project-architecture)
- [Running tests](#running-tests)
- [Tags](#tags)
- [HTML reporting](#html-reporting)
- [Functional coverage](#functional-coverage)
- [Test data and safety](#test-data-and-safety)
- [Debugging and troubleshooting](#debugging-and-troubleshooting)
- [Maintenance rules](#maintenance-rules)
- [Known limitations](#known-limitations)

## Technology

- Node.js 20 LTS or newer
- TypeScript
- Playwright and Chromium
- Cucumber.js
- Page Object Model
- Gherkin / BDD
- dotenv
- PowerShell-compatible npm scripts

## Prerequisites

Before running the suite, confirm that the machine has:

1. Node.js and npm installed.
2. Access to the Spectrum Back Office environment.
3. A valid test account for the configured Microsoft identity tenant.
4. Permission to access Spectrum Back Office modules used by the selected tags.
5. The test account password available through local environment configuration.

Verify the toolchain:

```powershell
node --version
npm --version
```

## Installation

From the project directory:

```powershell
npm install
npx playwright install chromium
```

The combined setup command is:

```powershell
npm run setup
```

`npm run setup` installs Node dependencies and the Chromium browser required by the framework. It does not execute test scenarios.

## Environment configuration

Create a local `.env` file from the committed template:

```powershell
Copy-Item .env.example .env
```

Set the password in `.env`:

```dotenv
SBPOJECT_URL=https://admin-gmp.gpm.int.dgplatform.net/app/sbp/dashboard
SBPOJECT_USERNAME=testuserLA9@dgstage.onmicrosoft.com
SBPOJECT_PASSWORD=your-local-password
```

The following variables are required:

| Variable | Purpose |
| --- | --- |
| `SBPOJECT_URL` | Application entry point used by the login flow |
| `SBPOJECT_USERNAME` | Microsoft identity username |
| `SBPOJECT_PASSWORD` | Local password used for authentication |
| `HEADED` | Optional; set to `true` for a visible browser |

Security requirements:

- Never commit `.env`.
- Never place the password in TypeScript, feature files, step definitions, Page Objects, screenshots, or reports.
- Use `.env.example` only as a variable-name template.
- Use a CI secret or protected environment variable when running in a pipeline.

## Authentication flow

Each `@spectrum` scenario uses the shared Cucumber hook:

1. Launch Chromium.
2. Create a scenario-scoped browser context and page.
3. Open `SBPOJECT_URL`.
4. Submit the configured username.
5. Submit the password from `SBPOJECT_PASSWORD`.
6. Wait for Entitlements.
7. Open the application switcher.
8. Select the live application entry labelled `Spectrum Booking`.
9. Wait for the Spectrum Back Office shell.
10. Start the business scenario.

Entitlements and application switching are setup only. They are not functional test coverage.

## Project architecture

```text
features/
  functional/
    appointments.feature
    bulk-import.feature
    disciplines.feature
    organization-types.feature
    organizations.feature
    reports.feature
    requests.feature
    settings.feature
    venues.feature
  fixtures/
    invalid-request-import.xlsx

src/
  config/
    environment.ts              dotenv loading and required variables
  context/
    ScenarioContext.ts           Scenario-scoped values and browser objects
  hooks/
    hooks.ts                     Browser, login, app switch, cleanup, screenshots
  pages/
    Page.ts                      Shared Page Object helpers
    LoginPage.ts                 Microsoft login interaction
    EntitlementsPage.ts          Entitlements readiness and app switch
    SpectrumBackOfficePage.ts    Spectrum shell and module navigation
    AppointmentsPage.ts          Appointment list and creation flow
    RequestsPage.ts               Requests and cancelled requests
    ReportsPage.ts                Embedded report iframe
    VenuesPage.ts                 Venue list and creation form
    ReferenceTablePage.ts         Shared reference-table behavior
    DisciplinesPage.ts
    OrganizationsPage.ts
    OrganizationTypesPage.ts
    SettingsPage.ts               Application Settings tabs
  steps/                         Business-oriented step definitions
  support/
    CustomWorld.ts                Typed Cucumber World
  utils/
    assertions.ts
    tableHelpers.ts
    TestDataFactory.ts

scripts/
  generate-report.ts              Simple JSON-to-HTML report generator

reports/
  cucumber-report.json            Generated by Cucumber
  cucumber-report.html            Generated by npm run report
```

## Running tests

Run the complete suite:

```powershell
npm test
```

Run functional scenarios:

```powershell
npm run test:functional
```

Run regression-tagged scenarios:

```powershell
npm run test:regression
```

Run with a visible Chromium browser:

```powershell
npm run test:headed
```

Run one tag:

```powershell
npm run test:tag -- "@venues"
```

Run combined tag expressions:

```powershell
npm run test:tag -- "@functional and @search"
npm run test:tag -- "@requests and @cancelled"
npm run test:tag -- "@settings"
```

Run the TypeScript compiler check without executing scenarios:

```powershell
npm run typecheck
```

## Tags

Common tags include:

| Tag | Scope |
| --- | --- |
| `@spectrum` | Scenarios requiring the shared login and app-switch flow |
| `@functional` | Functional business coverage |
| `@regression` | Baseline regression coverage |
| `@search` | Search and clear-search behavior |
| `@sorting` | Ascending and descending table sorting |
| `@pagination` | Page-size and pagination behavior |
| `@columns` | Table-column contract checks |
| `@filter` | Filter controls and filter lifecycle |
| `@validation` | Required fields and invalid input behavior |
| `@negative` | Invalid, unknown, or unsupported input |
| `@crud` | CRUD-oriented scenarios where the UI supports them |
| `@create` | Creation workflows |
| `@cancelled` | Cancelled request view and status behavior |
| `@settings` | Application Settings |

Module tags include `@appointments`, `@requests`, `@reports`, `@venues`, `@disciplines`, `@organizations`, `@organization-types`, and `@settings`.

## HTML reporting

Cucumber writes the machine-readable result file here:

```text
reports/cucumber-report.json
```

Generate the simple HTML report after a test run:

```powershell
npm run report
```

The output is:

```text
reports/cucumber-report.html
```

The HTML report includes:

- Total scenario count
- Passed count
- Failed count
- Skipped count
- Feature name
- Scenario name
- Failure message when available

The report generator uses only Node.js built-in file and path APIs. It does not require a reporting server or browser and does not execute tests.

## Functional coverage

### Requests

- All Requests and Cancelled Requests views
- Cancelled-only status checks
- Exact, partial, and unknown request search
- Clear search
- Request columns
- Sorting by request ID, status, date, user, organization, service, and venue
- Spectrum service, status, venue, and organization filters
- Filter cancel and confirm behavior
- Pagination summary, page size, and page navigation
- Scan QR Code, Import, and Bulk Actions toolbar visibility
- Request detail access
- Status-action state checks

### Appointments

- Appointment columns
- Exact, partial, and unknown search
- Clear search
- Sorting
- Column selector
- Page size and pagination
- Spectrum service and Venue filters
- New Appointment flow
- Organization selection
- Request-selection stage
- SNG request separation rule
- Venue and Date gating before request selection

### Venues

- Venue, Address, Location, and Code columns
- Exact, partial, code, and unknown search
- Clear search
- Sorting in both directions
- Refresh and pagination
- Create Venue fields
- Required-field gating
- Address validation state
- NAD83 coordinate inputs
- Indoor and Outdoor venue types
- Cancel create behavior

### Reference entities

- Disciplines search, columns, sorting, refresh, page size, and pagination
- Organizations search, columns, sorting, refresh, page size, and pagination
- Organization Types search, columns, sorting, refresh, page size, and pagination

### Reports

- Embedded report application loading
- Title, Tags, Created, and Updated columns
- Exact, partial, and unknown searches
- Clear search
- Refresh
- Ascending and descending sorting
- Empty-state behavior

### Application Settings

- System timezone configuration
- General portal status override and opening periods
- Communication sender configuration and email-trigger table
- Administrative command options
- Venue NAD83 coordinate boundaries

### Import

- Request import template download
- Invalid import result handling

## Test data and safety

`TestDataFactory` creates unique names, codes, emails, and phone values for scenarios that need generated data. The preferred naming pattern is:

```text
AQA_<entity>_<timestamp>
```

Safety rules:

- Do not delete arbitrary existing records.
- Use records created by the scenario for future edit/delete workflows.
- Review destructive actions before enabling them against shared environments.
- Administrative Commands are inspected but not executed by the settings coverage.
- Current venue scenarios do not save data when the live address validation service is unavailable.

## Debugging and troubleshooting

### Missing environment variables

Error:

```text
Missing required environment variable: SBPOJECT_PASSWORD
```

Resolution:

1. Confirm `.env` exists in the project root.
2. Confirm the variable names match `.env.example` exactly.
3. Confirm the password is not surrounded by accidental spaces.

### Browser executable missing

Run:

```powershell
npx playwright install chromium
```

### TypeScript errors

Run:

```powershell
npm run typecheck
```

Fix compilation errors before running scenarios.

### Authentication failure

Check the username, password, tenant access, account lock state, and whether Microsoft identity prompts for an additional verification step. The framework expects the normal username/password flow.

### Scenario timeout

Review the screenshot attached to the failed Cucumber scenario and the trace retained by Playwright. Confirm that the target account has access to the requested module and that the application APIs are available.

### Report generation error

Run a test command first so that `reports/cucumber-report.json` exists, then run:

```powershell
npm run report
```

## Maintenance rules

- Keep selectors inside Page Objects.
- Keep feature files business-oriented; do not put CSS selectors in Gherkin.
- Keep step definitions thin and delegate UI interaction to Page Objects.
- Prefer accessible roles, labels, placeholders, and stable attributes.
- Avoid generated class names and positional selectors unless no stable alternative exists.
- Add a meaningful assertion to every scenario.
- Add a tag when adding a new functional category or module.
- Keep scenario state in `ScenarioContext`, never in global mutable variables.
- Update this README when scripts, environment variables, or report behavior changes.

## Known limitations

The suite is intentionally based on controls confirmed in the available live environment. Some live backend services currently return errors, including address validation, request/session data, and report data. As a result:

- Some scenarios validate empty states or disabled controls until the backend is healthy.
- CRUD scenarios are not invented where the live UI does not expose create, edit, or delete controls.
- Administrative commands are listed and validated but not executed.
- The report page currently exposes an embedded empty report table, so report tests focus on its available table behavior.

These limitations are documented to prevent false-positive automation and should be revisited when the target APIs and test data are stable.
