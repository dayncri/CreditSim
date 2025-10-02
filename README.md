# API do Simulador de Crédito

API backend para simulação de cálculos de empréstimos com taxas de juros baseadas na idade.

---

## Instruções de Configuração

### Pré-requisitos
- Node.js 20 ou superior
- npm (já vem com o Node.js)

### Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Compile o projeto:
```bash
npm run build
```

---

## Executando a Aplicação

**Modo desenvolvimento** (com hot reload):
```bash
npm run dev
```

**Modo produção**:
```bash
npm run build
npm start
```

O servidor será iniciado na porta **5000**.

---

## Executando Testes

**Rodar todos os testes**:
```bash
npm test
```

**Rodar testes em modo watch**:
```bash
npm test:watch
```

**Rodar testes com cobertura**:
```bash
npm test:coverage
```

**Lint do código**:
```bash
npm run lint
```

---

## Endpoints da API

### Health Check

**GET** `/health`

Retorna o status do servidor.

**Resposta:**
```json
{
  "status": "ok",
  "message": "API do Simulador de Crédito está rodando"
}
```

---

### Simulação Única de Empréstimo

**POST** `/api/simulate`

Calcula a simulação de um empréstimo único.

**Body da Requisição:**
```json
{
  "loanAmount": 10000,
  "birthDate": "1990-01-01",
  "termInMonths": 12
}
```

**Parâmetros:**
- `loanAmount` (número, obrigatório): Valor do empréstimo. Deve ser positivo.
- `birthDate` (string, obrigatório): Data de nascimento do cliente em formato ISO 8601 (YYYY-MM-DD).
- `termInMonths` (número, obrigatório): Prazo em meses (1-600).

**Resposta:**
```json
{
  "loanAmount": 10000,
  "birthDate": "1990-01-01",
  "termInMonths": 12,
  "monthlyPayment": 846.94,
  "totalPayable": 10163.24,
  "totalInterest": 163.24,
  "interestRate": 0.03
}
```

---

### Simulação em Lote de Empréstimos

**POST** `/api/simulate/batch`

Processa múltiplas simulações em uma única requisição. Suporta até 10.000 simulações.

**Body da Requisição:**
```json
{
  "simulations": [
    {
      "loanAmount": 10000,
      "birthDate": "1990-01-01",
      "termInMonths": 12
    },
    {
      "loanAmount": 20000,
      "birthDate": "1975-01-01",
      "termInMonths": 24
    }
  ]
}
```

**Resposta:**
```json
{
  "totalSimulations": 2,
  "processedSimulations": 2,
  "processingTimeMs": 0,
  "results": [
    {
      "loanAmount": 10000,
      "birthDate": "1990-01-01",
      "termInMonths": 12,
      "monthlyPayment": 846.94,
      "totalPayable": 10163.24,
      "totalInterest": 163.24,
      "interestRate": 0.03
    },
    {
      "loanAmount": 20000,
      "birthDate": "1975-01-01",
      "termInMonths": 24,
      "monthlyPayment": 850.81,
      "totalPayable": 20419.33,
      "totalInterest": 419.33,
      "interestRate": 0.02
    }
  ]
}
```

---

## Cálculo da Taxa de Juros

As taxas são definidas com base na idade do cliente:

| Faixa Etária | Taxa Anual de Juros |
|--------------|---------------------|
| ≤ 25 anos    | 5% |
| 26-40 anos   | 3% |
| 41-60 anos   | 2% |
| > 60 anos    | 4% |

A idade é calculada com base na data de nascimento fornecida.

---

## Fórmula de Cálculo

O valor da parcela mensal é calculado pela fórmula padrão **PMT**:

```
PMT = PV × (r × (1 + r)^n) / ((1 + r)^n - 1)
```

Onde:
- **PMT** = Pagamento mensal
- **PV** = Valor presente (empréstimo)
- **r** = Taxa de juros mensal (taxa anual / 12)
- **n** = Total de parcelas (meses)

Para empréstimos sem juros:
```
PMT = PV / n
```

---

## Estrutura do Projeto

```
credit-simulator/
├── src/
│   ├── index.ts                    # Ponto de entrada
│   ├── routes/
│   │   └── simulationRoutes.ts     # Definição das rotas
│   ├── controllers/
│   │   └── simulationController.ts # Controladores HTTP
│   ├── services/
│   │   └── simulationService.ts    # Lógica de negócio
│   └── utils/
│       └── interestCalculator.ts   # Utilitários de cálculo
├── tests/
│   ├── interestCalculator.test.ts  # Testes unitários
│   ├── simulation.test.ts          # Testes de integração
│   └── performance.test.ts         # Testes de performance
├── package.json                    # Dependências e scripts
├── tsconfig.json                   # Configuração TypeScript
├── jest.config.js                  # Configuração Jest
└── .eslintrc.json                  # Configuração ESLint
```

---

## Decisões de Arquitetura

- **Arquitetura em camadas** (Routes → Controllers → Services → Utils)  
- **TypeScript**: tipagem estática garante segurança em cálculos financeiros  
- **Express.js**: framework leve e flexível para REST APIs  
- **date-fns**: manipulação de datas moderna e confiável  
- **express-validator**: validação de dados robusta  
- **Jest + ts-jest**: testes unitários, integração e performance  

---

## Testes

- **Unitários**: funções de cálculo (idade, taxa, PMT)  
- **Integração**: endpoints e validação  
- **Performance**: processamento em lote até 10.000 simulações  

Benchmarks:  
- 100 simulações: < 5s  
- 1.000 simulações: < 10s  
- 10.000 simulações: completam com sucesso  

---

## Melhorias Futuras

- Integração com **mensageria** (SQS/Kafka/RabbitMQ)  
- Persistência em banco (histórico de simulações, auditoria)  
- Documentação interativa com Swagger/OpenAPI  
- Autenticação e autorização  
- Rate limiting  
- Envio de resultados por e-mail  
- Taxas variáveis e multi-moeda   