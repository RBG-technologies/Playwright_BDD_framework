# Quick Start (Users)

This is the short user guide for daily use.

## 1) Setup

```bash
# Installs dependencies, Playwright browsers, and bootstraps .env
npm run setup
```

## 2) Configure

The `setup` script automatically creates a `.env` file from `.env.example`.
Update the following key values in `.env`:
- `BASE_URL`: The target website URL.
- `BROWSER`: `chromium` (default), `firefox`, or `webkit`.
- `HEADLESS`: `true` (default) or `false` (for headed mode).
- `PARALLEL`: Set to 0 (default) for serial or > 1 for parallel execution.
- `TAGS`: Default Cucumber tags to filter scenarios (e.g., `@smoke`).

## 3) Framework Structure

```text
src/
	config/           -> cucumber and runtime configuration
	pages/            -> Page Object classes (UI logic)
	factories/        -> Test data builders
	tests/
		features/     -> Gherkin feature files (.feature)
		stepDefinitions/ -> Step implementations
		hooks/        -> Browser/Context lifecycle hooks
		support/      -> Custom world and shared context
	utils/            -> Helpers (assertions, reports, step checks)
scripts/              -> Setup and utility scripts
```

## 4) Run Tests

```bash
# Run all tests (configured in src/config/cucumber.cjs)
npm run test

# Run tests with a UI report workflow (Run -> Generate -> Open)
npm run test:report

# Run specific tag groups
npm run test:smoke
npm run test:regression
npm run test:api

# Dry run (validate steps without browser)
npm run test:dry
```

## 5) Useful Commands

### Reporting & Maintenance
- `npm run report:dashboard` -> View unified history of past Allure/Cucumber reports.
- `npm run report:history`   -> List archived report versions.
- `npm run report:generate`  -> Generate Allure report from current results.
- `npm run cucumber:report`  -> Generate and open Cucumber HTML report.
- `npm run steps:check`      -> Verify all Gherkin steps are implemented.
- `npm run imports:fix`     -> Automatically add missing imports to step definitions.
- `npm run format`           -> Auto-format code using Prettier.
- `npm run lint`             -> Check for code quality issues.

### Advanced
- `npm run test:one`         -> Interactively run a single feature file.
- `npm run steps:generate -- --feature <path>` -> Scaffold steps for a new feature.

## 6) Add a Test Scenario

1. Create a `.feature` file in `src/tests/features/`.
2. Generate step skeletons: `npm run steps:generate -- --feature src/tests/features/my.feature`
3. Implement matching steps in `src/tests/stepDefinitions/`.
4. Use or create Page Objects in `src/pages/` for UI interactions.
5. Run `npm run test` (or use tags for isolation).

## 7) Notes

- **Report History**: Archived reports are stored in `report-history/`.
- **Environment**: Keep `.env` local; do not commit secrets.
- **Java**: Allure reports require Java 11+ installed and in your PATH.
