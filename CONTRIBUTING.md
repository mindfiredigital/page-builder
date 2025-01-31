# Contributing to PAGE-BUILDER

We welcome and appreciate your contributions to the Page Builder. To ensure a smooth and collaborative process, please follow these guidelines.

## Table of Contents

- [How Can You Contribute?](#how-can-you-contribute)
- [Steps for Contributing](#steps-for-contributing)
- [Development Setup](#development-setup)
- [Commit Message Format](#commit-message-format)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Documentation Guidelines](#documentation-guidelines)
- [Code of Conduct](#code-of-conduct)
- [Need Help?](#need-help)

## How Can You Contribute?

Here are some ways you can contribute to the project:

- Reporting bugs or issues
- Suggesting new features or enhancements
- Writing or improving documentation
- Fixing bugs
- Implementing new features
- Improving tests
- Helping with reviews

## Steps for Contributing

1. **Fork** the repository to your GitHub account.
2. **Clone** the forked repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/page-builder.git
   ```

3. **Set up the development environment**:

   ```bash
   cd page-builder
   pnpm install
   ```

4. Create a new **branch** for your feature or fix:

   ```bash
   git checkout -b feat/core/new-feature
   # or
   git checkout -b fix/react/bug-fix
   ```

5. **Make changes** and **test** to ensure they work as expected:

   ```bash
   pnpm test
   pnpm turbo run build
   ```

6. **Commit** your changes following our commit message format (see below).
7. **Push** your branch to your GitHub repository:

   ```bash
   git push origin feat/core/new-feature
   ```

8. Create a **Pull Request (PR)** from your branch to the original repository's `main` branch.

## Development Setup

1. **Prerequisites**:

   - Node.js (v20 or later)
   - pnpm (v8 or later)

2. **Installation**:

   ```bash
   pnpm install
   ```

3. **Development Commands**:
   ```bash
   pnpm dev          # Start development server
   pnpm turbo run build        # Build all packages
   pnpm lint         # Run linting
   ```

## Commit Message Format

We follow a strict conventional commit message format to ensure consistent and meaningful commit messages. This format helps in automated versioning, changelog generation, and release management in our monorepo structure.

### Commit Structure

```
type(scope): subject
```

- **type**: The type of change being made (see types below)
- **scope**: The package name from the monorepo being affected (required)
- **subject**: A brief description of the change

### Commit Types and Release Impact

- **feat**: A new feature or significant change (triggers MINOR version bump)

  - Example: `feat(react): add new drag-and-drop functionality`

- **fix**: A bug fix or issue resolution (triggers PATCH version bump)

  - Example: `fix(core): resolve element positioning bug`

- **docs**: Documentation changes only (no version bump)

  - Example: `docs(web-component): update API documentation`

- **chore**: Routine tasks, maintenance, or tooling changes (no version bump)

  - Example: `chore(react): update dev dependencies`

- **style**: Code style/formatting changes (no version bump)

  - Example: `style(core): format according to new eslint rules`

- **refactor**: Code changes that neither fix a bug nor add a feature (no version bump)

  - Example: `refactor(web-component): improve rendering performance`

- **test**: Adding or modifying tests (no version bump)

  - Example: `test(react): add unit tests for form component`

- **perf**: Performance improvements (triggers PATCH version bump)

  - Example: `perf(core): optimize rendering logic`

- **ci**: Changes to CI configuration (no version bump)
  - Example: `ci(web-component): update GitHub Actions workflow`

### Scopes

Scopes must match your package names in the monorepo:

- `core`: Core package changes
- `react`: React package changes
- `web-component`: Web Components package changes

### Breaking Changes

For breaking changes, add `BREAKING CHANGE:` in the commit body and append a `!` after the type/scope:

```
feat(core)!: change API interface

BREAKING CHANGE: The API interface has changed. Users need to update their implementations.
```

Breaking changes will trigger a MAJOR version bump.

### Release Management

Commit messages directly influence our automated release process:

1. MAJOR version (1.0.0 → 2.0.0)

   - Any commit with a breaking change (`!` or `BREAKING CHANGE` in body)

2. MINOR version (1.1.0 → 1.2.0)

   - Commits with `feat` type

3. PATCH version (1.1.1 → 1.1.2)

   - Commits with `fix` or `perf` type

4. No version change
   - Commits with `docs`, `chore`, `style`, `refactor`, `test`, or `ci` types

### Commitlint Configuration

We enforce these commit conventions using Commitlint. Your commits will be automatically validated against these rules:

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['core', 'react', 'web-component']],
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
  },
  ignores: [message => message.includes('[skip-commitlint]')],
};
```

### Common Error Messages

```bash
# Missing scope
❌ Error: scope may not be empty [scope-empty]
# Wrong scope
❌ Error: scope must be one of [core, react, web-component] [scope-enum]
# Invalid type
❌ Error: type must be one of [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test] [type-enum]
```

## Pull Request Guidelines

1. **Before Submitting a PR**:

   - Run the linter: `pnpm lint`
   - Update documentation if needed
   - Add tests for new features
   - Run `pnpm build` to ensure everything builds correctly

2. **PR Title**:

   - Follow the same convention as commit messages
   - Example: `feat(core): add new template engine`

3. **PR Description**:

   - Clearly describe the changes
   - Reference any related issues
   - Include any breaking changes
   - List any new dependencies
   - Provide steps to test the changes

4. **PR Review Process**:
   - At least one maintainer approval is required
   - Address review comments
   - Keep the PR focused and atomic
   - Rebase if needed to resolve conflicts

## Documentation Guidelines

1. **API Documentation**:

   - Document all public APIs
   - Include JSDoc comments for TypeScript/JavaScript code
   - Provide usage examples

2. **Package Documentation**:

   - Each package should have its own README.md
   - Include installation instructions
   - Provide basic usage examples
   - List available options/props

3. **Contributing to Docs**:
   - Place documentation in the `docs` folder
   - Follow markdown best practices
   - Include images in the `docs/assets` folder
   - Update the docs index when adding new pages

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](./CODE_OF_CONDUCT.md). Please read it before contributing.

## Need Help?

- **Issues**: Open an issue in the repository
- **Discussions**: Use GitHub Discussions for questions

Thank you for contributing to Page Builder! Your efforts help make this project better for everyone.
