import { IPADDRESS } from "../../consts/consts";

const API_BASE_URL = 'http://' + IPADDRESS + ':5000';

const doRecap = async (recapContext) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/get_recap`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recap_context: recapContext
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error calling doing lookup', error);
        throw error;
    }
}

export default doRecap