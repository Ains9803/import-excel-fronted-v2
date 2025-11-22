import {useState, useRef, useEffect} from "react";
import type {ImportError, ImportResult} from "../../types/api.ts";
import {importExcel} from "../../services/api.ts"
import type {UploadState, FileHistoryItem} from "../../types/ui.ts";
import {DropZone, type DropZoneRef} from "./DropZone.tsx";
import {FileHistoryList} from "./FileHistoryList.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Progress} from "@/components/ui/progress";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {CheckCircle, AlertCircle, Search, X, FileSpreadsheet} from "lucide-react";
import {ErrorDialog} from "@/components/ui/error-dialog";

export default function ImportExcel() {
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
                // Convert date strings back to Date objects
                return parsed.map((item: any) => ({
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
    const dropZoneRef = useRef<DropZoneRef>(null);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('file-history', JSON.stringify(history));
    }, [history]);

    const onFileSelect = (selected: File) => {
        console.log('Archivo seleccionado:', selected.name);
        setFile(selected);
        setErrors([]);
        setResult(null);
        setUploadState('idle');
    }

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

    const isButtonDisabled = !file || loading;

    // Filtrar historial por nombre
    const filteredHistory = history.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            {/* Screen reader announcements */}
            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
                {uploadState === 'uploading' && `Subiendo archivo: ${progress}% completado`}
                {uploadState === 'success' && result && `Archivo importado exitosamente. ${result.importedRows} de ${result.totalRows} filas importadas correctamente.`}
                {uploadState === 'error' && 'Error al importar archivo. Por favor, verifica el formato e intenta nuevamente.'}
            </div>

            {/* Page Header con diseño moderno */}
            <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                        Importar Datos
                    </h2>
                </div>
                <p className="text-sm sm:text-base text-gray-600 ml-15">
                    Carga tus archivos Excel y gestiona tus datos de forma eficiente
                </p>
            </div>

                {/* Upload and History Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
                    {/* Upload Card - Left */}
                    <Card className="border-green-100 shadow-lg transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"></div>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                                    <FileSpreadsheet className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                    Subir archivo
                                </CardTitle>
                            </div>
                            <CardDescription className="text-sm text-gray-600">
                                Arrastra tu archivo Excel o haz clic para seleccionar
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* DropZone Component */}
                            <DropZone
                                ref={dropZoneRef}
                                onFileSelect={onFileSelect}
                                accept=".xlsx,.xls"
                                maxSize={10 * 1024 * 1024}
                                disabled={loading}
                            />

                            {file && (
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <p className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                                                    Archivo listo
                                                </p>
                                            </div>
                                            <p className="text-sm text-gray-800 font-medium truncate">
                                                {file.name}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                dropZoneRef.current?.reset();
                                            }}
                                            disabled={loading}
                                            className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                disabled={isButtonDisabled}
                                className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                                    isButtonDisabled
                                        ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                        : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
                                }`}
                                title={isButtonDisabled ? 'Selecciona un archivo para importar' : 'Haz clic para importar el archivo'}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Subiendo... {progress}%
                                    </span>
                                ) : (
                                    'Importar Excel'
                                )}
                            </button>

                            {/* Progress Bar */}
                            {loading && (
                                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 space-y-3 shadow-inner">
                                    <div className="flex justify-between text-sm font-medium text-gray-700">
                                        <span className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Procesando archivo...
                                        </span>
                                        <span className="text-green-700 font-bold">{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-3" />
                                </div>
                            )}

                            {/* Success Alert */}
                            {uploadState === 'success' && result && (
                                <Alert className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0">
                                            <CheckCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <AlertTitle className="text-green-800 font-bold text-base mb-3">
                                                ¡Importación completada exitosamente!
                                            </AlertTitle>
                                            <AlertDescription className="text-green-700">
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                                                        <p className="text-xs text-gray-600 mb-1">Total procesadas</p>
                                                        <p className="text-2xl font-bold text-green-700">{result.totalRows}</p>
                                                    </div>
                                                    <div className="bg-white/60 rounded-lg p-3 border border-green-200">
                                                        <p className="text-xs text-gray-600 mb-1">Importadas</p>
                                                        <p className="text-2xl font-bold text-green-700">{result.importedRows}</p>
                                                    </div>
                                                    {errors.length > 0 && (
                                                        <div className="bg-white/60 rounded-lg p-3 border border-amber-200">
                                                            <p className="text-xs text-gray-600 mb-1">Con errores</p>
                                                            <p className="text-2xl font-bold text-amber-600">{errors.length}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </AlertDescription>
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            {/* Error Alert */}
                            {uploadState === 'error' && (
                                <Alert className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-orange-50 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md" variant="destructive">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shrink-0">
                                            <AlertCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <AlertTitle className="font-bold text-base mb-2">
                                                Error en la importación
                                            </AlertTitle>
                                            <AlertDescription className="mt-2">
                                                Hubo un problema al procesar el archivo. Por favor, verifica el formato e intenta nuevamente.
                                            </AlertDescription>
                                        </div>
                                    </div>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>

                    {/* File History Card - Right */}
                    <Card className="border-green-100 shadow-lg transition-all duration-300 hover:shadow-xl bg-white/80 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"></div>
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <CardTitle className="text-lg sm:text-xl font-bold text-gray-800">
                                    Historial
                                </CardTitle>
                            </div>
                            <CardDescription className="text-sm text-gray-600">
                                Archivos importados recientemente
                            </CardDescription>
                            {/* Search Filter */}
                            <div className="mt-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar por nombre..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-10 h-10 text-sm border-green-200 focus:ring-green-500 focus:border-transparent"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Limpiar búsqueda"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <FileHistoryList items={filteredHistory} maxItems={10} />
                        </CardContent>
                    </Card>
                </div>

                {/* Error Table - Full Width Below */}
                {errors.length > 0 && (
                    <Card className="border-red-100 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                                    <AlertCircle className="h-4 w-4 text-white" />
                                </div>
                                <CardTitle className="text-base sm:text-lg font-bold text-red-600">
                                    Errores de importación
                                </CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto -mx-4 sm:mx-0 sm:rounded-lg border-y sm:border border-green-200">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-green-50">
                                            <TableHead className="font-semibold text-green-700">Fila</TableHead>
                                            <TableHead className="font-semibold text-green-700">Error</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {errors.map((e, i) => (
                                            <TableRow key={i} className="hover:bg-green-50 transition-colors duration-200">
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
                        </CardContent>
                    </Card>
                )}

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