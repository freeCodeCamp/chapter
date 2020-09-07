import express from 'express';
import passport from 'passport';

const router = express.Router();

router
  .get(
    '/',
    passport.authenticate('google', {
      failureRedirect: '/',
      scope: 'email',
      session: false,
    }),
  )
  .get(
    '/callback',
    passport.authenticate('google', {
      failureRedirect: '/',
      session: false,
    }),
    (_, res) => {
      // console.log('GOTHERE! ');
      // console.log('req.user ', req.user);
      res.redirect('http://localhost:3000/');
    },
  );

export default router;
