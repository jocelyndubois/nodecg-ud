const axios = require('axios');


module.exports = nodecg => {

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

						if ('grind' == PB.game.groupment) {
							nodecg.log.info(`[${query.game}]Found light PB. Score : ${PB.score}. Time: ${PB.time}`);
							results[key].light = {
								score: PB.score,
								time: PB.time
							}
						} else if ('race' == PB.game.groupment) {
							nodecg.log.info(`[${query.game}]Found dark PB. Score : ${PB.score}. Time: ${PB.time}`);
							results[key].dark = {
								score: PB.score,
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

			const apiResponse = await axios.get('https://www.ultimedecathlon.com/graphql', {
				params: {
					query: 'query getGames {  activeSeasonGames (season: ' + query + ', groupment: "grind") {    name  }}'
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

}
