from dotenv import load_dotenv
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import (
    ChatPromptTemplate,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

def _get_key() -> str:
    load_dotenv()
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise RuntimeError("OPENAI_API_KEY missing. Set it in env or Streamlit secrets.")
    return key

def llm_clf(email_text: str) -> str:
    openai_api_key = _get_key()
    llm = ChatOpenAI(model="gpt-4o", temperature=0.7, openai_api_key=openai_api_key)

    reasoning_clf = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(
            """You are an email assistant. Classify the email into one of:
- Invoice/Payment
- Meeting
- Lead
- Recruitment
- Customer Support
- Internal
- General
- Other

Return only the category name."""
        ),
        HumanMessagePromptTemplate.from_template("{email_text}")
    ])
    formatted = reasoning_clf.format_prompt(email_text=email_text)
    resp = llm(formatted.to_messages())
    return resp.content.strip()

def llm_draft_reply(email_text: str, category: str) -> str:
    openai_api_key = _get_key()
    llm = ChatOpenAI(model="gpt-4o", temperature=0.7, openai_api_key=openai_api_key)

    reasoning_reply = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(
            """You are my helpful assistant writing a friendly response.

Category: {category}
Email Content:
{email_text}

Please draft a reply that:
- Uses a warm, conversational tone
- Keeps it under 3 sentences
- Includes next steps or thanks
- Feels like it came from a real person

Reply:"""
        ),
        HumanMessagePromptTemplate.from_template("Email: {email_text}, Category: {category}")
    ])
    formatted = reasoning_reply.format_prompt(email_text=email_text, category=category)
    resp = llm(formatted.to_messages())
    return resp.content.strip()
