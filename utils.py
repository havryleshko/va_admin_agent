from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from email.mime.text import MIMEText #Multipurpose Internet Main Extensions - to create plain text email bodies
import base64 #to encode email content into Base64URL
import os
import streamlit as st

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

def get_redirect():
    redirect = st.secrets["gmail_credentials"]["web"].get("redirect_uris", [])
    return redirect

def get_gmail():
    if "credentials" in st.session_state:
        return build('gmail', 'v1', credentials=st.session_state["credentials"])

    try:
        web_config = dict(st.secrets["gmail_credentials"]["web"])
    except Exception:
        st.error("Missing gmail_credentials in 'secrets'. Please add OAuth client to 'secrets'.")
        return None
    
    client_config = {"web": web_config}
    redirect_uri = get_redirect()

    flow = Flow.from_client_config(
        client_config=client_config,
        scopes=SCOPES,
        redirect_uri=redirect_uri
    )
    
    code = st.query_params.get("code")
    state = st.query_params.get("state")
    if code:
        saved_state = st.session_state.get("oauth_state")
        if saved_state and state and saved_state != state:
            st.error('OAuth state mismatch. Try that again please')
            return None
        
        flow.fetch_token(code=code)
        st.session_state["credentials"] = flow.credentials
        return build("v1", "gmail", credentials=flow.credentials)

    auth, state = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent"
    )
    st.session_state["oauth_state"] = state
    st.info('Authorise Gmail please:')
    try:
        st.link_button("Sign in with Google:", auth)
    except Exception:
        st.markdown(f"[Sign in with Google]({auth})")
    return None 

def create_message(to, subject, text):
    message = MIMEText(text)
    message['to'] = to
    message['subject'] = subject

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode() # converts structured message into bytes an d encodes it 
    return {'raw': raw} 

def send_email(to, subject, text):
    service = get_gmail() 
    if service is None:
        st.warning('Please sign in with Google for Gmail access')
        return None
    message = create_message(to, subject, text)
    sent = service.users().messages().send(userId='me', body=message).execute() # sends email using user's Gmail via GmailAPI
    return sent

