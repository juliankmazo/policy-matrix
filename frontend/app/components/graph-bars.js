import Ember from 'ember';
// import d3 from '../bower_components/d3/d3';

export default Ember.Component.extend({
	bardata: [
		{"letter": "A", "frequency":.08167},
		{"letter": "B", "frequency":.01492},
		{"letter": "C", "frequency":.02782},
		{"letter": "D", "frequency":.04253},
		{"letter": "E",	"frequency":.12702},
		{"letter": "F", "frequency":.02288},
		{"letter": "G", "frequency":.02015},
		{"letter": "H", "frequency":.06094},
		{"letter": "I", "frequency":.06966},
		{"letter": "J", "frequency":.00153},
		{"letter": "K", "frequency":.00772},
		{"letter": "L", "frequency":.04025},
		{"letter": "M", "frequency":.02406},
		{"letter": "N", "frequency":.06749},
		{"letter": "O", "frequency":.07507},
		{"letter": "P", "frequency":.01929},
		{"letter": "Q", "frequency":.00095},
		{"letter": "R", "frequency":.05987},
		{"letter": "S", "frequency":.06327},
		{"letter": "T", "frequency":.09056},
		{"letter": "U", "frequency":.02758},
		{"letter": "V", "frequency":.00978},
		{"letter": "W", "frequency":.02360},
		{"letter": "X", "frequency":.00150},
		{"letter": "Y", "frequency":.01974},
		{"letter": "Z", "frequency":.00074},
	],

	createGraph: function(){
		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = 960 - margin.left - margin.right,
		    height = 500 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], .1);

		var y = d3.scale.linear()
		    .range([height, 0]);

		var xAxis = d3.svg.axis()
		    .scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
		    .scale(y)
		    .orient("left")
		    .ticks(10, "%");

		var svg = d3.select("#graph").append("svg")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var data = this.get('bardata');

	  x.domain(data.map(function(d) { return d.letter; }));
	  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

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
	      .text("Frequency");

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
