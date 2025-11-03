'use client';

import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { FileParser, FileData } from '@/lib/file-parser';

interface FileUploadProps {
  onFileLoaded: (fileData: FileData) => void;
  onClear: () => void;
  currentFile?: FileData | null;
  compact?: boolean; // Versão compacta para usar dentro do input
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileLoaded,
  onClear,
  currentFile,
  compact = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const fileData = await FileParser.parseFile(file);
      onFileLoaded(fileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar arquivo';
      setError(errorMessage);
      console.error('Erro ao processar arquivo:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClear = () => {
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClear();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Se já tem arquivo carregado
  if (currentFile) {
    const numericCols = FileParser.detectNumericColumns(currentFile);
    
    // Versão compacta
    if (compact) {
      return (
        <div className="p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
              <FileText className="h-4 w-4 text-green-400 flex-shrink-0" />
              <span className="text-white text-sm font-medium truncate">{currentFile.filename}</span>
              <span className="text-gray-400 text-xs flex-shrink-0">
                ({currentFile.rowCount} linhas, {currentFile.columns.length} colunas)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-400 hover:text-white h-8 w-8 p-0 flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      );
    }
    
    // Versão completa
    return (
      <Card className="border-green-500/50 bg-green-900/20 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <CardTitle className="text-white">Arquivo Carregado</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-green-400" />
            <span className="text-white font-medium">{currentFile.filename}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Linhas:</p>
              <p className="text-white font-semibold">{currentFile.rowCount}</p>
            </div>
            <div>
              <p className="text-gray-500">Colunas:</p>
              <p className="text-white font-semibold">{currentFile.columns.length}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-2">Colunas disponíveis:</p>
            <div className="flex flex-wrap gap-2">
              {currentFile.columns.map((col) => (
                <span
                  key={col}
                  className={`px-2 py-1 rounded text-xs ${
                    numericCols.includes(col)
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-gray-700/50 text-gray-300 border border-gray-600/30'
                  }`}
                >
                  {col}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClick}
              className="w-full border-slate-600 hover:bg-slate-800"
            >
              Carregar outro arquivo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Versão compacta para upload
  if (compact) {
    return (
      <div className="space-y-2">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-3 text-center cursor-pointer
            transition-all duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/30'
            }
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleInputChange}
            className="hidden"
            disabled={isLoading}
          />

          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span className="text-white text-sm">Processando...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">
                Arraste um arquivo CSV/Excel ou clique para selecionar
              </span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-2 bg-red-900/20 border border-red-500/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-xs">{error}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Estado de upload - versão completa
  return (
    <Card className="border-slate-700 bg-slate-900/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Carregar Arquivo de Dados
        </CardTitle>
        <CardDescription>
          Envie um arquivo CSV ou Excel para criar gráficos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
            }
            ${isLoading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleInputChange}
            className="hidden"
            disabled={isLoading}
          />

          {isLoading ? (
            <div className="space-y-3">
              <div className="animate-spin mx-auto h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-white font-medium">Processando arquivo...</p>
              <p className="text-gray-400 text-sm">Isso pode levar alguns segundos</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-400" />
              </div>
              
              <div>
                <p className="text-white font-medium mb-1">
                  Clique ou arraste um arquivo
                </p>
                <p className="text-gray-400 text-sm">
                  CSV, XLSX ou XLS (máx. 10MB)
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4 border-slate-600 hover:bg-slate-800"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Selecionar Arquivo
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 font-semibold text-sm">Erro ao carregar arquivo</p>
                <p className="text-red-200/90 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500 space-y-1">
          <p>• Formatos suportados: CSV, Excel (.xlsx, .xls)</p>
          <p>• Tamanho máximo: 10MB</p>
          <p>• Máximo de 10.000 linhas</p>
          <p>• Primeira linha deve conter os cabeçalhos das colunas</p>
        </div>
      </CardContent>
    </Card>
  );
};

