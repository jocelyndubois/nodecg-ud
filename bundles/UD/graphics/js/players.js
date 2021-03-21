function updatePlayer(infos)
{
	runnerId.innerText = infos.player.toUpperCase();
	pbScore.innerText = infos.PB.score;
	pbTime.innerText = infos.PB.time;
	if (infos.pronoun) {
		pronoun.innerHTML = infos.pronoun;
		pronoun.classList.remove('hidden')
	} else {
		pronoun.classList.add('hidden')
	}
	playerDiv.classList.remove('hidden');
	PBDiv.classList.remove('hidden');
}

function updatePlayerPseudo(infos)
{
	runnerId.innerText = infos.player.toUpperCase();
	if (infos.pronoun) {
		pronoun.innerHTML = infos.pronoun;
		pronoun.classList.remove('hidden')
	} else {
		pronoun.classList.add('hidden')
	}
	playerDiv.classList.remove('hidden');
	PBDiv.classList.add('hidden');
}

function displayHideCup(infos, id) {
	if (id === infos.player) {
		cup.classList.remove('hide');
	} else {
		cup.classList.add('hide');
	}
}
