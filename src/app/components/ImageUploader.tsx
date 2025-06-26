'use client';

import { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import Image from 'next/image';

interface ImageUploaderProps {
  maxFiles: number;
  acceptedTypes: string[];
  maxSize: number;
  onFilesChange: (files: File[]) => void;
}

export default function ImageUploader({ 
  maxFiles, 
  acceptedTypes, 
  maxSize, 
  onFilesChange 
}: ImageUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    setError(null);
    
    // Handle rejected files
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        setError(`El archivo es demasiado grande (máximo ${maxSize}MB)`);
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        setError('Tipo de archivo no soportado');
      }
      return;
    }

    // Check if adding these files would exceed maxFiles
    const totalFiles = files.length + acceptedFiles.length;
    if (totalFiles > maxFiles) {
      setError(`Solo puedes subir hasta ${maxFiles} imágenes`);
      return;
    }

    const updatedFiles = [...files, ...acceptedFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  }, [files, maxFiles, maxSize, onFilesChange]);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  // Convierte el array de tipos aceptados en un objeto Accept
  const acceptObj = acceptedTypes.reduce((acc, type) => {
    acc[type] = [];
    return acc;
  }, {} as Record<string, string[]>);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptObj,
    maxSize: maxSize * 1024 * 1024,
    multiple: maxFiles > 1
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer 
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          {isDragActive ? (
            'Suelta tus imágenes aquí'
          ) : (
            'Arrastra y suelta imágenes aquí, o haz clic para seleccionar'
          )}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Formatos aceptados: {acceptedTypes.map(t => t.split('/')[1]).join(', ')} (max {maxSize}MB cada una)
        </p>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Imágenes seleccionadas:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <Image
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                <p className="text-xs truncate">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}