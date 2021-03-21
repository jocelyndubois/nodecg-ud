const season = nodecg.Replicant('season');
const game = nodecg.Replicant('game');

const runnerIdReplicant_1 = nodecg.Replicant('runnerId_1');
const runnerIdReplicant_2 = nodecg.Replicant('runnerId_2');
const runnerIdReplicant_3 = nodecg.Replicant('runnerId_3');
const runnerIdReplicant_4 = nodecg.Replicant('runnerId_4');

const runnerLightScoreReplicant_1 = nodecg.Replicant('runnerLightScore_1');
const runnerLightScoreReplicant_2 = nodecg.Replicant('runnerLightScore_2');
const runnerLightScoreReplicant_3 = nodecg.Replicant('runnerLightScore_3');
const runnerLightScoreReplicant_4 = nodecg.Replicant('runnerLightScore_4');

const runnerLightTimeReplicant_1 = nodecg.Replicant('runnerLightTime_1');
const runnerLightTimeReplicant_2 = nodecg.Replicant('runnerLightTime_2');
const runnerLightTimeReplicant_3 = nodecg.Replicant('runnerLightTime_3');
const runnerLightTimeReplicant_4 = nodecg.Replicant('runnerLightTime_4');

const runnerDarkScoreReplicant_1 = nodecg.Replicant('runnerDarkScore_1');
const runnerDarkScoreReplicant_2 = nodecg.Replicant('runnerDarkScore_2');
const runnerDarkScoreReplicant_3 = nodecg.Replicant('runnerDarkScore_3');
const runnerDarkScoreReplicant_4 = nodecg.Replicant('runnerDarkScore_4');

const runnerDarkTimeReplicant_1 = nodecg.Replicant('runnerDarkTime_1');
const runnerDarkTimeReplicant_2 = nodecg.Replicant('runnerDarkTime_2');
const runnerDarkTimeReplicant_3 = nodecg.Replicant('runnerDarkTime_3');
const runnerDarkTimeReplicant_4 = nodecg.Replicant('runnerDarkTime_4');

const fetchPbListReplicant = nodecg.Replicant('fetchPbList');
const fetchPbAggregatedListReplicant = nodecg.Replicant('fetchPbAggregatedList');
const runnerListReplicant = nodecg.Replicant('runnerList');

const backgrounds = nodecg.Replicant('assets:background');
const background = nodecg.Replicant('background');

const commentatorsReplicant = nodecg.Replicant('commentatorsReplicant');

const backgroundClips = nodecg.Replicant('assets:back-clips');

const clips = nodecg.Replicant('assets:clips');
const clip = nodecg.Replicant('clip');

const gameInfos = nodecg.Replicant('getGameInfos');

const fetchGamesListReplicant = nodecg.Replicant('fetchGamesList');

//[GAMES/SEASON Modifs]
season.on('change', (newSeason) => {
	fetchRunnersList();
});
game.on('change', (newGame) => {
	fetchPBList();
});


function fetchPBList() {
	nodecg.sendMessage(
		'fetchPBList',
		{
			players : {
				1: runnerIdReplicant_1.value,
				2: runnerIdReplicant_2.value,
				3: runnerIdReplicant_3.value,
				4: runnerIdReplicant_4.value,
			},
			game: game.value,
			season: season.value
		}
	);
}

function fetchPBAggregatedList() {
	nodecg.sendMessage(
		'fetchPbAggregatedList',
		{
			players : {
				1: runnerId_1.value,
				2: runnerId_2.value,
				3: runnerId_3.value,
				4: runnerId_4.value,
			},
			game: game.value,
			season: season.value
		}
	);
}

function fetchRunnersList() {
	nodecg.sendMessage(
		'fetchRunnersList',
		{
			season: season.value
		}
	);
}
