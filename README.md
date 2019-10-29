# Angular seed project

- [Questions and support](#questions-and-support)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Contributing to this project](#contributing-to-this-project)
- [Using with library versions prior to 7.2](#using-with-library-versions-prior-to-7.2)

A basic build of the ChartIQ library using the Angular 8.0 framework and [Angular CLI](https://cli.angular.io) support.
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

## Using with library versions prior to 7.2

- Copy unzipped library source directory to ./src folder with the name chartiq_library
- Update angular.json styles section to reference styles in src directory

```
  "styles": [
    "src/chartiq_library/css/normalize.css",
    "src/chartiq_library/css/stx-chart.css",
    "src/chartiq_library/css/chartiq.css",
    "src/chartiq_library/css/perfect-scrollbar.css",
    "src/styles.scss"
  ]
```

- uncomment path section in tsconfig.json

```
  "paths": {
    "chartiq/*": ["src/chartiq_library/*"],
    "chartiq": ["src/chartiq_library/js/chartiq.js"]
  },
```

## Contributing to this project

If you wish to contribute to this project, fork it and send us a pull request.
We'd love to see what it is you want to do with our charting tools!
