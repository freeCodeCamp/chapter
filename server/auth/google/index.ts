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
  );

export default router;
