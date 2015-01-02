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