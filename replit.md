# 💳 API do Simulador de Crédito  

## Visão Geral  
O **Simulador de Crédito** é uma aplicação backend em forma de API que calcula simulações de empréstimos com base na idade do cliente, valor solicitado e prazo de pagamento.  
A API oferece endpoints para simulação única e em lote, retornando valor da parcela mensal, juros totais e valor total a pagar.  
Foi desenvolvida em **TypeScript** com **Express**, utilizando faixas etárias para definir taxas de juros, sendo útil para instituições financeiras que oferecem crédito personalizado.  

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
- **Justificativa:** separação clara facilita manutenção, testes e reuso da lógica de cálculo.  

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

**Justificativa:** Evita dados inválidos chegarem na lógica de negócio.  

---

## Regras de Negócio  

### Taxa de Juros por Idade  
- Até 25 anos → 5% ao ano  
- De 26 a 40 anos → 3% ao ano  
- De 41 a 60 anos → 2% ao ano  
- Acima de 60 anos → 4% ao ano  

**Justificativa:** precificação baseada em risco, ajustada pelo perfil etário.  

### Fórmula Financeira  
- Fórmula de amortização padrão (PMT):  