#!/usr/bin/env python3
"""
HAR Cleaner Launcher
Automatically starts the web server and opens the browser
"""

import webbrowser
import time
import threading
import sys
import os

def open_browser():
    """Open browser after a short delay"""
    time.sleep(1.5)
    webbrowser.open('http://127.0.0.1:5000')

if __name__ == '__main__':
    print("=" * 60)
    print("  HAR Cleaner - Web Portal")
    print("  Invicti Scanner Preparation Tool")
    print("=" * 60)
    print()
    print("Starting web server...")
    print("The browser will open automatically in a moment.")
    print()
    print("Server URL: http://127.0.0.1:5000")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    print()

    # Start browser in background thread
    threading.Thread(target=open_browser, daemon=True).start()

    # Import and run Flask app
    try:
        from app import app
        app.run(debug=False, port=5000, use_reloader=False)
    except KeyboardInterrupt:
        print("\n\nShutting down server...")
        print("Thank you for using HAR Cleaner!")
        sys.exit(0)
