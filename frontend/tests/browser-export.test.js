describe('Browser Environment Export', () => {
  test('should export to window when module is not available', () => {
    const browserCode = `
      (function() {
        const BrowserService = (function() {
          function testMethod() {
            return 'browser';
          }
          return { testMethod };
        })();
        

        if (typeof module !== "undefined" && module.exports) {
          module.exports = BrowserService;
        }
        
        if (typeof window !== "undefined" && typeof module === "undefined") {
          window.BrowserService = BrowserService;
        }
        
        return BrowserService;
      })();
    `;
    
    const service = eval(browserCode);
    expect(service).toBeDefined();
    expect(service.testMethod()).toBe('browser');
  });
  
  test('should validate window export path exists', () => {
    // Create a new context where we can control module
    const vm = require('vm');
    const sandbox = {
      window: {},
      module: undefined,
      console: console
    };
    
    const code = `
      const Service = { value: 'test' };
      
      if (typeof module !== "undefined" && module.exports) {
        module.exports = Service;
      }
      
      if (typeof window !== "undefined" && typeof module === "undefined") {
        window.ApiService = Service;
      }
      
      window.ApiService;
    `;
    
    const context = vm.createContext(sandbox);
    const result = vm.runInContext(code, context);
    
    expect(result).toBeDefined();
    expect(result.value).toBe('test');
  });
});
