'use strict';

angular.module('dapoll.common.directives')
  .directive('d3Donut', function () {
    
    // constants
    var
      dur = 2500,
      width = 370,
      height = 370,
      radius = Math.min(width, height) / 2;

    var
      colorLoading = d3.scale.ordinal().range(['#e5e5e5', '#999']),
      color = d3.scale.ordinal().range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b']);

    var directiveDefObj = {
      restrict: 'A', 
      
      scope: {
        data: '=data'
      },

      // initialization, done once per my-directive tag in template. If my-directive is within an
      // ng-repeat-ed template then it will be called every time ngRepeat creates a new copy of the template.
      link: function (scope, element, attrs) {   

        console.log(scope.data);

        // data should be an array of objects
        // important properties are votes and content
        var data = scope.data;    

        // set up initial svg object
        var vis = d3.select(element[0]).append('svg')
            .attr('width', width)
            .attr('height', height)
          .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        
        var pie = d3.layout.pie()
          .sort(null)
          .value(function (d) {
            return d.votes; // which property to access
          });

        var arc = d3.svg.arc()
          .outerRadius(radius - 10)
          .innerRadius(radius - 50);

        // draw the chart using temp data
        var arcs = vis.selectAll('.arc')
            .data(pie(data))
          .enter().append('path')
            .attr('class', 'arc')
            .attr('d', arc)
            .style('fill', function(d, i) { 
              return colorLoading(i); 
            })
            .style('opacity', 0.3)
            .each(function (d) {
              return this.current = d;
            });

        /**
         * updateChart
         *
         * Used to update the chart with new data
         */
        var updateChart = function (data) {
          arcs.data(pie(data))
            .enter().append('path')
            .attr('class', 'arc')
            .attr('d', arc);

          arcs.transition()
            .duration(dur)
            .attrTween('d', arcTween)
            .style('fill', function(d, i) { 
              return color(i); 
            })
            .style('opacity', 1);

        }

        var arcTween = function(a) {
          var i = d3.interpolate(this.current, a);
          this.current = i(0);
          return function(t) {
            return arc(i(t));
          };
        }

        var firstTime = true;

        scope.$watchCollection('data', function (newVal, oldVal) {

          // do nothing the first time this fires because we initialize with temp data
          if (firstTime) {
            firstTime = false;
            return;
          }

          updateChart(newVal);
        });
      }
    };

    return directiveDefObj;
  })