
from for_emails import draft_reply
import streamlit as st
from utils import get_gmail, send_email
from for_emails import queue_email, discard_email

st.write(st.secrets)


st.set_page_config(page_title='VA AI agent', page_icon='📜')
st.title('VA AI for automated admin')

with st.sidebar:
    if st.button('Sign out'):
        if "credentials" in st.session_state:
            del st.session_state["credentials"]
        st.query_params.clear()
        st.rerun()

if st.button('Load emails'): # click = 'if' becomes True, 
    service = get_gmail()
    if service is None:
        st.warning('Complete Google sign in please to get Gmail access')
    else:
        result = draft_reply()
        if result:
            st.session_state.classified_emails = result
        else:
            st.info("No unread emails found")

# displaying outcomes from loading emails and other:
if 'classified_emails' in st.session_state:
    for idx, email in enumerate(st.session_state.classified_emails): # looping through each email - idx is index 'enumerate' creates for each e
        st.markdown('---') #. visual separation
        st.markdown(f"**Subject:** {email['subject']}") # for subject
        st.markdown(f"**From:** {email['sender']}") # from
        st.markdown(f"**Category:** {email['category']}") # category
        st.markdown(f"**Snippet:** {email['snippet']}") # snippet
        edited = st.text_area("Edit draft reply", value=email.get("draft_reply", ""), key=f"reply_{idx}")

    # creating texting area 
        c1, c2, c3 = st.columns(3)
        with c1:
            if st.button('Send', key=f'send_{idx}'):
                send_email(to=email['sender'], subject='RE: ' + email['subject'], text=edited)
                st.success('Email sent!')
        with c2:
            if st.button("Queue", key=f"queue_{idx}"):
                queue_email(email['sender'], email['subject'], edited)
                st.success("Queued.")
        with c3:
            if st.button("Discard", key=f"discard_{idx}"):
                discard_email(email['sender'], email['subject'])
                st.warning("Discarded.")

elif 'classified_emails' in st.session_state and not st.session_state.classified_emails:
    st.info("No unread emails in the inbox!")

from supabase import create_client # entry point to connect to Supabase

url = st.secrets['SUPABASE_URL']
key = st.secrets['SUPABASE_KEY']

supabase = create_client(url, key)
current_user_id = "demo_user"
task_id = "demo_task"
supabase.table("tasks").insert({
    "title": "Reply to client email",
    "user_id": current_user_id,
    "status": "pending"
}).execute() # inserting new tasks 

tasks = supabase.table("tasks").select("*").eq("user_id", current_user_id).execute() # to show pending tasks
supabase.table("tasks").update({"status": "done"}).eq("id", task_id).execute() # to update status after agent makes changes
