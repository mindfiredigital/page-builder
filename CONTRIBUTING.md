# Contributing to ESLint Plugin Hub

We welcome and appreciate your contributions to the Page Builder. To ensure a smooth and collaborative process, please follow these guidelines.

## How Can You Contribute?

Here are some ways you can contribute to the project:

- Reporting bugs or issues
- Suggesting new rules or features
- Writing or improving documentation
- Fixing bugs
- Implementing new rules or features

## Steps for Contributing

1. **Fork** the repository to your GitHub account.
2. **Clone** the forked repository to your local machine:

   ```bash
   git clone https://github.com/lakinmindfire/page-builder.git
   ```

3. Create a new **branch** for your feature or fix:

   ```bash
   git checkout -b feature/new-login or bugfix/header-styling.
   ```

4. **Make changes** and **test** to ensure they work as expected.
5. **Commit** your changes:

   ```bash
   git commit -m 'Your descriptive commit message'
   ```

6. **Push** your branch to your GitHub repository:

   ```bash
   git push origin feature-name
   ```

7. Create a **Pull Request (PR)** from your branch to the original repository's `main` branch.

## Commit Message Format

We follow the conventional commit message format to ensure consistent and meaningful commit messages. This format helps in automated versioning and release notes generation.

### Commit Types

- **feat:** A new feature or significant change.
- **fix:** A bug fix or issue resolution.
- **docs:** Documentation changes.
- **chore:** Routine tasks, maintenance, or tooling changes.

### How to Write Commit Messages

- Start the commit message with the type, followed by a colon and a space (e.g., `feat: Add new rule`).
- Provide a concise and descriptive commit message.
- If the commit addresses an issue or feature request, include the issue number in the message (e.g., `fix: Resolve issue #123`).

### Example Commit Messages

- feat: Add new rule for variable naming
- fix: Correct issue #456 with class name validation
- docs: Update usage instructions in README
- chore: Upgrade dependencies to latest versions

### Commitlint Configuration

We use Commitlint to enforce the commit message format. Ensure that your commits adhere to the specified format. You can find the Commitlint configuration in the repository.

For more details on Commitlint and conventional commits, please refer to [Commitlint Documentation](https://commitlint.js.org/).

## Pull Request Guidelines

- Make sure your PR addresses an issue or feature request.
- Provide a clear description of your PR and any relevant context.
- Keep your PR focused on a single change to facilitate review.
- Ensure your code follows the project's coding style and conventions.
- Include tests for any new rules or changes to existing ones.

## Documentation Guidelines

When contributing to the documentation, please add your updates in the `docs` branch inside the `docs` folder. This helps keep the documentation organized and easily accessible.

## Code of Conduct and Licensing

Please ensure your contributions adhere to the project's [Code of Conduct](./CODE_OF_CONDUCT.md) and are licensed under the project's [License](./LICENSE).

## Need Help?

If you have questions or need assistance, feel free to create an issue or directly contact the maintainers.

Thank you for your interest in contributing to ESLint Plugin Hub! We appreciate your efforts in making this project better.

Happy contributing!
