const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/admin', (req, res) => {
  res.render('pages/admin');
});

router.post('/login', function(req, res) {
  if (!req.body.password || !req.body.email) {
    return res.send('404');
  }
  // return res.send(`EMail - ${req.body.email} Password: ${req.body.password}`);
  res.redirect('/admin');
});

module.exports = router;