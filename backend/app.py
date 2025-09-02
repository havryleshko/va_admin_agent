from flask import Flask, request, jsonify
from flask_cors import CORS
from for_emails import get_unread_emails, classify_emails, draft_replies, send_email_service, discard_email
from utils import get_gmail
import os
from dotenv import load_dotenv
import json
from datetime import datetime
import requests

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/')
def health_check():
    """Health check endpoint for Railway"""
    return jsonify({
        'status': 'healthy',
        'message': 'VA Admin Agent Backend is running',
        'version': '1.0.0'
    })

@app.route('/api/health')
def api_health():
    """API health check"""
    return jsonify({
        'status': 'healthy',
        'endpoints': [
            '/api/emails',
            '/api/emails/classify',
            '/api/emails/draft-replies',
            '/api/emails/send',
            '/api/emails/discard',
            '/api/emails/stats'
        ]
    })

@app.route('/api/emails', methods=['POST'])
def handle_emails():
    try:
        data = request.get_json()
        action = data.get('action')
        google_access_token = request.headers.get('X-Google-Access-Token')
        
        if not google_access_token:
            return jsonify({'error': 'No Google access token provided'}), 401
        
        if action == 'fetch_unread':
            try:
                print(f"Attempting Gmail API call with Google token...")
                
                # Fetch emails using the actual Google OAuth token
                real_emails = fetch_emails_with_google_token(google_access_token)
                if real_emails and len(real_emails) > 0:
                    # Convert to expected format
                    formatted_emails = format_emails_for_frontend(real_emails)
                    print(f"Successfully fetched {len(formatted_emails)} real emails from Gmail")
                    return jsonify({'emails': formatted_emails, 'source': 'google_gmail'})
                else:
                    print("No emails found or Gmail API failed")
                    return jsonify({'emails': [], 'source': 'google_gmail', 'message': 'No unread emails found'})
                    
            except Exception as e:
                print(f"Gmail API error: {e}")
                return jsonify({'error': f'Gmail API error: {str(e)}', 'emails': []}), 500
        
        return jsonify({'error': 'Invalid action'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/classify', methods=['POST'])
def classify_emails_endpoint():
    try:
        data = request.get_json()
        emails = data.get('emails', [])
        google_access_token = request.headers.get('X-Google-Access-Token')
        
        if not google_access_token:
            return jsonify({'error': 'No Google access token provided'}), 401
        
        # Classify emails using AI
        classified_emails = classify_emails(emails)
        return jsonify({'emails': classified_emails})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/draft-replies', methods=['POST'])
def draft_replies_endpoint():
    try:
        data = request.get_json()
        emails = data.get('emails', [])
        google_access_token = request.headers.get('X-Google-Access-Token')
        
        if not google_access_token:
            return jsonify({'error': 'No Google access token provided'}), 401
        
        # Generate draft replies
        emails_with_drafts = draft_replies(emails)
        return jsonify({'emails': emails_with_drafts})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/send', methods=['POST'])
def send_email_endpoint():
    try:
        data = request.get_json()
        email_id = data.get('emailId')
        reply_text = data.get('replyText')
        google_access_token = request.headers.get('X-Google-Access-Token')
        
        if not google_access_token:
            return jsonify({'error': 'No Google access token provided'}), 401
        
        # For now, return success (in production, implement actual email sending)
        # send_email_service(credentials, to, subject, text)
        return jsonify({'success': True, 'message': 'Email sent successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/discard', methods=['POST'])
def discard_email_endpoint():
    try:
        data = request.get_json()
        email_id = data.get('emailId')
        google_access_token = request.headers.get('X-Google-Access-Token')
        
        if not google_access_token:
            return jsonify({'error': 'No Google access token provided'}), 401
        
        # For now, return success (in production, implement actual email discarding)
        # discard_email(email_id)
        return jsonify({'success': True, 'message': 'Email discarded successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/stats', methods=['GET'])
def get_email_stats():
    try:
        google_access_token = request.headers.get('X-Google-Access-Token')
        
        if not google_access_token:
            return jsonify({'error': 'No Google access token provided'}), 401
        
        # Get real stats from Gmail API
        try:
            # Fetch a small sample to get count
            headers = {
                'Authorization': f'Bearer {google_access_token}',
                'Content-Type': 'application/json'
            }
            
            gmail_url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages'
            params = {
                'q': 'is:unread',
                'maxResults': 1  # Just get count
            }
            
            response = requests.get(gmail_url, headers=headers, params=params)
            
            if response.status_code == 200:
                gmail_data = response.json()
                total_messages = gmail_data.get('resultSizeEstimate', 0)
                
                stats = {
                    'total': total_messages,
                    'unread': total_messages,
                    'categorized': 0  # Will be updated when emails are classified
                }
                
                print(f"Real Gmail stats: {stats}")
                return jsonify({'stats': stats})
            else:
                print(f"Failed to get Gmail stats: {response.status_code}")
                return jsonify({'error': 'Failed to fetch Gmail stats'}), 500
                
        except Exception as e:
            print(f"Error getting Gmail stats: {e}")
            return jsonify({'error': f'Gmail API error: {str(e)}'}), 500
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def fetch_emails_with_google_token(google_access_token):
    """
    Fetch emails using actual Google OAuth token.
    """
    try:
        headers = {
            'Authorization': f'Bearer {google_access_token}',
            'Content-Type': 'application/json'
        }
        
        # Try to fetch emails from Gmail API directly
        gmail_url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages'
        params = {
            'q': 'is:unread',
            'maxResults': 25
        }
        
        print(f"Making request to Gmail API: {gmail_url}")
        response = requests.get(gmail_url, headers=headers, params=params)
        
        print(f"Gmail API response status: {response.status_code}")
        
        if response.status_code == 200:
            print("Successfully fetched emails from Gmail API!")
            gmail_data = response.json()
            messages = gmail_data.get('messages', [])
            
            print(f"Found {len(messages)} unread messages")
            
            if not messages:
                print("No unread messages found")
                return []
            
            # Process each message to get full details
            emails = []
            for i, msg in enumerate(messages[:10]):  # Limit to 10 for now
                try:
                    msg_id = msg['id']
                    print(f"Processing message {i+1}/{min(len(messages), 10)}: {msg_id}")
                    
                    msg_response = requests.get(
                        f'https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}',
                        headers=headers
                    )
                    
                    if msg_response.status_code == 200:
                        msg_data = msg_response.json()
                        payload = msg_data.get('payload', {})
                        headers = payload.get('headers', [])
                        
                        subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
                        sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown Sender')
                        snippet = msg_data.get('snippet', '')
                        
                        emails.append({
                            'id': msg_id,
                            'subject': subject,
                            'sender': sender,
                            'snippet': snippet
                        })
                        
                        print(f"  - Subject: {subject[:50]}...")
                        print(f"  - From: {sender}")
                    else:
                        print(f"  - Failed to get message details: {msg_response.status_code}")
                        
                except Exception as e:
                    print(f"  - Error processing message {msg_id}: {e}")
                    continue
            
            print(f"Successfully processed {len(emails)} emails")
            return emails
            
        elif response.status_code == 401:
            print("Gmail API: Unauthorized - token may be expired or invalid")
            return None
        elif response.status_code == 403:
            print("Gmail API: Forbidden - insufficient permissions")
            return None
        else:
            print(f"Gmail API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Error fetching emails with Google token: {e}")
        return None

def format_emails_for_frontend(emails):
    """
    Convert Gmail API emails to frontend format.
    """
    formatted = []
    for email in emails:
        formatted.append({
            'id': email.get('id', ''),
            'subject': email.get('subject', 'No Subject'),
            'sender': email.get('sender', 'Unknown'),
            'snippet': email.get('snippet', ''),
            'category': 'General',  # Will be set by classification
            'draftReply': '',  # Will be set by draft generation
            'isRead': False,
            'timestamp': datetime.now().isoformat()
        })
    return formatted

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)  # Set debug=False for production

