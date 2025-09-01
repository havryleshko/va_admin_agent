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
            # For now, we'll use a mock approach since we need to convert OAuth token to credentials
            # In production, you'd need to exchange the OAuth token for Gmail API credentials
            emails = get_mock_emails()  # Replace with real Gmail API call
            return jsonify({'emails': emails})
        
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
