from elasticsearch import Elasticsearch
import os
from dotenv import load_dotenv

load_dotenv()

ELASTICSEARCH_HOST = os.getenv("ELASTICSEARCH_HOST", "localhost")
ELASTICSEARCH_PORT = os.getenv("ELASTICSEARCH_PORT", "9200")

es = Elasticsearch([{'host': ELASTICSEARCH_HOST, 'port': ELASTICSEARCH_PORT}])

def create_index(index_name, settings=None):
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name, body=settings or {})

def index_document(index_name, doc_id, document):
    es.index(index=index_name, id=doc_id, body=document)

def search_documents(index_name, query):
    return es.search(index=index_name, body=query)
