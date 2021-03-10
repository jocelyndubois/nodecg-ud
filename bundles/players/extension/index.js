const {OBSUtility} = require('nodecg-utility-obs');
const axios = require('axios');

module.exports = nodecg => {
	const obs = new OBSUtility(nodecg);

	obs.replicants.previewScene.on('change', () => {console.log('slip')});

	nodecg.listenFor('loadRTMP', async query => {
		try {
			await obs.send("SetSourceSettings", {
				sourceName: 'player-' + query.id + '-rtmp',
				sourceSettings: {
					is_local_file: false,
					input: "rtmp://stream.ultimedecathlon.com/stream/" + query.runner,
				},
			});
		} catch (error) {
			nodecg.log.error(error);
		}
	});

	const fetchPbListReplicant = nodecg.Replicant('fetchPbList');
	nodecg.listenFor('fetchPBList', async query => {
		try {
			let results = {};

			for (const [key, player] of Object.entries(query.players)) {
				const apiResponse = await axios.get('https://www.ultimedecathlon.com/graphql', {
					params: {
						query: 'query AllPBs {  userCardInformations(season: ' + query.season + ', username: "' + player + '", showEmptyPb: true) {    pbList {      game {        name        groupment      }      time      score    }  }}'
					}
				});


				apiResponse.data.data.userCardInformations.pbList.forEach(function(PB){
					if (query.game == PB.game.name) {
						if (!results[key]) {
							results[key] = {};
						}


						if ('grind' == PB.game.groupment || 'light' == PB.game.groupment) {
							nodecg.log.info(`[${query.game}]Found light PB. Score : ${PB.score}. Time: ${PB.time}`);
							results[key].light = {
								score: PB.score ?? 0,
								time: PB.time
							}
						} else if ('race' == PB.game.groupment || 'dark' == PB.game.groupment) {
							console.log(PB.score);

							nodecg.log.info(`[${query.game}]Found dark PB. Score : ${PB.score}. Time: ${PB.time}`);
							results[key].dark = {
								score: PB.score ?? 0,
								time: PB.time
							}
						}


					}
				})
			}

			fetchPbListReplicant.value = results;
		} catch (error) {
			nodecg.log.error(error);
		}
	});


	const fetchGamesListReplicant = nodecg.Replicant('fetchGamesList');
	nodecg.listenFor('fetchGamesList', async query => {
		try {
			let results = [];

			let groupment = 'grind';
			if (9 === query) {
				groupment = 'light';
			}

			const apiResponse = await axios.get('https://www.ultimedecathlon.com/graphql', {
				params: {
					query: 'query getGames {  activeSeasonGames (season: ' + query + ', groupment: "' + groupment + '") {    name  }}'
				}
			});


			apiResponse.data.data.activeSeasonGames.forEach(function(game){
				results.push(game.name);
			})

			fetchGamesListReplicant.value = results;
		} catch (error) {
			nodecg.log.error(error);
		}
	});


	const gameInfos = nodecg.Replicant('getGameInfos');
	nodecg.listenFor('getGameInfos', async query => {
		try {
			let gameResult = {};

			let apiResponseLight = await axios.get('https://www.ultimedecathlon.com/graphql', {
				params: {
					query: 'query slip {  activeSeasonGames(season: ' + query.season + ', groupment: ' + (query.season == 9 ? "light" : "grind") + ') {    id    name    category  minScore maxScore    bestTime    middleTime    fewestTime    groupment    twitchName    hexColor    pathInformation {      path      width    }  }}'
				}
			});
			gameResult = aggregateGameInfos(query, apiResponseLight.data.data.activeSeasonGames, gameResult);

			let apiResponseDark = await axios.get('https://www.ultimedecathlon.com/graphql', {
				params: {
					query: 'query slip {  activeSeasonGames(season: ' + query.season + ', groupment: ' + (query.season == 9 ? 'dark' : 'race') + ') {    id    name    category  minScore maxScore   bestTime    middleTime    fewestTime    groupment    twitchName    hexColor    pathInformation {      path      width    }  }}'
				}
			});
			gameResult = aggregateGameInfos(query, apiResponseDark.data.data.activeSeasonGames, gameResult);

			gameInfos.value = gameResult;
		} catch (error) {
			nodecg.log.error(error);
		}
	});


	function aggregateGameInfos(query, games, gameResult) {
		games.forEach(function(game){
			if (query.game === game.name) {
				gameResult.name = game.name;
				gameResult.hexColor = game.hexColor;
				gameResult.pathInformation = {
					path: game.pathInformation.path,
					width: game.pathInformation.width
				};

				if ('light' === game.groupment || 'grind' === game.groupment) {
					gameResult.light = {
						category: game.category,
						bestTime: game.bestTime,
						middleTime: game.middleTime,
						fewestTime: game.fewestTime,
						minScore: game.minScore,
						maxScore: game.maxScore,
					}
				} else {
					gameResult.dark = {
						category: game.category,
						bestTime: game.bestTime,
						middleTime: game.middleTime,
						fewestTime: game.fewestTime,
						minScore: game.minScore,
						maxScore: game.maxScore,
					}
				}
			}
		})

		return gameResult;
	}
}
