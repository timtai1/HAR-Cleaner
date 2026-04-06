# Quick Start Guide

## Installation (30 seconds)

### macOS/Linux

1. Open Terminal
2. Run:
```bash
git clone https://github.com/timtai1/HAR-Cleaner.git
cd HAR-Cleaner
./start.sh
```

### Windows

1. Open Command Prompt
2. Run:
```cmd
git clone https://github.com/timtai1/HAR-Cleaner.git
cd HAR-Cleaner
start.bat
```

Or simply **double-click `start.bat`** after extracting the files.

---

## Usage (3 steps)

### Step 1: Upload HAR File
- Drag & drop your `.har` file
- Or click "Browse Files"

### Step 2: Select Domains
- Check/uncheck domains to keep
- Click "Next: Review URLs"

### Step 3: Review & Export
- Search and filter URLs
- Use selection controls:
  - **Select All / Deselect All** - affects all URLs
  - **Select this page / Deselect this page** - affects current page only
- Click "Check File Size" (optional)
- Click "Export Cleaned HAR"

**Done!** Your file downloads as `{original}_cleaned.har`

---

## How to Get a HAR File

### Chrome/Edge
1. Press `F12` (Developer Tools)
2. Go to **Network** tab
3. Check **Preserve log**
4. Browse the website
5. Right-click → **Save all as HAR with content**

### Firefox
1. Press `F12` (Developer Tools)
2. Go to **Network** tab
3. Click the gear icon → **Persist Logs**
4. Browse the website
5. Click the gear icon → **Save All As HAR**

### Safari
1. Develop menu → **Show Web Inspector**
2. Go to **Network** tab
3. Browse the website
4. Click **Export** button

---

## Troubleshooting

**Browser doesn't open?**
- Manually go to: http://127.0.0.1:5000

**Port 5000 in use?**
- Edit `run.py`, change `port=5000` to `port=8080`

**Python not found?**
- Install from: https://www.python.org/

---

## Security Reminder

- HAR files contain cookies, tokens, and session data
- This tool runs **100% locally** - no data is uploaded
- **Delete HAR files after use**
- Never commit HAR files to Git

---

Need more help? See [README.md](README.md)
