// src/core/storage/storage.interface.ts

export interface UploadResult {
  url: string; // URL pública del archivo subido
  publicId?: string; // ID público (útil para Cloudinary y otros para eliminación/modificación)
  providerResponse: any; // Respuesta original del proveedor, para debugging o información adicional
}

export interface DeleteResult {
  success: boolean;
  message?: string;
  providerResponse?: any;
}

export interface IStorageService {
  uploadFile(
    fileBuffer: Buffer,
    fileName: string, // Podría incluir una ruta/prefijo si el proveedor lo soporta
    mimeType: string,
  ): Promise<UploadResult>;

  deleteFile(publicIdOrUrl: string): Promise<DeleteResult>; // Usar publicId si está disponible, sino la URL

  // Opcional: Podríamos añadir más métodos si son necesarios, como:
  // getFileUrl(publicIdOrKey: string): Promise<string>;
  // updateFileMetadata(publicIdOrKey: string, metadata: any): Promise<any>;
}

// También podríamos definir un Injection Token para facilitar la inyección de dependencias
export const STORAGE_SERVICE = 'STORAGE_SERVICE';
