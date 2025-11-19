import {useState, useRef} from "react";
import type {ImportError, ImportResult} from "../../types/api.ts";
import {importExcel} from "../../services/api.ts"
import type {UploadState, FileHistoryItem} from "../../types/ui.ts";
import {DropZone, type DropZoneRef} from "./DropZone.tsx";
import {FileHistoryList} from "./FileHistoryList.tsx";
import {TemplateDownloadCard} from "./TemplateDownloadCard.tsx";
import {ConfigurationPanel} from "./ConfigurationPanel.tsx";
import {HelpCard} from "./HelpCard.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle, AlertCircle} from "lucide-react";
import {ErrorDialog} from "@/components/ui/error-dialog";
import * as React from "react";

export default function ImportExcel() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [errors, setErrors] = useState<ImportError[]>([]);
    const [uploadState, setUploadState] = useState<UploadState>('idle');
    const [history, setHistory] = useState<FileHistoryItem[]>([]);
    const [errorDialogMessage, setErrorDialogMessage] = useState<string>('');
    const dropZoneRef = useRef<DropZoneRef>(null);

    const onFileSelect = (selected: File) => {
        setFile(selected);
        setErrors([]);
        setResult(null);
        setUploadState('idle');
    }

    const onFileUpload = async () => {
        if (!file) return;
        setLoading(true);
        setProgress(0);
        setUploadState('uploading');
        try {
            const resp = await importExcel(file, setProgress);
            setResult(resp);
            setErrors(resp.errors ?? []);
            setUploadState('success');
            
            // Add to history
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
        } catch (err: any) {
            console.error(err.message);
            setErrorDialogMessage(err.response?.data?.message ?? 'Error al subir el archivo. Por favor, verifica el formato e intenta nuevamente.');
            setUploadState('error');
            
            // Add error to history
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
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl">
            {/* Screen reader announcements */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {uploadState === 'uploading' && `Subiendo archivo: ${progress}% completado`}
                {uploadState === 'success' && result && `Archivo importado exitosamente. ${result.importedRows} de ${result.totalRows} filas importadas correctamente.`}
                {uploadState === 'error' && 'Error al importar archivo. Por favor, verifica el formato e intenta nuevamente.'}
            </div>

            {/* Page Header */}
            <div className="mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Importar Excel</h1>
                <p className="text-sm sm:text-base text-slate-700 mt-2">
                    Carga archivos Excel para importar datos al sistema
                </p>
            </div>

            {/* Grid Layout: Main Content (2/3) + Sidebar (1/3) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Main Content - 2/3 */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    {/* Upload Card */}
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow transition-shadow duration-200 hover:shadow-md">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4">Subir archivo</h2>
                        
                        {/* DropZone Component */}
                        <DropZone
                            ref={dropZoneRef}
                            onFileSelect={onFileSelect}
                            accept=".xlsx,.xls"
                            maxSize={10 * 1024 * 1024}
                            disabled={loading}
                        />

                        {file && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-200">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-700">
                                            Archivo seleccionado: <strong>{file.name}</strong>
                                        </p>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Tamaño: {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFile(null);
                                            dropZoneRef.current?.reset();
                                        }}
                                        disabled={loading}
                                        className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Remover archivo"
                                        aria-label="Remover archivo seleccionado"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={onFileUpload}
                            disabled={!file || loading}
                            className={`w-full mt-4 py-2 px-4 rounded text-white transition-all duration-200 ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md cursor-pointer'
                            }`}
                        >
                            {loading ? `Subiendo... ${progress}%` : 'Importar Excel'}
                        </button>

                        {/* Progress Bar */}
                        {loading && (
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                                <div className="flex justify-between text-sm text-slate-700">
                                    <span>Subiendo archivo...</span>
                                    <span>{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}

                        {/* Success Alert */}
                        {uploadState === 'success' && result && (
                            <Alert className="mt-6 border-green-500 bg-green-50 animate-in fade-in slide-in-from-top-2 duration-300">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <AlertTitle className="text-green-800 font-semibold">
                                    Importación completada exitosamente
                                </AlertTitle>
                                <AlertDescription className="text-green-700 mt-3">
                                    <div className="space-y-2">
                                        <p>Total de filas procesadas: <strong>{result.totalRows}</strong></p>
                                        <p>Filas importadas correctamente: <strong>{result.importedRows}</strong></p>
                                        {errors.length > 0 && (
                                            <p className="text-amber-700">
                                                Filas con errores: <strong>{errors.length}</strong>
                                            </p>
                                        )}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Alert */}
                        {uploadState === 'error' && (
                            <Alert className="mt-6 border-red-500 bg-red-50 animate-in fade-in slide-in-from-top-2 duration-300" variant="destructive">
                                <AlertCircle className="h-5 w-5" />
                                <AlertTitle className="font-semibold">
                                    Error en la importación
                                </AlertTitle>
                                <AlertDescription className="mt-3">
                                    Hubo un problema al procesar el archivo. Por favor, verifica el formato e intenta nuevamente.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Error Table */}
                        {errors.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-4">
                                    Errores de importación
                                </h3>
                                <div className="overflow-x-auto -mx-4 sm:mx-0 sm:rounded-lg border-y sm:border border-slate-200">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50">
                                                <TableHead className="font-semibold text-slate-700">Fila</TableHead>
                                                <TableHead className="font-semibold text-slate-700">Error</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {errors.map((e, i) => (
                                                <TableRow key={i} className="hover:bg-red-50 transition-colors duration-200">
                                                    <TableCell className="text-red-700 font-medium">
                                                        {e.line}
                                                    </TableCell>
                                                    <TableCell className="text-red-600">
                                                        {e.error}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* File History Card */}
                    <Card className="border-slate-200 shadow-sm transition-shadow duration-200 hover:shadow-md">
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-slate-700">
                                Historial de archivos
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-600">
                                Archivos importados recientemente
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FileHistoryList items={history} maxItems={10} />
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - 1/3 */}
                <div className="space-y-4 sm:space-y-6">
                    {/* Template Download Card */}
                    <TemplateDownloadCard />

                    {/* Configuration Panel */}
                    <ConfigurationPanel onConfigChange={(config) => {
                        console.log('Configuration updated:', config);
                    }} />

                    {/* Help Card */}
                    <HelpCard />
                </div>
            </div>

            {/* Error Dialog */}
            <ErrorDialog
                open={!!errorDialogMessage}
                onOpenChange={(open) => !open && setErrorDialogMessage('')}
                title="Error al importar"
                message={errorDialogMessage}
            />
        </div>
    );
}