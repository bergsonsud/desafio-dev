const ApiService = require('../js/api-service.js');

jest.mock('../js/api-service.js', () => ({
  uploadFile: jest.fn()
}));

describe('Upload Module', () => {
  let fileInput, fileName, uploadStatus, form;

  const setupDOM = () => {
    document.body.innerHTML = `
      <form id="upload-form">
        <input type="file" id="file">
        <span id="file-name"></span>
        <button type="submit">Enviar</button>
      </form>
      <div id="upload-status"></div>
    `;
    fileInput = document.getElementById('file');
    fileName = document.getElementById('file-name');
    uploadStatus = document.getElementById('upload-status');
    form = document.getElementById('upload-form');
  };

  beforeEach(() => {
    setupDOM();
    jest.useFakeTimers();
    jest.clearAllMocks();
    global.loadTransactions = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    delete global.loadTransactions;
  });

  const loadUploadModule = () => {
    global.ApiService = ApiService;
    
    jest.isolateModules(() => {
      require('../js/upload.js');
    });
    document.dispatchEvent(new Event('DOMContentLoaded'));
  };

  describe('File Input Change', () => {
    test('should display file name when file is selected', () => {
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      fileInput.dispatchEvent(new Event('change'));

      expect(fileName.textContent).toBe('test.txt');
    });

    test('should clear file name when no file is selected', () => {
      loadUploadModule();

      fileName.textContent = 'previous.txt';
      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false
      });

      fileInput.dispatchEvent(new Event('change'));

      expect(fileName.textContent).toBe('');
    });
  });

  describe('Form Submit', () => {
    test('should show error when no file is selected', async () => {
      loadUploadModule();

      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false
      });

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      await Promise.resolve();

      expect(uploadStatus.textContent).toBe('Selecione um arquivo!');
      expect(uploadStatus.classList.contains('bg-red-100')).toBe(true);
    });

    test('should upload file and show success message', async () => {
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      ApiService.uploadFile.mockImplementation(() => Promise.resolve({
        ok: true,
        data: { message: 'Arquivo processado com sucesso' }
      }));

      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(ApiService.uploadFile).toHaveBeenCalledWith(file);
      expect(uploadStatus.textContent).toBe('Arquivo processado com sucesso');
      expect(uploadStatus.classList.contains('bg-green-100')).toBe(true);
    });

    test('should call loadTransactions after successful upload', async () => {
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      ApiService.uploadFile.mockImplementation(() => Promise.resolve({
        ok: true,
        data: { message: 'Sucesso' }
      }));

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      jest.advanceTimersByTime(1000);

      expect(global.loadTransactions).toHaveBeenCalled();
    });

    test('should not call loadTransactions if not defined', async () => {
      delete global.loadTransactions;
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      ApiService.uploadFile.mockImplementation(() => Promise.resolve({
        ok: true,
        data: { message: 'Sucesso' }
      }));

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(() => jest.advanceTimersByTime(1000)).not.toThrow();
    });

    test('should show error message from response', async () => {
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      ApiService.uploadFile.mockImplementation(() => Promise.reject({
        status: 400,
        message: 'Arquivo invalido'
      }));

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(uploadStatus.textContent).toBe('Arquivo invalido');
      expect(uploadStatus.classList.contains('bg-red-100')).toBe(true);
    });

    test('should show default error message when no error in response', async () => {
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      ApiService.uploadFile.mockImplementation(() => Promise.reject({}));

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(uploadStatus.textContent).toBe('Erro ao processar arquivo');
    });

    test('should show connection error on fetch failure', async () => {
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      ApiService.uploadFile.mockImplementation(() => Promise.reject({
        status: 0,
        message: 'Erro de conexao com o servidor'
      }));

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(uploadStatus.textContent).toBe('Erro de conexao com o servidor');
      expect(uploadStatus.classList.contains('bg-red-100')).toBe(true);
      expect(console.error).toHaveBeenCalled();
    });

    test('should clear file input after successful upload', async () => {
      loadUploadModule();

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });
      fileName.textContent = 'test.txt';

      ApiService.uploadFile.mockImplementation(() => Promise.resolve({
        ok: true,
        data: { message: 'Sucesso' }
      }));

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(fileName.textContent).toBe('');
    });
  });

  describe('Status Display', () => {
    test('should clear status after 5 seconds', async () => {
      loadUploadModule();

      Object.defineProperty(fileInput, 'files', {
        value: [],
        writable: false
      });

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();

      expect(uploadStatus.classList.contains('bg-red-100')).toBe(true);

      jest.advanceTimersByTime(5000);

      expect(uploadStatus.classList.contains('hidden')).toBe(true);
    });
  });

  describe('File Validation', () => {
    test('should reject non-.txt files', async () => {
      loadUploadModule();

      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();

      expect(uploadStatus.textContent).toBe('Por favor, selecione um arquivo .txt');
      expect(uploadStatus.classList.contains('bg-red-100')).toBe(true);
      expect(ApiService.uploadFile).not.toHaveBeenCalled();
    });

    test('should reject files larger than 10MB', async () => {
      loadUploadModule();

      const largeContent = 'x'.repeat(11 * 1024 * 1024);
      const file = new File([largeContent], 'large.txt', { type: 'text/plain' });
      Object.defineProperty(fileInput, 'files', {
        value: [file],
        writable: false
      });

      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

      await Promise.resolve();

      expect(uploadStatus.textContent).toBe('Arquivo muito grande. Máximo: 10MB');
      expect(uploadStatus.classList.contains('bg-red-100')).toBe(true);
      expect(ApiService.uploadFile).not.toHaveBeenCalled();
    });
  });
});
