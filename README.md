# ChartIQ Angular Seed Project

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Enabling add-ons](#enabling-add\-ons)
- [Enabling the TFC plug-in](#enabling-the-tfc-plug\-in)
- [Questions and support](#questions-and-support)
- [Contributing to this project](#contributing-to-this-project)

The ChartIQ Angular seed project is a basic build of the ChartIQ library using the Angular 8.0 framework with [Angular CLI](https://cli.angular.io) support.

The project is an example of how to implement the most common user interface elements of the ChartIQ API using native Angular components. The project is a good starting point for developers who want to create a UI entirely in Angular.

For example implementations of full-featured user interfaces built with ChartIQ's web components, see the [chartiq-angular-app](https://github.com/ChartIQ/chartiq-angular-app) project.

## Requirements

- A copy of the ChartIQ library, version 7.5.0 or later.

    If you do not have a copy of the library, please contact your ChartIQ account manager or send an email to [support@chartiq.com](mailto:support@chartiq.com).

## Getting started

To implement this project, do the following:

1. Clone the repository
2. Extract the contents of your zipped ChartIQ library package
3. Copy the tarball (.tgz file) from the extracted library package into the root of this project
4. Run the following commands from the root of the project:
    - `npm install ./chartiq-x.x.x.tgz` to install the charting library
    - `npm install` to install the rest of the dependencies
    - `npm start` to start up the development server
5. Open your browser to [http://localhost:4200](http://localhost:4200) to see the working application

## Enabling add-ons

The ChartIQ library includes a variety of add-ons which enhance the functionality of charts. For example,
the [RangeSlider](https://documentation.chartiq.com/CIQ.RangeSlider.html) add-on enables users to select a range of chart data using an interactive slider.

See the &ldquo;Add-Ons&rdquo; section of the [API Reference](https://documentation.chartiq.com/tutorial-SDK%20API%20Reference.html) for a complete list of add-ons.

### Built-in add-ons

In this seed project, the [RangeSlider](https://documentation.chartiq.com/CIQ.RangeSlider.html) and [Tooltip](https://documentation.chartiq.com/CIQ.Tooltip.html) add-ons are built in. The add-ons are imported dynamically and instantiated in the `toggleRangeSlider` and `addTooltip` methods (respectively) of `ChartService` (see *chart.service.ts*).

The `addTooltip` method is called when the `showTooltip` property of `ConfigService` is true (see *config.service.ts*). The [Tooltip](https://documentation.chartiq.com/CIQ.Tooltip.html) add-on works in conjuction with the chart crosshairs. The add-on creates a tooltip-like display of information for the data point at the crosshairs location. To see the tooltip, enable the chart crosshairs and move your mouse across the chart.

To enable a [RangeSlider](https://documentation.chartiq.com/CIQ.RangeSlider.html), add the following method call to the `createChart` method of `ChartService`:
```ts
this.toggleRangeSlider(true);
```

The call must come after the assignment of the chart engine (`ciq`) to `ChartService`; for example (at the bottom of `createChart`):
```ts
this.ciq = ciq;
this.toggleRangeSlider(true);
```

### All add-ons

Any add-on can be included in your project by doing the following:
1. Import the ChartIQ add-on source files (*chartiq/js/addOns*)
2. Create and initialize an instance of the add-on

For example, the [FullScreen](https://documentation.chartiq.com/CIQ.FullScreen.html) add-on creates a toggle control that enables the chart to occupy the entire display area of a device.

To include the [FullScreen](https://documentation.chartiq.com/CIQ.FullScreen.html) add-on:
1. Add the following static import to the top of *src/app/services/chart.service.ts*:
   ```ts
   import 'chartiq/js/addOns';
   ```

   **Note:** With the static import of *chartiq/js/addOns* added to the file, you could remove the dynamic import statements in the `toggleRangeSlider` and `addTooltip` methods.

2. Add the following constructor function call to the `createChart` method of `ChartService`:
   ```ts
   new CIQ.FullScreen({ stx: ciq });
   ```

   The call must come after the chart engine has been instantiated; for example:
   ```ts
   const ciq = new CIQ.ChartEngine({
       container,
       layout: { periodicity, interval, timeUnit },
   });
   new CIQ.FullScreen({ stx: ciq });
   ```


A control is added to the bottom of the chart, next to the zoom controls (**-**&nbsp;**+**). Select the control to expand (and contract) the chart display.

## Enabling the TFC plug-in

The Trade from the Chart (TFC) plug-in enables users to place trades directly from a ChartIQ chart. The plug-in includes tools for placing market orders, limit and stop orders, and multi-leg orders.

The plug-in is built into this project but is disabled.

To enable the plug-in, uncomment the following lines of code:
- *src/app/app.module.ts*
  - // import { TfcService } from './plugins/tfc.service';
  - // { provide: ITfc, useClass: TfcService },
- *src/styles/scss*
  - // @import '~chartiq/plugins/tfc/tfc.css';

**Note:** Each line of code follows the comment: `// to enable tfc plugin uncomment next line`

Open the Trade from the Chart panel by selecting the TFC control in the upper right corner of the chart.

## Questions and support

- Contact our development support team at [support@chartiq.com](mailto:support@chartiq.com).
- See our SDK documentation at https://documentation.chartiq.com.

## Contributing to this project

Contribute to this project. Fork it and send us a pull request. We'd love to see what you can do with our charting tools!
