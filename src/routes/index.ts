import { Router } from 'express';
const router = Router();

router.use((_req, res) => {
    return res.send('Wrong route!');
});

export default router;