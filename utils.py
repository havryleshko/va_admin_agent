from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from email.mime.text import MIMEText #Multipurpose Internet Main Extensions - to create plain text email bodies
import base64 #to encode email content into Base64URL

SCOPES = ['https://www.googleapis.com/auth/gmail.modify']

def get_gmail(credentials: any):
    if not credentials:
        raise ValueError('Missing OAuth credentials')
    service = build('gmail', 'v1', credentials=credentials)
    return service
    
def create_message(to: str, subject: str, text: str):
    message = MIMEText(text)
    message['to'] = to
    message['subject'] = subject

    raw = base64.urlsafe_b64encode(message.as_bytes()).decode() # converts structured message into bytes an d encodes it 
    return {'raw': raw} 

def send_email(service: any, to: str, subject: str, text: str):
    service = get_gmail() 
    if service is None:
        raise ValueError("Gmail service not provided")
    message = create_message(to, subject, text)
    sent = service.users().messages().send(userId='me', body=message).execute() # sends email using user's Gmail via GmailAPI
    return sent

def get_oauth(client_config: dict[str, any], redirect_uri: str):
    return Flow.from_client_config(
        client_config=client_config,
        scopes=SCOPES,
        redirect_uri=redirect_uri
    )

def fetch_token(flow: Flow, code: str):
    if not code:
        raise ValueError('Auth code missing')
    flow.fetch_token(code=code)
    return flow.credentials 