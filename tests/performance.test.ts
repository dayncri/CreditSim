import request from 'supertest';
import app from '../src/index';

describe('Performance Tests', () => {
  describe('Batch Simulation Performance', () => {
    it('should process 100 simulations in under 5 seconds', async () => {
      const simulations = Array(100).fill(null).map((_, index) => ({
        loanAmount: 10000 + (index * 100),
        birthDate: '1990-01-01',
        termInMonths: 12 + (index % 48)
      }));

      const startTime = Date.now();
      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations });
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body.processedSimulations).toBe(100);
      expect(endTime - startTime).toBeLessThan(5000);
    });

    it('should process 1000 simulations in under 10 seconds', async () => {
      const simulations = Array(1000).fill(null).map((_, index) => ({
        loanAmount: 5000 + (index * 50),
        birthDate: '1990-01-01',
        termInMonths: 12 + (index % 60)
      }));

      const startTime = Date.now();
      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations });
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(response.body.processedSimulations).toBe(1000);
      expect(endTime - startTime).toBeLessThan(10000);
    });

    it('should process 5000 simulations efficiently', async () => {
      const simulations = Array(5000).fill(null).map((_, index) => ({
        loanAmount: 1000 + (index * 10),
        birthDate: `199${index % 10}-01-01`,
        termInMonths: 6 + (index % 54)
      }));

      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations });

      expect(response.status).toBe(200);
      expect(response.body.processedSimulations).toBe(5000);
      expect(response.body.processingTimeMs).toBeLessThan(30000);
    });

    it('should handle maximum batch size of 10000 simulations', async () => {
      const simulations = Array(10000).fill(null).map((_, index) => ({
        loanAmount: 1000 + index,
        birthDate: '1990-01-01',
        termInMonths: 12
      }));

      const response = await request(app)
        .post('/api/simulate/batch')
        .send({ simulations });

      expect(response.status).toBe(200);
      expect(response.body.processedSimulations).toBe(10000);
      expect(response.body.results).toHaveLength(10000);
    }, 60000);
  });

  describe('Single Simulation Performance', () => {
    it('should process single simulation quickly', async () => {
      const startTime = Date.now();
      const response = await request(app)
        .post('/api/simulate')
        .send({
          loanAmount: 10000,
          birthDate: '1990-01-01',
          termInMonths: 12
        });
      const endTime = Date.now();

      expect(response.status).toBe(200);
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle concurrent single requests', async () => {
      const requests = Array(50).fill(null).map(() =>
        request(app)
          .post('/api/simulate')
          .send({
            loanAmount: 10000,
            birthDate: '1990-01-01',
            termInMonths: 12
          })
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.monthlyPayment).toBeGreaterThan(0);
      });
    });
  });
});
