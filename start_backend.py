#!/usr/bin/env python3
"""
Startup script for VA Admin Agent Backend
This script launches the Flask app using gunicorn in production
"""

import os
import sys
import subprocess

# Add the backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
sys.path.insert(0, backend_dir)

# Change to backend directory
os.chdir(backend_dir)

# Import the Flask app
try:
    from app import app
    print(f"Successfully imported Flask app from {os.getcwd()}")
except ImportError as e:
    print(f"Import error: {e}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    print(f"Files in current directory: {os.listdir('.')}")
    sys.exit(1)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    
    # Check if we're in production (Render sets PORT)
    if port != 5000:
        print(f"Production environment detected. Starting with gunicorn on port {port}")
        try:
            # Use gunicorn for production
            subprocess.run([
                'gunicorn', 'app:app',
                '--bind', f'0.0.0.0:{port}',
                '--workers', '1',
                '--timeout', '120',
                '--access-logfile', '-',
                '--error-logfile', '-'
            ], check=True)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("Gunicorn not available, falling back to Flask development server")
            print("WARNING: Using development server in production!")
            app.run(host='0.0.0.0', port=port, debug=False)
    else:
        # Development environment
        print(f"Development environment. Starting Flask dev server on port {port}")
        app.run(host='0.0.0.0', port=port, debug=False)
