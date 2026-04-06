"""
HAR Cleaner Web Portal
A web-based tool for cleaning and filtering HAR files for Invicti scanner.
"""

from flask import Flask, render_template, request, jsonify, send_file
import json
import os
import tempfile
from urllib.parse import urlparse
from collections import defaultdict
import io
import glob
import time

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB max upload

def cleanup_old_temp_files(max_age_hours=24):
    """Clean up temporary HAR files older than max_age_hours."""
    temp_dir = tempfile.gettempdir()
    pattern = os.path.join(temp_dir, 'har_*.json')
    current_time = time.time()
    max_age_seconds = max_age_hours * 3600

    for filepath in glob.glob(pattern):
        try:
            file_age = current_time - os.path.getmtime(filepath)
            if file_age > max_age_seconds:
                os.remove(filepath)
                print(f"Cleaned up old temp file: {filepath}")
        except Exception as e:
            print(f"Error cleaning up {filepath}: {e}")

def get_fqdn(url):
    """Extracts the hostname (FQDN) from a given URL."""
    try:
        return urlparse(url).hostname or ""
    except Exception:
        return ""

def analyze_har(har_data):
    """
    Analyze HAR file and return statistics by FQDN.
    Returns: dict with FQDN as key and list of entries with their sizes
    """
    entries = har_data.get('log', {}).get('entries', [])

    fqdn_data = defaultdict(lambda: {
        'urls': [],
        'total_size': 0,
        'count': 0
    })

    for idx, entry in enumerate(entries):
        request_obj = entry.get('request', {})
        response_obj = entry.get('response', {})
        url = request_obj.get('url', '')
        fqdn = get_fqdn(url)

        if not fqdn:
            fqdn = 'unknown'

        # Calculate entry size (rough estimation)
        entry_size = 0
        content = response_obj.get('content', {})
        if 'text' in content:
            entry_size = content.get('size', 0)

        url_info = {
            'index': idx,
            'url': url,
            'method': request_obj.get('method', 'GET'),
            'status': response_obj.get('status', 0),
            'size': entry_size,
            'mimeType': content.get('mimeType', 'unknown')
        }

        fqdn_data[fqdn]['urls'].append(url_info)
        fqdn_data[fqdn]['total_size'] += entry_size
        fqdn_data[fqdn]['count'] += 1

    return dict(fqdn_data)

def create_cleaned_har(har_data, selected_indices):
    """
    Create a cleaned HAR file with only selected entries.
    Removes response bodies to reduce size.
    """
    entries = har_data.get('log', {}).get('entries', [])

    # Filter entries by selected indices
    new_entries = []
    removed_body_count = 0

    for idx in selected_indices:
        if 0 <= idx < len(entries):
            entry = entries[idx].copy()

            # Remove response body
            if 'response' in entry:
                response = entry['response']
                if 'content' in response and 'text' in response['content']:
                    del response['content']['text']
                    removed_body_count += 1

            new_entries.append(entry)

    # Create new HAR structure
    cleaned_har = {
        'log': {
            'version': har_data.get('log', {}).get('version', '1.2'),
            'creator': har_data.get('log', {}).get('creator', {}),
            'pages': har_data.get('log', {}).get('pages', []),
            'entries': new_entries
        }
    }

    return cleaned_har, removed_body_count

