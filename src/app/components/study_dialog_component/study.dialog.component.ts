import {
	Component,
	Output,
	EventEmitter,
	OnInit,
	ChangeDetectionStrategy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { ChartService } from 'src/app/services';

@Component({
	selector: 'study-dialog',
	templateUrl: './study.dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyDialog implements OnInit {
	studyHelper: any = {};
	inputs: any = [];
	outputs: any;
	parameters: any;
	studyId: any;
	studyName: any;
	activeOutput: any = {};

	$showDialog: Observable<any>;
	@Output() launchColorpickerEvent = new EventEmitter<any>();

	constructor(private chartService: ChartService) {}

	ngOnInit() {
		const thisDialogOnly = params => !params || params.dialog === 'study';

		this.$showDialog = this.chartService.$dialog.pipe(
			filter(thisDialogOnly),
			tap(params => params && this.showDialog(params))
		);
	}

	addStudy(study) {
		this.chartService.addStudy(study);
	}

	showDialog({ sd }) {
		this.studyHelper = this.chartService.getStudyDialogHelper(sd);

		this.inputs = this.studyHelper.inputs;
		this.outputs = this.studyHelper.outputs;
		this.parameters = this.studyHelper.parameters;
		this.studyId = this.studyHelper.name;
		this.studyName = this.studyHelper.title;
	}

	updateStudyHelperColors(color, { name }) {
		const matchName = el => el.name === name;
		const output = this.studyHelper.outputs.find(matchName);
		const parameter = this.studyHelper.parameters.find(matchName);

		if (output) {
			output.color = color;
		}
		if (parameter) {
			parameter.color = color;
		}
	}

	launchColorpicker(setting, { target: swatch }) {
		const self = this;

		this.chartService.showColorPicker(swatch, color => {
			self.updateStudyHelperColors(color, setting);
			swatch.style.backgroundColor = color;
		});
	}

	setColorFromPicker({ color, source, params }) {
		this.updateStudyHelperColors(color, params);
		source.style.backgroundColor = this.chartService.hexToRgba(color);
	}

	closeMe = function() {
		this.chartService.hideDialog();
	};

	updateStudy = function(inputs, outputs, params) {
		const currentInputs = {};
		const currentOutputs = {};
		const currentParams = {};
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
