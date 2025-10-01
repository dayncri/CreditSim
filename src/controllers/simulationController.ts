import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { SimulationService } from '../services/simulationService';

const simulationService = new SimulationService();

export class SimulationController {
  async simulateSingle(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { loanAmount, birthDate, termInMonths } = req.body;
      
      const result = simulationService.simulateLoan({
        loanAmount,
        birthDate,
        termInMonths
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async simulateBatch(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    try {
      const { simulations } = req.body;

      if (!Array.isArray(simulations)) {
        res.status(400).json({ error: 'simulations must be an array' });
        return;
      }

      if (simulations.length > 10000) {
        res.status(400).json({ 
          error: 'Batch size exceeds maximum limit of 10,000 simulations' 
        });
        return;
      }

      const result = await simulationService.simulateBatch({ simulations });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}
