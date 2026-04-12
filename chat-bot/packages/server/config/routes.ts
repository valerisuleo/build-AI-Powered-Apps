import express from 'express';
import { chatCtrl } from '../controllers/chat';
import { productCtrl } from '../controllers/products';
import { reviewCtrl } from '../controllers/reviews';
import { summaryCtrl } from '../controllers/summaries';

const router = express.Router();

router.route('/api/chat').post(chatCtrl.create);

router.route('/api/products').get(productCtrl.index);
router.route('/api/products/:id/reviews').get(reviewCtrl.show);
router.route('/api/products/:id/reviews/summarize').post(summaryCtrl.create);

export default router;
