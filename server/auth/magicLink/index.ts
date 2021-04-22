import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', passport.authenticate('magicLink', { action: 'requestToken' }));
router.get(
  '/callback',
  passport.authenticate('magicLink', { action: 'acceptToken' }),
  (_, res) => {
    res.redirect('http://localhost:3000/');
  },
);

export default router;
