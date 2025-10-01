import { differenceInYears } from 'date-fns';

export function calculateAge(birthDate: Date): number {
  return differenceInYears(new Date(), birthDate);
}

export function getAnnualInterestRate(age: number): number {
  if (age <= 25) {
    return 0.05;
  } else if (age <= 40) {
    return 0.03;
  } else if (age <= 60) {
    return 0.02;
  } else {
    return 0.04;
  }
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (annualRate === 0) {
    return principal / months;
  }

  const monthlyRate = annualRate / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
  
  return payment;
}

export function calculateTotalInterest(
  monthlyPayment: number,
  months: number,
  principal: number
): number {
  const totalPayable = monthlyPayment * months;
  return totalPayable - principal;
}

export interface SimulationResult {
  monthlyPayment: number;
  totalPayable: number;
  totalInterest: number;
  interestRate: number;
}

export function calculateLoanSimulation(
  loanAmount: number,
  birthDate: Date,
  termInMonths: number
): SimulationResult {
  const age = calculateAge(birthDate);
  const annualRate = getAnnualInterestRate(age);
  const monthlyPayment = calculateMonthlyPayment(loanAmount, annualRate, termInMonths);
  const totalPayable = monthlyPayment * termInMonths;
  const totalInterest = calculateTotalInterest(monthlyPayment, termInMonths, loanAmount);

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    interestRate: annualRate
  };
}
