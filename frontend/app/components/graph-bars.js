import Ember from 'ember';
import _ from '../bower_components/lodash/dist/lodash.js';
import d3 from '../bower_components/d3/d3.js';

export default Ember.Component.extend({

	createGraph: function(){
		var study = this.get("study"),
				variables = study.get("variables").toArray(),
				output = this.get("output.model"),
				cells = study.get("cells").toArray();

		var bardata = _.chain(cells).filter(function(c){ return c.get('output.id')===output.id;}).filter(function(c){return c.get('variable.id')===variables[0].id;}).value();
		
		bardata = [
			{'letter': "General Objectives", "frequency": bardata[0].get('score')},
			{'letter': "Measurements", "frequency": bardata[1].get('score')},
			{'letter': "Activities", "frequency": bardata[2].get('score')},
		];

		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = 480 - margin.left - margin.right,
		    height = 250 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], 0.08);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left");
		    

		var svg = d3.select("#graph").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var data = bardata;

	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, 5]);

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis);

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("SCORE");

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.letter); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.frequency); })
	      .attr("height", function(d) { return height - y(d.frequency); });

	}.on('didInsertElement'),

});
