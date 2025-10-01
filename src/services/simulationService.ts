import { calculateLoanSimulation, SimulationResult } from '../utils/interestCalculator';

export interface SimulationRequest {
  loanAmount: number;
  birthDate: string;
  termInMonths: number;
}

export interface SimulationResponse {
  loanAmount: number;
  birthDate: string;
  termInMonths: number;
  monthlyPayment: number;
  totalPayable: number;
  totalInterest: number;
  interestRate: number;
}

export interface BatchSimulationRequest {
  simulations: SimulationRequest[];
}

export interface BatchSimulationResponse {
  totalSimulations: number;
  processedSimulations: number;
  results: SimulationResponse[];
  processingTimeMs: number;
}

export class SimulationService {
  simulateLoan(request: SimulationRequest): SimulationResponse {
    const birthDate = new Date(request.birthDate);
    
    const result = calculateLoanSimulation(
      request.loanAmount,
      birthDate,
      request.termInMonths
    );

    return {
      loanAmount: request.loanAmount,
      birthDate: request.birthDate,
      termInMonths: request.termInMonths,
      monthlyPayment: result.monthlyPayment,
      totalPayable: result.totalPayable,
      totalInterest: result.totalInterest,
      interestRate: result.interestRate
    };
  }

  async simulateBatch(batchRequest: BatchSimulationRequest): Promise<BatchSimulationResponse> {
    const startTime = Date.now();
    const results: SimulationResponse[] = [];

    const processSimulation = (request: SimulationRequest): SimulationResponse => {
      return this.simulateLoan(request);
    };

    const chunkSize = 100;
    const simulations = batchRequest.simulations;

    for (let i = 0; i < simulations.length; i += chunkSize) {
      const chunk = simulations.slice(i, i + chunkSize);
      const chunkPromises = chunk.map(sim => 
        Promise.resolve(processSimulation(sim))
      );
      const chunkResults = await Promise.all(chunkPromises);
      results.push(...chunkResults);
    }

    const endTime = Date.now();
    const processingTimeMs = endTime - startTime;

    return {
      totalSimulations: batchRequest.simulations.length,
      processedSimulations: results.length,
      results,
      processingTimeMs
    };
  }
}
