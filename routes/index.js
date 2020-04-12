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

router.post('/', (req, res) => {
  if(!req.body.name || !req.body.email || !req.body.message) {
    return res.render('pages/index');
  }
  console.log('post: /', `Name: ${req.body.name} EMail: ${req.body.email} Message: ${req.body.message}`);
  res.send(`Name: ${req.body.name} EMail: ${req.body.email} Message: ${req.body.message} <a href="/" >Home</a>`);
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

router.post('/admin/upload', (req, res) => {

});

router.post('/admin/skills', (req, res) => {
  if (!req.body.age || !req.body.concerts || !req.body.cities || !req.body.years) {
    return res.render('pages/admin');
  }
  console.log('post: /admin/skills', `2Age: ${req.body.age} Concert: ${req.body.concerts} Cities: ${req.body.cities} Year: ${req.body.years}`);  
  res.render('pages/admin');
});

module.exports = router;