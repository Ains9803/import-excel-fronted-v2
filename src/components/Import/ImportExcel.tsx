import {useState} from "react";
import type {ImportError, ImportResult} from "../../types/api.ts";
import {importExcel} from "../../services/api.ts"
import * as React from "react";

export default function ImportExcel() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [errors, setErrors] = useState<ImportError[]>([]);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        const isExcel = selected.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            || selected.type === "application/vnd.ms-excel";

        if (!isExcel) {
            alert('Solamente se permiten archivos en formato .xls/.xlsx');
            return;
        }
        if (selected.size > 10 * 1024 * 1024) {
            alert('El archvo no debe pesar más de 10 MB');
            return;
        }
        setFile(selected);
        setErrors([]);
        setResult(null)
    }

    const onFileUpload = async () => {
        if (!file) return;
        setLoading(true);
        setProgress(0);
        try {
            const resp = await importExcel(file, setProgress);
            setResult(resp)
            setErrors(resp.errors ?? []);
        } catch (err: any) {
            console.error(err.message);
            alert(err.response?.data?.message ?? 'Error al subir el archivo');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
            <h1 className="text-2xl font-bold mb-4">Importar Excel</h1>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar archivo
                </label>
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={onFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
            </div>

            {file && (
                <div className="mb-4 text-sm text-gray-600">
                    Archivo: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
            )}

            <button
                onClick={onFileUpload}
                disabled={!file || loading}
                className={`w-full py-2 px-4 rounded text-white ${
                    loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {loading ? `Subiendo... ${progress}%` : 'Importar Excel'}
            </button>

            {loading && (
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{width: `${progress}%`}}
                        />
                    </div>
                </div>
            )}

            {result && (
                <div className="mt-6 p-4 border rounded bg-green-50 text-green-800">
                    <strong>Importación completada</strong>
                    <p>Total filas: {result.totalRows}</p>
                    <p>Importadas: {result.importedRows}</p>
                    {errors.length > 0 && (
                        <p className="text-yellow-700">Con errores: {errors.length}</p>
                    )}
                </div>
            )}

            {errors.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">Errores de importación</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto border-collapse border border-gray-300 text-sm">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-2 py-1">Fila</th>
                                <th className="border px-2 py-1">Error</th>
                            </tr>
                            </thead>
                            <tbody>
                            {errors.map((e, i) => (
                                <tr key={i}>
                                    <td className="border px-2 py-1 text-red-700">{e.line}</td>
                                    <td className="border px-2 py-1 text-red-700">{e.error}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}