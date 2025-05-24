import os
from dotenv import load_dotenv

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

from langchain.llms import OpenAI
from llama_index import SimpleDirectoryReader, LLMPredictor, ServiceContext, VectorStoreIndex, QueryEngine

llm_predictor = LLMPredictor(llm=OpenAI(openai_api_key=OPENAI_API_KEY))
service_context = ServiceContext.from_defaults(llm_predictor=llm_predictor)

# Store the index globally for reuse (in-memory, for demo)
global_index = None

def build_index_from_docs(doc_dir):
    global global_index
    documents = SimpleDirectoryReader(doc_dir).load_data()
    global_index = VectorStoreIndex.from_documents(documents, service_context=service_context)
    return global_index

# New: Query the index for relevant context

def query_llama_index(query: str):
    global global_index
    if global_index is None:
        raise Exception("Index not built yet. Upload a document first.")
    query_engine = global_index.as_query_engine()
    response = query_engine.query(query)
    return str(response)
