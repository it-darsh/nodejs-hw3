const router = require('express').Router();
const db = require('../db');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const isAdmin = (req, res, next) => {
  if(req.session.isAdmin) {
    return next();
  }
  res.redirect('/login');
};

router.get('/', (req, res) => {
  res.render('pages/index', {social: db.get('social'), skills: db.get('skills'), products: db.get('products')});
});

router.post('/', (req, res) => {
  if(!req.body.name || !req.body.email || !req.body.message) {
    return res.render('pages/index');
  }
  console.log('post: /', `Name: ${req.body.name} EMail: ${req.body.email} Message: ${req.body.message}`);
  res.send(`Name: ${req.body.name} EMail: ${req.body.email} Message: ${req.body.message} <a href="/" >Home</a>`);
});

router.get('/login', (req, res) => {
  if (req.session.isAdmin) {    
    res.redirect('admin');
  }
  res.render('pages/login', {social: db.get('social'), skills: db.get('skills'), products: db.get('products')});
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

router.post('/admin/upload', isAdmin, (req, res) => {
  let form = new formidable.IncomingForm();
  let upload = path.join('./public', 'assets', 'img', 'products')

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload)
  }

  form.uploadDir = path.join(process.cwd(), upload)

  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err)
    }

    const valid = validation(fields, files)

    if (valid.err) {
      fs.unlinkSync(files.photo.path)
      return res.redirect(`/admin?msg=${valid.status}`)
    }

    const fileName = path.join(upload, files.photo.name);

    const validation = (fields, files) => {
      if (files.photo.name === '' || files.photo.size === 0) {
        return { status: 'Не загружена картинка!', err: true };
      }
      if (!fields.name) {
        return { status: 'Не указано описание картинки!', err: true };
      }
      return { status: 'Ok', err: false };
    }

    fs.rename(files.photo.path, fileName, function (err) {
      if (err) {
        console.error(err.message)
        return
      }

      let dir = fileName.substr(fileName.indexOf('\\'))

      db.add('products', {src: dir, name: fields.name, price: fields.price });
      res.redirect('/admin?msg=Картинка успешно загружена')
    })
  })
});

router.post('/admin/skills', isAdmin, (req, res) => {
  const age = (req.body.age) ? req.body.age : undefined;
  const concerts = (req.body.concerts) ? req.body.concerts : undefined;
  const cities = (req.body.cities) ? req.body.cities : undefined;
  const years = (req.body.years) ? req.body.years : undefined;

  if(age || concerts || cities || years) {
    db.set('skills',[age, concerts, cities, years]);
  }
  res.render('pages/admin');
});

module.exports = router;