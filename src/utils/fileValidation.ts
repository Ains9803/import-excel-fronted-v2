// File Validation Utilities

/**
 * Validates an uploaded file for Excel import
 * @param file - The file to validate
 * @returns Error message if validation fails, null if valid
 */
export const validateFile = (file: File): string | null => {
  // Validate file type (MIME type)
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ];
  
  if (!validTypes.includes(file.type)) {
    return 'Solo se permiten archivos .xlsx y .xls';
  }
  
  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return 'El archivo no debe superar los 10 MB';
  }
  
  return null;
};
