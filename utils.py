from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

def get_gmail():
    SCOPES = ['https://www.googleapis.com/auth/gmail.modify']
    flow = InstalledAppFlow.from_client_secrets_file('config/client_secret_919073950139-8o8c4fhkkrf3cvs5gdsaje6ri51du5bh.apps.googleusercontent.com.json', SCOPES)
    credentials = flow.run_local_server(port=0)
    return build('gmail', 'v1', credentials=credentials)
