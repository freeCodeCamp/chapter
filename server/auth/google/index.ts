import express from 'express';
import passport from 'passport';

const router = express.Router();

router
  .get(
    '/',
    passport.authenticate('google', {
      failureRedirect: '/',
      scope: 'email profile',
      session: true,
    }),
  )
  .get(
    '/callback',
    passport.authenticate('google', {
      failureRedirect: '/',
      session: true,
    }),
    (req, res) => {
      console.log('GOTHERE! ');
      console.log('req.user ', req.user);
      res.redirect('http://localhost:3000/');
    },
  )
  .post('/token', passport.authenticate('google-verify-token'), (req, res) => {
    console.log(req.user);
    res.sendStatus(req.user ? 200 : 401);
  });

export default router;
