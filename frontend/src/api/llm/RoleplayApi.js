import { IPADDRESS } from "../../consts/consts";

const API_BASE_URL = 'http://' + IPADDRESS + ':5000';

const createRoleplayScenes = async (roleplayContext) => {
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
        console.error('Error generating recap', error);
        throw error;
    }
}

export default createRoleplayScenes