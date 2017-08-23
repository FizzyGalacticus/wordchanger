class WordField {
	constructor(word, changeTo, matchCase) {
		this.wordContainer = document.createElement('div');
		this.wordField = document.createElement('input');
		this.changeToField = document.createElement('input');
		this.matchCaseLabel = document.createElement('span');
		this.matchCaseCheckbox = document.createElement('input');

		this.word = '';
		this.changeTo = '';
		this.matchCaseLabel.innerHTML = 'Match Case';
		this.matchCase = false;

		this.wordField.type = 'text';
		this.changeToField.type = 'text';
		this.matchCaseCheckbox.type = 'checkbox';

		this.wordField.placeholder = 'Word to change';
		this.changeToField.placeholder = 'Word to change to';
	
		this.wordField.classList.add('wordField');
		this.changeToField.classList.add('changeToField');
		this.matchCaseLabel.classList.add('matchCaseLabel');
		this.matchCaseCheckbox.classList.add('matchCaseCheckbox');

		if(word && changeTo && matchCase !== undefined) {
			this.word = word;
			this.changeTo = changeTo;
			this.matchCase = matchCase;

			this.wordField.value = word;
			this.changeToField.value = changeTo;
			this.matchCaseCheckbox.checked = matchCase;
		}

		this.wordField.onkeyup = (e) => {
			this.word = this.wordField.value;
		};

		this.changeToField.onkeyup = (e) => {
			this.changeTo = this.changeToField.value;
		};

		this.matchCaseCheckbox.onclick = (e) => {
			this.matchCase = this.matchCaseCheckbox.checked;
		};

		WordField.instances.push(this);
	}

	getContainer() {
		let matchCaseContainer = document.createElement('div');
		this.wordContainer.classList.add('wordContainer');
		matchCaseContainer.classList.add('matchCaseContainer');

		this.wordContainer.appendChild(this.wordField);
		this.wordContainer.appendChild(this.changeToField);

		matchCaseContainer.appendChild(this.matchCaseLabel);
		matchCaseContainer.appendChild(this.matchCaseCheckbox);

		this.wordContainer.appendChild(matchCaseContainer);

		return this.wordContainer;
	}

	saveable() {
		return (this.word && this.changeTo && this.word != '' && this.changeTo != '');
	}

	static saveAll() {
		let objs = {'wordchangerextension': []};
		for(let i = 0; i < WordField.instances.length; i++) {
			if(WordField.instances[i].saveable()) {
				let field = WordField.instances[i];
				objs.wordchangerextension.push({
					word:field.word,
					changeTo:field.changeTo,
					matchCase:field.matchCase
				});
			}
		}

		chrome.storage.sync.set(objs);
	}

	static loadAll() {
		chrome.storage.sync.get('wordchangerextension', (objs) => {
			if(objs && objs.wordchangerextension) {
				let objArr = objs.wordchangerextension;
				let container = document.getElementById('container');

				for(let i = 0; i < objArr.length; i++) {
					let obj = objArr[i];
					let field = new WordField(obj.word, obj.changeTo, obj.matchCase);
					container.appendChild(field.getContainer());
				}
			}
		});
	}
}
WordField.instances = [];
WordField.loadAll();

document.getElementById('addFieldButton').onclick = () => {
	let container = document.getElementById('container');
	let field = new WordField();
	container.appendChild(field.getContainer());
};

document.getElementById('saveButton').onclick = () => {
	WordField.saveAll();
};