from llm_central import llm_clf, llm_draft_reply
from for_emails import draft_reply, sending_email
import streamlit as st
from utils import get_gmail

st.set_page_config(page_title='VA AI agent', page_icon='📜')
st.title('VA AI for automated admin')
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
        st.write(f"**Subject:** {email['subject']}") # for subject
        st.write(f"**From:** {email['sender']}") # from
        st.write(f"**Category:** {email['category']}") # category
        st.write(f"**Snippet:** {email['snippet']}") # snippet

    # creating texting area 
        edited = st.text_area(label="Edit draft reply", value=email["draft_reply"], key=f"reply_{idx}")
        c1, c2, c3 = st.columns(3) # columns for email buttons
        with c1:
            if st.button('Send', key=f'send_{idx}'):
                sending_email(to=email['sender'], subject='RE: ' + email['subject'], text=edited) #calling func for email send
                st.success('Email sent!')

        with c2:
            if st.button("Queue", key=f"queue_{idx}"):
                with open("queue_list.txt", "a") as f:
                    f.write(f"{email['sender']} | {email['subject']} | {email['draft_reply']}\n")

                    st.success("Queued.")

        with c3:
            if st.button("Discard", key=f"discard_{idx}"):
                st.warning("Discarded.")


