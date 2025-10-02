# API do Simulador de Crédito

## Visão Geral
O **Simulador de Crédito** é uma aplicação backend em forma de API que calcula simulações de empréstimos com base na idade do cliente, valor solicitado e prazo de pagamento.  
A API oferece endpoints para simulação única e em lote, retornando **valor da parcela mensal**, **juros totais** e **valor total a pagar**.  
Foi desenvolvida em **TypeScript com Express**, utilizando faixas etárias para definir taxas de juros, sendo útil para instituições financeiras que oferecem crédito personalizado.

---

## Arquitetura do Sistema

### Framework & Runtime
- **Tecnologia:** Node.js com Express 5.x  
- **Linguagem:** TypeScript (tipagem estrita)  
- **Justificativa:** Express é leve e ideal para APIs RESTful; TypeScript traz segurança e evita erros em cálculos financeiros.

### Padrão de Arquitetura em Camadas
- **Controllers:** tratam requisições/respostas HTTP e validam entrada.  
- **Services:** concentram a lógica de negócio (simulações).  
- **Utils:** funções puras para cálculos financeiros.  
- **Routes:** definem endpoints da API.  

**Justificativa:** separação clara facilita manutenção, testes e reuso da lógica de cálculo.

---

## Design da API

### Endpoints RESTful
- `POST /api/simulate` → simulação única  
- `POST /api/simulate/batch` → processamento em lote (até 10.000 simulações)  
- `GET /health` → checagem de saúde da API  

**Justificativa:** API previsível e padronizada. O endpoint de lote garante desempenho ao processar muitas simulações.

### Validação de Entrada
- Middleware: **express-validator**  
- Valida:  
  - Valor do empréstimo (número positivo)  
  - Data de nascimento (ISO 8601)  
  - Prazo em meses (1 a 600)  

**Justificativa:** evita que dados inválidos cheguem à lógica de negócio.

---

## Regras de Negócio

### Taxa de Juros por Idade
- Até 25 anos → 5% ao ano  
- De 26 a 40 anos → 3% ao ano  
- De 41 a 60 anos → 2% ao ano  
- Acima de 60 anos → 4% ao ano  

**Justificativa:** precificação baseada em risco, ajustada pelo perfil etário.

### Fórmula Financeira
Fórmula de amortização padrão (PMT): 
PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)

- Considera casos de taxa zero.  

**Justificativa:** fórmula padrão do mercado, garantindo precisão.

### Datas
- Biblioteca: **date-fns**  
- Calcula idade corretamente, inclusive anos bissextos.

---

## Estratégia de Testes

### Cobertura
- **Unitários:** utilitários (idade, juros, parcelas)  
- **Integração:** endpoints da API  
- **Performance:** simulações em lote (100, 1000, 5000)  
- **Framework:** Jest + ts-jest  

**Justificativa:** garante precisão financeira e valida escalabilidade.

### Requisitos de Performance
- 100 simulações < 5s  
- 1000 simulações < 10s  
- Suporte até 10.000 simulações em lote  

---

## Qualidade do Código

### Linting & Tipagem
- ESLint + plugin TypeScript  
- Configuração estrita do TypeScript  

**Justificativa:** consistência e segurança em tempo de compilação.

### Build & Desenvolvimento
- Compilação TypeScript → CommonJS  
- Nodemon para hot-reload  
- Source maps para debug  

---

## Dependências Externas

### Core
- **Express (5.1.0):** servidor e roteamento  
- **TypeScript (5.9.3):** tipagem estática  
- **date-fns (4.1.0):** manipulação de datas  

### Validação & Testes
- **express-validator (7.2.1):** validação de entrada  
- **Jest (30.2.0) + ts-jest (29.4.4):** testes  
- **supertest (7.1.4):** testes de endpoints  

### Ferramentas de Desenvolvimento
- **ESLint (9.36.0):** linting  
- **Nodemon (3.1.10):** reload automático  
- **ts-node (10.9.2):** execução de TS em dev  

---

## Armazenamento de Dados
- Atualmente não há banco de dados.  
- Todas as simulações são calculadas em memória (stateless).  
- **Possível evolução:** integrar com Postgres (via Drizzle ORM) para guardar histórico de simulações, usuários ou logs de auditoria.

---

## Integrações Externas
- Nenhuma no momento.  
- Não há autenticação externa, gateways de pagamento ou APIs de terceiros.  
- Motor de cálculo é **100% autocontido**.

