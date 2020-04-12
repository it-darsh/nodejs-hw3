const router = require('express').Router();

const isAdmin = (req, res, next) => {
  if(req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
};

router.get('/', (req, res) => {
  res.render('pages/index');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.post('/login', (req, res) => {
  //проверка связки логин-пароль
  if (!req.body.password || !req.body.email) {
    res.render('pages/login');
  }
  req.session.isAdmin = true;
  res.redirect('/admin');
});

router.get('/admin', isAdmin, (req, res) => {
  res.render('pages/admin');
});

module.exports = router;