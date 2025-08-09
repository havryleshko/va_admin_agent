from utils import get_gmail
from llm_central import llm_clf
from llm_central import llm_draft_reply
from utils import send_email
from googleapiclient.errors import HttpError
import streamlit as st


def get_unread_emails():
    service = get_gmail()
    if service is None:
        st.warning("Please sign in first")
        return []
    
    try:
        results = service.users().messages().list(userId='me', q='is:unread', maxResults=25).execute()
    except HttpError as e:
        st.info(f"Debug: Gmail API {e}")
        return []
    messages = results.get('messages', []) or [] # returning messages
    emails = [] # creates actual full list for storing all data later


    for m in messages: #for each message get its details

        m_id = m.get('id') #need the email id to get full content
        if not m_id:
            continue
        try:
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

        except HttpError as e:
            st.warning(f'Debug: error retrieving message {m_id}, {e}')
            continue

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

def queue_email(sender: str, subject: str, draft: str):
    with open("queue_list.txt", "a") as f:
        f.write(f"{sender} | {subject} | {draft}\n")
    return True

def discard_email(_sender: str, _subject: str):
    return True