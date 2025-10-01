import request from 'supertest';
import app from '../src/index';

describe('Simulation API Integration Tests', () => {
  describe('POST /api/simulate - Single Simulation', () => {
    it('should return simulation results for valid request', async () => {
      const response = await request(app)
        .post('/api/simulate')
        .send({
          loanAmount: 10000,
          birthDate: '1990-01-01',
          termInMonths: 12
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('monthlyPayment');
      expect(response.body).toHaveProperty('totalPayable');
      expect(response.body).toHaveProperty('totalInterest');
      expect(response.body).toHaveProperty('interestRate');
      expect(response.body.monthlyPayment).toBeGreaterThan(0);
    });

    it('should return 400 for missing loanAmount', async () => {
      const response = await request(app)
        .post('/api/simulate')
        .send({
          birthDate: '1990-01-01',
          termInMonths: 12
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should return 400 for invalid birthDate format', async () => {
      const response = await request(app)
        .post('/api/simulate')
        .send({
          loanAmount: 10000,
          birthDate: 'invalid-date',
          termInMonths: 12
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for negative loanAmount', async () => {
      const response = await request(app)
        .post('/api/simulate')
        .send({
          loanAmount: -5000,
          birthDate: '1990-01-01',
          termInMonths: 12
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for termInMonths exceeding maximum', async () => {
      const response = await request(app)
        .post('/api/simulate')
        .send({
          loanAmount: 10000,
          birthDate: '1990-01-01',
          termInMonths: 700
        });

      expect(response.status).toBe(400);
    });

    it('should calculate correctly for different age groups', async () => {
      const testCases = [
        { birthDate: '2000-01-01', expectedRate: 0.05 },
        { birthDate: '1990-01-01', expectedRate: 0.03 },
        { birthDate: '1970-01-01', expectedRate: 0.02 },
        { birthDate: '1960-01-01', expectedRate: 0.04 }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/simulate')
          .send({
            loanAmount: 10000,
            birthDate: testCase.birthDate,
            termInMonths: 12
          });

        expect(response.status).toBe(200);
        expect(response.body.interestRate).toBe(testCase.expectedRate);
      }
    });
  });

  describe('POST /api/simulate/batch - Batch Simulation', () => {
    it('should process multiple simulations successfully', async () => {
      const simulations = [
        { loanAmount: 10000, birthDate: '1990-01-01', termInMonths: 12 },
        { loanAmount: 20000, birthDate: '1985-05-15', termInMonths: 24 },
        { loanAmount: 15000, birthDate: '1975-10-20', termInMonths: 18 }
      ];

      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations });

      expect(response.status).toBe(200);
      expect(response.body.totalSimulations).toBe(3);
      expect(response.body.processedSimulations).toBe(3);
      expect(response.body.results).toHaveLength(3);
      expect(response.body.processingTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should return 400 for exceeding batch limit', async () => {
      const simulations = Array(10001).fill({
        loanAmount: 10000,
        birthDate: '1990-01-01',
        termInMonths: 12
      });

      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('exceeds maximum limit');
    });

    it('should return 400 for empty simulations array', async () => {
      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations: [] });

      expect(response.status).toBe(400);
    });

    it('should return 400 for invalid simulation in batch', async () => {
      const simulations = [
        { loanAmount: 10000, birthDate: '1990-01-01', termInMonths: 12 },
        { loanAmount: -5000, birthDate: '1985-05-15', termInMonths: 24 }
      ];

      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /health - Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
    });
  });
});
