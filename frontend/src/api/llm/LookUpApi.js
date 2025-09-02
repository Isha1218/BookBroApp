import { IPADDRESS } from "../../consts/consts";

const API_BASE_URL = 'http://' + IPADDRESS + ':5000';

const doLookUp = async (selectedText, lookUpContext) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/do_lookup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                selected_text: selectedText,
                lookup_context: lookUpContext
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();
        const lookUpText = data['lookup_text'];
        const lookUpType = data['lookup_type'];
        return { lookUpText, lookUpType };
    } catch (error) {
        console.error('Error doing lookup', error);
        throw error;
    }
}

export default doLookUp;