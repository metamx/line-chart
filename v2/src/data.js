angular.module('data', [])

.factory('datasets', function(generators) {
  return {
    timed: [],
    tolerance: generators.toleranceData(30),
    numerical: generators.sinData(100, 4),
    logarithmic: generators.logarithmicData(100, 4),
    noisy: generators.noisyLinearData(40, 4)
  }
})

.factory('generators', function() {
  var fn = function(yFn, xFn) {
    return function(rowCount, seriesCount) {
      var data = [];

      for (var i = 0; i < seriesCount; i++) {
        for (var j = 0; j < rowCount; j++) {
          var row = data[j] || {x: xFn ? xFn(j) : j};
          row['val_' + i] = yFn(i, j);
          data[j] = row;
        }
      }
      return data;
    };
  };

  return {
    noisyLinearData: fn(
      function(i, j) {return Math.round(Math.random()*100);}
    ),

    positiveData: fn(
      function(i, j) {return Math.abs(Math.round(Math.sin((i+1)*j/5)*(5*(i+1))*1000)/1000);}
    ),

    sinData: fn(
      function(i, j) {return Math.round(Math.sin((i+1)*j/5)*(5*(i+1))*1000)/1000;}
    ),

    logarithmicData: fn(
      function(i, j) {return Math.abs((i+1)*100000 + parseInt(Math.cos(j)*200000));}
    ),

    toleranceData: function(rowCount) {
      var data = [];

      for (var i = 0; i < rowCount; i++) {
        var v = 20 + Math.round(Math.random()*5);

        data.push({
          x: i,
          average: v,
          extrema_min: v - 2 - Math.round(Math.random()*3),
          extrema_max: v + 2 + Math.round(Math.random()*3)
        });
      }
      return data;
    },

    timedData: function(rowCount, seriesCount) {
      var data = [];

      var t = new Date();
      t.setMonth(t.getMonth() - 1);
      t = t.getTime();

      for (var i = 0; i < seriesCount; i++) {
        for (var j = 0; j < rowCount; j++) {
          var row = data[j] || {x: new Date(t + j*3600*1000*24)};
          row['val_' + i] = Math.round(Math.sin((i+1)*j/5)*(5*(i+1))*1000)/1000;
          data[j] = row;
        }
      }

      return data;
    }
  };
})