@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle HAR file upload and analysis."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    if not file.filename.endswith('.har'):
        return jsonify({'error': 'File must be a .har file'}), 400

    try:
        # Clean up old temp files (older than 24 hours)
        cleanup_old_temp_files(24)

        # Read and parse HAR file
        har_content = file.read().decode('utf-8')
        har_data = json.loads(har_content)

        # Analyze the HAR file
        fqdn_data = analyze_har(har_data)

        # Convert to list and sort by total size
        fqdn_list = []
        for fqdn, data in fqdn_data.items():
            fqdn_list.append({
                'fqdn': fqdn,
                'total_size': data['total_size'],
                'count': data['count'],
                'urls': sorted(data['urls'], key=lambda x: x['size'], reverse=True)
            })

        fqdn_list.sort(key=lambda x: x['total_size'], reverse=True)

        # Store HAR data in session (using in-memory storage for simplicity)
        # In production, consider using server-side session storage
        session_id = os.urandom(16).hex()

        # Store in a temporary file
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f'har_{session_id}.json')

        # Also store the original filename
        original_filename = file.filename
        metadata = {
            'har_data': har_data,
            'original_filename': original_filename
        }

        with open(temp_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f)

        return jsonify({
            'success': True,
            'session_id': session_id,
            'original_filename': original_filename,
            'fqdn_data': fqdn_list,
            'total_entries': len(har_data.get('log', {}).get('entries', []))
        })

    except json.JSONDecodeError:
        return jsonify({'error': 'Invalid HAR file format (not valid JSON)'}), 400
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500

@app.route('/export', methods=['POST'])
def export_file():
    """Export cleaned HAR file."""
    data = request.get_json()
    session_id = data.get('session_id')
    selected_indices = data.get('selected_indices', [])
    original_filename = data.get('original_filename', 'file.har')

    if not session_id or not selected_indices:
        return jsonify({'error': 'Missing session_id or selected_indices'}), 400

    try:
        # Load HAR data from temporary file
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f'har_{session_id}.json')

        if not os.path.exists(temp_path):
            return jsonify({'error': 'Session expired or invalid'}), 400

        with open(temp_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)

        # Extract HAR data and original filename
        har_data = metadata.get('har_data')
        stored_filename = metadata.get('original_filename', original_filename)

        # Generate cleaned filename
        if stored_filename.endswith('.har'):
            cleaned_filename = stored_filename[:-4] + '_cleaned.har'
        else:
            cleaned_filename = stored_filename + '_cleaned.har'

        # Create cleaned HAR
        cleaned_har, removed_count = create_cleaned_har(har_data, selected_indices)

        # Convert to JSON bytes
        json_bytes = json.dumps(cleaned_har, ensure_ascii=False).encode('utf-8')
        file_size_mb = len(json_bytes) / (1024 * 1024)

        # Check size limit
        if file_size_mb > 20:
            return jsonify({
                'warning': True,
                'size_mb': round(file_size_mb, 2),
                'message': f'Warning: File size is {file_size_mb:.2f}MB, which exceeds the 20MB limit for Invicti scanner. Please remove more URLs.'
            }), 200

        # Note: We don't delete the temp file here to allow multiple exports
        # The temp file will be cleaned up by the system or can be manually deleted

        # Send file
        return send_file(
            io.BytesIO(json_bytes),
            mimetype='application/json',
            as_attachment=True,
            download_name=cleaned_filename
        )

    except Exception as e:
        return jsonify({'error': f'Error exporting file: {str(e)}'}), 500

@app.route('/check_size', methods=['POST'])
def check_size():
    """Check the size of cleaned HAR file without downloading."""
    data = request.get_json()
    session_id = data.get('session_id')
    selected_indices = data.get('selected_indices', [])

    if not session_id or not selected_indices:
        return jsonify({'error': 'Missing session_id or selected_indices'}), 400

    try:
        # Load HAR data from temporary file
        temp_dir = tempfile.gettempdir()
        temp_path = os.path.join(temp_dir, f'har_{session_id}.json')

        if not os.path.exists(temp_path):
            return jsonify({'error': 'Session expired or invalid'}), 400

        with open(temp_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)

        # Extract HAR data
        har_data = metadata.get('har_data')

        # Create cleaned HAR
        cleaned_har, removed_count = create_cleaned_har(har_data, selected_indices)

        # Calculate size
        json_str = json.dumps(cleaned_har, ensure_ascii=False)
        file_size_mb = len(json_str.encode('utf-8')) / (1024 * 1024)

        return jsonify({
            'success': True,
            'size_mb': round(file_size_mb, 2),
            'entry_count': len(cleaned_har['log']['entries']),
            'removed_bodies': removed_count,
            'exceeds_limit': file_size_mb > 20
        })

    except Exception as e:
        return jsonify({'error': f'Error checking size: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
