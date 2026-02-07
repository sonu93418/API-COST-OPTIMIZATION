# Contributing to API Cost Optimization Platform

First off, thank you for considering contributing! 🎉

## Code of Conduct

This project follows a simple code of conduct:
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

## How Can I Contribute?

### 🐛 Reporting Bugs

**Before submitting a bug report:**
- Check if the bug has already been reported
- Collect information about the bug:
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots (if applicable)
  - Environment details (OS, Node version, browser)

**Submit via GitHub Issues** with the `bug` label.

### 💡 Suggesting Features

We love new ideas! Submit feature requests via GitHub Issues with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Label it as `enhancement`

### 🔧 Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/sonu93418/API-COST-OPTIMIZATION.git
   cd API-COST-OPTIMIZATION
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Backend tests
   cd backend
   npm test
   
   # Frontend tests
   cd frontend
   npm test
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: Feature description"
   git commit -m "Fix: Bug description"
   git commit -m "Update: Documentation changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Describe what you changed and why
   - Reference any related issues
   - Request review

## Development Setup

### Prerequisites
- Node.js v16+
- MongoDB
- Git

### Local Development

```bash
# Clone repository
git clone https://github.com/sonu93418/API-COST-OPTIMIZATION.git
cd API-COST-OPTIMIZATION

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run seed
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Coding Standards

### JavaScript/Node.js
- Use ES6+ features
- Use `const`/`let`, avoid `var`
- Use async/await over callbacks
- Handle errors properly
- Add JSDoc comments for functions

```javascript
/**
 * Calculate total API cost
 * @param {Array} logs - API log entries
 * @returns {Number} Total cost in USD
 */
const calculateCost = (logs) => {
  return logs.reduce((sum, log) => sum + log.cost, 0);
};
```

### React/Frontend
- Use functional components
- Use hooks (useState, useEffect)
- Keep components small and focused
- Extract reusable logic to custom hooks
- Use proper prop types

```jsx
const Dashboard = () => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  return <div>{/* Component JSX */}</div>;
};
```

### CSS/Tailwind
- Use Tailwind utility classes
- Keep custom CSS minimal
- Follow mobile-first approach
- Use design system colors

## Project Structure

```
API-COST-OPTIMIZATION/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── frontend/
│   └── src/
│       ├── components/ # Reusable components
│       ├── context/    # React context
│       ├── pages/      # Page components
│       └── services/   # API services
└── docs/              # Documentation
```

## Commit Message Guidelines

Use semantic commit messages:

- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Changes to existing feature
- `Remove:` Removed code/feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Formatting changes
- `Test:` Adding tests

Examples:
```
Add: Budget alert threshold configuration
Fix: Dashboard chart not updating on filter change
Update: Improve cost calculation performance
Docs: Add API endpoint documentation
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### Manual Testing
- Test all CRUD operations
- Verify authentication flows
- Check responsive design
- Test error handling
- Verify data accuracy

## Documentation

When adding features, update:
- README.md (if user-facing)
- ARCHITECTURE.md (if architectural)
- Inline code comments
- API documentation

## Review Process

1. **Automated checks** run on PR
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Approval** and merge

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Chat**: Join our Discord/Slack (if available)
- **Email**: Contact maintainers

## Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Project website (if applicable)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing! 🙏**

Every contribution, no matter how small, makes a difference.
