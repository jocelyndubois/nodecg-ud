function updateScore(time) {
	let categories = [];
	if ('both' === chrono.dataset.category) {
		categories = ['light', 'dark'];
	} else {
		categories = [chrono.dataset.category];
	}
	categories.forEach(function (category) {
		let scoreSpan = getScoreSpan(category);

		let timeInSec = time / 1000;
		let maxScore = chrono.dataset.maxScore
			? chrono.dataset.maxScore
			: maxSeasonTimes[season.value];

		let score = calcScore(
			timeInSec,
			scoreSpan.dataset.bestTime,
			scoreSpan.dataset.middleTime,
			scoreSpan.dataset.minScore,
			scoreSpan.dataset.maxScore,
			maxScore,
		);

		if (String(score) !== scoreSpan.innerHTML) {
			if (0 === parseInt(score)) {
				scoreSpan.innerHTML = String('-');
			} else {
				scoreSpan.innerHTML = String(score);
			}
		}

		if (
			parseInt(score) === 1 ||
			parseInt(score) ===
			parseInt(scoreSpan.dataset.minScore)
		) {
			scoreSpan.classList.add('blink');
		} else {
			scoreSpan.classList.remove('blink');
		}
	});
}

function calcScore(
	time,
	bestTime,
	middleTime,
	minScore,
	maxScore,
	capGame,
) {
	time = parseInt(time);
	bestTime = parseInt(bestTime);
	middleTime = parseInt(middleTime);
	let timeCoeff = 2;

	let totalDiffTime =
		bestTime - (bestTime + (middleTime - bestTime) * 2);

	let score = Math.min(
		capGame,
		Math.max(
			Math.floor(
				100 *
				(timeCoeff -
					((bestTime - time) / totalDiffTime) *
					timeCoeff),
			),
			0,
		),
	);

	if (score < 100) {
		let diffBetweenHundedAndTwoHundred =
			middleTime - bestTime;
		let p_high =
			100 /
			Math.pow(
				2,
				Math.floor(
					(time - middleTime) /
					diffBetweenHundedAndTwoHundred,
				),
			);

		score = Math.floor(
			p_high -
			(p_high / 2) *
			((time - middleTime) /
				diffBetweenHundedAndTwoHundred -
				Math.floor(
					(time - middleTime) /
					diffBetweenHundedAndTwoHundred,
				)),
		);
	}

	if ('' !== minScore && score < parseInt(minScore)) {
		score = 0;
	}
	if (maxScore) {
		score = Math.min(score, parseInt(maxScore));
	}

	return score;
}
