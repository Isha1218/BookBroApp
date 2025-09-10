import { IPADDRESS } from "../../consts/consts";

const API_BASE_URL = 'http://' + IPADDRESS + ':5000';

export const convertToSecondPersonPOV = async (dialogue) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/second_person_pov`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dialogue: dialogue
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();
        return data['dialogue'];
    } catch (error) {
        console.error('Error converting to second person POV', error);
        throw error;
    }
}

export const createRoleplayScenes = async (roleplayContext) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/create_roleplay_scenes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roleplay_context: roleplayContext
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();
        return data['roleplay_scenes'];
    } catch (error) {
        console.error('Error creating roleplay scenes', error);
        throw error;
    }
}

export const createCharacterBrief = async (characterName, sceneDescription, readText, recentChapterContext) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/create_character_brief`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                character_name: characterName,
                scene_description: sceneDescription,
                read_text: readText,
                recent_chapter_context: recentChapterContext
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();
        return data['character_brief'];
    } catch (error) {
        console.error('Error creating character brief', error);
        throw error;
    }
}

export const doRoleplay = async (characterName, userCharacterName, characterBrief, sceneDescription, recentChapterContext, characterQuotes, messages) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/do_roleplay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                character_name: characterName,
                user_character_name: userCharacterName,
                character_brief: characterBrief,
                scene_description: sceneDescription,
                recent_chapter_context: recentChapterContext,
                character_quotes: characterQuotes,
                messages: messages
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();
        return data['roleplay_message'];
    } catch (error) {
        console.error('Error creating character brief', error);
        throw error;
    }
}