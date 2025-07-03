import { Router } from 'express';
import * as C from '../controllers/recordController.js';

const router = Router();

router.post('/', C.createRecords);
router.get('/', C.readAll);
router.get('/:id', C.readOne);
router.put('/:id', C.updateOne);
router.delete('/:id', C.deleteOne);

export default router;
