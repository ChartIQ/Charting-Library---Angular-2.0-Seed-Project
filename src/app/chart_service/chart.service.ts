import { CIQ } from 'chartiq';
import { quoteFeedSimulator } from 'chartiq/examples/feeds/quoteFeedSimulator';

export class ChartService {
	constructor() {
		// To implement your own quotefeed and see other methods of data loading, check out our tutorial: http://documentation.chartiq.com/tutorial-Data%20Loading.html
		CIQ.QuoteFeed.MyFeed = function(url) {
			this.url = url;
		};

		// Inherit from the base feed
		CIQ.QuoteFeed.MyFeed.ciqInheritsFrom(CIQ.QuoteFeed);
	}

	attachQuoteFeed(chart): void {
		chart.attachQuoteFeed(quoteFeedSimulator, { refreshInterval: 1 });
	}
}
