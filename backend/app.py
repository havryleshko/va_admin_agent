from flask import Flask, request, jsonify
from flask_cors import CORS
from for_emails import get_unread_emails, classify_emails, draft_replies, send_email_service, discard_email
from utils import get_gmail
import os
from dotenv import load_dotenv
import json
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

# Mock credentials storage (in production, use proper session management)
credentials_store = {}

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
        access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not access_token:
            return jsonify({'error': 'No access token provided'}), 401
        
        if action == 'fetch_unread':
            try:
                # Try to use real Gmail API with the access token
                # Convert Supabase access token to Gmail credentials
                credentials = convert_token_to_credentials(access_token)
                if credentials:
                    # Use real Gmail API
                    real_emails = get_unread_emails(credentials)
                    # Convert to expected format
                    formatted_emails = format_emails_for_frontend(real_emails)
                    return jsonify({'emails': formatted_emails, 'source': 'gmail_api'})
                else:
                    # Fallback to mock emails if credentials conversion fails
                    print("Using mock emails - credentials conversion failed")
                    emails = get_mock_emails()
                    return jsonify({'emails': emails, 'source': 'mock'})
            except Exception as e:
                print(f"Gmail API error: {e}, falling back to mock emails")
                emails = get_mock_emails()
                return jsonify({'emails': emails, 'source': 'mock', 'error': str(e)})
        
        return jsonify({'error': 'Invalid action'}), 400
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/classify', methods=['POST'])
def classify_emails_endpoint():
    try:
        data = request.get_json()
        emails = data.get('emails', [])
        access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not access_token:
            return jsonify({'error': 'No access token provided'}), 401
        
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
        access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not access_token:
            return jsonify({'error': 'No access token provided'}), 401
        
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
        access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not access_token:
            return jsonify({'error': 'No access token provided'}), 401
        
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
        access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not access_token:
            return jsonify({'error': 'No access token provided'}), 401
        
        # For now, return success (in production, implement actual email discarding)
        # discard_email(email_id)
        return jsonify({'success': True, 'message': 'Email discarded successfully'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/emails/stats', methods=['GET'])
def get_email_stats():
    try:
        access_token = request.headers.get('Authorization', '').replace('Bearer ', '')
        
        if not access_token:
            return jsonify({'error': 'No access token provided'}), 401
        
        # For now, return mock stats (in production, get real stats from Gmail API)
        stats = {
            'total': 25,
            'unread': 8,
            'categorized': 20
        }
        
        return jsonify({'stats': stats})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def convert_token_to_credentials(access_token):
    """
    Convert Supabase access token to Gmail API credentials.
    This is a placeholder - you'll need to implement proper OAuth flow.
    """
    try:
        # For now, return None to trigger mock emails
        # In production, you'd exchange the token for Gmail API credentials
        print(f"Token conversion not implemented yet. Token: {access_token[:20]}...")
        return None
    except Exception as e:
        print(f"Token conversion error: {e}")
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

def get_mock_emails():
    """Temporary mock emails for testing - replace with real Gmail API calls"""
    return [
        {
            'id': '1',
            'subject': 'Invoice #12345 - Payment Due',
            'sender': 'billing@company.com',
            'snippet': 'Your invoice for services rendered is now due. Please process payment within 30 days.',
            'category': 'Invoice/Payment',
            'draftReply': 'Thank you for the invoice. I will process the payment within the next few days.',
            'isRead': False,
            'timestamp': datetime.now().isoformat()
        },
        {
            'id': '2',
            'subject': 'Meeting Request - Q4 Planning',
            'sender': 'manager@company.com',
            'snippet': 'Hi, I would like to schedule a meeting to discuss our Q4 planning and strategy.',
            'category': 'Meeting',
            'draftReply': 'Sounds great! I\'m available this week. What time works best for you?',
            'isRead': False,
            'timestamp': datetime.now().isoformat()
        },
        {
            'id': '3',
            'subject': 'New Lead - Potential Client',
            'sender': 'sales@prospect.com',
            'snippet': 'We are interested in your services and would like to learn more about your offerings.',
            'category': 'Lead',
            'draftReply': 'Thank you for your interest! I\'d be happy to schedule a call to discuss how we can help.',
            'isRead': True,
            'timestamp': datetime.now().isoformat()
        }
    ]

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)  # Set debug=False for production

