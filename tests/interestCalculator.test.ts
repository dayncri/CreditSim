import {
  calculateAge,
  getAnnualInterestRate,
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateLoanSimulation
} from '../src/utils/interestCalculator';

describe('Interest Calculator Tests', () => {
  describe('calculateAge', () => {
    it('should calculate correct age for a given birth date', () => {
      const birthDate = new Date('1990-01-01');
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(34);
    });

    it('should handle leap year birth dates', () => {
      const birthDate = new Date('2000-02-29');
      const age = calculateAge(birthDate);
      expect(age).toBeGreaterThanOrEqual(24);
    });
  });

  describe('getAnnualInterestRate', () => {
    it('should return 5% for age <= 25', () => {
      expect(getAnnualInterestRate(20)).toBe(0.05);
      expect(getAnnualInterestRate(25)).toBe(0.05);
    });

    it('should return 3% for age 26-40', () => {
      expect(getAnnualInterestRate(26)).toBe(0.03);
      expect(getAnnualInterestRate(35)).toBe(0.03);
      expect(getAnnualInterestRate(40)).toBe(0.03);
    });

    it('should return 2% for age 41-60', () => {
      expect(getAnnualInterestRate(41)).toBe(0.02);
      expect(getAnnualInterestRate(50)).toBe(0.02);
      expect(getAnnualInterestRate(60)).toBe(0.02);
    });

    it('should return 4% for age > 60', () => {
      expect(getAnnualInterestRate(61)).toBe(0.04);
      expect(getAnnualInterestRate(75)).toBe(0.04);
    });
  });

  describe('calculateMonthlyPayment', () => {
    it('should calculate correct PMT for standard loan', () => {
      const payment = calculateMonthlyPayment(10000, 0.05, 12);
      expect(payment).toBeCloseTo(856.07, 1);
    });

    it('should handle zero interest rate', () => {
      const payment = calculateMonthlyPayment(12000, 0, 12);
      expect(payment).toBe(1000);
    });

    it('should calculate correctly for longer terms', () => {
      const payment = calculateMonthlyPayment(50000, 0.03, 60);
      expect(payment).toBeGreaterThan(0);
      expect(payment).toBeLessThan(50000);
    });
  });

  describe('calculateTotalInterest', () => {
    it('should calculate total interest correctly', () => {
      const monthlyPayment = 856.07;
      const months = 12;
      const principal = 10000;
      const interest = calculateTotalInterest(monthlyPayment, months, principal);
      expect(interest).toBeCloseTo(272.84, 1);
    });

    it('should return 0 interest for zero rate loan', () => {
      const monthlyPayment = 1000;
      const months = 12;
      const principal = 12000;
      const interest = calculateTotalInterest(monthlyPayment, months, principal);
      expect(interest).toBe(0);
    });
  });

  describe('calculateLoanSimulation', () => {
    it('should return complete simulation for young client (age <= 25)', () => {
      const birthDate = new Date('2000-01-01');
      const result = calculateLoanSimulation(10000, birthDate, 12);
      
      expect(result.interestRate).toBe(0.05);
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalPayable).toBeGreaterThan(10000);
      expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should return complete simulation for mid-age client (26-40)', () => {
      const birthDate = new Date('1990-01-01');
      const result = calculateLoanSimulation(20000, birthDate, 24);
      
      expect(result.interestRate).toBe(0.03);
      expect(result.monthlyPayment).toBeGreaterThan(0);
      expect(result.totalPayable).toBeGreaterThan(20000);
    });

    it('should return complete simulation for mature client (41-60)', () => {
      const birthDate = new Date('1970-01-01');
      const result = calculateLoanSimulation(50000, birthDate, 36);
      
      expect(result.interestRate).toBe(0.02);
      expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('should return complete simulation for senior client (> 60)', () => {
      const birthDate = new Date('1960-01-01');
      const result = calculateLoanSimulation(30000, birthDate, 48);
      
      expect(result.interestRate).toBe(0.04);
      expect(result.monthlyPayment).toBeGreaterThan(0);
    });

    it('should round monetary values to 2 decimal places', () => {
      const birthDate = new Date('1990-01-01');
      const result = calculateLoanSimulation(10000, birthDate, 12);
      
      expect(result.monthlyPayment.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.totalPayable.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
      expect(result.totalInterest.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});
