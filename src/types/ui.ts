// UI Types for Import Excel Application

export type UploadState = 'idle' | 'dragging' | 'uploading' | 'success' | 'error';

export interface FileHistoryItem {
  id: string;
  name: string;
  size: number;
  date: Date;
  status: 'success' | 'error' | 'processing';
  totalRows?: number;
  importedRows?: number;
  errorCount?: number;
}

export interface ImportConfig {
  dateFormat: string;
  decimalSeparator: '.' | ',';
  columnMapping: Record<string, string>;
}

export interface HelpTip {
  icon: string;
  title: string;
  description: string;
}
