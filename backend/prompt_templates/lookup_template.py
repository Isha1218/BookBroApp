LOOKUP_TYPE_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to classify a highlighted phrase from a book into one of the following types:
character, group, event, place, object, or none (a word or phrase with no significance to the story, e.g., "this", "since", "and").

Phrase to classify:
"{phrase}"

Context for this phrase:
{context}

Instructions:
- Choose the type that best fits the phrase **in the context of the story**.
- If the phrase has no meaningful significance to the story, respond with "none".
- Do not add extra explanation—return only one of the types listed above.
"""


LOOKUP_CHARACTER_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to analyze a character from a book 
and return the result in valid JSON format.

Follow this structure exactly:
{{
    "name": string,                   // the character's full name or main identifier
    "role": string,                   // their role in the story (e.g. protagonist, antagonist, mentor, side character, etc.)
    "relationships": {{               // key = another character's name, value = type of relationship
        "Character A": "friend",
        "Character B": "enemy",
        "Character C": "sibling"
    }},
    "personality": [string],         // list of major personality traits (adjectives or short phrases)
    "notable_events": [string]       // only the most important events, actions, or turning points involving the character
}}

This is the character to analyze: "{selected_text}"

Here is the context about the character:
{context}

Guidelines:
- IMPORTANT: Ignore all other characters mentioned in the context. 
- Only consider "{selected_text}" for analysis. Do not describe, speculate, or infer anything about any other character, even if they are frequently mentioned in the context.
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

LOOKUP_PLACE_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to analyze a place or location from a book 
and return the result in valid JSON format.

Follow this structure exactly:
{{
    "name": string,                   // the name of the location
    "type": string,                   // type of location (e.g., residence, city, forest, castle, inn, etc.)
    "description": string,            // physical characteristics and notable features of the location
    "significance": string,           // importance of the location within the story or context
    "notable_events": [string]        // only the most important events, actions, or turning points that occur at this location
}}

This is the location to analyze: "{selected_text}"

Here is the context about the location:
{context}

Guidelines:
- IMPORTANT: Focus only on "{selected_text}". Do not describe, speculate, or infer anything about other locations unless directly relevant to this one.
- Emphasize how the location contributes to the story, character development, or plot progression.
- Keep lists concise but representative.
- Only return the JSON — no explanations, no extra text.

Example output:
{{
    "name": "Hogwarts School of Witchcraft and Wizardry",
    "type": "school / castle",
    "description": "A large, ancient castle with multiple towers, secret passages, magical staircases, and extensive grounds including a lake and forest.",
    "significance": "Serves as the primary setting where the main characters learn magic, face challenges, and experience key events that drive the story.",
    "notable_events": [
        "Harry receives his Hogwarts acceptance letter",
        "Sorting Ceremony and house assignments",
        "Triwizard Tournament tasks take place here",
        "Final battle against Voldemort occurs in the castle"
    ]
}}
"""

LOOKUP_EVENT_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to analyze an event from a book 
and return the result in valid JSON format.

Follow this structure exactly:
{{
    "name": string,                    // the name or title of the event
    "time": string,                    // when the event occurs in the story timeline (e.g., year, season, age, or relative timing)
    "description": string,             // brief description of what happens during the event
    "outcome": string,                 // the result or consequence of the event
    "participants": {{                  // key = character's name, value = their role in the event
        "Character A": "role",
        "Character B": "role"
    }}
}}

This is the event to analyze: "{selected_text}"

Here is the context about the event:
{context}

Guidelines:
- Focus only on "{selected_text}" and its participants.
- Include the event's timing within the story world, description, outcome, and key participants.
- Keep information concise but representative of the story.
- Only return the JSON — no explanations, no extra text.

Example output:
{{
    "name": "The Battle of Hogwarts",
    "time": "Late spring, during Harry's seventh year at Hogwarts",
    "description": "A large-scale battle between the forces of good and Voldemort's followers at Hogwarts castle.",
    "outcome": "Voldemort is defeated, and the wizarding world is saved.",
    "participants": {{
        "Harry Potter": "protagonist / leader",
        "Hermione Granger": "support / strategist",
        "Ron Weasley": "support / fighter",
        "Lord Voldemort": "antagonist / defeated"
    }}
}}
"""

LOOKUP_OBJECT_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to analyze an object from a book 
and return the result in valid JSON format.

Follow this structure exactly:
{{
    "name": string,                        // the name of the object
    "description": string,                 // physical description or appearance
    "owner_or_user": {{                     // key = character's name, value = how the character uses or owns the object
        "Character A": "role / usage",
        "Character B": "role / usage"
    }},
    "abilities_or_properties": [string],   // list of abilities, powers, or notable properties of the object
    "significance": string                 // importance of the object within the story
}}

This is the object to analyze: "{selected_text}"

Here is the context about the object:
{context}

Guidelines:
- Focus only on "{selected_text}" and its known interactions with characters.
- Include the description, abilities or properties, owners/users, and significance.
- Keep information concise but representative of the story.
- Only return the JSON — no explanations, no extra text.

Example output:
{{
    "name": "Invisibility Cloak",
    "description": "A long, silvery cloak that renders the wearer invisible when worn.",
    "owner_or_user": {{
        "Harry Potter": "primary user; uses it for stealth and protection",
        "Ignotus Peverell": "original owner"
    }},
    "abilities_or_properties": ["renders wearer invisible", "can be folded and stored easily"],
    "significance": "Critical magical artifact that helps the protagonist avoid danger and uncover key secrets."
}}
"""

