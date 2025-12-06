import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { FileHistoryList } from "./file-history-list.tsx";
import type { FileHistoryItem } from "@/types/ui";

interface HistoryCardProps {
    history: FileHistoryItem[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export const HistoryCard = ({ history, searchQuery, onSearchChange }: HistoryCardProps) => {
    const filteredHistory = history.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card className="border-t-2 border-t-emerald-500 border-gray-200 shadow-md transition-all duration-300 hover:shadow-lg bg-white">
            <CardHeader className="pb-4 p-4 lg:p-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-md bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-800">
                        Historial
                    </CardTitle>
                </div>
                <CardDescription className="text-xs sm:text-sm text-gray-600">
                    Archivos importados recientemente
                </CardDescription>
                <div className="mt-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-10 h-10 text-sm border-green-200 focus:ring-green-500 focus:border-transparent"
                        />
                        {searchQuery && (
                            <Button
                                type="button"
                                onClick={() => onSearchChange('')}
                                variant="outline"
                                size="icon"
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 border-0 shadow-none"
                                aria-label="Limpiar búsqueda"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-4 lg:p-6 pt-0">
                <FileHistoryList items={filteredHistory} maxItems={10} />
            </CardContent>
        </Card>
    );
};
