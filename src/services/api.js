import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';

export const fetchTaxonomyTree = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}taxonomy-tree`).then();

        return response.data;
    } catch (error) {
        console.error("Ошибка при запросе к API таксономии:", error);
        throw error;
    }
};

export const clearRepository = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}clear_repository`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при очистке репозитория через API:", error);
        throw error;
    }
}

export const importTaxonomyFromFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file); // 'file' - назва поля, яке очікує backend

    try {
        const response = await axios.post(`${API_BASE_URL}import_taxonomy`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Важливо для передачі файлів
            },
        });
        return response.data; // Можна повертати успішне повідомлення або дані
    } catch (error) {
        console.error("Помилка при імпорті таксономії з файлу (axios):", error);
        throw error;
    }
};
