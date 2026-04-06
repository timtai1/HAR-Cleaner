# Contributing to HAR Cleaner

Thank you for your interest in contributing to HAR Cleaner! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:

1. **Clear title** - Describe the issue briefly
2. **Steps to reproduce** - Detailed steps to recreate the bug
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Environment** - OS, Python version, browser
6. **Screenshots** - If applicable

### Suggesting Features

Feature requests are welcome! Please include:

1. **Use case** - Why is this feature needed?
2. **Description** - What should it do?
3. **Examples** - How would users interact with it?

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
6. **Push to your fork**
7. **Open a Pull Request**

## Development Setup

### Prerequisites
- Python 3.7+
- Basic knowledge of Flask and JavaScript

### Setup

```bash
git clone https://github.com/yourusername/HAR_cleaner.git
cd HAR_cleaner
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running in Development Mode

```bash
# Enable debug mode in app.py (already enabled by default in app.py)
python app.py
```

This enables:
- Auto-reload on code changes
- Detailed error messages
- Debug toolbar

### Project Structure

```
HAR_cleaner/
├── app.py              # Flask backend
├── har_cleaner.py      # CLI version
├── run.py              # Production launcher
├── templates/
│   └── index.html      # Main UI
└── static/
    ├── css/
    │   └── style.css   # Custom styles
    └── js/
        └── app.js      # Frontend logic
```

## Code Style

### Python
- Follow PEP 8
- Use type hints where applicable
- Add docstrings to functions
- Keep functions focused and small

Example:
```python
def get_fqdn(url: str) -> str:
    """
    Extracts the hostname (FQDN) from a given URL.

    Args:
        url: The URL to parse

    Returns:
        The hostname/FQDN, or empty string if invalid
    """
    try:
        return urlparse(url).hostname or ""
    except Exception:
        return ""
```

### JavaScript
- Use modern ES6+ syntax
- Use `const` and `let`, avoid `var`
- Add JSDoc comments for functions
- Keep functions pure where possible

Example:
```javascript
/**
 * Filters URLs based on search text
 */
function filterURLs() {
    const searchText = document.getElementById('urlSearch').value.toLowerCase();
    // ...
}
```

### HTML/CSS
- Use semantic HTML5 tags
- Follow Bootstrap conventions
- Keep custom CSS minimal
- Ensure responsive design

## Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] File upload (drag & drop and browse)
- [ ] Domain selection (select/deselect all)
- [ ] URL filtering and search
- [ ] Pagination (50/100/200/All)
- [ ] Size checking
- [ ] Export functionality
- [ ] Error handling (invalid files, oversized files)
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness

### Test Files

Create test HAR files with:
- Small files (< 1MB)
- Medium files (1-20MB)
- Large files (> 20MB)
- Multiple domains
- Single domain
- Invalid JSON

## Security Considerations

### Important Security Rules

1. **Never store HAR files permanently**
   - Use temporary storage only
   - Clean up after sessions expire

2. **No external API calls**
   - All processing must be local
   - No data should leave the user's machine

3. **Input validation**
   - Validate file types
   - Sanitize user input
   - Limit file sizes

4. **XSS Prevention**
   - Escape all user-provided content
   - Use CSP headers
   - Validate URLs before display

## Documentation

When adding features, update:
- README.md - Main documentation
- FEATURES.md - Feature list and use cases
- QUICK_START.md - If it affects quick start
- Code comments - Inline documentation

## Commit Messages

Use clear, descriptive commit messages:

Good:
```
Add URL search functionality to Step 3
Fix pagination bug when showing all URLs
Update README with Windows installation steps
```

Bad:
```
Update
Fix bug
Changes
```

## Questions?

Feel free to:
- Open an issue with the "question" label
- Reach out to maintainers
- Join discussions in existing issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HAR Cleaner! 🎉
