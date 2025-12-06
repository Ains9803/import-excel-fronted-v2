import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { validateFile } from '@/utils/fileValidation';
import { ErrorDialog } from '@/components/ui/error-dialog';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  accept: string;
  maxSize: number;
  disabled?: boolean;
}

export interface DropZoneRef {
  reset: () => void;
}

export const DropZone = forwardRef<DropZoneRef, DropZoneProps>(({ onFileSelect, accept, disabled = false }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }));

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
      
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }

      onFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      const validationError = validateFile(file);
      if (validationError) {
        setErrorMessage(validationError);
        return;
      }

      onFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled}
        onChange={handleFileInputChange}
      />
      
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Zona de carga de archivos Excel. Arrastra y suelta un archivo o haz clic para seleccionar. Presiona Enter o Espacio para abrir el selector de archivos."
        aria-describedby="dropzone-instructions"
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
          transition-colors duration-150 cursor-pointer
          outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
          ${isDragging 
            ? 'border-2 border-solid border-green-500 bg-green-50 shadow-lg' 
            : 'border-2 border-dashed border-gray-300 bg-white hover:border-green-400 hover:bg-gray-50 hover:shadow-md'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div className={`mb-4 sm:mb-5 transition-colors duration-150 flex justify-center ${isDragging ? 'text-green-600' : 'text-gray-400'}`}>
          {isDragging ? (
            <FileText className="w-12 h-12 sm:w-16 sm:h-16" />
          ) : (
            <div className="relative">
              <Upload className="w-12 h-12 sm:w-16 sm:h-16" />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 sm:h-6 sm:w-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="w-full text-left">
          <p className={`text-sm sm:text-base font-bold mb-2 transition-colors duration-150 ${isDragging ? 'text-green-700' : 'text-gray-800'}`}>
            {isDragging ? '¡Suelta el archivo aquí!' : 'Arrastra tu archivo Excel'}
          </p>
          <p className="text-xs text-gray-600 mb-4">
            o haz clic para seleccionar desde tu equipo
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-gray-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-gray-700">.xlsx, .xls • Máx. 10 MB</span>
          </div>
        </div>

        <div id="dropzone-instructions" className="sr-only">
          Formatos de archivo aceptados: archivos Excel con extensión .xlsx o .xls. Tamaño máximo permitido: 10 megabytes.
        </div>
      </div>

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
