import { useState, useRef, useEffect } from "react";
import type { ImportError, ImportResult } from "@/types/api";
import { importExcel } from "@/services/api";
import type { UploadState, FileHistoryItem } from "@/types/ui";
import type { DropZoneRef } from "@/components/Import/drop-zone";
import { UploadCard } from "@/components/Import/upload-card";
import { HistoryCard } from "@/components/Import/history-card";
import { ErrorTable } from "@/components/Import/error-table";
import { ErrorDialog } from "@/components/ui/error-dialog";

export default function ImportPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [errors, setErrors] = useState<ImportError[]>([]);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [history, setHistory] = useState<FileHistoryItem[]>(() => {
        const savedHistory = localStorage.getItem('file-history');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                return parsed.map((item: { date: string | number | Date }) => ({
                    ...item,
                    date: new Date(item.date)
                }));
            } catch (error) {
                console.error('Error loading file history:', error);
                return [];
            }
        }
        return [];
    });
    const [errorDialogMessage, setErrorDialogMessage] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showAllErrors, setShowAllErrors] = useState<boolean>(false);
    const [fileRemovedAnnouncement, setFileRemovedAnnouncement] = useState<boolean>(false);
    const dropZoneRef = useRef<DropZoneRef>(null);

    useEffect(() => {
        localStorage.setItem('file-history', JSON.stringify(history));
    }, [history]);

    const onFileSelect = (selected: File) => {
        console.log('Archivo seleccionado:', selected.name);
        setFile(selected);
        setErrors([]);
        setResult(null);
        setUploadState('idle');
        setShowAllErrors(false);
    };

    const onFileRemove = () => {
        setFile(null);
        setErrors([]);
        setResult(null);
        setUploadState('idle');
        setShowAllErrors(false);
        dropZoneRef.current?.reset();
        setFileRemovedAnnouncement(true);
        setTimeout(() => setFileRemovedAnnouncement(false), 100);
    };

    const onFileUpload = async () => {
        if (!file) {
            console.error('No hay archivo seleccionado');
            return;
        }
        setLoading(true);
        setProgress(0);
        setUploadState('uploading');
        try {
            const resp = await importExcel(file, setProgress);
            setResult(resp);
            setErrors(resp.errors ?? []);
            setUploadState('success');
            
            const historyItem: FileHistoryItem = {
                id: Date.now().toString(),
                name: file.name,
                size: file.size,
                date: new Date(),
                status: resp.success ? 'success' : 'error',
                totalRows: resp.totalRows,
                importedRows: resp.importedRows,
                errorCount: resp.errors?.length ?? 0
            };
            setHistory(prev => [historyItem, ...prev]);
        } catch (err: unknown) {
            const error = err as { message?: string; response?: { data?: { message?: string } } };
            console.error(error.message);
            setErrorDialogMessage(error.response?.data?.message ?? 'Error al subir el archivo. Por favor, verifica el formato e intenta nuevamente.');
            setUploadState('error');
            
            if (file) {
                const historyItem: FileHistoryItem = {
                    id: Date.now().toString(),
                    name: file.name,
                    size: file.size,
                    date: new Date(),
                    status: 'error'
                };
                setHistory(prev => [historyItem, ...prev]);
            }
        } finally {
            setLoading(false);
        }
    };

    const getScreenReaderAnnouncement = () => {
        if (fileRemovedAnnouncement) {
            return 'Archivo removido. Puedes seleccionar un nuevo archivo para importar.';
        }
        if (uploadState === 'uploading') {
            return `Subiendo archivo ${file?.name}. Progreso: ${progress} por ciento completado.`;
        }
        if (uploadState === 'success' && result) {
            const errorMessage = errors.length > 0 
                ? ` Se encontraron ${errors.length} errores durante la importación.`
                : '';
            return `Importación completada exitosamente. Se importaron ${result.importedRows} de ${result.totalRows} filas correctamente.${errorMessage}`;
        }
        if (uploadState === 'error') {
            return 'Error al importar el archivo. Por favor, verifica que el archivo sea un Excel válido en formato xlsx o xls y que no exceda 10 megabytes. Intenta nuevamente.';
        }
        if (file && uploadState === 'idle') {
            return `Archivo ${file.name} seleccionado y listo para importar. Tamaño: ${(file.size / 1024 / 1024).toFixed(2)} megabytes.`;
        }
        return '';
    };

    return (
        <div>
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {getScreenReaderAnnouncement()}
            </div>

            <div className="mb-8 sm:mb-12">
                <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Importar Datos
                    </h2>
                </div>
                <p className="text-sm text-gray-600 flex items-center gap-3 mb-3">
                    Carga tus archivos Excel y gestiona tus datos de forma eficiente
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-8 sm:mb-12">
                <UploadCard
                    ref={dropZoneRef}
                    file={file}
                    loading={loading}
                    progress={progress}
                    result={result}
                    errors={errors}
                    uploadState={uploadState}
                    onFileSelect={onFileSelect}
                    onFileRemove={onFileRemove}
                    onFileUpload={onFileUpload}
                />

                <HistoryCard
                    history={history}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </div>

            <ErrorTable
                errors={errors}
                showAllErrors={showAllErrors}
                onToggleShowAll={setShowAllErrors}
            />

            <ErrorDialog
                open={!!errorDialogMessage}
                onOpenChange={(open) => !open && setErrorDialogMessage('')}
                title="Error al importar"
                message={errorDialogMessage}
            />
        </div>
    );
}
