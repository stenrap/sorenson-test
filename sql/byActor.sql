DROP PROCEDURE IF EXISTS videodb.readVideosByActor;
DELIMITER //
CREATE PROCEDURE videodb.readVideosByActor(actorName VARCHAR(500), pgNum INT)
	BEGIN
		SET @actorName = CONCAT('%', actorName, '%');
		SET @pageNumber = (pgNum - 1) * 10;
		SET @videoSelectVar = CONCAT('SELECT DISTINCT SQL_CALC_FOUND_ROWS v.id AS videoId, v.title, v.description, GROUP_CONCAT(DISTINCT p.name) AS producers, GROUP_CONCAT(DISTINCT a.name) AS actors ',
		                             'FROM videodb.videos v ',
		                             'JOIN videodb.video_producer vp ON vp.video_producer_id = v.id ',
		                             'JOIN videodb.video_actor va ON va.video_actor_id = v.id ',
		                             'JOIN videodb.producers p ON p.id = vp.producer_id ',
		                             'JOIN videodb.actors a ON a.id = va.actor_id WHERE a.name LIKE ? ',
		                             'GROUP BY v.id ',
		                             'ORDER BY v.title ASC ',
		                             'LIMIT ?, 10');
		PREPARE videoSelectStmt FROM @videoSelectVar;
		EXECUTE videoSelectStmt USING @actorName, @pageNumber;
		DEALLOCATE PREPARE videoSelectStmt;
		SELECT CEIL(FOUND_ROWS() / 10) AS pages;
	END
	//
DELIMITER ;