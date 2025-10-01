import { Router } from 'express';
import { body } from 'express-validator';
import { SimulationController } from '../controllers/simulationController';

const router = Router();
const controller = new SimulationController();

const singleSimulationValidation = [
  body('loanAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Loan amount must be a positive number'),
  body('birthDate')
    .isISO8601()
    .withMessage('Birth date must be a valid ISO 8601 date'),
  body('termInMonths')
    .isInt({ min: 1, max: 600 })
    .withMessage('Term must be between 1 and 600 months')
];

const batchSimulationValidation = [
  body('simulations')
    .isArray({ min: 1 })
    .withMessage('simulations must be a non-empty array'),
  body('simulations.*.loanAmount')
    .isFloat({ min: 0.01 })
    .withMessage('Each loan amount must be a positive number'),
  body('simulations.*.birthDate')
    .isISO8601()
    .withMessage('Each birth date must be a valid ISO 8601 date'),
  body('simulations.*.termInMonths')
    .isInt({ min: 1, max: 600 })
    .withMessage('Each term must be between 1 and 600 months')
];

router.post('/simulate', singleSimulationValidation, (req: any, res: any) => 
  controller.simulateSingle(req, res)
);

router.post('/simulate/batch', batchSimulationValidation, (req: any, res: any) => 
  controller.simulateBatch(req, res)
);

export default router;
