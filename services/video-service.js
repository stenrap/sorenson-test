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

  listVideos: function(pageNum, callback) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL readVideos(?)', [pageNum], function(err, results) {
        if (err) throw err;
        connection.release();
        callback(results[0]);
      });
    });
  },

  listVideosByActor: function(actorId, pageNum, callback) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL readVideosByActor(?,?)', [actorId, pageNum], function(err, results) {
        if (err) throw err;
        connection.release();
        callback(results[0]);
      });
    });
  },

  getVideo: function(videoId, callback) {
    pool.getConnection(function(err, connection) {
      if (err) throw err;
      connection.query('CALL getVideo(?)', [videoId], function(err, results) {
        if (err) throw err;
        connection.release();
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