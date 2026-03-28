import express from 'express';
import { chatCtrl } from '../controllers/chat';

const router = express.Router();

router.route('/api/chat').post(chatCtrl.create);

export default router;
