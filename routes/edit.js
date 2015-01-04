var express = require('express');
var router = express.Router();
var videoService = null;

router.put('/', function(req, res) {
  var id = req.body.id;
  var title = req.body.title;
  var description = req.body.description;
  var rawProducerString = req.body.producers;
  var rawActorString = req.body.actors;
  if (id && title && description && rawProducerString && rawActorString) {
    var producers = videoService.formatMultipleNames(rawProducerString);
    var actors = videoService.formatMultipleNames(rawActorString);
    videoService.updateVideo(id, title, description, producers, actors, function() {
      res.sendStatus(200);
    });
  }
});

router.delete('/', function(req, res) {
  var id = req.body.id;
  if (id) {
    videoService.deleteVideo(id, function() {
      res.sendStatus(200);
    });
  }
});

module.exports = function(vidService) {
  videoService = vidService;
  return router;
};
