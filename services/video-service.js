var mysql = require('mysql2');
var pool = null;

module.exports = {

  init: function(dbConfig) {
    pool = mysql.createPool({
      host: dbConfig.get('host'),
      port: dbConfig.get('port'),
      connectionLimit: dbConfig.get('connectionLimit'),
      user: dbConfig.get('user'),
      password: dbConfig.get('password'),
      database: 'videodb',
      supportBigNumbers: true,
//      debug: true,
      charset: 'utf8_unicode_ci'
    });
    return this;
  },

  formatMultipleNames: function(rawNameString) {
    var pattern = /\s*,\s*/;
    var nameList = rawNameString.split(pattern);
    var formattedNameString = '';
    nameList.forEach(function(currentName) {
      if (formattedNameString.length > 0 && currentName.length > 0) {
        formattedNameString += ',';
      }
      if (currentName.length > 0) {
        formattedNameString += currentName;
      }
    });
    return formattedNameString;
  },

  createVideo: function(title, description, producers, actors, callback) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL createVideo(?,?,?,?)', [title, description, producers, actors], function(err, results) {
        if (err) throw err;
        connection.release();
        callback(results[0][0].id);
      });
    });
  },
  
  fixCommas: function(results) {
    results.forEach(function(currentVideo) {
      if (currentVideo.producers) {
        currentVideo.producers = currentVideo.producers.replace(/,/g, ', ');
      }
      if (currentVideo.actors) {
        currentVideo.actors = currentVideo.actors.replace(/,/g, ', ');
      }
    });
  },

  listVideos: function(pageNum, callback) {
    var self = this;
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL readVideos(?)', [pageNum], function(err, results) {
        if (err) throw err;
        connection.release();
        self.fixCommas(results[0]);
        callback(results[0]);
      });
    });
  },

  listVideosByActor: function(actorName, pageNum, callback) {
    var self = this;
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL readVideosByActor(?,?)', [actorName, pageNum], function(err, results) {
        if (err) throw err;
        connection.release();
        self.fixCommas(results[0]);
        if (results[0][0]) {
          results[0][0].pages = results[1][0].pages; // Append the number of pages
        }
        callback(results[0]);
      });
    });
  },

  getVideo: function(videoId, callback) {
    var self = this;
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL getVideo(?)', [videoId], function(err, results) {
        if (err) throw err;
        connection.release();
        self.fixCommas(results[0]);
        callback(results[0]);
      });
    });
  },

  updateVideo: function(videoId, title, description, producerNames, actorNames, callback) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL updateVideo(?,?,?,?,?)', [videoId, title, description, producerNames, actorNames], function(err) {
        if (err) throw err;
        connection.release();
        callback();
      });
    });
  },

  deleteVideo: function(videoId, callback) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL deleteVideo(?)', [videoId], function(err) {
        if (err) throw err;
        connection.release();
        callback();
      });
    });
  },

  shutDown: function() {
    pool.end();
  }

};