import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { validateFile } from '@/utils/fileValidation';
import { ErrorDialog } from '@/components/ui/error-dialog';

// Props interface for DropZone component
interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
  maxSize: number;
  disabled?: boolean;
}

// Expose reset method
export interface DropZoneRef {
  reset: () => void;
}

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(({ onFileSelect, accept, maxSize, disabled = false }, ref) => {
  // Local state for drag interaction
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Ref for hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Expose reset method to parent
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }));

  // Drag & Drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file using validateFile utility
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }

      onFileSelect(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }

      onFileSelect(file);
    }
  };

  // Handle click to open file dialog
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Handle keyboard navigation (Enter and Space)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={handleFileInputChange}
      />
      
      {/* Drop zone area */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Zona de carga de archivos Excel. Arrastra y suelta un archivo o presiona Enter para seleccionar"
        aria-disabled={disabled}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`
          relative flex flex-col items-center justify-center
          min-h-[200px] sm:min-h-[280px] p-6 sm:p-8 rounded-lg
          transition-all duration-200 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2
          ${isDragging 
            ? 'border-2 border-solid border-blue-600 bg-blue-50' 
            : 'border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Icon */}
        <div className={`mb-3 sm:mb-4 ${isDragging ? 'text-blue-600' : 'text-slate-500'}`}>
          {isDragging ? (
            <FileText className="w-12 h-12 sm:w-16 sm:h-16" />
          ) : (
            <Upload className="w-12 h-12 sm:w-16 sm:h-16" />
          )}
        </div>

        {/* Text content */}
        <div className="text-center">
          <p className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
            {isDragging ? 'Suelta el archivo aquí' : 'Arrastra y suelta tu archivo Excel'}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
            o haz clic para seleccionar
          </p>
          <p className="text-xs text-slate-600">
            Formatos aceptados: .xlsx, .xls (máximo 10 MB)
          </p>
        </div>
      </div>

      {/* Error Dialog */}
      <ErrorDialog
        open={!!errorMessage}
        onOpenChange={(open) => !open && setErrorMessage('')}
        title="Archivo no válido"
        message={errorMessage}
      />
    </div>
  );
});

DropZone.displayName = 'DropZone';
