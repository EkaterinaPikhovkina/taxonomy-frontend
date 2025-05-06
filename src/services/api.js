import axios from 'axios';
import { saveAs } from 'file-saver';

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
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}import_taxonomy`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Помилка при імпорті таксономії з файлу (axios):", error);
        throw error;
    }
};

export const createTaxonomyFromCorpusLLM = async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
        // FastAPI expects multiple files under the same key 'files'
        formData.append('files', file, file.name);
    });

    try {
        const response = await axios.post(`${API_BASE_URL}create_taxonomy_from_corpus_llm`, formData, {
            headers: {
                // Content-Type is set automatically by browser/axios for FormData
            },
            // Potentially long operation, consider timeout
            // timeout: 180000, // e.g., 3 minutes
        });
        return response.data; // Expected: { message: "Таксономія успішно створена..." }
    } catch (error) {
        console.error("Помилка при створенні таксономії з корпусу (axios):", error.response ? error.response.data : error.message);
        const errorMessage = error.response?.data?.detail || error.message || 'Невідома помилка сервера.';
        throw new Error(errorMessage);
    }
};

export const exportTaxonomy = async (format) => {
    try {
        const response = await axios.get(`${API_BASE_URL}export_taxonomy?format=${format}`, {
            responseType: 'blob',
        });

        const blob = response.data;
        const filename = format === 'ttl' ? 'taxonomy.ttl' : 'taxonomy.rdf';
        saveAs(blob, filename);

    } catch (error) {
        console.error("Помилка при експорті таксономії (axios):", error);
        throw error;
    }
};

export const addTopConcept = async (conceptName, definition) => {
    try {
        const response = await axios.post(`${API_BASE_URL}add_topconcept`, {
            concept_name: conceptName,
            definition: definition
        });
        return response.data;
    } catch (error) {
        console.error("Помилка при додаванні топ концепту (axios):", error);
        throw error;
    }
};

export const addSubConcept = async (conceptName, parentConceptUri) => {
    try {
        const response = await axios.post(`${API_BASE_URL}add_subconcept`, {
            concept_name: conceptName,
            parent_concept_uri: parentConceptUri
        });
        return response.data;
    } catch (error) {
        console.error("Помилка при додаванні концепту (axios):", error);
        throw error;
    }
};

export const deleteConcept = async (conceptUri) => {
    try {
        const response = await axios.post(`${API_BASE_URL}delete_concept`, {
            concept_uri: conceptUri
        });
        return response.data;
    } catch (error) {
        console.error("Помилка при видаленні концепту (axios):", error);
        throw error;
    }
};

export const updateConceptName = async (conceptUri, newConceptName) => {
    try {
        const response = await axios.post(`${API_BASE_URL}edit_concept_name`, {
            concept_uri: conceptUri,
            new_concept_name: newConceptName
        });
        return response.data;
    } catch (error) {
        console.error("Помилка при оновленні назви концепту (axios):", error);
        throw error;
    }
};