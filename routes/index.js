var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Team Notes' });
});

router.get('/about/', function(req, res, next) {
  res.render('about', { title: 'Team Notes2' });
});

router.get('/images/', function(req, res, next) {
  res.render('images', { title: 'Team Notes2' });
});

router.get('/forms/', function(req, res, next) {
  res.render('forms', { title: 'Forms' });
});

module.exports = router;
