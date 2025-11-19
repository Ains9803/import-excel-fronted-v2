import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileHistoryItem } from '@/types/ui';
import { formatFileSize, formatDate } from '@/utils/formatters';
import { FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Props interface for FileHistoryList component
interface FileHistoryListProps {
  items: FileHistoryItem[];
  maxItems?: number;
}

export const FileHistoryList = ({ items, maxItems = 10 }: FileHistoryListProps) => {
  // Sort items by date descending (most recent first) and limit to maxItems
  const sortedItems = [...items]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, maxItems);

  // Empty state when no files
  if (sortedItems.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 text-sm">
          No hay archivos en el historial
        </p>
        <p className="text-slate-600 text-xs mt-2">
          Los archivos importados aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedItems.map((item) => (
        <FileHistoryItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};

// Individual FileHistoryItem component
interface FileHistoryItemCardProps {
  item: FileHistoryItem;
}

const FileHistoryItemCard = ({ item }: FileHistoryItemCardProps) => {
  // Get badge variant and icon based on status
  const getBadgeConfig = (status: FileHistoryItem['status']) => {
    switch (status) {
      case 'success':
        return {
          variant: 'default' as const,
          className: 'bg-green-500 hover:bg-green-600 text-white',
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Éxito'
        };
      case 'error':
        return {
          variant: 'destructive' as const,
          className: '',
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          label: 'Error'
        };
      case 'processing':
        return {
          variant: 'secondary' as const,
          className: '',
          icon: <Loader2 className="w-3 h-3 mr-1 animate-spin" />,
          label: 'Procesando'
        };
    }
  };

  const badgeConfig = getBadgeConfig(item.status);

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          {/* File icon and info */}
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 shrink-0 mt-0.5" />
            
            <div className="flex-1 min-w-0">
              {/* File name */}
              <p className="text-xs sm:text-sm font-medium text-slate-700 truncate">
                {item.name}
              </p>
              
              {/* File size and date */}
              <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs text-slate-600">
                <span>{formatFileSize(item.size)}</span>
                <span>•</span>
                <span>{formatDate(item.date)}</span>
              </div>

              {/* Statistics if available */}
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

          {/* Status badge */}
          <Badge 
            variant={badgeConfig.variant}
            className={`flex items-center shrink-0 ${badgeConfig.className}`}
          >
            {badgeConfig.icon}
            {badgeConfig.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
