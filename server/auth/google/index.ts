import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/',
  passport.authenticate('google', {
    failureRedirect: '/',
    scope: 'email profile',
    session: true,
  }),
);
router.get(
  '/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: true,
  }),
  (_, res) => {
    res.redirect('http://localhost:3000/');
  },
);
router.post(
  '/token',
  passport.authenticate('google-verify-token'),
  (req, res) => {
    res.sendStatus(req.user ? 200 : 401);
  },
);

export default router;
