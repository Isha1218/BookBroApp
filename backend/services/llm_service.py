import google.generativeai as genai
from langchain_core.prompts import ChatPromptTemplate
from consts.api_keys import APIKEY
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings.huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from prompt_templates.recap_template import RECAP_TEMPLATE
from prompt_templates.lookup_template import LOOKUP_TYPE_PROMPT_TEMPLATE, LOOKUP_CHARACTER_PROMPT_TEMPLATE, JSON_TO_PARAGRAPH_TEMPLATE

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
    
    def _store_chunks(self, text):
        chunks = self.text_splitter.split_text(text=text)
        vector_db = FAISS.from_texts(chunks, self.embeddings)
        return vector_db
    
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
        
    def _JSON_to_text(self, json, context):
        try:
            prompt_template = ChatPromptTemplate.from_template(JSON_TO_PARAGRAPH_TEMPLATE)
            prompt = prompt_template.format(context=context, json=json)
            response = self.model.generate_content(
                prompt, 
                generation_config=genai.types.GenerationConfig(
                    temperature=0.5,
                )
            )
            print(f'character lookup text {response.text}')
            return response.text
        except Exception as e:
            print(f"Error in lookup: {e}")
            raise e
        
    def _character_lookup(self, character, context):
        try:
            prompt_template = ChatPromptTemplate.from_template(LOOKUP_CHARACTER_PROMPT_TEMPLATE)
            prompt = prompt_template.format(character=character, context=context)
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.5,
                    response_mime_type="application/json"
                )
            )
            print(f'character lookup json: {response.text}')
            lookup_text = self._JSON_to_text(response.text, context)
            return lookup_text
        except Exception as e:
            print(f"Error in lookup: {e}")
            raise e
    
    def lookup(self, selected_text, lookup_context):
        try:
            db = self._store_chunks(lookup_context)
            results = db.similarity_search_with_score(selected_text, k=10)
            context_list = [doc.page_content for doc, _score in results if selected_text.lower() in doc.page_content.lower()]
            context = "\n\n---\n\n".join(context_list)
            if not context_list:
                lower_context = lookup_context.lower()
                lower_selected = selected_text.lower()
                start_idx = lower_context.find(lower_selected)

                if start_idx == -1:
                    return "Unable to perform lookup"
                else:
                    window_size = 1000
                    start_char = max(start_idx - window_size, 0)
                    end_char = min(start_idx + len(selected_text) + window_size, len(lookup_context))
                    context = lookup_context[start_char:end_char]

            prompt_template = ChatPromptTemplate.from_template(LOOKUP_TYPE_PROMPT_TEMPLATE)
            prompt = prompt_template.format(phrase=selected_text, context=context)

            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.5,
                    stop_sequences=['\n\n'],
                    max_output_tokens=1
                )
            )
            result = response.text if response.text else "N/A"
            print(f'type: {result}')
            if result == 'character':
                return self._character_lookup(selected_text, context), 'character'
            return "Not character"
        except Exception as e:
            print(f"Error in lookup: {e}")
            raise e