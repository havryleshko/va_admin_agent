from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain_community.vectorstores import FAISS

def _get_key():
    load_dotenv()
    openai_api_key = os.getenv('OPENAI_API_KEY') #opening .env file
    return openai_api_key

def llm_clf(email_text: str):
    openai_api_key = _get_key()
    llm = ChatOpenAI(model='gpt-5-nano', temperature=0.7, openai_api_key=openai_api_key)

    #defining prompt template for this specific instance
    reasoning_clf = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(''' You are an email assistant. Your task is to read the email content and classify it into one of the following categories:
- Invoice/Payment
- Meeting
- Lead
- Recruitment
- Customer Support
- Internal
- General
- Other

Return only the category name.'''
        ),
        HumanMessagePromptTemplate.from_template("{email_text}")
])
    formatted_prompt = reasoning_clf.format_prompt(email_text=email_text)
    response = llm(formatted_prompt.to_messages())
    return response.content.strip()
    

def llm_draft_reply(email_text: str, category: str): # needs both content and category for relevant response
    openai_api_key = _get_key()
    llm = ChatOpenAI(model='gpt-5-nano', openai_api_key=openai_api_key, temperature=0.7)

    reasoning_reply = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template('''You are my helpful assistant writing a friendly response.  
Here’s the incoming email and its type:

Category: {category}  
Email Content:
{email_text}

Please draft a reply that:
- Uses a warm, conversational tone
- Keeps it under 3 sentences
- Includes next steps or thanks
- Feels like it came from a real person (use “I” or “we” appropriately)

Reply: '''
        ),
        HumanMessagePromptTemplate.from_template("Email: {email_text}, Category: {category}")
    ])

    formatted_prompt = reasoning_reply.format_prompt(email_text=email_text, category=category)
    response = llm(formatted_prompt.to_messages())
    return response.content.strip()
