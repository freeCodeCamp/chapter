import express from 'express';

import list from './routes/list';

const router = express.Router();

router.get('/api/chapters', list);

export default router;
