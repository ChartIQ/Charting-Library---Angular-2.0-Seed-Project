import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class ConfigService {
	symbol = 'APPL';

	layout = {
		periodicity: 1,
		interval: 1,
		timeUnit: 'day',
	};

	refreshInterval = 0;
	showTooltip = true;

	periodicityOptions: Array<{
		period: number;
		interval: number;
		timeUnit: string;
		label: string;
	}> = [
		{
			period: 1,
			interval: 1,
			timeUnit: 'minute',
			label: '1 Min',
		},
		{
			period: 1,
			interval: 3,
			timeUnit: 'minute',
			label: '3 Min',
		},
		{
			period: 1,
			interval: 5,
			timeUnit: 'minute',
			label: '5 Min',
		},
		{
			period: 1,
			interval: 10,
			timeUnit: 'minute',
			label: '10 Min',
		},
		{
			period: 3,
			interval: 5,
			timeUnit: 'minute',
			label: '15 Min',
		},
		{
			period: 1,
			interval: 30,
			timeUnit: 'minute',
			label: '30 Min',
		},
		{
			period: 2,
			interval: 30,
			timeUnit: 'minute',
			label: '1 Hour',
		},
		{
			period: 8,
			interval: 30,
			timeUnit: 'minute',
			label: '4 Hour',
		},
		{
			period: 1,
			interval: 1,
			timeUnit: 'day',
			label: '1 Day',
		},
		{
			period: 2,
			interval: 1,
			timeUnit: 'day',
			label: '2 Day',
		},
		{
			period: 3,
			interval: 1,
			timeUnit: 'day',
			label: '3 Day',
		},
		{
			period: 5,
			interval: 1,
			timeUnit: 'day',
			label: '5 Day',
		},
		{
			period: 10,
			interval: 1,
			timeUnit: 'day',
			label: '10 Day',
		},
		{
			period: 20,
			interval: 1,
			timeUnit: 'day',
			label: '20 Day',
		},
		{
			period: 1,
			interval: 1,
			timeUnit: 'week',
			label: '1 Wk',
		},
		{
			period: 1,
			interval: 1,
			timeUnit: 'month',
			label: '1 Mon',
		},
	];

	chartTypes: Array<any> = [
		{
			type: 'bar',
			label: 'bar',
		},
		{
			type: 'candle',
			label: 'candle',
		},
		{
			type: 'colored_bar',
			label: 'colored bar',
		},
		{
			type: 'hollow_candle',
			label: 'hollow candle',
		},
		{
			type: 'line',
			label: 'line',
		},
		{
			type: 'mountain',
			label: 'mountain',
		},
		{
			type: 'volume_candle',
			label: 'volume candle',
		},
		{
			type: 'heikinashi',
			label: 'Heikin-Ashi',
		},
		{
			type: 'kagi',
			label: 'kagi',
			aggregationEdit: {
				title: 'Set Reversal Percentage',
				inputs: [
					{
						lookup: 'kagi',
						label: 'kagi',
					},
				],
			},
		},
		{
			type: 'linebreak',
			label: 'line break',
			aggregationEdit: {
				title: 'Set Price Lines',
				inputs: [
					{
						lookup: 'priceLines',
						label: 'price line',
					},
				],
			},
		},
		{
			type: 'renko',
			label: 'renko',
			aggregationEdit: {
				title: 'Set Range',
				inputs: [
					{
						lookup: 'renko',
						label: 'renko',
					},
				],
			},
		},
		{
			type: 'rangebars',
			label: 'range bars',
			aggregationEdit: {
				title: 'Set Range',
				inputs: [
					{
						lookup: 'range',
						label: 'range',
					},
				],
			},
		},
		{
			type: 'pandf',
			label: 'point & figure',
			aggregationEdit: {
				title: 'Set Point & Figure Parameters',
				inputs: [
					{
						lookup: 'pandf.box',
						label: 'box',
					},
					{
						lookup: 'pandf.reversal',
						label: 'reversal',
					},
				],
			},
		},
	];

	themes: any = {
		selected: 'Default',
		list: [
			{
				// the default theme settings
				name: 'Default',
				settings: {
					chart: {
						'Axis Text': { color: 'rgba(197,199,201,1)' },
						Background: { color: 'rgba(28,42,53,1)' },
						'Grid Dividers': { color: 'rgba(37,55,70,1)' },
						'Grid Lines': { color: 'rgba(33,50,63,1)' },
					},
					chartTypes: {
						'Candle/Bar': {
							down: {
								border: 'rgba(227,70,33,1)',
								color: 'rgba(184,44,12,1)',
								wick: 'rgba(255,255,255,1)',
							},
							up: {
								border: 'rgba(184,222,168,1)',
								color: 'rgba(140,193,118,1)',
								wick: 'rgba(255,255,255,1)',
							},
						},
						Line: { color: 'rgba(0,0,0,1)' },
						Mountain: { color: 'rgba(102,202,196,0.498039)' },
					},
				},
			},
			{ name: '+ New Theme' },
		],
	};

	colorPickerColors: string[] = [
		'ffffff',
		'ffd0cf',
		'ffd9bb',
		'fff56c',
		'eaeba3',
		'd3e8ae',
		'adf3ec',
		'ccdcfa',
		'd9c3eb',
		'efefef',
		'eb8b87',
		'ffb679',
		'ffe252',
		'e2e485',
		'c5e093',
		'9de3df',
		'b1c9f8',
		'c5a6e1',
		'cccccc',
		'e36460',
		'ff9250',
		'ffcd2b',
		'dcdf67',
		'b3d987',
		'66cac4',
		'97b8f7',
		'b387d7',
		'9b9b9b',
		'dd3e39',
		'ff6a23',
		'faaf3a',
		'c9d641',
		'8bc176',
		'33b9b0',
		'7da6f5',
		'9f6ace',
		'656565',
		'b82c0b',
		'be501b',
		'e99b54',
		'97a030',
		'699158',
		'00a99d',
		'5f7cb8',
		'784f9a',
		'343434',
		'892008',
		'803512',
		'ab611f',
		'646c20',
		'46603a',
		'007e76',
		'3e527a',
		'503567',
		'000000',
		'5c1506',
		'401a08',
		'714114',
		'333610',
		'222f1d',
		'00544f',
		'1f2a3c',
		'281a33',
	];

	footerSpanSizes: Array<{ label: string; span: number; unit: string }> = [
		{ label: '1D', span: 1, unit: 'today' },
		{ label: '5D', span: 5, unit: 'day' },
		{ label: '1M', span: 1, unit: 'month' },
		{ label: '3M', span: 3, unit: 'month' },
		{ label: 'YTD', span: 5, unit: 'YTD' },
		{ label: '1Y', span: 1, unit: 'year' },
		{ label: '5Y', span: 5, unit: 'year' },
		{ label: 'All', span: 5, unit: 'all' },
	];
}

export function loadConfig(http: HttpClient, config: ConfigService) {
	return () =>
		new Promise<boolean>(resolve => {
			http
				.get('./resources/config.json')
				.pipe(
					map((conf: ConfigService) => {
						Object.assign(config, conf);
						resolve(true);
					}),
					catchError((res: { status: number }) => {
						if (res.status !== 404) {
							resolve(false);
						}
						resolve(true);
						return of({});
					})
				)
				.subscribe();
		});
}
