import express from 'express';
import Setup from './google/passport';
import googleRouter from './google';

Setup();

const router = express.Router();

router.use(
  '/is-auth', // add { credentials: 'include' } into fetch request for this endpoint to work
  router.get('/', (req, res) => {
    console.log('is there ', req.isAuthenticated());
    console.log('is there ', req.user);
    if (req.isAuthenticated()) {
      return res.send({ isAuth: true });
    } else {
      return res.send({ isAuth: false });
    }
  }),
);
router.use('/google', googleRouter);

export default router;
