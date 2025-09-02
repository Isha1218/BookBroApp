LOOKUP_TYPE_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to classify a highlighted phrase from a book into one of the following types:
character, group, event, place, object, or N/A.

Phrase to classify:
"{phrase}"

Context for this phrase:
{context}

Instructions:
- Choose the type that best fits the phrase **in the context of the story**.
- If the phrase does not clearly fit any category, respond with "N/A".
- Do not add extra explanation—return only one of the types listed above.
"""


LOOKUP_CHARACTER_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to analyze a character from a book 
and return the result in valid JSON format.

Follow this structure exactly:
{{
    "name": string,                  // the character's full name or main identifier
    "role": string,                  // their role in the story (e.g. protagonist, antagonist, mentor, side character, etc.)
    "relationships": {{               // key = another character's name, value = type of relationship
        "Character A": "friend",
        "Character B": "enemy",
        "Character C": "sibling"
    }},
    "personality": [string],         // list of major personality traits (adjectives or short phrases)
    "notable_events": [string]       // only the most important events, actions, or turning points involving the character
}}

This is the character to analyze: "{character}"

Here is the context about the character:
{context}

Guidelines:
- Only include meaningful or major information. Ignore minor interactions or trivial details.  
- Focus on relationships and events that significantly impact the story or the character's arc.  
- Keep lists concise but representative.  
- Only return the JSON — no explanations, no extra text.

Example output:
{{
    "name": "Elizabeth Bennet",
    "role": "protagonist",
    "relationships": {{
        "Mr. Darcy": "love interest",
        "Jane Bennet": "sister",
        "Mr. Collins": "cousin / unwanted suitor",
        "Lady Catherine de Bourgh": "antagonistic acquaintance"
    }},
    "personality": ["witty", "independent", "observant", "strong-willed"],
    "notable_events": [
        "Refuses Mr. Collins' proposal",
        "Gradually overcomes prejudice against Mr. Darcy",
        "Supports Jane during her courtship with Mr. Bingley",
        "Ultimately marries Mr. Darcy"
    ]
}}
"""


JSON_TO_PARAGRAPH_TEMPLATE = """
You are a literary analyst. Your task is to turn a JSON character analysis into a natural, engaging paragraph.  

Here is the context from the book:
{context}

Here is the structured JSON analysis:
{json}

Now, using both the context and the JSON, write a concise but insightful paragraph that describes the character's role, personality, relationships, and most important events. 

Guidelines:
- The paragraph should flow smoothly like a literary analysis, not like a list.
- Only include meaningful or major information. Ignore minor interactions or trivial details.  
- Focus on relationships and events that significantly impact the story or the character's arc.  
- The paragraph should be 4-6 sentences.

Paragraph:
"""
