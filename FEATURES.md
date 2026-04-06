# Features & Use Cases

## Key Features

### 1. Drag & Drop Upload
- Simply drag your HAR file into the browser window
- No need to click browse - just drop and go
- Supports files up to 100MB (configurable)

### 2. Domain-Based Filtering
**Problem:** HAR files contain requests to many third-party domains (analytics, CDNs, ads)

**Solution:**
- Automatically extracts all unique FQDNs
- Shows request count and total size per domain
- Select only the domains you care about
- Example: Keep only `example.com` and `api.example.com`, remove everything else

### 3. Size Analysis
**Problem:** Need to know which URLs are taking up the most space

**Solution:**
- URLs are sorted by size (largest first)
- See exact size for each URL
- Easily identify and remove bloated responses

### 4. Advanced Search & Filtering
**Problem:** Large HAR files have thousands of URLs

**Solution:**
- Search box to filter URLs by keyword
- Example: Search "api" to see only API calls
- Example: Search ".png" to find all image requests
- Pagination (50/100/200/All) for easy browsing

### 5. Smart Response Body Removal
**Problem:** Response bodies make HAR files huge

**Solution:**
- Automatically removes `response.content.text` from all entries
- Can reduce file size by 80-95%
- Keeps all important metadata (headers, timing, status codes)

### 6. Size Limit Enforcement
**Problem:** Invicti rejects files over 20MB

**Solution:**
- "Check File Size" button shows estimated size before export
- Warning if file exceeds 20MB
- Prevents failed uploads to Invicti

---

## Use Cases

### Use Case 1: Recording Authentication Flow
**Scenario:** You need to capture a login flow for Invicti

**Steps:**
1. Record HAR while logging in
2. Upload to HAR Cleaner
3. Keep only your domain (e.g., `myapp.com`)
4. Remove third-party domains (Google Analytics, Facebook Pixel, etc.)
5. Export cleaned HAR
6. Upload to Invicti

**Result:** Clean HAR file focused on your application's authentication flow

---

### Use Case 2: Reducing Oversized HAR Files
**Scenario:** Your HAR file is 150MB and Invicti won't accept it

**Steps:**
1. Upload to HAR Cleaner
2. Check which domains are using the most space
3. Deselect unnecessary domains
4. Review URLs - remove large responses (like base64-encoded images)
5. Use "Check File Size" to verify it's under 20MB
6. Export

**Result:** HAR file reduced from 150MB to 15MB

---

### Use Case 3: Isolating API Traffic
**Scenario:** You only want to scan API endpoints, not the frontend

**Steps:**
1. Record HAR of your application
2. Upload to HAR Cleaner
3. Select only API domains (e.g., `api.example.com`)
4. Deselect frontend domains
5. Export

**Result:** Focused HAR file containing only API requests

---

### Use Case 4: Removing Sensitive Data
**Scenario:** HAR contains responses with PII/sensitive data you don't want to share

**Steps:**
1. Upload HAR to HAR Cleaner
2. All response bodies are automatically removed
3. Headers and timing information are preserved
4. Export cleaned HAR

**Result:** Safe HAR file without response content, suitable for sharing with Invicti or security team

---

### Use Case 5: Multi-Domain Applications
**Scenario:** Your app uses multiple domains (main site, API, CDN)

**Steps:**
1. Upload HAR
2. Select all your domains:
   - `www.example.com`
   - `api.example.com`
   - `cdn.example.com`
3. Deselect third-party domains
4. Export

**Result:** Complete recording of your multi-domain application

---

## Performance

### File Size Reduction Examples

| Original Size | After Cleaning | Reduction |
|---------------|----------------|-----------|
| 150 MB        | 12 MB          | 92%       |
| 80 MB         | 8 MB           | 90%       |
| 45 MB         | 6 MB           | 87%       |
| 25 MB         | 3 MB           | 88%       |

### Processing Speed

- **Upload & Analysis:** ~1-3 seconds for most files
- **Export:** ~2-5 seconds for most files
- **Large Files (>50MB):** May take 10-15 seconds

---

## Comparison with CLI Version

| Feature | Web Portal | CLI (`har_cleaner.py`) |
|---------|------------|------------------------|
| User Interface | Visual, interactive | Command-line |
| Domain Selection | Click checkboxes | Specify via `-domain` parameter |
| URL-level Control | Yes, full control | No |
| Size Preview | Yes | No |
| Search/Filter | Yes | No |
| Ease of Use | Beginner-friendly | Requires CLI knowledge |
| Automation | Manual | Scriptable |

**When to use Web Portal:**
- You want visual control
- You need to review and select specific URLs
- You want to see size impact before exporting

**When to use CLI:**
- You need automation/scripting
- You know exactly which domain you want
- You prefer command-line tools

---

## Technical Details

### What Gets Removed
- `response.content.text` - Response body content
- Entries from unselected domains
- Unselected individual URLs

### What Gets Preserved
- Request headers
- Response headers
- HTTP status codes
- Timing information
- Cookie headers
- Request/response metadata
- Page references
- All HAR structure

### Security
- All processing happens locally
- No data sent to external servers
- Temporary files stored in system temp directory
- Files deleted after session expires

---

## Tips & Best Practices

### 1. Start with Domain Selection
Don't try to review thousands of URLs - filter by domain first

### 2. Use Search for Large Files
If you have 5000+ URLs, use the search box to find specific patterns

### 3. Check Size Before Export
Always click "Check File Size" before exporting to avoid rejected uploads

### 4. Remove Static Assets
Look for `.png`, `.jpg`, `.css`, `.js` files - they often have large base64-encoded responses

### 5. Focus on Dynamic Requests
API calls and form submissions are usually most important for scanning

### 6. Delete Original HAR
Once you have the cleaned version, securely delete the original HAR file

---

## Limitations

- Maximum upload size: 100MB (configurable in `app.py`)
- Session storage: Files deleted when browser closes
- No cloud sync or saving (by design, for security)
- Requires modern browser (Chrome, Firefox, Edge, Safari)

---

## Future Enhancements (Roadmap)

- [ ] Export statistics report (CSV/JSON)
- [ ] Regex-based URL filtering
- [ ] Custom response body size threshold
- [ ] Batch processing multiple HAR files
- [ ] HAR file comparison tool
- [ ] Cookie/token masking option
- [ ] Dark mode UI

Suggestions? [Open an issue](https://github.com/timtai1/HAR-Cleaner/issues)!
