from unstructured.partition.auto import partition

def parse_document(file_path):
    elements = partition(filename=file_path)
    return elements
