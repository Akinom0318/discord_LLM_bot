from langchain_huggingface import HuggingFaceEndpoint
import os
from dotenv import load_dotenv

load_dotenv()


HF_API_KEY = os.getenv("huggingface_token")
repo_id = "mistralai/Mistral-7B-Instruct-v0.2"


def chatBot(prompt):
    llm = HuggingFaceEndpoint(
        repo_id=repo_id,
        max_length=1024,
        temperature=0.5,
        huggingfacehub_api_token=HF_API_KEY,
    )
    llm_chain = llm
    response = llm_chain.invoke(prompt)
    return response