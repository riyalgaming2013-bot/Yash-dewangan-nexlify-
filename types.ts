export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface GenerationResult {
  imageUrl: string | null;
  error?: string;
}

export enum ToolType {
  BRUSH = 'BRUSH',
  LASSO = 'LASSO' // Placeholder for future expansion, currently visual only
}
