export abstract class ITfc {
	available() {
		return false;
	}

	openPanel(contextContainer, newValue) {}

	loadPlugin(params: { stx: any; context: any }) {
		return Promise.resolve();
	}
}
