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
          min-h-[200px] sm:min-h-[280px] p-6 sm:p-8 rounded-xl
          transition-all duration-300 cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${isDragging 
            ? 'border-2 border-solid border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 scale-[1.02] shadow-lg' 
            : 'border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-green-400 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:shadow-md'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Icon con animación */}
        <div className={`mb-4 sm:mb-5 transition-all duration-300 ${isDragging ? 'text-green-600 scale-110' : 'text-gray-400'}`}>
          {isDragging ? (
            <div className="relative">
              <FileText className="w-14 h-14 sm:w-20 sm:h-20 animate-bounce" />
              <div className="absolute inset-0 bg-green-500 opacity-20 blur-xl rounded-full"></div>
            </div>
          ) : (
            <div className="relative">
              <Upload className="w-14 h-14 sm:w-20 sm:h-20" />
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Text content */}
        <div className="text-center">
          <p className={`text-base sm:text-lg font-bold mb-2 transition-colors duration-300 ${isDragging ? 'text-green-700' : 'text-gray-800'}`}>
            {isDragging ? '¡Suelta el archivo aquí!' : 'Arrastra tu archivo Excel'}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            o haz clic para seleccionar desde tu equipo
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700">.xlsx, .xls • Máx. 10 MB</span>
          </div>
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
