var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('add', {
    pageTitle: '✧ Polaris - Add Video'
  });
});

module.exports = router;
