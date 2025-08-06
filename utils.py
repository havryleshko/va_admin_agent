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
    credentials = flow.run_local_server(port=0)
    return build('gmail', 'v1', credentials=credentials)



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

