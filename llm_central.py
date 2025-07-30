from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain.memory import ConversationBufferMemory

load_dotenv()

openai_api_key = os.getenv('OPEN_API_KEY') #opening .env file
embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)