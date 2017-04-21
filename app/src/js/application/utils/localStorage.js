export const saveStateToLocalStorage = (state) => {
	let editedState = _.cloneDeep(state);
	delete editedState.assets;
	delete editedState.settings;

	localStorage.setItem('IsoGrid',JSON.stringify(editedState));
}

export const clearLocalStorage = (state) => {
	localStorage.removeItem('IsoGrid');
}