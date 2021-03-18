function loadBackClips() {
	var length = backgroundClipsSelect.options.length;
	for (let i = length-1; i >= 0; i--) {
		backgroundClipsSelect.options[i].remove();
	}

	let counter = 0;
	backgroundClips.value.forEach(function (background) {
		let back = document.createElement("option");
		back.value = background.url;
		back.text = background.name;
		if (0 === counter) {
			back.setAttribute('selected', 'selected');
		}

		backgroundClipsSelect.add(back);
		++counter;
	});

	backgroundClipsSelect.onchange();
}

backgroundClips.on('change', (newValue) => {
	loadBackClips();
});
