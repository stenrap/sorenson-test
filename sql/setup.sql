/*
	Database creation script for Polaris - a video library programming 
	test created by Rob Johansen for Sorenson Media. See the MySQL
	documentation for information about the privileges needed to
	execute this script (and later the stored procedures herein):

	http://dev.mysql.com/doc/refman/5.6/en/privileges-provided.html

	To start the MySQL daemon:

	/usr/local/Cellar/mysql/5.6.22/bin/mysqld --basedir=/usr/local/Cellar/mysql/5.6.22 --datadir=/usr/local/var/mysql --plugin-dir=/usr/local/Cellar/mysql/5.6.22/lib/plugin --log-error=/usr/local/var/mysql/lightning.local.err --pid-file=/usr/local/var/mysql/lightning.local.pid

	...or...

	/usr/local/opt/mysql/bin/mysqld_safe &
*/
CREATE DATABASE IF NOT EXISTS videodb CHARACTER SET 'utf8' COLLATE 'utf8_general_ci';

DROP TABLE IF EXISTS `videodb`.`video_producer`;
DROP TABLE IF EXISTS `videodb`.`video_actor`;
DROP TABLE IF EXISTS `videodb`.`videos`;
DROP TABLE IF EXISTS `videodb`.`producers`;
DROP TABLE IF EXISTS `videodb`.`actors`;

CREATE TABLE IF NOT EXISTS `videodb`.`videos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `title_index` (`title` ASC));

CREATE TABLE IF NOT EXISTS `videodb`.`producers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `producer_name` (`name` ASC));

CREATE TABLE IF NOT EXISTS `videodb`.`actors` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `actor_name` (`name` ASC));

