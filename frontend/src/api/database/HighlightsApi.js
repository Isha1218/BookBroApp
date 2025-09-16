import { IPADDRESS } from "../../consts/consts_private";

const API_BASE_URL = 'http://' + IPADDRESS + ':5000';

export const addHighlight = async (bookId, userId, cfiRange, content) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/add_highlight`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                book_id: bookId,
                user_id: userId,
                cfi_range: cfiRange,
                content: content
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const added = await response.json();
        return added;
    } catch (error) {
        console.error('Error doing adding highlight', error);
        throw error;
    }
}

export const getHighlights = async (bookId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/highlights?book_id=${bookId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const highlights = await response.json();
        return highlights;
    } catch (error) {
        console.error('Error doing adding highlight', error);
        throw error;
    }
}