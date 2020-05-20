# ChartIQ Angular Seed Project

- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Enabling add-ons](#enabling-add\-ons)
- [Enabling the TFC plug-in](#enabling-the-tfc-plug\-in)
- [Questions and support](#questions-and-support)
- [Contributing to this project](#contributing-to-this-project)

The ChartIQ Angular seed project is a basic build of the ChartIQ library using the Angular 8.0 framework with [Angular CLI](https://cli.angular.io) support.

The project is an example of how to implement the most common elements in the charting library.
The project is a good starting point for Angular developers.

For an example implementation of a wide range of charting capabilities, see the [chartiq-angular-app](https://github.com/ChartIQ/chartiq-angular-app) project.

## Requirements

- A copy of the ChartIQ library, version 7.2.0 or later.

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

Prior to an addOn initiation the addOn module has to be loaded. In this application addOns are imported dynamically
as and provided as chart service methods toggleRangeSlider and addTooltip.

## Enabling the TFC plug-in

The Trade from the Chart (TFC) plug-in enables users to place trades directly from a ChartIQ chart. The plug-in includes tools for placing market orders, limit and stop orders, and multi-leg orders.

The plug-in is built into this project but is disabled.

To enable the plug-in, uncomment the following lines of code:
- *src/app.module.ts*
  - // import { TfcService } from './plugins/tfc.service';
  - // { provide: ITfc, useClass: TfcService },
- *src/styles/scss*
  - // @import '~chartiq/plugins/tfc/tfc.css';

**Note:** Each line of code follows the comment: `// to enable tfc plugin uncomment next line`

## Questions and support

- Contact our development support team at [support@chartiq.com](mailto:support@chartiq.com).
- See our SDK documentation at https://documentation.chartiq.com.

## Contributing to this project

Contribute to this project. Fork it and send us a pull request. We'd love to see what you can do with our charting tools!
