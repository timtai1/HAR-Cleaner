# HAR Cleaner - Web Portal

<div align="center">

![HAR Cleaner](https://img.shields.io/badge/HAR-Cleaner-blue)
![Python](https://img.shields.io/badge/Python-3.7+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

**A web-based tool for cleaning and filtering HAR files for Invicti Web Application Scanner**

</div>

---

## 🎯 Purpose

This tool is specifically designed to prepare HAR (HTTP Archive) files for **Invicti Scanner** by:
- Removing unnecessary request entries
- Filtering by domain (FQDN)
- Removing response bodies to reduce file size
- Ensuring the final file is under 20MB (Invicti's limit)

## 🔒 Security Notice

**⚠️ IMPORTANT: HAR files contain sensitive data!**

HAR files typically include:
- Session cookies
- Authentication tokens
- API keys
- Personal data
- Internal system information

**This tool runs 100% locally on your computer. Your HAR files are NOT uploaded to any server.**

**Best practices:**
1. ✅ Use this tool only on your local machine
2. ✅ Delete HAR files immediately after use
3. ✅ Never share HAR files publicly
4. ✅ Review cleaned HAR files before submitting to Invicti

---

## ✨ Features

- **🌐 Web Interface** - User-friendly browser-based UI with GitHub-inspired design
- **📁 Drag & Drop** - Simply drag HAR files into the browser
- **🔍 Domain Filtering** - Select which FQDNs to keep
- **📊 Size Analysis** - View size per domain and per URL
- **🔎 URL Search** - Filter URLs by keyword with persistent selection
- **📄 Pagination** - Handle large HAR files efficiently (50/100/200/All per page)
- **🎯 Smart Selection** - Global and page-level selection controls
- **📈 Live Statistics** - Real-time counters for selected, total, and visible URLs
- **✂️ Smart Cleaning** - Automatically removes response bodies
- **⚠️ Size Warnings** - Alerts when file exceeds 20MB
- **📦 Automatic Cleanup** - Removes temporary files older than 24 hours
- **💻 Cross-Platform** - Works on Windows, macOS, and Linux

---

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Installation & Launch

#### Option 1: Use the Start Script (Recommended)

Simply double-click or run:

**macOS/Linux:**
```bash
git clone https://github.com/timtai1/HAR-Cleaner.git
cd HAR-Cleaner
./start.sh
```

**Windows:**
- Double-click `start.bat`, or run in Command Prompt:
```cmd
git clone https://github.com/timtai1/HAR-Cleaner.git
cd HAR-Cleaner
start.bat
```

#### Option 2: Manual Installation (One Command)

**On macOS/Linux:**

```bash
git clone https://github.com/timtai1/HAR-Cleaner.git && cd HAR-Cleaner && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python run.py
```

**On Windows (PowerShell):**

```powershell
git clone https://github.com/timtai1/HAR-Cleaner.git; cd HAR-Cleaner; python -m venv venv; .\venv\Scripts\Activate.ps1; pip install -r requirements.txt; python run.py
```

**On Windows (Command Prompt):**

```cmd
git clone https://github.com/timtai1/HAR-Cleaner.git && cd HAR-Cleaner && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python run.py
```

The browser will open automatically at `http://127.0.0.1:5000`

---

## 📖 Detailed Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/timtai1/HAR-Cleaner.git
cd HAR-Cleaner
```

### Step 2: Install Dependencies

```bash
# macOS/Linux
pip3 install -r requirements.txt

# Windows
pip install -r requirements.txt
```

### Step 3: Start the Application

```bash
# macOS/Linux
python3 run.py

# Windows
python run.py
```

The application will:
1. Start a local web server on port 5000
2. Automatically open your default browser
3. Display the HAR Cleaner interface

**To stop the server:** Press `Ctrl+C` in the terminal

---

## 📋 How to Use

### Step 1: Upload HAR File

1. **Drag & Drop** your `.har` file into the drop zone, or
2. **Click "Browse Files"** to select a file

The tool will analyze the file and extract all domains.

### Step 2: Select Domains (FQDNs)

- Review the list of domains found in your HAR file
- Each domain shows:
  - Number of requests
  - Total size
- **Select** the domains you want to keep (default: all selected)
- Use **Select All / Deselect All** buttons for convenience
- Click **Next: Review URLs**

### Step 3: Review and Select URLs

- All URLs from selected domains are listed, sorted by size (largest first)
- **Search**: Use the search box to filter URLs by keyword
- **Pagination**: Choose to show 50, 100, 200, or all URLs per page
- **Selection Controls**:
  - **Select All / Deselect All**: Affects all URLs regardless of current page or filter
  - **Select this page / Deselect this page**: Only affects URLs currently visible on the page
- **Statistics**: View selected URLs count, total URLs count, and URLs in current page
- **Check File Size**: Click to see the estimated output file size before download
- **Export Cleaned HAR**: Download the cleaned file (appends `_cleaned` to original filename)
- **Back**: Click the Back button in the header to return to domain selection

### Step 4: Export

- The tool automatically checks if the file size exceeds 20MB
- **If under 20MB**: File downloads automatically with `_cleaned.har` suffix (e.g., `test.har` → `test_cleaned.har`)
- **If over 20MB**: Warning message appears - deselect more URLs and try again
- Save the cleaned file to your desired location and upload to Invicti

---

## 🛠️ Command-Line Version (Legacy)

The original CLI version is still available:

```bash
# Basic usage (keeps all domains)
python har_cleaner.py input.har

# Filter by domain
python har_cleaner.py input.har -domain example.com

# Multiple domains
python har_cleaner.py input.har -domain example.com,api.example.com
```

---

## 📁 Project Structure

```
HAR_cleaner/
├── app.py                 # Flask web application
├── har_cleaner.py         # Original CLI version
├── run.py                 # Launch script (auto-opens browser)
├── requirements.txt       # Python dependencies
├── README.md             # This file
├── templates/
│   └── index.html        # Main web interface
└── static/
    ├── css/
    │   └── style.css     # Custom styles
    └── js/
        └── app.js        # Frontend logic
```

---

## ⚙️ Technical Details

### How It Works

1. **File Upload**: HAR file is sent to the local Flask server
2. **Analysis**: Server parses JSON and groups requests by FQDN
3. **Filtering**: User selects domains and URLs via web interface
4. **Cleaning**: Response bodies (`content.text`) are removed from all entries
5. **Export**: Cleaned HAR is generated and downloaded

### Why Remove Response Bodies?

- Response bodies often contain large HTML, JSON, or binary data
- They significantly increase file size
- **Invicti only needs request/response headers and metadata** - not the full content
- Removing bodies can reduce file size by **80-95%**

### File Size Limit

Invicti Scanner has a **20MB file upload limit**. This tool helps ensure your HAR file stays under this limit.

---

## 🔧 Troubleshooting

### Port 5000 Already in Use

If you see an error about port 5000 being in use, edit `run.py` and change:

```python
app.run(debug=False, port=5000, use_reloader=False)
```

to a different port, e.g., `port=8080`

### Browser Doesn't Open Automatically

Manually navigate to: `http://127.0.0.1:5000`

### "Module Not Found" Error

Make sure you've installed dependencies:

```bash
pip install -r requirements.txt
```

### Large Files Cause Timeout

The default upload limit is 100MB. For larger files, edit `app.py`:

```python
app.config['MAX_CONTENT_LENGTH'] = 200 * 1024 * 1024  # 200MB
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Built specifically for **Invicti Web Application Scanner**
- Inspired by the need for better HAR file management
- Uses [Flask](https://flask.palletsprojects.com/) and [Bootstrap 5](https://getbootstrap.com/)

---

## 📞 Support

If you encounter issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Open an issue on GitHub
3. Review existing issues for solutions

---

## ⚠️ Disclaimer

This tool is provided as-is for preparing HAR files for web application scanning. Always ensure you have proper authorization before scanning web applications. The authors are not responsible for misuse of this tool.

---

<div align="center">

**Made with ❤️ for the security community**

[Report Bug](https://github.com/timtai1/HAR-Cleaner/issues) · [Request Feature](https://github.com/timtai1/HAR-Cleaner/issues)

</div>
