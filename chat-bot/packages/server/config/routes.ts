import express from 'express';
import { chatCtrl } from '../controllers/chat';
import { productCtrl } from '../controllers/products';

const router = express.Router();

router.route('/api/chat').post(chatCtrl.create);

router.route('/api/products').get(productCtrl.index);
router.route('/api/products/:id/reviews').get(productCtrl.show);

export default router;
