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

function fetchRunnersList() {
	nodecg.sendMessage(
		'fetchRunnersList',
		{
			season: season.value
		}
	);
}
