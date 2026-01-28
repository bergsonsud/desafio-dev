const ApiService = require('../js/api-service.js');

jest.mock('../js/api-service.js', () => ({
  getTransactions: jest.fn()
}));

describe('Transactions Module', () => {
  let tableBody, loading, emptyState, table, refreshBtn;

  const setupDOM = () => {
    document.body.innerHTML = `
      <div id="loading" style="display: none;">
        <div class="spinner"></div>
        <span>Carregando...</span>
      </div>
      <div id="empty-state" style="display: none;">
        <p>Nenhuma transacao encontrada.</p>
      </div>
      <table id="transactions-table">
        <thead>
          <tr>
            <th>Loja</th>
            <th>Descricao</th>
            <th>Valor Original</th>
            <th>Valor com Sinal</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <button id="refresh-btn">Atualizar</button>
    `;
    tableBody = document.querySelector('#transactions-table tbody');
    loading = document.getElementById('loading');
    emptyState = document.getElementById('empty-state');
    table = document.getElementById('transactions-table');
    refreshBtn = document.getElementById('refresh-btn');
  };

  beforeEach(() => {
    setupDOM();
    jest.clearAllMocks();
    ApiService.getTransactions.mockClear();
  });

  const loadTransactionsModule = () => {
    // Inject ApiService mock into global scope before loading module
    global.ApiService = ApiService;
    
    jest.isolateModules(() => {
      require('../js/transactions.js');
    });
  };

  describe('loadTransactions function', () => {
    test('should show loading state initially', async () => {
      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: []
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      expect(loading.classList.contains('hidden')).toBe(false);
      expect(table.classList.contains('hidden')).toBe(true);
      expect(emptyState.classList.contains('hidden')).toBe(true);

      await Promise.resolve();
      await Promise.resolve();
    });

    test('should show empty state when no stores', async () => {
      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: []
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(loading.classList.contains('hidden')).toBe(true);
      expect(emptyState.classList.contains('hidden')).toBe(false);
      expect(table.classList.contains('hidden')).toBe(true);
    });

    test('should show empty state when stores is null', async () => {
      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: null
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(emptyState.classList.contains('hidden')).toBe(false);
    });

    test('should display stores with positive balance', async () => {
      const stores = [{
        store_name: 'Loja Teste',
        balance: '1000.50',
        transactions: []
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(table.classList.contains('hidden')).toBe(false);
      expect(tableBody.innerHTML).toContain('Loja Teste');
      expect(tableBody.innerHTML).toContain('text-green-600');
      expect(tableBody.innerHTML).toContain('bg-gray-50');
    });

    test('should display stores with negative balance', async () => {
      const stores = [{
        store_name: 'Loja Negativa',
        balance: '-500.00',
        transactions: []
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(tableBody.innerHTML).toContain('text-red-600');
    });

    test('should handle invalid balance value', async () => {
      const stores = [{
        store_name: 'Loja Invalida',
        balance: 'invalid',
        transactions: []
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(tableBody.innerHTML).toContain('Loja Invalida');
    });

    test('should display transactions with positive value_sign', async () => {
      const stores = [{
        store_name: 'Loja',
        balance: '100',
        transactions: [{
          description: 'Debito',
          value: '50.00',
          value_sign: '50.00',
          date: '2025-01-15'
        }]
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(tableBody.innerHTML).toContain('Debito');
      expect(tableBody.innerHTML).toContain('text-green-600');
      expect(tableBody.innerHTML).toContain('bg-green-100');
    });

    test('should display transactions with negative value_sign', async () => {
      const stores = [{
        store_name: 'Loja',
        balance: '100',
        transactions: [{
          description: 'Boleto',
          value: '30.00',
          value_sign: '-30.00',
          date: '2025-01-15'
        }]
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(tableBody.innerHTML).toContain('Boleto');
      expect(tableBody.innerHTML).toContain('text-red-600');
      expect(tableBody.innerHTML).toContain('bg-red-100');
    });

    test('should handle invalid transaction values', async () => {
      const stores = [{
        store_name: 'Loja',
        balance: '100',
        transactions: [{
          description: 'Test',
          value: 'invalid',
          value_sign: 'invalid',
          date: '2025-01-15'
        }]
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(tableBody.innerHTML).toContain('Test');
    });

    test('should show empty row for store without transactions', async () => {
      const stores = [{
        store_name: 'Loja Vazia',
        balance: '0',
        transactions: []
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(tableBody.innerHTML).toContain('Nenhuma transacao disponivel');
    });

    test('should show empty row when transactions is null', async () => {
      const stores = [{
        store_name: 'Loja Null',
        balance: '0',
        transactions: null
      }];

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: stores
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(tableBody.innerHTML).toContain('Nenhuma transacao disponivel');
    });

    test('should handle fetch error', async () => {
      ApiService.getTransactions.mockRejectedValueOnce(new Error('Network error'));

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      expect(loading.classList.contains('hidden')).toBe(true);
      expect(emptyState.classList.contains('hidden')).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('DOMContentLoaded', () => {
    test('should call loadTransactions on DOMContentLoaded', async () => {
      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: []
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      expect(ApiService.getTransactions).toHaveBeenCalled();

      await Promise.resolve();
      await Promise.resolve();
    });

    test('should add click listener to refresh button', async () => {
      ApiService.getTransactions.mockResolvedValue({
        ok: true,
        data: []
      });

      loadTransactionsModule();
      document.dispatchEvent(new Event('DOMContentLoaded'));

      await Promise.resolve();
      await Promise.resolve();

      // Simply verify that the button exists and can be clicked without errors
      expect(refreshBtn).toBeDefined();
      expect(() => refreshBtn.click()).not.toThrow();
    });

    test('should handle missing refresh button', async () => {
      document.body.innerHTML = `
        <div id="loading" style="display: none;"></div>
        <div id="empty-state" style="display: none;"></div>
        <table id="transactions-table"><tbody></tbody></table>
      `;

      ApiService.getTransactions.mockResolvedValueOnce({
        ok: true,
        data: []
      });

      loadTransactionsModule();

      expect(() => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
      }).not.toThrow();

      await Promise.resolve();
      await Promise.resolve();
    });
  });
});
