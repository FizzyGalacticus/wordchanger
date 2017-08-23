let getWords = () => {
	return new Promise((response, reject) => {
		chrome.storage.sync.get('wordchangerextension', (objs) => {
			if(objs && objs.wordchangerextension) {
				response(objs.wordchangerextension);
			}
			else reject();
		});
	});
};

let replaceAll = (word, changeTo, matchCase) => {
	let regex = new RegExp(`${word}`, `g${matchCase ? '':'i'}`);
	document.body.innerHTML = document.body.innerHTML.replace(regex, changeTo);
};

let run = async () => {
	let changeWords = await getWords();
	if(changeWords && Array.isArray(changeWords)) {
		for(let i = 0; i < changeWords.length; i++) {
			let instance = changeWords[i];

			replaceAll(instance.word, instance.changeTo, instance.matchCase);
		}
	}
};

run();