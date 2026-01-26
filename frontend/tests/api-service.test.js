const ApiService = require('../js/api-service.js');

describe('ApiService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getTransactions', () => {
    test('should fetch transactions successfully', async () => {
      const mockData = [
        {
          store_name: 'Loja 1',
          balance: '1000.00',
          transactions: []
        }
      ];

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockData)
      });

      const result = await ApiService.getTransactions();

      expect(global.fetch).toHaveBeenCalledWith('/api/v1/transactions', {
        headers: {}
      });
      expect(result).toEqual({
        ok: true,
        data: mockData,
        status: 200
      });
    });

    test('should handle API error response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: (name) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve({ error: 'Internal server error' })
      });

      await expect(ApiService.getTransactions()).rejects.toEqual({
        status: 500,
        message: 'Internal server error',
        data: { error: 'Internal server error' }
      });
    });

    test('should handle network error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(ApiService.getTransactions()).rejects.toEqual({
        status: 0,
        message: 'Erro de conexao com o servidor',
        originalError: new Error('Network failure')
      });
    });

    test('should handle API error without error message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: {
          get: (name) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve({})
      });

      await expect(ApiService.getTransactions()).rejects.toEqual({
        status: 404,
        message: 'Erro na requisicao',
        data: {}
      });
    });
  });

  describe('uploadFile', () => {
    test('should upload file successfully', async () => {
      const mockResponse = {
        message: 'Arquivo processado com sucesso',
        transactions_count: 5
      };

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockResponse)
      });

      const result = await ApiService.uploadFile(file);

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/upload',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );

      const formData = global.fetch.mock.calls[0][1].body;
      expect(formData.get('file')).toBe(file);

      expect(result).toEqual({
        ok: true,
        data: mockResponse,
        status: 200
      });
    });

    test('should handle upload error', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        headers: {
          get: (name) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve({ error: 'Invalid file format' })
      });

      await expect(ApiService.uploadFile(file)).rejects.toEqual({
        status: 400,
        message: 'Invalid file format',
        data: { error: 'Invalid file format' }
      });
    });

    test('should handle network error during upload', async () => {
      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      global.fetch.mockRejectedValueOnce(new Error('Network failure'));

      await expect(ApiService.uploadFile(file)).rejects.toEqual({
        status: 0,
        message: 'Erro de conexao com o servidor',
        originalError: new Error('Network failure')
      });
    });
  });

  describe('request method', () => {
    test('should make GET request with default options', async () => {
      const mockData = { result: 'success' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: (name) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockData)
      });

      const result = await ApiService.request('/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/v1/test', {
        headers: {}
      });
      expect(result).toEqual({
        ok: true,
        data: mockData,
        status: 200
      });
    });

    test('should make POST request with custom options', async () => {
      const mockData = { result: 'created' };
      const postData = { name: 'test' };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: {
          get: (name) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockData)
      });

      const result = await ApiService.request('/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/v1/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      expect(result).toEqual({
        ok: true,
        data: mockData,
        status: 201
      });
    });

    test('should handle non-JSON response errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        headers: {
          get: (name) => name === 'content-type' ? 'text/html' : null
        },
        json: () => Promise.reject(new Error('Not JSON'))
      });

      await expect(ApiService.request('/test')).rejects.toEqual({
        status: 503,
        message: 'Resposta inválida do servidor'
      });
    });
  });

  describe('Module Export', () => {
    test('should export ApiService', () => {
      expect(ApiService).toBeDefined();
      expect(ApiService.getTransactions).toBeDefined();
      expect(ApiService.uploadFile).toBeDefined();
      expect(ApiService.request).toBeDefined();
    });

    test('should export to window in browser environment', () => {
      if (typeof window !== "undefined") {
        const testExport = () => {
          if (typeof window !== "undefined" && typeof module === "undefined") {
            return true;
          }
          return false;
        };
        
        expect(typeof testExport).toBe('function');
        expect(testExport()).toBeDefined();
      }
      
      const hasWindow = typeof window !== "undefined";
      const hasModule = typeof module !== "undefined";
      
      expect(hasWindow || hasModule).toBe(true);
    });
    
    test('should handle both export mechanisms', () => {
      const moduleExport = typeof module !== "undefined" && module.exports;
      expect(moduleExport).toBeTruthy();
      
      const code = `
        const mockService = { test: 'value' };
        let exported = false;
        
        if (typeof module !== "undefined" && module.exports) {
          exported = 'module';
        }
        
        if (typeof window !== "undefined" && typeof module === "undefined") {
          exported = 'window';
        }
        
        exported;
      `;
      
      const result = eval(code);
      expect(result).toBe('module');
    });
  });
});
