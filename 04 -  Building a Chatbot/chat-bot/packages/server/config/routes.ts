import express from 'express';
import { ChatCtrls } from '../controllers/chat';

const router = express.Router();

router.route('/api/chat').post(ChatCtrls.create);

export default router;
