import axios from "axios";
import type {ImportResult} from "../types/api.ts";
import {API_URL, IMPORT_PEOPLE_ENDPOINT} from "../utils/constants.ts";

export async function importExcel(
    file: File,
    onProgress?: (percent: number) => void,
): Promise<ImportResult> {
    const data = new FormData();
    data.append("file", file);
    const response = await axios.post<ImportResult>(`${API_URL}${IMPORT_PEOPLE_ENDPOINT}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        onUploadProgress: (event) =>
            onProgress?.(Math.round((event.loaded * 100) / (event.total ?? 1))),
    })
    console.log(response)
    return response.data;
}