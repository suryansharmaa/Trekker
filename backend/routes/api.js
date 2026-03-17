import express from 'express';
import { getUserStats } from '../controllers/statsController.js';

const router = express.Router();

router.post('/stats', getUserStats);

export default router;
