import streamlit as st
from supabase import create_client
from for_emails import draft_reply, queue_email, discard_email
from utils import get_gmail, send_email


SUPABASE_URL = st.secrets["SUPABASE_URL"]
SUPABASE_KEY = st.secrets["SUPABASE_KEY"]
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


st.set_page_config(page_title="VA AI agent", page_icon="📜")
st.title("VA AI for automated admin")

if "user" not in st.session_state:
    st.write("## Please log in")
    redirect_url = "https://vaappagent.streamlit.app/"
    auth_url = f"{SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to={redirect_url}"
    st.markdown(f"[Click here to sign in with Google]({auth_url})")
    st.stop()

current_user_id = st.session_state.user.id  # this assumes you have somehow stored it in session_state previously

with st.sidebar:
    if st.button("Sign out"):
        st.session_state.clear()
        st.experimental_rerun()


if st.button("Load emails"):
    service = get_gmail()
    if service is None:
        st.warning("Complete Google sign in to get Gmail access")
    else:
        result = draft_reply()
        if result:
            st.session_state.classified_emails = result
        else:
            st.info("No unread emails found")


if "classified_emails" in st.session_state:
    for idx, email in enumerate(st.session_state.classified_emails):
        st.markdown("---")
        st.markdown(f"**Subject:** {email['subject']}")
        st.markdown(f"**From:** {email['sender']}")
        st.markdown(f"**Category:** {email['category']}")
        st.markdown(f"**Snippet:** {email['snippet']}")
        edited = st.text_area("Edit draft reply", value=email.get("draft_reply", ""), key=f"reply_{idx}")

        c1, c2, c3 = st.columns(3)
        with c1:
            if st.button("Send", key=f"send_{idx}"):
                send_email(to=email["sender"], subject="RE: " + email["subject"], text=edited)
                supabase.table("tasks").update({"status": "done"})\
                    .eq("user_id", current_user_id).eq("title", f"Reply: {email['subject']}").execute()
                st.success("Email sent and task marked done")

        with c2:
            if st.button("Queue", key=f"queue_{idx}"):
                queue_email(email["sender"], email["subject"], edited)
                supabase.table("tasks").insert({
                    "title": f"Reply: {email['subject']}",
                    "user_id": current_user_id,
                    "status": "pending"
                }).execute()
                st.success("Email queued and task created!")

        with c3:
            if st.button("Discard", key=f"discard_{idx}"):
                discard_email(email["sender"], email["subject"])
                supabase.table("tasks").update({"status": "discarded"})\
                    .eq("user_id", current_user_id).eq("title", f"Reply: {email['subject']}").execute()
                st.warning("Email discarded and task updated")

elif "classified_emails" in st.session_state and not st.session_state.classified_emails:
    st.info("No unread emails in the inbox")