LOOKUP_GROUP_PROMPT_TEMPLATE = """
You are an expert literary analyst. Your task is to analyze a group from a book 
and return the result in valid JSON format.

Follow this structure exactly:
{{
    "name": string,                        // the name of the group
    "members": {{                           // key = character's name, value = their role in the group
        "Character A": "role",
        "Character B": "role"
    }},
    "purpose": string,                     // the main goal, mission, or function of the group
    "type": string,                        // type of group (e.g., secret society, army, guild, family, etc.)
    "notable_events": [string]             // major events or actions the group participated in
}}

This is the group to analyze: "{selected_text}"

Here is the context about the group:
{context}

Guidelines:
- Focus only on "{selected_text}" and its members.
- Include the group's name, type, purpose, key members, and notable events.
- Keep information concise but representative of the story.
- Only return the JSON — no explanations, no extra text.

Example output:
{{
    "name": "The Order of the Phoenix",
    "members": {{
        "Harry Potter": "member / key operative",
        "Albus Dumbledore": "leader",
        "Sirius Black": "member / protector"
    }},
    "purpose": "To fight against Voldemort and his Death Eaters",
    "type": "secret society",
    "notable_events": [
        "Battle at the Department of Mysteries",
        "Protecting Harry from Death Eaters",
        "Covert operations against Voldemort"
    ]
}}
"""


JSON_TO_PARAGRAPH_CHARACTER_TEMPLATE = """
You are a literary analyst. Your task is to turn a JSON character analysis into a clear, engaging paragraph.  

Here is the structured JSON analysis:
{json}

Write a concise paragraph that describes the character's role in the story, personality, relationships, and most important events. 

Guidelines:
- Include the character's role, personality, relationships (use the actual names given), and most important events.
- Only include information from fields that are present and non-empty. Ignore missing or empty fields completely.
- Use simple, easy-to-understand language. Avoid complex or technical words.
- Do NOT reference the book context explicitly. Focus only on the character as described in the JSON.
- Only include major information. Ignore minor interactions or trivial details.
- The paragraph should be 1-6 sentences and flow naturally.

Paragraph:
"""

JSON_TO_PARAGRAPH_LOCATION_TEMPLATE = """
You are a literary analyst. Your task is to turn a JSON location analysis into a clear, engaging paragraph.  

Here is the structured JSON analysis:
{json}

Write a concise paragraph that describes the location's type, physical characteristics, significance in the story, and most important events that occur there. 

Guidelines:
- Include the location's type, description, significance, and notable events. Use the actual names given.
- Only include information from fields that are present and non-empty. Ignore missing or empty fields completely.
- Use simple, easy-to-understand language. Avoid complex or technical words.
- Do NOT reference the book context explicitly. Focus only on the location as described in the JSON.
- Only include major information. Ignore minor or insignificant details.
- The paragraph should be 1-6 sentences and flow naturally.

Paragraph:
"""

JSON_TO_PARAGRAPH_EVENT_TEMPLATE = """
You are a literary analyst. Your task is to turn a JSON event analysis into a clear, engaging paragraph.  

Here is the structured JSON analysis:
{json}

Write a concise paragraph that describes the event's timing in the story, what happened, its outcome, and the roles of the participants.

Guidelines:
- Include the event's name, story-time, description, outcome, and main participants (use the names and roles given).
- Only include information from fields that are present and non-empty. Ignore missing or empty fields completely.
- Use simple, easy-to-understand language. Avoid complex or technical words.
- Do NOT reference the book context explicitly. Focus only on the event as described in the JSON.
- Only include major details. Ignore minor or trivial actions.
- The paragraph should be 1-6 sentences and flow naturally.

Paragraph:
"""

JSON_TO_PARAGRAPH_OBJECT_TEMPLATE = """
You are a literary analyst. Your task is to turn a JSON object analysis into a clear, engaging paragraph.  

Here is the structured JSON analysis:
{json}

Write a concise paragraph that describes the object's appearance, abilities or properties, owners or users, and its significance in the story.

Guidelines:
- Include the object's name, description, abilities or properties, main owners/users (use the names and roles given), and significance.
- Only include information from fields that are present and non-empty. Ignore missing or empty fields completely.
- Use simple, easy-to-understand language. Avoid complex or technical words.
- Do NOT reference the book context explicitly. Focus only on the object as described in the JSON.
- Only include major details. Ignore minor or trivial mentions.
- The paragraph should be 1-6 sentences and flow naturally.

Paragraph:
"""

JSON_TO_PARAGRAPH_GROUP_TEMPLATE = """
You are a literary analyst. Your task is to turn a JSON group analysis into a clear, engaging paragraph.  

Here is the structured JSON analysis:
{json}

Write a concise paragraph that describes the group's purpose, type, key members and their roles, and the major events the group participated in.

Guidelines:
- Include the group's name, type, purpose, main members (use the names and roles given), and notable events.
- Only include information from fields that are present and non-empty. Ignore missing or empty fields completely.
- Use simple, easy-to-understand language. Avoid complex or technical words.
- Do NOT reference the book context explicitly. Focus only on the group as described in the JSON.
- Only include major details. Ignore minor or trivial actions.
- The paragraph should be 4-6 sentences and flow naturally.

Paragraph:
"""
