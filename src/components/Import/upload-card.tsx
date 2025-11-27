import { forwardRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, X, FileSpreadsheet, Loader2 } from "lucide-react";
import { DropZone, type DropZoneRef } from "./drop-zone";
import type { ImportResult, ImportError } from "@/types/api";
import type { UploadState } from "@/types/ui";

interface UploadCardProps {
    file: File | null;
    loading: boolean;
    progress: number;
    result: ImportResult | null;
    errors: ImportError[];
    uploadState: UploadState;
    onFileSelect: (file: File) => void;
    onFileRemove: () => void;
    onFileUpload: () => void;
}

export const UploadCard = forwardRef<DropZoneRef, UploadCardProps>(({
    file,
    loading,
    progress,
    result,
    errors,
    uploadState,
    onFileSelect,
    onFileRemove,
    onFileUpload
}, ref) => {
    const isButtonDisabled = !file || loading;

    return (
        <Card className="border-t-2 border-t-green-500 border-gray-200 shadow-md transition-all duration-300 hover:shadow-lg bg-white">
            <CardHeader className="pb-4 p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-800">
                        Subir archivo
                    </CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm text-gray-600">
                    Arrastra tu archivo Excel o haz clic para seleccionar
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 lg:p-6 pt-0">
                <DropZone
                    ref={ref}
                    onFileSelect={onFileSelect}
                    accept=".xlsx,.xls"
                    maxSize={10 * 1024 * 1024}
                    disabled={loading}
                />

                {file && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200 shadow-sm">
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
                            <Button
                                type="button"
                                onClick={onFileRemove}
                                disabled={loading}
                                variant="outline"
                                size="icon"
                                className="shrink-0 text-red-600 hover:text-red-700 hover:bg-red-100 hover:border-red-300"
                                title="Remover archivo"
                                aria-label="Remover archivo seleccionado"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                )}

                <Button
                    onClick={onFileUpload}
                    disabled={isButtonDisabled}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    title={isButtonDisabled ? 'Selecciona un archivo para importar' : 'Haz clic para importar el archivo'}
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                            Subiendo... {progress}%
                        </>
                    ) : (
                        'Importar Excel'
                    )}
                </Button>

                {loading && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-200 space-y-3">
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

                {uploadState === 'success' && result && (
                    <Alert className="border border-green-200 bg-green-50 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md p-4">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-md bg-green-500 flex items-center justify-center shrink-0">
                                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <AlertTitle className="text-green-800 font-bold text-sm sm:text-base mb-3">
                                    ¡Importación completada exitosamente!
                                </AlertTitle>
                                <AlertDescription className="text-xs sm:text-sm text-green-700">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
                                            <p className="text-xs text-gray-600">Total procesadas:</p>
                                            <p className="text-base sm:text-lg font-bold text-green-700">{result.totalRows}</p>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
                                            <p className="text-xs text-gray-600">Importadas:</p>
                                            <p className="text-base sm:text-lg font-bold text-green-700">{result.importedRows}</p>
                                        </div>
                                        {errors.length > 0 && (
                                            <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-md">
                                                <p className="text-xs text-gray-600">Con errores:</p>
                                                <p className="text-base sm:text-lg font-bold text-amber-600">{errors.length}</p>
                                            </div>
                                        )}
                                    </div>
                                </AlertDescription>
                            </div>
                        </div>
                    </Alert>
                )}

                {uploadState === 'error' && (
                    <Alert className="border border-red-200 bg-red-50 animate-in fade-in slide-in-from-top-2 duration-300 shadow-md p-4" variant="destructive">
                        <div className="flex items-start gap-3">
                            <div className="h-10 w-10 rounded-md bg-red-500 flex items-center justify-center shrink-0">
                                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <AlertTitle className="font-bold text-sm sm:text-base mb-2">
                                    Error en la importación
                                </AlertTitle>
                                <AlertDescription className="text-xs sm:text-sm mt-2">
                                    Hubo un problema al procesar el archivo. Por favor, verifica el formato e intenta nuevamente.
                                </AlertDescription>
                            </div>
                        </div>
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
});

UploadCard.displayName = 'UploadCard';
