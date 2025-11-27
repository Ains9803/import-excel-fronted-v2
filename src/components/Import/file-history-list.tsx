import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FileHistoryItem } from '@/types/ui';
import { formatFileSize, formatDate } from '@/utils/formatters';
import { FileText, CheckCircle, AlertCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface FileHistoryListProps {
  items: FileHistoryItem[];
  maxItems?: number;
}

export const FileHistoryList = ({ items, maxItems = 10 }: FileHistoryListProps) => {
  const [showAll, setShowAll] = useState(false);
  const INITIAL_ITEMS = 5;
  
  const sortedItems = [...items]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, maxItems);

  const displayedItems = showAll ? sortedItems : sortedItems.slice(0, INITIAL_ITEMS);
  const hiddenCount = sortedItems.length - INITIAL_ITEMS;

  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-slate-600">
          No hay archivos en el historial
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Los archivos importados aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayedItems.map((item) => (
        <FileHistoryItemCard key={item.id} item={item} />
      ))}
      
      {sortedItems.length > INITIAL_ITEMS && (
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={() => setShowAll(!showAll)}
          aria-expanded={showAll}
          aria-label={showAll ? 'Ver menos archivos en el historial' : `Ver ${hiddenCount} archivos más en el historial`}
        >
          {showAll ? (
            <>
              <ChevronUp className="w-4 h-4 sm:w-5 sm:w-5 mr-2" />
              Ver menos
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Ver {hiddenCount} más
            </>
          )}
        </Button>
      )}
    </div>
  );
};

interface FileHistoryItemCardProps {
  item: FileHistoryItem;
}

const FileHistoryItemCard = ({ item }: FileHistoryItemCardProps) => {
  const getBadgeConfig = (status: FileHistoryItem['status']) => {
    switch (status) {
      case 'success':
        return {
          variant: 'success' as const,
          icon: <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />,
          label: 'Éxito'
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          icon: <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />,
          label: 'Error'
        };
      case 'processing':
        return {
          variant: 'secondary' as const,
          icon: <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />,
          label: 'Procesando'
        };
    }
  };

  const badgeConfig = getBadgeConfig(item.status);

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0 mt-0.5" />
            
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                {item.name}
              </p>
              
              <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs text-slate-600">
                <span>{formatFileSize(item.size)}</span>
                <span>•</span>
                <span>{formatDate(item.date)}</span>
              </div>

              {(item.totalRows !== undefined || item.importedRows !== undefined) && (
                <div className="mt-2 text-xs text-slate-600">
                  {item.totalRows !== undefined && (
                    <span>Total: {item.totalRows} filas</span>
                  )}
                  {item.importedRows !== undefined && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="text-green-600 font-medium">
                        Importadas: {item.importedRows}
                      </span>
                    </>
                  )}
                  {item.errorCount !== undefined && item.errorCount > 0 && (
                    <>
                      <span className="mx-1">•</span>
                      <span className="text-red-600 font-medium">
                        Errores: {item.errorCount}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <Badge 
            variant={badgeConfig.variant}
            className="flex items-center shrink-0"
          >
            {badgeConfig.icon}
            {badgeConfig.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
