from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from email.mime.text import MIMEText #Multipurpose Internet Main Extensions - to create plain text email bodies
import base64 #to encode email content into Base64URL
import json
import os
import streamlit as st

def get_gmail():
    SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
    client_config = {'installed': dict(st.secrets['gmail_credentials']['installed'])}
    flow = InstalledAppFlow.from_client_config(client_config, SCOPES)
    if "credentials" in st.session_state:
        credentials = st.session_state["credentials"]
        return build('gmail', 'v1', credentials=credentials)

    auth, _ = flow.authorization_url(prompt='consent') #pop up win for permissions to access gmail; consent for consent screen
    st.write("**Authorise Gmail access below:**")
    st.markdown(f"[Authorise Gmail access:]({auth})", unsafe_allow_html=True)
    code = st.text_input("**Paste auth code:**")
    if code:
        flow.fetch_token(code=code)
        credentials = flow.credentials
        st.session_state["credentials"] = credentials
        return build('gmail', 'v1', credentials=credentials)
    
    return None


def create_message(to, subject, text):
    message = MIMEText(text)
    message['to'] = to
    message['subject'] = subject

    raw = base64.urlsafe_b64encode(message.as_bytes()) # converts structured message into bytes an d encodes it 
    return {'raw': raw.decode()} 

def send_email(to, subject, text):
    service = get_gmail() 
    message = create_message(to, subject, text)
    sent = service.users().messages().send(userId='me', body=message).execute() # sends email using user's Gmail via GmailAPI
    return sent

