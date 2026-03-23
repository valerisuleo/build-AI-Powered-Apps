import express from 'express';
import { createRoute } from '../controllers/chat';

const router = express.Router();

router.route('/api/chat').post(createRoute);

// router.post(
//     '/api/chat',
//     async (request: Request, response: Response, next: NextFunction) => {
//         try {
//             const validatedData = chatSchema.parse(request.body);
//             const result = await handleChat(validatedData);
//             response.json(result);
//         } catch (error) {
//             next(error);
//         }
//     },
// );

export default router;
