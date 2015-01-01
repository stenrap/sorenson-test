var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('add', {
    pageTitle: '✧ Polaris - Add Video'
  });
});

router.post('/', function(req, res) {
  // Get the params from req.body
  // Validate them
  // Add the new video (you'll need to dependency inject the video-service instance...
  // Render the result...just a simple message
  res.render('add', {
    pageTitle: '✧ Polaris - Add Video'
  });
});

module.exports = router;
