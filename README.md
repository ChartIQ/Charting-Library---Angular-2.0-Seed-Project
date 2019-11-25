# Angular seed project

- [Questions and support](#questions-and-support)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Enabling TFC plugin](#enable-tfc-plugin)
- [Legacy IE11 support](#enable-ie11)
- [Contributing to this project](#contributing-to-this-project)

A basic build of the ChartIQ library using the Angular 8.0 framework with [Angular CLI](https://cli.angular.io) support.
This provides an example of how to implement the most common elements in the charting library.
This is not a comprehensive example, more like a good starting point for an Angular developer.
[Here is a live demo of the Angular Seed Project.](https://demo.chartiq.com/angular-seed/)

## Questions and support

If you have questions or get stuck using this project or the ChartIQ library, the dev support team can be reached through [dev@chartiq.com](mailto:dev@chartiq.com).

## Requirements

- A copy of the ChartIQ library, version 7.2+ is required. To get your copy, visit https://www.chartiq.com/products/html5-charting-library/ to see a demo and get in touch with us.

## Getting started

These are the basic instructions to get this project running with no extra features:

- Clone this repository.
- Extract the contents of your zipped copy of the ChartIQ library and use the .tgz extension file for npm installation of library
  `npm i ./chartiq-7.2.0.tgz`
- Run `npm install` to install rest of dependencies.
- Run `npm start` to start up the dev server.
- Open your browser to [`http://localhost:4200`](http://localhost:4200).

## Enbalig TFC plugin

- Uncomment 3 lines following the `"// to enable tfc plugin uncomment next line"`
  in the **_src/styles.scss_** and **_src/app.module.ts_** files.

## Enabling IE11

- run `npm install core-js`

- uncomment IE11 related imports in polyfills.js file

## Contributing to this project

If you wish to contribute to this project, fork it and send us a pull request.
We'd love to see what it is you want to do with our charting tools!
