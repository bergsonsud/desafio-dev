# Frontend - Importador CNAB

## 🎨 Tailwind CSS

Este projeto utiliza **Tailwind CSS v4** para estilização, proporcionando:

- Design system consistente
- Responsividade nativa
- Performance otimizada
- Manutenibilidade simplificada

### Scripts Disponíveis

```bash
# Gerar CSS para produção (minificado)
npm run build:css

# Modo watch para desenvolvimento
npm run watch:css

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch
```

### Estrutura de Estilos

```
frontend/
├── styles/
│   ├── tailwind.css      # Arquivo fonte com configurações Tailwind
│   └── output.css        # CSS gerado (não versionar)
├── tailwind.config.js    # Configuração do Tailwind
└── index.html            # HTML com classes Tailwind
```

### Cores Customizadas

O projeto define cores primárias personalizadas:

- `primary-50` a `primary-900`: Escala de azul para elementos principais
- Classes utilitárias: `btn-primary` para botões

### Classes Customizadas

- **btn-primary**: Botão principal com hover effects e transições
- **fade-in**: Animação de entrada suave

### Desenvolvimento

Durante o desenvolvimento, mantenha o comando `watch:css` rodando:

```bash
npm run watch:css
```

Isso irá recompilar automaticamente o CSS sempre que você modificar:
- `styles/tailwind.css`
- Arquivos HTML
- Arquivos JavaScript com classes Tailwind

### Build para Produção

Antes de fazer deploy, sempre execute:

```bash
npm run build:css
```

Isso gerará uma versão minificada e otimizada do CSS.

## 📊 Cobertura de Testes

- ✅ 43 testes passando
- ✅ 100% de cobertura de código
- ✅ Testes unitários para todos os módulos
- ✅ Validação de XSS e segurança
- ✅ Testes de integração com API

## 🚀 Tecnologias

- **Tailwind CSS v4**: Framework CSS utility-first
- **Vanilla JavaScript**: Sem frameworks, código limpo
- **Jest**: Testes unitários
- **API Service Pattern**: Arquitetura modular
