import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import type { ImportError } from "@/types/api";

interface ErrorTableProps {
    errors: ImportError[];
    showAllErrors: boolean;
    onToggleShowAll: (show: boolean) => void;
}

export const ErrorTable = ({ errors, showAllErrors, onToggleShowAll }: ErrorTableProps) => {
    if (errors.length === 0) return null;

    return (
        <Card className="border-t-2 border-t-red-500 border-gray-200 shadow-md bg-white">
            <CardHeader className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-red-500 flex items-center justify-center">
                            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        <CardTitle className="text-sm sm:text-base font-bold text-red-600">
                            Errores de importación ({errors.length})
                        </CardTitle>
                    </div>
                    {errors.length > 5 && (
                        <Button
                            onClick={() => onToggleShowAll(!showAllErrors)}
                            variant="outline"
                            className="text-sm font-medium text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            aria-expanded={showAllErrors}
                            aria-label={showAllErrors ? 'Ver menos errores' : `Ver todos los ${errors.length} errores`}
                        >
                            {showAllErrors ? 'Ver menos' : `Ver todos los errores (${errors.length})`}
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
                <div className="overflow-x-auto -mx-4 lg:mx-0 lg:rounded-lg border-y lg:border border-gray-200">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">Fila</TableHead>
                                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">Error</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {errors.slice(0, showAllErrors ? errors.length : 5).map((e, i) => (
                                <TableRow key={i} className="hover:bg-gray-50 transition-colors duration-150">
                                    <TableCell className="text-xs sm:text-sm text-red-700 font-medium">
                                        {e.line}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm text-red-600">
                                        {e.error}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {errors.length > 5 && !showAllErrors && (
                    <div className="mt-4 text-center">
                        <Button
                            onClick={() => onToggleShowAll(true)}
                            variant="outline"
                            className="text-sm font-medium text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                            aria-expanded={showAllErrors}
                            aria-label={`Ver todos los ${errors.length} errores`}
                        >
                            Ver todos los errores ({errors.length})
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
