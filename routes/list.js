var express = require('express');
var router = express.Router();
var videoService = null;

router.get('/', function(req, res) {
  videoService.listVideos(1, function(videos) {
    var results = {
      pageTitle: '✧ Polaris - Video List',
      videos: videos,
      previous: 0,
      current: 1,
      next: 2
    };
    res.render('list', results);
  });
});

router.post('/', function(req, res) {
  var pageNumber = Number(req.body.pageNumber);
  if (isNaN(pageNumber) || pageNumber < 1) {
    pageNumber = 1;
  }
  if (req.body.actorName) {
    videoService.listVideosByActor(req.body.actorName, pageNumber, function(videos) {
      var actorResults = {
        pageTitle: '✧ Polaris - Video List',
        videos: videos,
        previous: 0,
        current: 1,
        next: 2,
        actorName: req.body.actorName || ''
      };
      if (req.body.pageChange) {
        actorResults.previous = pageNumber - 1;
        actorResults.current = pageNumber;
        actorResults.next = pageNumber + 1;
        res.send(actorResults);
      } else {
        res.render('list', actorResults);
      }
    });
  } else {
    videoService.listVideos(pageNumber, function (videos) {
      var results = {
        pageTitle: '✧ Polaris - Video List',
        videos: videos,
        previous: pageNumber - 1,
        current: pageNumber,
        next: pageNumber + 1
      };
      res.send(results);
    });
  }
});

module.exports = function(vidService) {
  videoService = vidService;
  return router;
};
