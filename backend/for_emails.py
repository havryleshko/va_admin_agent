from utils import get_gmail, send_email
from llm_central import llm_clf, llm_draft_reply
from googleapiclient.errors import HttpError
from typing import List, Dict


def get_unread_emails(credentials) -> List[Dict]:
    """
    Fetch unread emails using provided Gmail OAuth credentials.
    Returns a list of dicts: {'id', 'subject', 'sender', 'snippet'}
    """
    if not credentials:
        raise ValueError("Missing OAuth credentials")
    
    service = get_gmail(credentials)

    try:
        results = service.users().messages().list(
            userId='me',
            q='is:unread',
            maxResults=25
        ).execute()
    except HttpError as e:
        raise HttpError(f"Gmail API error: {e}")

    messages = results.get('messages', []) or []
    emails = []

    for msg in messages:
        m_id = msg.get('id')
        if not m_id:
            continue

        try:
            m_data = service.users().messages().get(
                userId='me', 
                id=m_id, 
                format='full'
            ).execute()

            headers = m_data['payload'].get('headers', [])
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), 'No Subject')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), 'Unknown Sender')
            snippet = m_data.get('snippet', '')

            emails.append({
                'id': m_id,
                'subject': subject,
                'sender': sender,
                'snippet': snippet
            })
        except HttpError as e:
            raise HttpError(f"Error retrieving message {m_id}: {e}")

    return emails


def classify_emails(emails: List[Dict]) -> List[Dict]:
    """
    Classify a list of emails using LLM.
    Returns the same list with 'category' added to each email.
    """
    for email in emails:
        content = email.get('snippet', '')
        email['category'] = llm_clf(content)
    return emails


def draft_replies(emails: List[Dict]) -> List[Dict]:
    """
    Draft replies for a list of classified emails.
    Returns the same list with 'draft_reply' added to each email.
    """
    for email in emails:
        content = email.get('snippet', '')
        category = email.get('category', 'Other')
        email['draft_reply'] = llm_draft_reply(content, category)
    return emails


def queue_email(sender: str, subject: str, draft: str) -> bool:
    """
    Save draft to queue file.
    """
    with open("queue_list.txt", "a") as f:
        f.write(f"{sender} | {subject} | {draft}\n")
    return True


def discard_email(sender: str, subject: str) -> bool:
    """
    Discard an email (placeholder for future database action).
    """
    # for production, replace with DB update
    return True


def send_email_service(credentials, to: str, subject: str, text: str):
    """
    Send an email using Gmail API with provided credentials.
    """
    service = get_gmail(credentials)
    return send_email(service, to, subject, text)

# supabase wrappers
def queue_email_task(supabase, user_id: str, sender: str, subject: str, draft: str):
    return queue_email(supabase, user_id, sender, subject, draft)

def discard_email_task(supabase, user_id: str, subject: str):
    return discard_email(supabase, user_id, subject)