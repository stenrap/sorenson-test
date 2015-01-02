var express = require('express');
var router = express.Router();
var videoService = null;

router.get('/', function(req, res) {
  var results = {pageTitle: '✧ Polaris - Video List', videos: [], previous: 0, next: 2};
  videoService.listVideos(1, function(videos) {
    results.videos = videos;
    res.render('list', results);
  });
});

router.post('/', function(req, res) {
  var title = req.body.title;
  var description = req.body.description;
  var rawProducerString = req.body.producers;
  var rawActorString = req.body.actors;
  var result = {pageTitle: '✧ Polaris - Add Video'};
  if (title && description && rawProducerString && rawActorString) {
    var producers = videoService.formatMultipleNames(rawProducerString);
    var actors = videoService.formatMultipleNames(rawActorString);
    videoService.createVideo(title, description, producers, actors, function(videoId) {
      result.videoId = videoId;
      res.render('add', result);
    });
  } else {
    res.render('add', result);
  }
});

module.exports = function(vidService) {
  videoService = vidService;
  return router;
};
