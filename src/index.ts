import express, { Application } from 'express';
import simulationRoutes from './routes/simulationRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', simulationRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Credit Simulator API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
