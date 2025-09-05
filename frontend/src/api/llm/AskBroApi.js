import { IPADDRESS } from "../../consts/consts";

const API_BASE_URL = 'http://' + IPADDRESS + ':5000';

const doAskBro = async (question, askBroContext) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/do_ask_bro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question,
                ask_bro_context: askBroContext
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const data = await response.json();
        return data['ask_bro_text']
    } catch (error) {
        console.error('Error doing ask bro', error);
        throw error;
    }
}

export default doAskBro;