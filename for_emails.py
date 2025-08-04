from utils import get_gmail
from llm_central import llm_clf
from llm_central import llm_draft_reply
from utils import send_email


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

    return emails

def classify_email():
    emails = get_unread_emails() #first to get unread emails
    classified_emails = [] # empty list to store outcomes
    for e in emails: 
        content = e['snippet'] # get content from each email
        category = llm_clf(content) #referring clf
        e['category'] = category
        classified_emails.append(e)

    return classified_emails

def draft_reply():
    emails = classify_email() #gets classified from prev func
    replied = [] # to store emails with draft reply
    for e in emails:
        content = e['snippet'] # getting main content
        category = e['category'] # getting category based on outcome from prev func
        draft = llm_draft_reply(content, category) #getting reply from llm
        e['draft_reply'] = draft # adding reply to email dict
        replied.append(e) # storing updated dic

    return replied

def sending_email():
    draft_emails = draft_reply() # gets emails with draft replies
    for e in draft_emails:
        print('Subject:', e['subject'])
        print('From:', e['sender'])
        print('Category:', e['category'])
        print('Draft Reply:', e['draft_reply'])

        choice = input('Send it, queue it or discard it?').strip().lower()

        if choice == 'send':
            send_email(to=e['sender'], subject='RE: ' + e['subject'], text=['draft_reply '])
            print('Email sent!')
        elif choice == 'queue':
            with open('queue_list.txt', 'a') as f:
                f.write(f'{e['sender']} | {e['subject']} | {e['draft_reply']}')
            print('Queued!')

        elif choice == 'discard':
            print('Discarded!')

        else:
            print('Invalid choice!')