CREATE TABLE IF NOT EXISTS `videodb`.`video_producer` (
  `video_producer_id` BIGINT UNSIGNED NULL,
  `producer_id` INT UNSIGNED NULL,
  INDEX `fk_video_producer_id_idx` (`video_producer_id` ASC),
  INDEX `fk_producer_id_idx` (`producer_id` ASC),
  CONSTRAINT `fk_video_producer_id`
    FOREIGN KEY (`video_producer_id`)
    REFERENCES `videodb`.`videos` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_producer_id`
    FOREIGN KEY (`producer_id`)
    REFERENCES `videodb`.`producers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE IF NOT EXISTS `videodb`.`video_actor` (
  `video_actor_id` BIGINT UNSIGNED NULL,
  `actor_id` INT UNSIGNED NULL,
  INDEX `fk_video_actor_id_idx` (`video_actor_id` ASC),
  INDEX `fk_actor_id_idx` (`actor_id` ASC),
  CONSTRAINT `fk_video_actor_id`
    FOREIGN KEY (`video_actor_id`)
    REFERENCES `videodb`.`videos` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_actor_id`
    FOREIGN KEY (`actor_id`)
    REFERENCES `videodb`.`actors` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

DROP PROCEDURE IF EXISTS videodb.createProducer;
DELIMITER //
CREATE PROCEDURE videodb.createProducer(prodName VARCHAR(255), OUT prodId INT)
	BEGIN
		START TRANSACTION;
			SET @producerId = NULL;
			SET @producerName = prodName;
			SET @producerLookupVar = 'SELECT id INTO @producerId FROM producers WHERE LOWER(name) = LOWER(?)';
			PREPARE producerLookupStmt FROM @producerLookupVar;
			EXECUTE producerLookupStmt USING @producerName;
			DEALLOCATE PREPARE producerLookupStmt;

			IF @producerId IS NULL THEN
				SET @producerInsertVar = 'INSERT INTO videodb.producers VALUES(?,?)';
				PREPARE producerInsertStmt FROM @producerInsertVar;
				EXECUTE producerInsertStmt USING @producerId, @producerName;
				DEALLOCATE PREPARE producerInsertStmt;
				SET @producerId = LAST_INSERT_ID();
			END IF;
		COMMIT;
		SET prodId = @producerId;
	END
	//
DELIMITER ;

DROP PROCEDURE IF EXISTS videodb.createActor;
DELIMITER //
CREATE PROCEDURE videodb.createActor(actName VARCHAR(255), OUT actId INT)
	BEGIN
		START TRANSACTION;
			SET @actorId = NULL;
			SET @actorName = actName;
			SET @actorLookupVar = 'SELECT id INTO @actorId FROM actors WHERE LOWER(name) = LOWER(?)';
			PREPARE actorLookupStmt FROM @actorLookupVar;
			EXECUTE actorLookupStmt USING @actorName;
			DEALLOCATE PREPARE actorLookupStmt;

			IF @actorId IS NULL THEN
				SET @actorInsertVar = 'INSERT INTO videodb.actors VALUES(?,?)';
				PREPARE actorInsertStmt FROM @actorInsertVar;
				EXECUTE actorInsertStmt USING @actorId, @actorName;
				DEALLOCATE PREPARE actorInsertStmt;
				SET @actorId = LAST_INSERT_ID();
			END IF;
		COMMIT;
		SET actId = @actorId;
	END
	//
DELIMITER ;

DROP PROCEDURE IF EXISTS videodb.createVideoProducer;
DELIMITER //
CREATE PROCEDURE videodb.createVideoProducer(vidId BIGINT, prodId INT)
	BEGIN
		SET @videoId = vidId;
		SET @producerId = prodId;
		SET @videoProducerInsertVar = 'INSERT INTO videodb.video_producer VALUES(?,?)';
		PREPARE videoProducerInsertStmt FROM @videoProducerInsertVar;
		EXECUTE videoProducerInsertStmt USING @videoId, @producerId;
		DEALLOCATE PREPARE videoProducerInsertStmt;
	END
	//
DELIMITER ;

DROP PROCEDURE IF EXISTS videodb.createVideoActor;
DELIMITER //
CREATE PROCEDURE videodb.createVideoActor(vidId BIGINT, actId INT)
	BEGIN
		SET @videoId = vidId;
		SET @actorId = actId;
		SET @videoActorInsertVar = 'INSERT INTO videodb.video_actor VALUES(?,?)';
		PREPARE videoActorInsertStmt FROM @videoActorInsertVar;
		EXECUTE videoActorInsertStmt USING @videoId, @actorId;
		DEALLOCATE PREPARE videoActorInsertStmt;
	END
	//
DELIMITER ;

DROP PROCEDURE IF EXISTS videodb.createVideo;
DELIMITER //
CREATE PROCEDURE videodb.createVideo(vidTitle VARCHAR(255), vidDescription VARCHAR(500), producerArray VARCHAR(500), actorArray VARCHAR(500))
	BEGIN
		START TRANSACTION;
			SET @videoInsertVar = 'INSERT INTO videodb.videos VALUES(?, ?, ?)';
			SET @videoId = NULL;
			SET @videoTitle = vidTitle;
			SET @videoDescription = vidDescription;
			PREPARE videoInsertStmt FROM @videoInsertVar;
			EXECUTE videoInsertStmt USING @videoId, @videoTitle, @videoDescription;
			DEALLOCATE PREPARE videoInsertStmt;
			SET @videoId = LAST_INSERT_ID();

			SET @separator = ',';
			SET @separatorLength = CHAR_LENGTH(@separator);

			WHILE producerArray != '' > 0 DO
				BEGIN
					SET @producerId = NULL;
					SET @producerName = SUBSTRING_INDEX(producerArray, @separator, 1);

					CALL videodb.createProducer(@producerName, @producerId);
					CALL videodb.createVideoProducer(@videoId, @producerId);

					SET producerArray = SUBSTRING(producerArray, CHAR_LENGTH(@producerName) + @separatorLength + 1);
				END;
			END WHILE;

			WHILE actorArray != '' > 0 DO
				BEGIN
					SET @actorId = NULL;
					SET @actorName = SUBSTRING_INDEX(actorArray, @separator, 1);

					CALL videodb.createActor(@actorName, @actorId);
					CALL videodb.createVideoActor(@videoId, @actorId);

					SET actorArray = SUBSTRING(actorArray, CHAR_LENGTH(@actorName) + @separatorLength + 1);
				END;
			END WHILE;
			SELECT MAX(id) as id FROM videodb.videos;
		COMMIT;
	END
	//
DELIMITER ;

DROP PROCEDURE IF EXISTS videodb.readVideos;
DELIMITER //
CREATE PROCEDURE videodb.readVideos(pgNum INT)
	BEGIN
		SET @pageNumber = (pgNum - 1) * 10;
		SET @videoSelectVar = CONCAT('SELECT DISTINCT v.id AS videoId, v.title, v.description, GROUP_CONCAT(DISTINCT p.name) AS producers, GROUP_CONCAT(DISTINCT a.name) AS actors, (SELECT CEIL(COUNT(*) / 10) FROM videos) AS pages ',
		                             'FROM videodb.videos v ',
		                             'JOIN videodb.video_producer vp ON vp.video_producer_id = v.id ',
		                             'JOIN videodb.video_actor va ON va.video_actor_id = v.id ',
		                             'JOIN videodb.producers p ON p.id = vp.producer_id ',
		                             'JOIN videodb.actors a ON a.id = va.actor_id ',
		                             'GROUP BY v.id ',
		                             'ORDER BY v.title ASC ',
		                             'LIMIT ?, 10');
		PREPARE videoSelectStmt FROM @videoSelectVar;
		EXECUTE videoSelectStmt USING @pageNumber;
		DEALLOCATE PREPARE videoSelectStmt;
	END
	//
DELIMITER ;
/*
mysql> CALL readVideos(2);
+---------+----------------+--------------------+---------------------------+--------------------------------+
| videoId | title          | description        | producer                  | actor                          |
+---------+----------------+--------------------+---------------------------+--------------------------------+
|      11 | Aliens         | A sci-fi thriller! | Gale Anne Hurd            | Michael Biehn,Sigourney Weaver |
|      13 | Breakfast Club | A real thriller.   | John Hughes,James Cameron | Sigourney Weaver,Michael Biehn |
|      12 | Ghostbusters   | A real thriller.   | John Hughes,James Cameron | Sigourney Weaver,Michael Biehn |
+---------+----------------+--------------------+---------------------------+--------------------------------+
*/

DROP PROCEDURE IF EXISTS videodb.readVideosByActor;
DELIMITER //
CREATE PROCEDURE videodb.readVideosByActor(actId INT, pgNum INT)
	BEGIN
		SET @actorId = actId;
		SET @pageNumber = (pgNum - 1) * 10;
		SET @videoSelectVar = CONCAT('SELECT v.id, v.title ',
		                             'FROM videodb.actors a ',
		                             'JOIN videodb.video_actor va ON va.actor_id = a.id ',
		                             'JOIN videodb.videos v ON v.id = va.video_actor_id ',
		                             'WHERE a.id = ? ',
		                             'ORDER BY v.title ASC ',
		                             'LIMIT ?, 10');
		PREPARE videoSelectStmt FROM @videoSelectVar;
		EXECUTE videoSelectStmt USING @actorId, @pageNumber;
		DEALLOCATE PREPARE videoSelectStmt;
	END
	//
DELIMITER ;
/*
+----+------------+
| id | title      |
+----+------------+
|  1 | Aliens     |
|  2 | Terminator |
+-----------------+
*/

DROP PROCEDURE IF EXISTS videodb.getVideo;
DELIMITER //
CREATE PROCEDURE videodb.getVideo(vidId BIGINT)
	BEGIN
		SET @videoId = vidId;
		SET @videoSelectVar = CONCAT('SELECT DISTINCT v.id AS videoId, v.title, v.description, GROUP_CONCAT(DISTINCT p.name) AS producers, GROUP_CONCAT(DISTINCT a.name) AS actors ',
		                             'FROM videodb.videos v ',
		                             'JOIN videodb.video_producer vp ON vp.video_producer_id = v.id ',
		                             'JOIN videodb.video_actor va ON va.video_actor_id = v.id ',
		                             'JOIN videodb.producers p ON p.id = vp.producer_id ',
		                             'JOIN videodb.actors a ON a.id = va.actor_id ',
		                             'WHERE v.id = ?');
		PREPARE videoSelectStmt FROM @videoSelectVar;
		EXECUTE videoSelectStmt USING @videoId;
		DEALLOCATE PREPARE videoSelectStmt;
	END
	//
DELIMITER ;

DROP PROCEDURE IF EXISTS videodb.updateVideo;
DELIMITER //
CREATE PROCEDURE videodb.updateVideo(vidId BIGINT, vidTitle VARCHAR(255), vidDescription VARCHAR(500), producerNames VARCHAR(500), actorNames VARCHAR(500))
	BEGIN
		START TRANSACTION;
			SET @videoUpdateVar = 'UPDATE videodb.videos SET title = ?, description = ? WHERE id = ?';
			SET @videoTitle = vidTitle;
			SET @videoDescription = vidDescription;
			SET @videoId = vidId;
			PREPARE videoUpdateStmt FROM @videoUpdateVar;
			EXECUTE videoUpdateStmt USING @videoTitle, @videoDescription, @videoId;
			DEALLOCATE PREPARE videoUpdateStmt;

			SET @deleteVideoProducerVar = 'DELETE FROM videodb.video_producer WHERE video_producer_id = ?';
			PREPARE deleteVideoProducerStmt FROM @deleteVideoProducerVar;
			EXECUTE deleteVideoProducerStmt USING @videoId;
			DEALLOCATE PREPARE deleteVideoProducerStmt;

			SET @deleteVideoActorVar = 'DELETE FROM videodb.video_actor WHERE video_actor_id = ?';
			PREPARE deleteVideoActorStmt FROM @deleteVideoActorVar;
			EXECUTE deleteVideoActorStmt USING @videoId;
			DEALLOCATE PREPARE deleteVideoActorStmt;

			SET @separator = ',';
			SET @separatorLength = CHAR_LENGTH(@separator);

			WHILE producerNames != '' > 0 DO
				BEGIN
					SET @producerId = NULL;
					SET @producerName = SUBSTRING_INDEX(producerNames, @separator, 1);

					CALL videodb.createProducer(@producerName, @producerId);
					CALL videodb.createVideoProducer(@videoId, @producerId);

					SET producerNames = SUBSTRING(producerNames, CHAR_LENGTH(@producerName) + @separatorLength + 1);
				END;
			END WHILE;

			WHILE actorNames != '' > 0 DO
				BEGIN
					SET @actorId = NULL;
					SET @actorName = SUBSTRING_INDEX(actorNames, @separator, 1);

					CALL videodb.createActor(@actorName, @actorId);
					CALL videodb.createVideoActor(@videoId, @actorId);

					SET actorNames = SUBSTRING(actorNames, CHAR_LENGTH(@actorName) + @separatorLength + 1);
				END;
			END WHILE;
		COMMIT;
	END
	//
DELIMITER ;

DROP PROCEDURE IF EXISTS videodb.deleteVideo;
DELIMITER //
CREATE PROCEDURE videodb.deleteVideo(vidId BIGINT)
	BEGIN
		SET @videoId = vidId;
		SET @videoDeleteVar = 'DELETE FROM videodb.videos WHERE id = ?';
		PREPARE videoDeleteStmt FROM @videoDeleteVar;
		EXECUTE videoDeleteStmt USING @videoId;
		DEALLOCATE PREPARE videoDeleteStmt;
	END
	//
DELIMITER ;
