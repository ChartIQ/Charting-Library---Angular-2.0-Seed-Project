# Angular seed project

- [Questions and support](#questions-and-support)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Enabling TFC plugin](#enabling-tfc-plugin)
- [Legacy IE11 support](#enabling-ie11)
- [Contributing to this project](#contributing-to-this-project)


A basic build of the ChartIQ library using the Angular 8.0 framework with [Angular CLI](https://cli.angular.io) support.
This provides an example of how to implement the most common elements in the charting library.
This is not a comprehensive example, more like a good starting point for an Angular developer.
[Here is a live demo of the Angular Seed Project.](https://demo.chartiq.com/angular-seed/)

## Questions and support

If you have questions or get stuck using this project or the ChartIQ library, the dev support team can be reached through [dev@chartiq.com](mailto:dev@chartiq.com).

## Requirements

* A copy of the ChartIQ library, version 7.2.0 or later.

    Visit [https://www.chartiq.com/products/html5-charting-library/](https://www.chartiq.com/products/html5-charting-library/) to get your copy, see a demo, and get in touch with us.

## Getting started

These are the basic instructions to get this project running with no extra features:

- Clone this repository.
- Extract the contents of your zipped ChartIQ library package.
- Copy the tarball (.tgz file) from the extracted library package into the root of this project.
- Run the following commands from the root of this project:
    - `npm install ./chartiq-x.x.x.tgz` to install the charting library.
    - `npm install` to install the rest of the dependencies.
    - `npm start` to start up the development server.
- Open your browser to [http://localhost:4200](http://localhost:4200).

## Enabling TFC plugin

- Uncomment the three lines following the `// to enable tfc plugin uncomment next line`
  comment in the *src/styles.scss* and *src/app.module.ts* files.

## Enabling IE11

- Run `npm install core-js` .

- Uncomment IE11-related imports in the *polyfills.js* file.

## Contributing to this project

If you wish to contribute to this project, fork it and send us a pull request.
We'd love to see what it is you want to do with our charting tools!
