from utils import get_gmail
from llm_central import llm_brain


def get_unread_emails():
    service = get_gmail()
    results = service.users().messages().list(userID='me', q='is:unread').execute()
    messages = results.get('messages', []) # returning messages
    emails = [] # creates actual full list for storing all data later


    for m in messages: #for each message get its details
        m_id = m['id'] #need the email id to get full content
        m_data = service.users().messages().get(userId='me', id=m_id, format='full').execute() #pulling all content 

        headers = m_data['payload'].get('headers', []) #getting header from email
        subject = next((header['value'] for header in headers if header['name'] == 'Subject'), 'No Subject') # getting subject of email
        sender = next((header['value'] for header in headers if header['name'] == 'From'), 'Unknown Sender') #getting info about sender
        snippet = m_data.get('snippet', '') #getting first few lines from the message to display

        emails.append({
            'id': m_id,
            'subject': subject,
            'sender': sender,
            'snippet': snippet
        }) # creating dict into one obj

    

