import Ember from 'ember';

export default Ember.Component.extend({
	
	freqData: [
		{Variable:'1',score:{low:4786, mid:1319, high:249}},
		{Variable:'2',score:{low:1101, mid:412, high:674}},
		{Variable:'3',score:{low:932, mid:2149, high:418}},
		{Variable:'4',score:{low:832, mid:1152, high:1862}},
		{Variable:'5',score:{low:4481, mid:3304, high:948}},
		{Variable:'6',score:{low:1619, mid:167, high:1063}},
		{Variable:'7',score:{low:1819, mid:247, high:1203}},
		{Variable:'8',score:{low:4498, mid:3852, high:942}}
	],

	createGraph: function(){
		var study = this.get("study"),
				variables = study.get("variables").toArray(),
				output = this.get("output.model"),
				cells = study.get("cells").toArray();

		var fData = [];

		for (var i=0; i<variables.length; i++){
			var bardata = _.chain(cells)
				.filter(function(c){ return c.get('output.id')===output.id;})
				.filter(function(c){return c.get('variable.id')===variables[i].id;}).value();
			
			fData.push({Variable: (i+1).toString(), score:{
				low: bardata[0].get('score'), 
				mid: bardata[1].get('score'), 
				high: bardata[2].get('score')
			}});
		}

    var barColor = 'steelblue';
    
    function segColor(c){ return {low:"#807dba", mid:"#e08214",high:"#41ab5d"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.score.low+d.score.mid+d.score.high;});
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 350 - hGDim.l - hGDim.r; 
        hGDim.h = 250 - hGDim.t - hGDim.b;
            
        //create svg for histogram.
        var hGsvg = d3.select('#dashboard').append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        hGsvg.append("text")
	        .attr("x", (hGDim.w / 2))             
	        .attr("y", 0 - (hGDim.t / 2))
	        .attr("text-anchor", "middle")
	        .style("font-size", "16px") 
	        .text("Score by Variables");

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined below.
            .on("mouseout",mouseout);// mouseout is defined below.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1]);})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "middle");
        
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function(s){ return s.Variable === d[0];})[0],
                nD = d3.keys(st.score).map(function(s){ return {type:s, score:st.score[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF);
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1]);})
                .attr("y", function(d) {return y(d[1])-5; });            
        };        
        return hG;
    }
    
    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:180, h: 180};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select('#dashboard').append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.score; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        };        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){ 
                return [v.Variable,v.score[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.Variable,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    // function to handle legend.
    function setLegend(lD){
        var labels = ["Score 1", "Score 2", "Score 3"];

        var leg = {};
            
        // create table for legend.
        var legend = d3.select('#dashboard').append("table").attr('class','legend');
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
			.attr("fill",function(d){ return segColor(d.type); });
            
        // create the second column for each segment.
        tr.append("td").style("width", '58px').text(function(d,i){ return labels[i];});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendscore')
            .text(function(d){ return d3.format(",")(d.score);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the scoreuencies.
            l.select(".legendscore").text(function(d){ return d3.format(",")(d.score);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
        };
        
        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.score/d3.sum(aD.map(function(v){ return v.score; })));
        }
        return leg;
    }
    
    // calculate total frequency by segment for all state.
    var tF = ['low','mid','high'].map(function(d){ 
        return {type:d, score: d3.sum(fData.map(function(t){ return t.score[d];}))}; 
    });    

    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.Variable,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= setLegend(tF);  // create the legend.
	}.on('didInsertElement')
});
