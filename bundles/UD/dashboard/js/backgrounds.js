function loadBacks() {
	var length = backgroundSelect.options.length;
	for (let i = length-1; i >= 0; i--) {
		backgroundSelect.options[i].remove();
	}

	let counter = 0;
	backgrounds.value.forEach(function (background) {
		let back = document.createElement("option");
		back.value = background.url;
		back.text = background.name;
		if (0 === counter) {
			back.setAttribute('selected', 'selected');
		}

		backgroundSelect.add(back);
		++counter;
	});

	backgroundSelect.onchange();
}

backgrounds.on('change', (newValue) => {
	loadBacks();
});
