import Papa from 'papaparse';

/**
 * Interface para dados parseados de arquivo
 */
export interface FileData {
  filename: string;
  data: Array<Record<string, any>>;
  columns: string[];
  rowCount: number;
}

/**
 * Configurações de validação
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_ROWS = 10000; // Limite de linhas para evitar sobrecarga
const ALLOWED_CSV_TYPES = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
const ALLOWED_EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
];

/**
 * Classe para processar arquivos de dados
 */
export class FileParser {
  /**
   * Valida o arquivo antes de processar
   */
  static validateFile(file: File): { valid: boolean; error?: string } {
    // Verificar tamanho
    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // Verificar tipo
    const extension = file.name.split('.').pop()?.toLowerCase();
    const isCSV = ALLOWED_CSV_TYPES.includes(file.type) || extension === 'csv';
    const isExcel = ALLOWED_EXCEL_TYPES.includes(file.type) || ['xlsx', 'xls'].includes(extension || '');

    if (!isCSV && !isExcel) {
      return {
        valid: false,
        error: 'Tipo de arquivo não suportado. Use CSV ou Excel (.xlsx, .xls)',
      };
    }

    return { valid: true };
  }

  /**
   * Parse de arquivo CSV usando PapaParse
   */
  static async parseCSV(file: File): Promise<FileData> {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            if (results.errors.length > 0) {
              const criticalErrors = results.errors.filter(e => e.type === 'Quotes' || e.type === 'FieldMismatch');
              if (criticalErrors.length > 0) {
                reject(new Error(`Erro ao processar CSV: ${criticalErrors[0].message}`));
                return;
              }
            }

            const data = results.data as Array<Record<string, any>>;
            
            // Validar número de linhas
            if (data.length > MAX_ROWS) {
              reject(new Error(`Arquivo muito grande. Máximo: ${MAX_ROWS} linhas`));
              return;
            }

            // Extrair colunas
            const columns = results.meta.fields || [];

            resolve({
              filename: file.name,
              data,
              columns,
              rowCount: data.length,
            });
          } catch (error) {
            reject(new Error('Erro ao processar arquivo CSV'));
          }
        },
        error: (error) => {
          reject(new Error(`Erro ao ler arquivo: ${error.message}`));
        },
      });
    });
  }

  /**
   * Parse de arquivo Excel usando dynamic import
   * Isso evita carregar a biblioteca xlsx até que seja necessária
   */
  static async parseExcel(file: File): Promise<FileData> {
    try {
      // Import dinâmico para não carregar se não usar
      const XLSX = await import('xlsx');

      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            if (!data) {
              reject(new Error('Erro ao ler arquivo'));
              return;
            }

            // Parse do arquivo Excel
            const workbook = XLSX.read(data, { 
              type: 'array',
              cellDates: true,
              cellNF: false,
              cellText: false,
            });

            // Pegar primeira planilha
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Converter para JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              defval: null,
              blankrows: false,
            }) as any[][];

            if (jsonData.length === 0) {
              reject(new Error('Arquivo vazio'));
              return;
            }

            // Validar número de linhas
            if (jsonData.length > MAX_ROWS) {
              reject(new Error(`Arquivo muito grande. Máximo: ${MAX_ROWS} linhas`));
              return;
            }

            // Primeira linha = headers
            const headers = jsonData[0].map(h => String(h || '').trim()).filter(Boolean);
            
            if (headers.length === 0) {
              reject(new Error('Nenhuma coluna encontrada'));
              return;
            }

            // Converter linhas em objetos
            const parsedData: Array<Record<string, any>> = [];
            for (let i = 1; i < jsonData.length; i++) {
              const row = jsonData[i];
              const rowObject: Record<string, any> = {};
              
              headers.forEach((header, index) => {
                rowObject[header] = row[index] ?? null;
              });

              parsedData.push(rowObject);
            }

            resolve({
              filename: file.name,
              data: parsedData,
              columns: headers,
              rowCount: parsedData.length,
            });
          } catch (error) {
            reject(new Error('Erro ao processar arquivo Excel'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Erro ao ler arquivo'));
        };

        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      throw new Error('Erro ao carregar biblioteca de Excel');
    }
  }

  /**
   * Processa arquivo automaticamente (detecta tipo)
   */
  static async parseFile(file: File): Promise<FileData> {
    // Validar arquivo
    const validation = this.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Detectar tipo e processar
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv' || ALLOWED_CSV_TYPES.includes(file.type)) {
      return this.parseCSV(file);
    } else {
      return this.parseExcel(file);
    }
  }

  /**
   * Converte dados para string para enviar à LLM (amostra limitada)
   */
  static dataToString(fileData: FileData, maxRows: number = 10): string {
    const sample = fileData.data.slice(0, maxRows);
    
    let result = `Arquivo: ${fileData.filename}\n`;
    result += `Total de linhas: ${fileData.rowCount}\n`;
    result += `Colunas: ${fileData.columns.join(', ')}\n\n`;
    result += `Primeiras ${Math.min(maxRows, fileData.rowCount)} linhas:\n`;
    result += JSON.stringify(sample, null, 2);

    if (fileData.rowCount > maxRows) {
      result += `\n\n... e mais ${fileData.rowCount - maxRows} linhas`;
    }

    return result;
  }

  /**
   * Detecta possíveis colunas numéricas para gráficos
   */
  static detectNumericColumns(fileData: FileData): string[] {
    if (fileData.data.length === 0) return [];

    const numericCols: string[] = [];

    fileData.columns.forEach((col) => {
      // Verificar se maioria dos valores são numéricos
      let numericCount = 0;
      const sampleSize = Math.min(100, fileData.data.length);

      for (let i = 0; i < sampleSize; i++) {
        const value = fileData.data[i][col];
        if (typeof value === 'number' || !isNaN(Number(value))) {
          numericCount++;
        }
      }

      // Se > 80% são numéricos, considera como coluna numérica
      if (numericCount / sampleSize > 0.8) {
        numericCols.push(col);
      }
    });

    return numericCols;
  }

  /**
   * Gera sugestão de gráfico baseado nos dados
   */
  static suggestChart(fileData: FileData): string {
    const numericCols = this.detectNumericColumns(fileData);
    const hasCategories = fileData.columns.some(col => !numericCols.includes(col));

    if (numericCols.length === 0) {
      return `Crie um resumo dos dados do arquivo ${fileData.filename}`;
    }

    if (numericCols.length === 1 && hasCategories) {
      return `Crie um gráfico de barras mostrando ${numericCols[0]} por categoria do arquivo ${fileData.filename}`;
    }

    if (numericCols.length >= 2) {
      return `Crie um gráfico de linha mostrando a evolução de ${numericCols[0]} e ${numericCols[1]} do arquivo ${fileData.filename}`;
    }

    return `Crie gráficos com os dados do arquivo ${fileData.filename}`;
  }
}

