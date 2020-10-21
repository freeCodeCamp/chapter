import express from 'express';

const router = express.Router();

// add { credentials: 'include' } into fetch request for this endpoint to work
router
  .get('/is-authed', (req, res) => {
    return res.send({ isAuth: req.isAuthenticated() });
  })
  .get('/logout', (req, res) => {
    req.logout();
    return res.redirect('http://localhost:3000/');
  });

export default router;
