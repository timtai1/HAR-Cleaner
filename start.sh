#!/bin/bash
# HAR Cleaner Launcher Script for macOS/Linux

echo "========================================"
echo "  HAR Cleaner - Starting..."
echo "========================================"
echo ""

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null
then
    echo "Error: Python 3 is not installed."
    echo "Please install Python 3.7 or higher from https://www.python.org/"
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Check if Flask is installed
if ! python -c "import flask" &> /dev/null 2>&1
then
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Run the application
echo "Starting HAR Cleaner..."
python run.py
