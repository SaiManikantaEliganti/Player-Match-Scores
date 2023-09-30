const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const databasePath = path.join(__dirname, "cricketMatchDetails.db");
const app = express();
app.use(express.json());
Db = null;
const initializeDbandServer = async () => {
  try {
    let Db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3009, () =>
      console.log("server running at https://localhost:3009/")
    );
  } catch (error) {
    console.log(`Db Error: ${error.message}`);
    process.exit(1);
  }
};

app.get("/players/", async (request, resonse) => {
  const getAllPlayersQuery = `SELECT player_id as playerId,
    player_name as palyerName FROM player_details;`;
  const result = await Db.all(getAllPlayersQuery);
  response.send(result);
});

app.get("/players/:playerId/", async (request, resonse) => {
  const { palyerId } = request.params;
  const getPalyerIdQuery = `SELECT * FROM player_details WHERE player_id=${playerId};`;
  const result = await Db.get(getPalyerIdQuery);
  response.send(result);
});

app.put("/players/:playerId/", async (request, resonse) => {
  const { playerName } = request.body;
  const { playerId } = request.params;
  const putUpdateQuery = `UPDATE
    player_details
    SET
    player_name=${playerName}
    WHERE
    player_id=${playerId};`;
  const result = await Db.run(putUpdateQuery);
  response.send("Player Details Updated");
});

app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const getMatchIdQuery = `SELECT * FROM match_details WHERE match_id=${matchId};`;
  const result = await Db.get(getMatchIdQuery);
  response.send(result);
});

app.get("/players/:playerId/matches", async (request, response) => {
  const getMatchesListQuery = `SELECT * FROM match_details;`;
  const result = await Db.get(getMatchesListQuery);
  response.send(result);
});

app.get("/matches/:matchId/players", async (request, response) => {
  const { playerId, playerName } = request.body;
  const { matchId } = request.params;
  const matchQuery = `
    SELECT 
    * 
    FROM 
    player_details 
    NATURAL JOIN
    match_details
    WHERE
    match_id=${matchId};`;
  const result = await Db.get(matchQuery);
  response.send(result);
});

app.get("/players/:playerId/playerScores", async (request, response) => {
  const { playerName, totalScore, totalFours, totalSixes } = request.body;
  const { playerId } = request.params;
  const getStatasticsQuery = `
    SELECT
    player_details.player_id as playerId,
    player_details.player_name as playerName,
    SUM(player_match_score.score)as totalScore,
    SUM(player_match_score.fours)as totalFours,
    SUM(player_match_score.sixes)as totalSixes
    FROM
     player_details INNER JOIN player_match_score ON  player_details.player_id=player_match_score.player_id
     WHERE 
     player_id=${playerId};`;
  const result = await Db.get(getStatasticsQuery);
  response.send(result);
});

module.exports = app;
