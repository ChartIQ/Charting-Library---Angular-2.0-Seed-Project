import { Component, Output, EventEmitter } from '@angular/core';
import { CIQ } from 'chartiq';

@Component({
	selector: 'study-dialog',
	templateUrl: './study.dialog.component.html',
})
export class StudyDialog {
	studyHelper: any = {};
	inputs: any = [];
	outputs: any;
	parameters: any;
	studyId: any;
	studyName: any;
	activeOutput: any = {};
	@Output() launchDialog = new EventEmitter<any>();
	@Output() launchColorpickerEvent = new EventEmitter<any>();
	@Output() launchOverlayMenu = new EventEmitter<any>();

	addStudy(study, ciq) {
		var self = this;
		var closure = function(fc) {
			return function() {
				fc.apply(self, arguments);
			};
		};
		ciq.callbacks.studyOverlayEdit = closure(this.showMenu);
		ciq.callbacks.studyPanelEdit = closure(this.showDialog);
		CIQ.Studies.addStudy(ciq, study);
	}
	showMenu = function() {
		this.launchOverlayMenu.emit({
			sd: arguments[0].sd,
			ciq: arguments[0].stx,
		});
	};
	showDialog = function({ sd, stx }) {
		this.studyHelper = new CIQ.Studies.DialogHelper({ sd, stx });

		this.inputs = this.studyHelper.inputs;
		this.outputs = this.studyHelper.outputs;
		this.parameters = this.studyHelper.parameters;
		this.studyId = this.studyHelper.name;
		this.studyName = this.studyHelper.title;
		this.launchDialog.emit(true);
	};

	updateStudyHelperColors(color, { name }) {
		const matchName = el => el.name === name;
		const output = this.studyHelper.outputs.find(matchName);
		const parameter = this.studyHelper.parameters.find(matchName);

		if (output) {
			output.color = '#' + color;
		}
		if (parameter) {
			parameter.color = '#' + color;
		}
	}

	launchColorpicker(setting, { target: swatch }) {
		this.launchColorpickerEvent.emit({
			swatch,
			setting,
		});
	}

	setColorFromPicker({ color, source, params }) {
		this.updateStudyHelperColors(color, params);
		source.style.backgroundColor = CIQ.hexToRgba('#' + color);
	}

	removeStudy = function(args) {
		CIQ.Studies.removeStudy(args.stx, args.sd);
	};

	closeMe = function() {
		this.launchDialog.emit(false);
	};

	updateStudy = function(inputs, outputs, params) {
		var currentInputs = {};
		var currentOutputs = {};
		var currentParams = {};
		for (var i = 0; i < inputs.length; i++) {
			currentInputs[inputs[i].name] = inputs[i].value;
		}
		for (var x = 0; x < outputs.length; x++) {
			currentOutputs[outputs[x].name] = outputs[x].color;
		}
		for (var y = 0; y < params.length; y++) {
			if (params[y].name == 'studyOverZones') {
				currentParams[params[y].name + 'Enabled'] = params[y].value;
			} else {
				currentParams[params[y].name + 'Value'] = params[y].value;
				currentParams[params[y].name + 'Color'] = params[y].color;
			}
		}

		this.studyHelper.updateStudy({
			inputs: currentInputs,
			outputs: currentOutputs,
			parameters: currentParams,
		});
	};
}
