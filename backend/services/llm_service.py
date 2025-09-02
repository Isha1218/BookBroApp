import google.generativeai as genai
from langchain_core.prompts import ChatPromptTemplate
from consts.api_keys import APIKEY
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from prompt_templates.recap_template import RECAP_TEMPLATE

class LLMService:
    def __init__(self):
        genai.configure(api_key=APIKEY)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.embeddings = HuggingFaceEmbeddings()
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=5000,
            chunk_overlap=100,
            length_function=len,
            is_separator_regex=False
        )
    
    def recap(self, recap_context):
        try:
            prompt_template = ChatPromptTemplate.from_template(RECAP_TEMPLATE)
            prompt = prompt_template.format(book_text=recap_context)
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.5,
                    stop_sequences=['\n\n']
                )
            )
            return response.text if response.text else "Unable to generate recap"
        except Exception as e:
            print(f"Error in recap: {e}")
            raise e