from langchain_core.prompts import PromptTemplate
from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_huggingface import HuggingFaceEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
from langchain.vectorstores import Chroma
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import PyPDFLoader
from langchain.chains import LLMChain
from langchain_community.vectorstores import Chroma
import tempfile

load_dotenv()

def vectorize(data):
    data.stream.seek(0)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        data.save(tmp.name)
        loader = PyPDFLoader(tmp.name)
        docs = loader.load()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=100,
            chunk_overlap=5
        )
        chunks = splitter.split_documents(docs)

        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        vector_store = Chroma(
        embedding_function=embeddings,
        persist_directory="chroma_db",
        collection_name="sample"
    )

    vector_store.add_documents(chunks)
    vector_store.persist()

    return "success"

def chatBot(query):
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = Chroma(
        persist_directory="chroma_db",
        embedding_function=embeddings,
        collection_name="sample"
    )

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 2}
    )

    docs = retriever.get_relevant_documents(query)

    context_text = "\n\n".join([doc.page_content for doc in docs])

    prompt = PromptTemplate(
        template="""You are a helpful assistant. Use the following context and chat history to answer the question.

        Context:
        {context}

        Question:
        {question}
        """,
        input_variables=["context", "question"]
    )

    parser = StrOutputParser()

    repo_id = 'mistralai/Mistral-7B-Instruct-v0.3'
    llm = HuggingFaceEndpoint(repo_id=repo_id, temperature=0.7, task="text-generation")
    model = ChatHuggingFace(llm=llm)

    chain = LLMChain(
        llm=model,
        prompt=prompt,
        output_parser=parser
    )

    response = chain.invoke({
        "context": context_text,
        "question": query
    })

    if isinstance(response, dict) and "text" in response:
        return response["text"]
    else:
        return str(response)
