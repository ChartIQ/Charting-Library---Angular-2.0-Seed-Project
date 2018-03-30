(function(exports){
  exports.CIQ = {};
  exports.CIQ.ChartEngine = class ChartEngine {
    constructor(config){
      this.container=config.container
    }
  };
  exports.CIQ.ChartEngine.registeredContainers=[]
  exports.CIQ.QuoteFeed = {};
  exports.CIQ.Studies = {};
  exports.$$$ = function(x) {};
  throw new Error(
    'ChartIQ library not loaded. Please add your copy to src/chartiq_library. ' +
    '(See README.md for more details.)'
  );
})(typeof window !== 'undefined' ? window : global);
