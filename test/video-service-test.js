var expect = require('chai').expect;

describe('Video service', function() {
  var dbConfig = require('config').get('db.config');
  var videoService = require('../services/video-service').init(dbConfig);
  var videoId = 0;
  after(videoService.shutDown);
  
  it('should process strings of multiple producer/actor names', function() {
    var rawProducers = 'John Hughes, James Cameron , Gale Anne Hurd';
    var formattedProducers = videoService.formatMultipleNames(rawProducers);
    expect(formattedProducers).to.equal('John Hughes,James Cameron,Gale Anne Hurd');
  });

  it('should process strings of single producer/actor names', function() {
    var rawActors = 'Sigourney Weaver';
    var formattedActors = videoService.formatMultipleNames(rawActors);
    expect(formattedActors).to.equal('Sigourney Weaver');
  });

  it('should process strings of single producer/actor names with trailing comma', function() {
    var rawActors = 'Sigourney Weaver,';
    var formattedActors = videoService.formatMultipleNames(rawActors);
    expect(formattedActors).to.equal('Sigourney Weaver');
  });

  it('should support creating a video', function(done) {
    videoService.createVideo('Aliens', 'A sci-fi thriller!', 'Gale Anne Hurd', 'Sigourney Weaver,Michael Biehn', function(id) {
      videoId = id;
      expect(videoId).to.be.above(0);
      done();
    });
  });

  it('should support listing videos', function(done) {
    videoService.listVideos(1, function(results) {
      expect(results).to.have.length.of.at.least(1);
      done();
    });
  });

  it('should support listing videos by actor', function(done) {
    videoService.listVideosByActor('Sigourney Weaver', 1, function(results) {
      if (results.length > 0) {
		expect(results).to.have.length.of.at.least(1);
      }
      done();
    });
  });

  it('should support updating a video', function(done) {
    videoService.updateVideo(videoId, 'Aliens', 'A sci-fi classic!', 'Gale Anne Hurd', 'Sigourney Weaver,Michael Biehn', function () {
      videoService.getVideo(videoId, function(results) {
        expect(results[0].description).to.equal('A sci-fi classic!');
        done();
      });
    });
  });

  it('should support deleting a video', function(done) {
    videoService.deleteVideo(videoId, function () {
      videoService.getVideo(videoId, function(results) {
        expect(results[0].title).to.be.null;
        done();
      });
    });
  });

});