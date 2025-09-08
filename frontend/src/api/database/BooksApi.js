import { IPADDRESS } from "../../consts/consts";

const API_BASE_URL = 'http://' + IPADDRESS + ':5000';

export const addBook = async (title, author, userId, file, coverFile) => {
    try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("author", author);
        formData.append("user_id", userId);
        formData.append("file_bytes", file);
        if (coverFile) formData.append("cover_bytes", coverFile, "cover.jpg");

        const response = await fetch(`${API_BASE_URL}/api/add_book`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error adding book', error);
        throw error;
    }
};

export const getBooks = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/books?user_id=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const books = await response.json();
        return books;
    } catch (error) {
        console.error('Error getting books', error);
        throw error;
    }
}

export const updateBookStatus = async (bookId, status) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/update_status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: status
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }
    } catch (error) {
        console.error('Error updating status', error);
        throw error;
    }
}

export const updateBookCurrCfi = async (bookId, currCfi) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/books/${bookId}/update_curr_cfi`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                curr_cfi: currCfi
            })
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }
    } catch (error) {
        console.error('Error updating curr cfi', error);
        throw error;
    }
}

export const getStatus = async (bookId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/book_status?book_id=${bookId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`${response.status}`)
        }

        const status = await response.json();
        return status;
    } catch (error) {
        console.error('Error getting book status', error);
        throw error;
    }
}