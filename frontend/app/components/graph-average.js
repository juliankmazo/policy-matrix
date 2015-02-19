import Ember from 'ember';

export default Ember.Component.extend({

	createGraph: function(){
		var study = this.get("study"),
				// variables = study.get("variables").toArray(),
				output = this.get("output.model"),
				cells = study.get("cells").toArray(),
				self = this;

		var sum1 = _.chain(cells)
			.filter(function(c){ return c.get('output.id')===output.id;})
			.filter(function(c){return c.get('scoreIndex')===1;})
			.reduce(function(a,m,i,p) {var score = m.get('score')||0;return a + score/p.length;},0).value();

		var sum2 = _.chain(cells)
			.filter(function(c){ return c.get('output.id')===output.id;})
			.filter(function(c){return c.get('scoreIndex')===2;})
			.reduce(function(a,m,i,p) {var score = m.get('score')||0;return a + score/p.length;},0).value();

		var sum3 = _.chain(cells)
			.filter(function(c){ return c.get('output.id')===output.id;})
			.filter(function(c){return c.get('scoreIndex')===3;})
			.reduce(function(a,m,i,p) {var score = m.get('score')||0;return a + score/p.length;},0).value();

		var bardata = [
			{'color': "green",'letter': "General Objectives", "frequency": sum1},
			{'color': "purple",'letter': "Measurements", "frequency": sum2},
			{'color': "red",'letter': "Activities", "frequency": sum3},
		];

		var margin = {top: 20, right: 20, bottom: 30, left: 40},
		    width = 480 - margin.left - margin.right,
		    height = 250 - margin.top - margin.bottom;

		var x = d3.scale.ordinal()
		    .rangeRoundBands([0, width], 0.5);

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
		var colors = d3.scale.category10();

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
	      .text("AVERAGE SCORE");

	  svg.selectAll(".bar")
	      .data(data)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("fill", function(d,i) { return colors(i); })
	      .attr("x", function(d) { return x(d.letter); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.frequency); })
	      .attr("height", function(d) { return height - y(d.frequency); });

	}.on('didInsertElement'),

	// http://alignedleft.com/tutorials
	// http://www.jeromecukier.net/wp-content/uploads/2012/10/d3-cheat-sheet.pdf
	// http://nvd3.org/examples/index.html
	// http://anna.ps/talks/fel/#/
});
