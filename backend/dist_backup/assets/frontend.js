/* jshint ignore:start */

/* jshint ignore:end */

define('frontend/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	exports['default'] = DS['default'].ActiveModelAdapter.extend({
		namespace: "_ah/api/pmmApi/v1"
	});

});
define('frontend/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'frontend/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('frontend/column-definition', ['exports', 'ember-cli-ember-table/column-definition'], function (exports, ColumnDefinition) {

	'use strict';

	exports['default'] = ColumnDefinition['default'];

});
define('frontend/components/bs-button-group', ['exports', 'ember', 'ember-bootstrap/components/bs-button-group'], function (exports, Ember, bsButtonGroup) {

	'use strict';

	exports['default'] = bsButtonGroup['default'];

});
define('frontend/components/bs-button', ['exports', 'ember', 'ember-bootstrap/components/bs-button'], function (exports, Ember, bsButton) {

	'use strict';

	exports['default'] = bsButton['default'];

});
define('frontend/components/chartist-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var UNDEF,

  // This is the structure that chartist is expecting
  defaultDataStructure = { labels: [], series: [] };

  exports['default'] = Ember['default'].Component.extend({
    chart: UNDEF,

    classNameBindings: ["ratio"],
    classNames: ["ct-chart"],

    // The ratio of the chart as it scales up/down in size.
    //
    // Available ratios:
    //
    // name              ratio
    // ct-square         1
    // ct-minor-second   15:16
    // ct-major-second   8:9
    // ct-minor-third    5:6
    // ct-major-third    4:5
    // ct-perfect-fourth 3:4
    // ct-perfect-fifth  2:3
    // ct-minor-sixth    5:8
    // ct-golden-section 1:1.618
    // ct-major-sixth    3:5
    // ct-minor-seventh  9:16
    // ct-major-seventh  8:15
    // ct-octave         1:2
    // ct-major-tenth    2:5
    // ct-major-eleventh 3:8
    // ct-major-twelfth  1:3
    // ct-double-octave  1:4
    ratio: "ct-square",

    type: "line",
    chartType: (function () {
      return this.get("type").capitalize();
    }).property("type"),

    data: defaultDataStructure,
    options: UNDEF,
    responsiveOptions: UNDEF,
    updateOnData: true,

    // This is where the business happens. This will only run if checkForReqs
    // doesn't find any problems.
    renderChart: (function () {
      var chart = new (Chartist[this.get("chartType")])(this.get("element"), this.get("data"), this.get("options"), this.get("responsiveOptions"));

      this.set("chart", chart);
    }).on("didInsertElement"),

    onData: (function () {
      if (this.get("updateOnData")) {
        this.get("chart").update(this.get("data"));
      }
    }).observes("data"),

    // Before trying to do anything else, let's check to see if any necessary
    // attributes are missing or if anything else is fishy about attributes
    // provided to the component in the template.
    //
    // We're doing this to help ease people into this project. Instead of just
    // getting some "uncaught exception" we're hoping these error messages will
    // point them in the right direction.
    checkForReqs: (function () {
      var data = this.get("data"),
          type = this.get("type");

      if (typeof data === "string") {
        console.info("Chartist-chart: The value of the \"data\" attribute on should be an object, it's a string.");
        this.set("data", defaultDataStructure);
      }

      if (!type || !Chartist[this.get("chartType")]) {
        console.info("Chartist-chart: Invalid or missing \"type\" attribute, defaulting to \"line\".");
        this.set("type", "line");
      }
    }).on("init")
  });

});
define('frontend/components/ember-table', ['exports', 'ember-cli-ember-table/components/ember-table'], function (exports, EmberTable) {

  'use strict';

  /*
    This is just a proxy file requiring the component from the /addon folder and
    making it available to the dummy application!
   */
  exports['default'] = EmberTable['default'];

});
define('frontend/components/graph-average', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({

		createGraph: (function () {
			var study = this.get("study"),
			   
			// variables = study.get("variables").toArray(),
			output = this.get("output.model"),
			    cells = study.get("cells").toArray();

			var sum1 = _.chain(cells).filter(function (c) {
				return c.get("output.id") === output.id;
			}).filter(function (c) {
				return c.get("scoreIndex") === 1;
			}).reduce(function (a, m, i, p) {
				var score = m.get("score") || 0;return a + score / p.length;
			}, 0).value();

			var sum2 = _.chain(cells).filter(function (c) {
				return c.get("output.id") === output.id;
			}).filter(function (c) {
				return c.get("scoreIndex") === 2;
			}).reduce(function (a, m, i, p) {
				var score = m.get("score") || 0;return a + score / p.length;
			}, 0).value();

			var sum3 = _.chain(cells).filter(function (c) {
				return c.get("output.id") === output.id;
			}).filter(function (c) {
				return c.get("scoreIndex") === 3;
			}).reduce(function (a, m, i, p) {
				var score = m.get("score") || 0;return a + score / p.length;
			}, 0).value();

			var bardata = [{ color: "green", letter: "General Objectives", frequency: sum1 }, { color: "purple", letter: "Measurements", frequency: sum2 }, { color: "red", letter: "Activities", frequency: sum3 }];

			var margin = { top: 20, right: 20, bottom: 30, left: 40 },
			    width = 480 - margin.left - margin.right,
			    height = 250 - margin.top - margin.bottom;

			var x = d3.scale.ordinal().rangeRoundBands([0, width], 0.5);

			var y = d3.scale.linear().range([height, 0]);

			var xAxis = d3.svg.axis().scale(x).orient("bottom");

			var yAxis = d3.svg.axis().scale(y).orient("left");

			var svg = d3.select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var data = bardata;
			var colors = d3.scale.category10();

			x.domain(data.map(function (d) {
				return d.letter;
			}));
			y.domain([0, 5]);

			svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

			svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("AVERAGE SCORE");

			svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("fill", function (d, i) {
				return colors(i);
			}).attr("x", function (d) {
				return x(d.letter);
			}).attr("width", x.rangeBand()).attr("y", function (d) {
				return y(d.frequency);
			}).attr("height", function (d) {
				return height - y(d.frequency);
			});
		}).on("didInsertElement") });


	// http://alignedleft.com/tutorials
	// http://www.jeromecukier.net/wp-content/uploads/2012/10/d3-cheat-sheet.pdf
	// http://nvd3.org/examples/index.html
	// http://anna.ps/talks/fel/#/

});
define('frontend/components/graph-bars', ['exports', 'ember', 'frontend/bower_components/lodash/dist/lodash', 'frontend/bower_components/d3/d3'], function (exports, Ember, _, d3) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({

		createGraph: (function () {
			var study = this.get("study"),
			    variables = study.get("variables").toArray(),
			    output = this.get("output.model"),
			    cells = study.get("cells").toArray();

			var bardata = _['default'].chain(cells).filter(function (c) {
				return c.get("output.id") === output.id;
			}).filter(function (c) {
				return c.get("variable.id") === variables[0].id;
			}).value();

			bardata = [{ letter: "General Objectives", frequency: bardata[0].get("score") }, { letter: "Measurements", frequency: bardata[1].get("score") }, { letter: "Activities", frequency: bardata[2].get("score") }];

			var margin = { top: 20, right: 20, bottom: 30, left: 40 },
			    width = 480 - margin.left - margin.right,
			    height = 250 - margin.top - margin.bottom;

			var x = d3['default'].scale.ordinal().rangeRoundBands([0, width], 0.08);

			var y = d3['default'].scale.linear().range([height, 0]);

			var xAxis = d3['default'].svg.axis().scale(x).orient("bottom");

			var yAxis = d3['default'].svg.axis().scale(y).orient("left");


			var svg = d3['default'].select("#graph").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			var data = bardata;

			x.domain(data.map(function (d) {
				return d.letter;
			}));
			y.domain([0, 5]);

			svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

			svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("SCORE");

			svg.selectAll(".bar").data(data).enter().append("rect").attr("class", "bar").attr("x", function (d) {
				return x(d.letter);
			}).attr("width", x.rangeBand()).attr("y", function (d) {
				return y(d.frequency);
			}).attr("height", function (d) {
				return height - y(d.frequency);
			});
		}).on("didInsertElement") });

});
define('frontend/components/graph-variable', ['exports', 'ember'], function (exports, Ember) {

    'use strict';

    exports['default'] = Ember['default'].Component.extend({

        freqData: [{ Variable: "1", score: { low: 4786, mid: 1319, high: 249 } }, { Variable: "2", score: { low: 1101, mid: 412, high: 674 } }, { Variable: "3", score: { low: 932, mid: 2149, high: 418 } }, { Variable: "4", score: { low: 832, mid: 1152, high: 1862 } }, { Variable: "5", score: { low: 4481, mid: 3304, high: 948 } }, { Variable: "6", score: { low: 1619, mid: 167, high: 1063 } }, { Variable: "7", score: { low: 1819, mid: 247, high: 1203 } }, { Variable: "8", score: { low: 4498, mid: 3852, high: 942 } }],

        createGraph: (function () {
            var study = this.get("study"),
                variables = study.get("variables").toArray(),
                output = this.get("output.model"),
                cells = study.get("cells").toArray();

            var fData = [];

            for (var i = 0; i < variables.length; i++) {
                var bardata = _.chain(cells).filter(function (c) {
                    return c.get("output.id") === output.id;
                }).filter(function (c) {
                    return c.get("variable.id") === variables[i].id;
                }).value();

                fData.push({ Variable: (i + 1).toString(), score: {
                        low: bardata[0].get("score"),
                        mid: bardata[1].get("score"),
                        high: bardata[2].get("score")
                    } });
            }

            var barColor = "steelblue";

            function segColor(c) {
                return ({ low: "#807dba", mid: "#e08214", high: "#41ab5d" })[c];
            }

            // compute total for each state.
            fData.forEach(function (d) {
                d.total = d.score.low + d.score.mid + d.score.high;
            });

            // function to handle histogram.
            function histoGram(fD) {
                var hG = {},
                    hGDim = { t: 60, r: 0, b: 30, l: 0 };
                hGDim.w = 350 - hGDim.l - hGDim.r;
                hGDim.h = 250 - hGDim.t - hGDim.b;

                //create svg for histogram.
                var hGsvg = d3.select("#dashboard").append("svg").attr("width", hGDim.w + hGDim.l + hGDim.r).attr("height", hGDim.h + hGDim.t + hGDim.b).append("g").attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

                // create function for x-axis mapping.
                var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1).domain(fD.map(function (d) {
                    return d[0];
                }));

                // Add x-axis to the histogram svg.
                hGsvg.append("g").attr("class", "x axis").attr("transform", "translate(0," + hGDim.h + ")").call(d3.svg.axis().scale(x).orient("bottom"));

                hGsvg.append("text").attr("x", hGDim.w / 2).attr("y", 0 - hGDim.t / 2).attr("text-anchor", "middle").style("font-size", "16px").text("Score by Variables");

                // Create function for y-axis map.
                var y = d3.scale.linear().range([hGDim.h, 0]).domain([0, d3.max(fD, function (d) {
                    return d[1];
                })]);

                // Create bars for histogram to contain rectangles and freq labels.
                var bars = hGsvg.selectAll(".bar").data(fD).enter().append("g").attr("class", "bar");

                //create the rectangles.
                bars.append("rect").attr("x", function (d) {
                    return x(d[0]);
                }).attr("y", function (d) {
                    return y(d[1]);
                }).attr("width", x.rangeBand()).attr("height", function (d) {
                    return hGDim.h - y(d[1]);
                }).attr("fill", barColor).on("mouseover", mouseover) // mouseover is defined below.
                .on("mouseout", mouseout); // mouseout is defined below.

                //Create the frequency labels above the rectangles.
                bars.append("text").text(function (d) {
                    return d3.format(",")(d[1]);
                }).attr("x", function (d) {
                    return x(d[0]) + x.rangeBand() / 2;
                }).attr("y", function (d) {
                    return y(d[1]) - 5;
                }).attr("text-anchor", "middle");

                function mouseover(d) {
                    // utility function to be called on mouseover.
                    // filter for selected state.
                    var st = fData.filter(function (s) {
                        return s.Variable === d[0];
                    })[0],
                        nD = d3.keys(st.score).map(function (s) {
                        return { type: s, score: st.score[s] };
                    });

                    // call update functions of pie-chart and legend.   
                    pC.update(nD);
                    leg.update(nD);
                }

                function mouseout() {
                    // utility function to be called on mouseout.
                    // reset the pie-chart and legend.   
                    pC.update(tF);
                    leg.update(tF);
                }

                // create function to update the bars. This will be used by pie-chart.
                hG.update = function (nD, color) {
                    // update the domain of the y-axis map to reflect change in frequencies.
                    y.domain([0, d3.max(nD, function (d) {
                        return d[1];
                    })]);

                    // Attach the new data to the bars.
                    var bars = hGsvg.selectAll(".bar").data(nD);

                    // transition the height and color of rectangles.
                    bars.select("rect").transition().duration(500).attr("y", function (d) {
                        return y(d[1]);
                    }).attr("height", function (d) {
                        return hGDim.h - y(d[1]);
                    }).attr("fill", color);

                    // transition the frequency labels location and change value.
                    bars.select("text").transition().duration(500).text(function (d) {
                        return d3.format(",")(d[1]);
                    }).attr("y", function (d) {
                        return y(d[1]) - 5;
                    });
                };
                return hG;
            }

            // function to handle pieChart.
            function pieChart(pD) {
                var pC = {},
                    pieDim = { w: 180, h: 180 };
                pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;

                // create svg for pie chart.
                var piesvg = d3.select("#dashboard").append("svg").attr("width", pieDim.w).attr("height", pieDim.h).append("g").attr("transform", "translate(" + pieDim.w / 2 + "," + pieDim.h / 2 + ")");

                // create function to draw the arcs of the pie slices.
                var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

                // create a function to compute the pie slice angles.
                var pie = d3.layout.pie().sort(null).value(function (d) {
                    return d.score;
                });

                // Draw the pie slices.
                piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc).each(function (d) {
                    this._current = d;
                }).style("fill", function (d) {
                    return segColor(d.data.type);
                }).on("mouseover", mouseover).on("mouseout", mouseout);

                // create function to update pie-chart. This will be used by histogram.
                pC.update = function (nD) {
                    piesvg.selectAll("path").data(pie(nD)).transition().duration(500).attrTween("d", arcTween);
                };
                // Utility function to be called on mouseover a pie slice.
                function mouseover(d) {
                    // call the update function of histogram with new data.
                    hG.update(fData.map(function (v) {
                        return [v.Variable, v.score[d.data.type]];
                    }), segColor(d.data.type));
                }
                //Utility function to be called on mouseout a pie slice.
                function mouseout() {
                    // call the update function of histogram with all data.
                    hG.update(fData.map(function (v) {
                        return [v.Variable, v.total];
                    }), barColor);
                }
                // Animating the pie-slice requiring a custom function which specifies
                // how the intermediate paths should be drawn.
                function arcTween(a) {
                    var i = d3.interpolate(this._current, a);
                    this._current = i(0);
                    return function (t) {
                        return arc(i(t));
                    };
                }
                return pC;
            }

            // function to handle legend.
            function setLegend(lD) {
                var labels = ["Score 1", "Score 2", "Score 3"];

                var leg = {};

                // create table for legend.
                var legend = d3.select("#dashboard").append("table").attr("class", "legend");

                // create one row per segment.
                var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");

                // create the first column for each segment.
                tr.append("td").append("svg").attr("width", "16").attr("height", "16").append("rect").attr("width", "16").attr("height", "16").attr("fill", function (d) {
                    return segColor(d.type);
                });

                // create the second column for each segment.
                tr.append("td").style("width", "58px").text(function (d, i) {
                    return labels[i];
                });

                // create the third column for each segment.
                tr.append("td").attr("class", "legendscore").text(function (d) {
                    return d3.format(",")(d.score);
                });

                // create the fourth column for each segment.
                tr.append("td").attr("class", "legendPerc").text(function (d) {
                    return getLegend(d, lD);
                });

                // Utility function to be used to update the legend.
                leg.update = function (nD) {
                    // update the data attached to the row elements.
                    var l = legend.select("tbody").selectAll("tr").data(nD);

                    // update the scoreuencies.
                    l.select(".legendscore").text(function (d) {
                        return d3.format(",")(d.score);
                    });

                    // update the percentage column.
                    l.select(".legendPerc").text(function (d) {
                        return getLegend(d, nD);
                    });
                };

                function getLegend(d, aD) {
                    // Utility function to compute percentage.
                    return d3.format("%")(d.score / d3.sum(aD.map(function (v) {
                        return v.score;
                    })));
                }
                return leg;
            }

            // calculate total frequency by segment for all state.
            var tF = ["low", "mid", "high"].map(function (d) {
                return { type: d, score: d3.sum(fData.map(function (t) {
                        return t.score[d];
                    })) };
            });

            // calculate total frequency by state for all segment.
            var sF = fData.map(function (d) {
                return [d.Variable, d.total];
            });

            var hG = histoGram(sF),
                // create the histogram.
            pC = pieChart(tF),
                // create the pie-chart.
            leg = setLegend(tF); // create the legend.
        }).on("didInsertElement")
    });

});
define('frontend/components/lf-overlay', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "span",
    classNames: ["lf-overlay"],
    didInsertElement: function () {
      Ember['default'].$("body").addClass("lf-modal-open");
    },
    willDestroy: function () {
      Ember['default'].$("body").removeClass("lf-modal-open");
    },
    click: function () {
      this.sendAction("clickAway");
    }
  });

});
define('frontend/components/liquid-measured', ['exports', 'liquid-fire/mutation-observer', 'ember'], function (exports, MutationObserver, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    didInsertElement: function () {
      var self = this;

      // This prevents margin collapse
      this.$().css({
        border: "1px solid transparent",
        margin: "-1px"
      });

      this.didMutate();

      this.observer = new MutationObserver['default'](function (mutations) {
        self.didMutate(mutations);
      });
      this.observer.observe(this.get("element"), {
        attributes: true,
        subtree: true,
        childList: true
      });
      this.$().bind("webkitTransitionEnd", function () {
        self.didMutate();
      });
      // Chrome Memory Leak: https://bugs.webkit.org/show_bug.cgi?id=93661
      window.addEventListener("unload", function () {
        self.willDestroyElement();
      });
    },

    willDestroyElement: function () {
      if (this.observer) {
        this.observer.disconnect();
      }
    },

    didMutate: function () {
      Ember['default'].run.next(this, function () {
        this._didMutate();
      });
    },

    _didMutate: function () {
      var elt = this.$();
      if (!elt || !elt[0]) {
        return;
      }

      // if jQuery sees a zero dimension, it will temporarily modify the
      // element's css to try to make its size measurable. But that's bad
      // for us here, because we'll get an infinite recursion of mutation
      // events. So we trap the zero case without hitting jQuery.

      if (elt[0].offsetWidth === 0) {
        this.set("width", 0);
      } else {
        this.set("width", elt.outerWidth());
      }
      if (elt[0].offsetHeight === 0) {
        this.set("height", 0);
      } else {
        this.set("height", elt.outerHeight());
      }
    }

  });

});
define('frontend/components/liquid-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["liquid-modal"],
    currentContext: Ember['default'].computed.oneWay("owner.modalContexts.lastObject"),

    owner: null, // set by injection

    innerView: Ember['default'].computed("currentContext", function () {
      var self = this,
          current = this.get("currentContext"),
          name = current.get("name"),
          container = this.get("container"),
          component = container.lookup("component-lookup:main").lookupFactory(name);
      Ember['default'].assert("Tried to render a modal using component '" + name + "', but couldn't find it.", !!component);

      var args = Ember['default'].copy(current.get("params"));

      args.registerMyself = Ember['default'].on("init", function () {
        self.set("innerViewInstance", this);
      });

      // set source so we can bind other params to it
      args._source = Ember['default'].computed(function () {
        return current.get("source");
      });

      var otherParams = current.get("options.otherParams");
      var from, to;
      for (from in otherParams) {
        to = otherParams[from];
        args[to] = Ember['default'].computed.alias("_source." + from);
      }

      var actions = current.get("options.actions") || {};

      // Override sendAction in the modal component so we can intercept and
      // dynamically dispatch to the controller as expected
      args.sendAction = function (name) {
        var actionName = actions[name];
        if (!actionName) {
          this._super.apply(this, Array.prototype.slice.call(arguments));
          return;
        }

        var controller = current.get("source");
        var args = Array.prototype.slice.call(arguments, 1);
        args.unshift(actionName);
        controller.send.apply(controller, args);
      };

      return component.extend(args);
    }),

    actions: {
      outsideClick: function () {
        if (this.get("currentContext.options.dismissWithOutsideClick")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "outsideClick");
        }
      },
      escape: function () {
        if (this.get("currentContext.options.dismissWithEscape")) {
          this.send("dismiss");
        } else {
          proxyToInnerInstance(this, "escape");
        }
      },
      dismiss: function () {
        var source = this.get("currentContext.source"),
            proto = source.constructor.proto(),
            params = this.get("currentContext.options.withParams"),
            clearThem = {};

        for (var key in params) {
          clearThem[key] = proto[key];
        }
        source.setProperties(clearThem);
      }
    }
  });

  function proxyToInnerInstance(self, message) {
    var vi = self.get("innerViewInstance");
    if (vi) {
      vi.send(message);
    }
  }

});
define('frontend/components/liquid-spacer', ['exports', 'ember', 'liquid-fire/promise'], function (exports, Ember, Promise) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    growDuration: 250,
    growPixelsPerSecond: 200,
    growEasing: "slide",
    enabled: true,

    didInsertElement: function () {
      var child = this.$("> div");
      this.$().css({
        overflow: "hidden",
        width: child.width(),
        height: child.height()
      });
    },

    sizeChange: Ember['default'].observer("width", "height", function () {
      var elt = this.$();
      if (!this.get("enabled")) {
        elt.width(this.get("width"));
        elt.height(this.get("height"));
        return Promise['default'].resolve();
      }
      return Promise['default'].all([this.adaptDimension(elt, "width"), this.adaptDimension(elt, "height")]);
    }),

    adaptDimension: function (elt, dimension) {
      var have = elt[dimension]();
      var want = this.get(dimension);
      var target = {};
      target[dimension] = want;

      return Ember['default'].$.Velocity(elt[0], target, {
        duration: this.durationFor(have, want),
        queue: false,
        easing: this.get("growEasing")
      });
    },

    durationFor: function (before, after) {
      return Math.min(this.get("growDuration"), 1000 * Math.abs(before - after) / this.get("growPixelsPerSecond"));
    } });

});
define('frontend/components/lm-container', ['exports', 'ember', 'liquid-fire/tabbable'], function (exports, Ember) {

  'use strict';

  /*
     Parts of this file were adapted from ic-modal

     https://github.com/instructure/ic-modal
     Released under The MIT License (MIT)
     Copyright (c) 2014 Instructure, Inc.
  */

  var lastOpenedModal = null;
  Ember['default'].$(document).on("focusin", handleTabIntoBrowser);

  function handleTabIntoBrowser() {
    if (lastOpenedModal) {
      lastOpenedModal.focus();
    }
  }


  exports['default'] = Ember['default'].Component.extend({
    classNames: ["lm-container"],
    attributeBindings: ["tabindex"],
    tabindex: 0,

    keyUp: function (event) {
      // Escape key
      if (event.keyCode === 27) {
        this.sendAction();
      }
    },

    keyDown: function (event) {
      // Tab key
      if (event.keyCode === 9) {
        this.constrainTabNavigation(event);
      }
    },

    didInsertElement: function () {
      this.focus();
      lastOpenedModal = this;
    },

    willDestroy: function () {
      lastOpenedModal = null;
    },

    focus: function () {
      if (this.get("element").contains(document.activeElement)) {
        // just let it be if we already contain the activeElement
        return;
      }
      var target = this.$("[autofocus]");
      if (!target.length) {
        target = this.$(":tabbable");
      }

      if (!target.length) {
        target = this.$();
      }

      target[0].focus();
    },

    constrainTabNavigation: function (event) {
      var tabbable = this.$(":tabbable");
      var finalTabbable = tabbable[event.shiftKey ? "first" : "last"]()[0];
      var leavingFinalTabbable = finalTabbable === document.activeElement ||
      // handle immediate shift+tab after opening with mouse
      this.get("element") === document.activeElement;
      if (!leavingFinalTabbable) {
        return;
      }
      event.preventDefault();
      tabbable[event.shiftKey ? "last" : "first"]()[0].focus();
    }
  });

});
define('frontend/components/matrix-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    actions: {
      toggleBody: function () {
        this.toggleProperty("isShowingBody");
      }
    }
  });

});
define('frontend/components/matrix-new', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({
		tagName: "td",

		ownCell: null,

		ownCellSetter: (function () {
			var variable = this.get("variable"),
			    study = this.get("study"),
			    scoreIndex = this.get("scoreIndex"),
			    outputNUR = this.get("outputNUR.model"),
			    mycells = study.get("cells").toArray(),
			    self = this;

			Ember['default'].RSVP.hash({
				variable: variable,
				study: study,
				scoreIndex: scoreIndex,
				outputNUR: outputNUR,
				mycells: mycells
			}).then(function (hash) {
				var cell = _.chain(hash.mycells).filter(function (c) {
					return c.get("study.id") === hash.study.id;
				}).filter(function (c) {
					return c.get("output.id") === hash.outputNUR.id;
				}).filter(function (c) {
					return c.get("variable.id") === hash.variable.id;
				}).filter(function (c) {
					return c.get("scoreIndex") === hash.scoreIndex;
				}).value()[0];

				if (!cell) {
					cell = self.store.createRecord("cell", {
						scoreIndex: hash.scoreIndex,
						study: hash.study,
						variable: hash.variable,
						output: hash.outputNUR });
				}
				self.set("ownCell", cell);
			});
		}).observes("variable", "outputNUR", "study", "scoreIndex").on("didInsertElement"),

		saveCell: function () {
			var ownCell = this.get("ownCell");

			ownCell.save();
		},

		actions: {
			updatedByUser: function () {
				console.log(this.get("ownCell.score"));
				Ember['default'].run.debounce(this, this.saveCell, 1000);
			}
		}
	});

});
define('frontend/components/modal-container', ['exports', 'ember-modal/components/modal-container'], function (exports, ModalContainer) {

	'use strict';

	exports['default'] = ModalContainer['default'];

});
define('frontend/components/modal-form', ['exports', 'ember-modal/components/modal-form'], function (exports, ModalForm) {

	'use strict';

	exports['default'] = ModalForm['default'];

});
define('frontend/components/modal-title', ['exports', 'ember-modal/components/modal-title'], function (exports, ModalTitle) {

	'use strict';

	exports['default'] = ModalTitle['default'];

});
define('frontend/components/modal-trigger', ['exports', 'ember-modal/components/modal-trigger'], function (exports, ModalTrigger) {

	'use strict';

	exports['default'] = ModalTrigger['default'];

});
define('frontend/components/sl-alert', ['exports', 'sl-ember-components/components/sl-alert'], function (exports, SlAlert) {

	'use strict';

	exports['default'] = SlAlert['default'];

});
define('frontend/components/sl-button', ['exports', 'sl-ember-components/components/sl-button'], function (exports, SlButton) {

	'use strict';

	exports['default'] = SlButton['default'];

});
define('frontend/components/sl-calendar-day', ['exports', 'sl-ember-components/components/sl-calendar-day'], function (exports, SlCalendarDay) {

	'use strict';

	exports['default'] = SlCalendarDay['default'];

});
define('frontend/components/sl-calendar-month', ['exports', 'sl-ember-components/components/sl-calendar-month'], function (exports, SlCalendarMonth) {

	'use strict';

	exports['default'] = SlCalendarMonth['default'];

});
define('frontend/components/sl-calendar-year', ['exports', 'sl-ember-components/components/sl-calendar-year'], function (exports, SlCalendarYear) {

	'use strict';

	exports['default'] = SlCalendarYear['default'];

});
define('frontend/components/sl-calendar', ['exports', 'sl-ember-components/components/sl-calendar'], function (exports, SlCalendar) {

	'use strict';

	exports['default'] = SlCalendar['default'];

});
define('frontend/components/sl-chart', ['exports', 'sl-ember-components/components/sl-chart'], function (exports, SlChart) {

	'use strict';

	exports['default'] = SlChart['default'];

});
define('frontend/components/sl-checkbox', ['exports', 'sl-ember-components/components/sl-checkbox'], function (exports, SlCheckbox) {

	'use strict';

	exports['default'] = SlCheckbox['default'];

});
define('frontend/components/sl-date-picker', ['exports', 'sl-ember-components/components/sl-date-picker'], function (exports, SlDatePicker) {

	'use strict';

	exports['default'] = SlDatePicker['default'];

});
define('frontend/components/sl-date-range-picker', ['exports', 'sl-ember-components/components/sl-date-range-picker'], function (exports, SlDateRangePicker) {

	'use strict';

	exports['default'] = SlDateRangePicker['default'];

});
define('frontend/components/sl-date-time', ['exports', 'sl-ember-components/components/sl-date-time'], function (exports, SlDateTime) {

	'use strict';

	exports['default'] = SlDateTime['default'];

});
define('frontend/components/sl-dialog', ['exports', 'sl-ember-components/components/sl-dialog'], function (exports, SlDialog) {

	'use strict';

	exports['default'] = SlDialog['default'];

});
define('frontend/components/sl-drop-button', ['exports', 'sl-ember-components/components/sl-drop-button'], function (exports, SlDropButton) {

	'use strict';

	exports['default'] = SlDropButton['default'];

});
define('frontend/components/sl-drop-option', ['exports', 'sl-ember-components/components/sl-drop-option'], function (exports, SlDropOption) {

	'use strict';

	exports['default'] = SlDropOption['default'];

});
define('frontend/components/sl-grid-header-settings', ['exports', 'sl-ember-components/components/sl-grid-header-settings'], function (exports, SlGridHeaderSettings) {

	'use strict';

	exports['default'] = SlGridHeaderSettings['default'];

});
define('frontend/components/sl-grid-table-cell-actions', ['exports', 'sl-ember-components/components/sl-grid-table-cell-actions'], function (exports, SlGridTableCellActions) {

	'use strict';

	exports['default'] = SlGridTableCellActions['default'];

});
define('frontend/components/sl-grid-table-cell-link', ['exports', 'sl-ember-components/components/sl-grid-table-cell-link'], function (exports, SlGridTableCellLink) {

	'use strict';

	exports['default'] = SlGridTableCellLink['default'];

});
define('frontend/components/sl-grid-table-cell-row-expander', ['exports', 'sl-ember-components/components/sl-grid-table-cell-row-expander'], function (exports, SlGridTableCellRowExpander) {

	'use strict';

	exports['default'] = SlGridTableCellRowExpander['default'];

});
define('frontend/components/sl-grid-table-cell', ['exports', 'sl-ember-components/components/sl-grid-table-cell'], function (exports, SlGridTableCell) {

	'use strict';

	exports['default'] = SlGridTableCell['default'];

});
define('frontend/components/sl-grid-table-header', ['exports', 'sl-ember-components/components/sl-grid-table-header'], function (exports, SlGridTableHeader) {

	'use strict';

	exports['default'] = SlGridTableHeader['default'];

});
define('frontend/components/sl-grid-table-row-expander', ['exports', 'sl-ember-components/components/sl-grid-table-row-expander'], function (exports, SlGridTableRowExpander) {

	'use strict';

	exports['default'] = SlGridTableRowExpander['default'];

});
define('frontend/components/sl-input', ['exports', 'sl-ember-components/components/sl-input'], function (exports, SlInput) {

	'use strict';

	exports['default'] = SlInput['default'];

});
define('frontend/components/sl-loading-icon', ['exports', 'sl-ember-components/components/sl-loading-icon'], function (exports, SlLoadingIcon) {

	'use strict';

	exports['default'] = SlLoadingIcon['default'];

});
define('frontend/components/sl-menu', ['exports', 'sl-ember-components/components/sl-menu'], function (exports, SlMenu) {

	'use strict';

	exports['default'] = SlMenu['default'];

});
define('frontend/components/sl-pagination-controls', ['exports', 'sl-ember-components/components/sl-pagination-controls'], function (exports, SlPaginationControls) {

	'use strict';

	exports['default'] = SlPaginationControls['default'];

});
define('frontend/components/sl-pagination-info', ['exports', 'sl-ember-components/components/sl-pagination-info'], function (exports, SlPaginationInfo) {

	'use strict';

	exports['default'] = SlPaginationInfo['default'];

});
define('frontend/components/sl-pagination-per-page-select', ['exports', 'sl-ember-components/components/sl-pagination-per-page-select'], function (exports, SlPaginationPerPageSelect) {

	'use strict';

	exports['default'] = SlPaginationPerPageSelect['default'];

});
define('frontend/components/sl-panel', ['exports', 'sl-ember-components/components/sl-panel'], function (exports, SlPanel) {

	'use strict';

	exports['default'] = SlPanel['default'];

});
define('frontend/components/sl-progress-bar', ['exports', 'sl-ember-components/components/sl-progress-bar'], function (exports, SlProgressBar) {

	'use strict';

	exports['default'] = SlProgressBar['default'];

});
define('frontend/components/sl-radio-group', ['exports', 'sl-ember-components/components/sl-radio-group'], function (exports, SlRadioGroup) {

	'use strict';

	exports['default'] = SlRadioGroup['default'];

});
define('frontend/components/sl-radio', ['exports', 'sl-ember-components/components/sl-radio'], function (exports, SlRadio) {

	'use strict';

	exports['default'] = SlRadio['default'];

});
define('frontend/components/sl-select', ['exports', 'sl-ember-components/components/sl-select'], function (exports, SlSelect) {

	'use strict';

	exports['default'] = SlSelect['default'];

});
define('frontend/components/sl-span', ['exports', 'sl-ember-components/components/sl-span'], function (exports, SlSpan) {

	'use strict';

	exports['default'] = SlSpan['default'];

});
define('frontend/components/sl-tab-pane', ['exports', 'sl-ember-components/components/sl-tab-pane'], function (exports, SlTabPane) {

	'use strict';

	exports['default'] = SlTabPane['default'];

});
define('frontend/components/sl-tab-panel', ['exports', 'sl-ember-components/components/sl-tab-panel'], function (exports, SlTabPanel) {

	'use strict';

	exports['default'] = SlTabPanel['default'];

});
define('frontend/components/sl-textarea', ['exports', 'sl-ember-components/components/sl-textarea'], function (exports, SlTextarea) {

	'use strict';

	exports['default'] = SlTextarea['default'];

});
define('frontend/components/sl-tooltip', ['exports', 'sl-ember-components/components/sl-tooltip'], function (exports, SlTooltip) {

	'use strict';

	exports['default'] = SlTooltip['default'];

});
define('frontend/controllers/objectives/new', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('frontend/controllers/policies/new', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend(EmberValidations['default'].Mixin, {
		countryOptions: [{ id: "AF", name: "Afghanistan" }, { id: "AX", name: "Åland Islands" }, { id: "AL", name: "Albania" }, { id: "DZ", name: "Algeria" }, { id: "AS", name: "American Samoa" }, { id: "AD", name: "Andorra" }, { id: "AO", name: "Angola" }, { id: "AI", name: "Anguilla" }, { id: "AQ", name: "Antarctica" }, { id: "AG", name: "Antigua and Barbuda" }, { id: "AR", name: "Argentina" }, { id: "AM", name: "Armenia" }, { id: "AW", name: "Aruba" }, { id: "AU", name: "Australia" }, { id: "AT", name: "Austria" }, { id: "AZ", name: "Azerbaijan" }, { id: "BS", name: "Bahamas" }, { id: "BH", name: "Bahrain" }, { id: "BD", name: "Bangladesh" }, { id: "BB", name: "Barbados" }, { id: "BY", name: "Belarus" }, { id: "BE", name: "Belgium" }, { id: "BZ", name: "Belize" }, { id: "BJ", name: "Benin" }, { id: "BM", name: "Bermuda" }, { id: "BT", name: "Bhutan" }, { id: "BO", name: "Bolivia, Plurinational State of" }, { id: "BQ", name: "Bonaire, Sint Eustatius and Saba" }, { id: "BA", name: "Bosnia and Herzegovina" }, { id: "BW", name: "Botswana" }, { id: "BV", name: "Bouvet Island" }, { id: "BR", name: "Brazil" }, { id: "IO", name: "British Indian Ocean Territory" }, { id: "BN", name: "Brunei Darussalam" }, { id: "BG", name: "Bulgaria" }, { id: "BF", name: "Burkina Faso" }, { id: "BI", name: "Burundi" }, { id: "KH", name: "Cambodia" }, { id: "CM", name: "Cameroon" }, { id: "CA", name: "Canada" }, { id: "CV", name: "Cape Verde" }, { id: "KY", name: "Cayman Islands" }, { id: "CF", name: "Central African Republic" }, { id: "TD", name: "Chad" }, { id: "CL", name: "Chile" }, { id: "CN", name: "China" }, { id: "CX", name: "Christmas Island" }, { id: "CC", name: "Cocos (Keeling) Islands" }, { id: "CO", name: "Colombia" }, { id: "KM", name: "Comoros" }, { id: "CG", name: "Congo" }, { id: "CD", name: "Congo, the Democratic Republic of the" }, { id: "CK", name: "Cook Islands" }, { id: "CR", name: "Costa Rica" }, { id: "CI", name: "Côte d'Ivoire" }, { id: "HR", name: "Croatia" }, { id: "CU", name: "Cuba" }, { id: "CW", name: "Curaçao" }, { id: "CY", name: "Cyprus" }, { id: "CZ", name: "Czech Republic" }, { id: "DK", name: "Denmark" }, { id: "DJ", name: "Djibouti" }, { id: "DM", name: "Dominica" }, { id: "DO", name: "Dominican Republic" }, { id: "EC", name: "Ecuador" }, { id: "EG", name: "Egypt" }, { id: "SV", name: "El Salvador" }, { id: "GQ", name: "Equatorial Guinea" }, { id: "ER", name: "Eritrea" }, { id: "EE", name: "Estonia" }, { id: "ET", name: "Ethiopia" }, { id: "FK", name: "Falkland Islands (Malvinas)" }, { id: "FO", name: "Faroe Islands" }, { id: "FJ", name: "Fiji" }, { id: "FI", name: "Finland" }, { id: "FR", name: "France" }, { id: "GF", name: "French Guiana" }, { id: "PF", name: "French Polynesia" }, { id: "TF", name: "French Southern Territories" }, { id: "GA", name: "Gabon" }, { id: "GM", name: "Gambia" }, { id: "GE", name: "Georgia" }, { id: "DE", name: "Germany" }, { id: "GH", name: "Ghana" }, { id: "GI", name: "Gibraltar" }, { id: "GR", name: "Greece" }, { id: "GL", name: "Greenland" }, { id: "GD", name: "Grenada" }, { id: "GP", name: "Guadeloupe" }, { id: "GU", name: "Guam" }, { id: "GT", name: "Guatemala" }, { id: "GG", name: "Guernsey" }, { id: "GN", name: "Guinea" }, { id: "GW", name: "Guinea-Bissau" }, { id: "GY", name: "Guyana" }, { id: "HT", name: "Haiti" }, { id: "HM", name: "Heard Island and McDonald Islands" }, { id: "VA", name: "Holy See (Vatican City State)" }, { id: "HN", name: "Honduras" }, { id: "HK", name: "Hong Kong" }, { id: "HU", name: "Hungary" }, { id: "IS", name: "Iceland" }, { id: "IN", name: "India" }, { id: "ID", name: "Indonesia" }, { id: "IR", name: "Iran, Islamic Republic of" }, { id: "IQ", name: "Iraq" }, { id: "IE", name: "Ireland" }, { id: "IM", name: "Isle of Man" }, { id: "IL", name: "Israel" }, { id: "IT", name: "Italy" }, { id: "JM", name: "Jamaica" }, { id: "JP", name: "Japan" }, { id: "JE", name: "Jersey" }, { id: "JO", name: "Jordan" }, { id: "KZ", name: "Kazakhstan" }, { id: "KE", name: "Kenya" }, { id: "KI", name: "Kiribati" }, { id: "KP", name: "Korea, Democratic People's Republic of" }, { id: "KR", name: "Korea, Republic of" }, { id: "KW", name: "Kuwait" }, { id: "KG", name: "Kyrgyzstan" }, { id: "LA", name: "Lao People's Democratic Republic" }, { id: "LV", name: "Latvia" }, { id: "LB", name: "Lebanon" }, { id: "LS", name: "Lesotho" }, { id: "LR", name: "Liberia" }, { id: "LY", name: "Libya" }, { id: "LI", name: "Liechtenstein" }, { id: "LT", name: "Lithuania" }, { id: "LU", name: "Luxembourg" }, { id: "MO", name: "Macao" }, { id: "MK", name: "Macedonia, the former Yugoslav Republic of" }, { id: "MG", name: "Madagascar" }, { id: "MW", name: "Malawi" }, { id: "MY", name: "Malaysia" }, { id: "MV", name: "Maldives" }, { id: "ML", name: "Mali" }, { id: "MT", name: "Malta" }, { id: "MH", name: "Marshall Islands" }, { id: "MQ", name: "Martinique" }, { id: "MR", name: "Mauritania" }, { id: "MU", name: "Mauritius" }, { id: "YT", name: "Mayotte" }, { id: "MX", name: "Mexico" }, { id: "FM", name: "Micronesia, Federated States of" }, { id: "MD", name: "Moldova, Republic of" }, { id: "MC", name: "Monaco" }, { id: "MN", name: "Mongolia" }, { id: "ME", name: "Montenegro" }, { id: "MS", name: "Montserrat" }, { id: "MA", name: "Morocco" }, { id: "MZ", name: "Mozambique" }, { id: "MM", name: "Myanmar" }, { id: "NA", name: "Namibia" }, { id: "NR", name: "Nauru" }, { id: "NP", name: "Nepal" }, { id: "NL", name: "Netherlands" }, { id: "NC", name: "New Caledonia" }, { id: "NZ", name: "New Zealand" }, { id: "NI", name: "Nicaragua" }, { id: "NE", name: "Niger" }, { id: "NG", name: "Nigeria" }, { id: "NU", name: "Niue" }, { id: "NF", name: "Norfolk Island" }, { id: "MP", name: "Northern Mariana Islands" }, { id: "NO", name: "Norway" }, { id: "OM", name: "Oman" }, { id: "PK", name: "Pakistan" }, { id: "PW", name: "Palau" }, { id: "PS", name: "Palestinian Territory, Occupied" }, { id: "PA", name: "Panama" }, { id: "PG", name: "Papua New Guinea" }, { id: "PY", name: "Paraguay" }, { id: "PE", name: "Peru" }, { id: "PH", name: "Philippines" }, { id: "PN", name: "Pitcairn" }, { id: "PL", name: "Poland" }, { id: "PT", name: "Portugal" }, { id: "PR", name: "Puerto Rico" }, { id: "QA", name: "Qatar" }, { id: "RE", name: "Réunion" }, { id: "RO", name: "Romania" }, { id: "RU", name: "Russian Federation" }, { id: "RW", name: "Rwanda" }, { id: "BL", name: "Saint Barthélemy" }, { id: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" }, { id: "KN", name: "Saint Kitts and Nevis" }, { id: "LC", name: "Saint Lucia" }, { id: "MF", name: "Saint Martin (French part)" }, { id: "PM", name: "Saint Pierre and Miquelon" }, { id: "VC", name: "Saint Vincent and the Grenadines" }, { id: "WS", name: "Samoa" }, { id: "SM", name: "San Marino" }, { id: "ST", name: "Sao Tome and Principe" }, { id: "SA", name: "Saudi Arabia" }, { id: "SN", name: "Senegal" }, { id: "RS", name: "Serbia" }, { id: "SC", name: "Seychelles" }, { id: "SL", name: "Sierra Leone" }, { id: "SG", name: "Singapore" }, { id: "SX", name: "Sint Maarten (Dutch part)" }, { id: "SK", name: "Slovakia" }, { id: "SI", name: "Slovenia" }, { id: "SB", name: "Solomon Islands" }, { id: "SO", name: "Somalia" }, { id: "ZA", name: "South Africa" }, { id: "GS", name: "South Georgia and the South Sandwich Islands" }, { id: "SS", name: "South Sudan" }, { id: "ES", name: "Spain" }, { id: "LK", name: "Sri Lanka" }, { id: "SD", name: "Sudan" }, { id: "SR", name: "Suriname" }, { id: "SJ", name: "Svalbard and Jan Mayen" }, { id: "SZ", name: "Swaziland" }, { id: "SE", name: "Sweden" }, { id: "CH", name: "Switzerland" }, { id: "SY", name: "Syrian Arab Republic" }, { id: "TW", name: "Taiwan, Province of China" }, { id: "TJ", name: "Tajikistan" }, { id: "TZ", name: "Tanzania, United Republic of" }, { id: "TH", name: "Thailand" }, { id: "TL", name: "Timor-Leste" }, { id: "TG", name: "Togo" }, { id: "TK", name: "Tokelau" }, { id: "TO", name: "Tonga" }, { id: "TT", name: "Trinidad and Tobago" }, { id: "TN", name: "Tunisia" }, { id: "TR", name: "Turkey" }, { id: "TM", name: "Turkmenistan" }, { id: "TC", name: "Turks and Caicos Islands" }, { id: "TV", name: "Tuvalu" }, { id: "UG", name: "Uganda" }, { id: "UA", name: "Ukraine" }, { id: "AE", name: "United Arab Emirates" }, { id: "GB", name: "United Kingdom" }, { id: "US", name: "United States" }, { id: "UM", name: "United States Minor Outlying Islands" }, { id: "UY", name: "Uruguay" }, { id: "UZ", name: "Uzbekistan" }, { id: "VU", name: "Vanuatu" }, { id: "VE", name: "Venezuela, Bolivarian Republic of" }, { id: "VN", name: "Viet Nam" }, { id: "VG", name: "Virgin Islands, British" }, { id: "VI", name: "Virgin Islands, U.S." }, { id: "WF", name: "Wallis and Futuna" }, { id: "EH", name: "Western Sahara" }, { id: "YE", name: "Yemen" }, { id: "ZM", name: "Zambia" }, { id: "ZW", name: "Zimbabwe" }],

		selectedObject: null,

		flagClass: (function () {
			var selectedObject = this.get("selectedObject.id") || "";
			return "flag-icon-" + selectedObject.toLowerCase();
		}).property("selectedObject"),

		isValid: Ember['default'].computed("model.country", "model.title", function () {
			return !Ember['default'].isEmpty(this.get("model.country")) && !Ember['default'].isEmpty(this.get("model.title"));
		}),
		actions: {
			save: function () {
				if (this.get("isValid")) {
					var _this = this;
					this.get("model").save().then(function (pyp) {
						_this.transitionToRoute("objectives", pyp);
					});
				} else {
					this.set("errorMessage", "You have to specify a country and a title");
				}
				return false;
			},
			cancel: function () {
				this.transitionToRoute("policies");
				return false;
			}
		},
		typologyOptions: ["Policy", "Program", "Strategy", "Policy Framework", "Other"],
		rFrameworkOptions: ["Law", "Decree", "Constitutional Article", "Other"],
		gCoverageOptions: ["Nat", "Dep", "Prov", "Com", "Other"],

		currencyOptions: [{ id: "AED", name: "AED - United Arab Emirates Dirham" }, { id: "AFN", name: "AFN - Afghanistan Afghani" }, { id: "ALL", name: "ALL - Albania Lek" }, { id: "AMD", name: "AMD - Armenia Dram" }, { id: "ANG", name: "ANG - Netherlands Antilles Guilder" }, { id: "AOA", name: "AOA - Angola Kwanza" }, { id: "ARS", name: "ARS - Argentina Peso" }, { id: "AUD", name: "AUD - Australia Dollar" }, { id: "AWG", name: "AWG - Aruba Guilder" }, { id: "AZN", name: "AZN - Azerbaijan New Manat" }, { id: "BAM", name: "BAM - Bosnia and Herzegovina Convertible Marka" }, { id: "BBD", name: "BBD - Barbados Dollar" }, { id: "BDT", name: "BDT - Bangladesh Taka" }, { id: "BGN", name: "BGN - Bulgaria Lev" }, { id: "BHD", name: "BHD - Bahrain Dinar" }, { id: "BIF", name: "BIF - Burundi Franc" }, { id: "BMD", name: "BMD - Bermuda Dollar" }, { id: "BND", name: "BND - Brunei Darussalam Dollar" }, { id: "BOB", name: "BOB - Bolivia Boliviano" }, { id: "BRL", name: "BRL - Brazil Real" }, { id: "BSD", name: "BSD - Bahamas Dollar" }, { id: "BTN", name: "BTN - Bhutan Ngultrum" }, { id: "BWP", name: "BWP - Botswana Pula" }, { id: "BYR", name: "BYR - Belarus Ruble" }, { id: "BZD", name: "BZD - Belize Dollar" }, { id: "CAD", name: "CAD - Canada Dollar" }, { id: "CDF", name: "CDF - Congo/Kinshasa Franc" }, { id: "CHF", name: "CHF - Switzerland Franc" }, { id: "CLP", name: "CLP - Chile Peso" }, { id: "CNY", name: "CNY - China Yuan Renminbi" }, { id: "COP", name: "COP - Colombia Peso" }, { id: "CRC", name: "CRC - Costa Rica Colon" }, { id: "CUC", name: "CUC - Cuba Convertible Peso" }, { id: "CUP", name: "CUP - Cuba Peso" }, { id: "CVE", name: "CVE - Cape Verde Escudo" }, { id: "CZK", name: "CZK - Czech Republic Koruna" }, { id: "DJF", name: "DJF - Djibouti Franc" }, { id: "DKK", name: "DKK - Denmark Krone" }, { id: "DOP", name: "DOP - Dominican Republic Peso" }, { id: "DZD", name: "DZD - Algeria Dinar" }, { id: "EGP", name: "EGP - Egypt Pound" }, { id: "ERN", name: "ERN - Eritrea Nakfa" }, { id: "ETB", name: "ETB - Ethiopia Birr" }, { id: "EUR", name: "EUR - Euro Member Countries" }, { id: "FJD", name: "FJD - Fiji Dollar" }, { id: "FKP", name: "FKP - Falkland Islands (Malvinas) Pound" }, { id: "GBP", name: "GBP - United Kingdom Pound" }, { id: "GEL", name: "GEL - Georgia Lari" }, { id: "GGP", name: "GGP - Guernsey Pound" }, { id: "GHS", name: "GHS - Ghana Cedi" }, { id: "GIP", name: "GIP - Gibraltar Pound" }, { id: "GMD", name: "GMD - Gambia Dalasi" }, { id: "GNF", name: "GNF - Guinea Franc" }, { id: "GTQ", name: "GTQ - Guatemala Quetzal" }, { id: "GYD", name: "GYD - Guyana Dollar" }, { id: "HKD", name: "HKD - Hong Kong Dollar" }, { id: "HNL", name: "HNL - Honduras Lempira" }, { id: "HRK", name: "HRK - Croatia Kuna" }, { id: "HTG", name: "HTG - Haiti Gourde" }, { id: "HUF", name: "HUF - Hungary Forint" }, { id: "IDR", name: "IDR - Indonesia Rupiah" }, { id: "ILS", name: "ILS - Israel Shekel" }, { id: "IMP", name: "IMP - Isle of Man Pound" }, { id: "INR", name: "INR - India Rupee" }, { id: "IQD", name: "IQD - Iraq Dinar" }, { id: "IRR", name: "IRR - Iran Rial" }, { id: "ISK", name: "ISK - Iceland Krona" }, { id: "JEP", name: "JEP - Jersey Pound" }, { id: "JMD", name: "JMD - Jamaica Dollar" }, { id: "JOD", name: "JOD - Jordan Dinar" }, { id: "JPY", name: "JPY - Japan Yen" }, { id: "KES", name: "KES - Kenya Shilling" }, { id: "KGS", name: "KGS - Kyrgyzstan Som" }, { id: "KHR", name: "KHR - Cambodia Riel" }, { id: "KMF", name: "KMF - Comoros Franc" }, { id: "KPW", name: "KPW - Korea (North) Won" }, { id: "KRW", name: "KRW - Korea (South) Won" }, { id: "KWD", name: "KWD - Kuwait Dinar" }, { id: "KYD", name: "KYD - Cayman Islands Dollar" }, { id: "KZT", name: "KZT - Kazakhstan Tenge" }, { id: "LAK", name: "LAK - Laos Kip" }, { id: "LBP", name: "LBP - Lebanon Pound" }, { id: "LKR", name: "LKR - Sri Lanka Rupee" }, { id: "LRD", name: "LRD - Liberia Dollar" }, { id: "LSL", name: "LSL - Lesotho Loti" }, { id: "LYD", name: "LYD - Libya Dinar" }, { id: "MAD", name: "MAD - Morocco Dirham" }, { id: "MDL", name: "MDL - Moldova Leu" }, { id: "MGA", name: "MGA - Madagascar Ariary" }, { id: "MKD", name: "MKD - Macedonia Denar" }, { id: "MMK", name: "MMK - Myanmar (Burma) Kyat" }, { id: "MNT", name: "MNT - Mongolia Tughrik" }, { id: "MOP", name: "MOP - Macau Pataca" }, { id: "MRO", name: "MRO - Mauritania Ouguiya" }, { id: "MUR", name: "MUR - Mauritius Rupee" }, { id: "MVR", name: "MVR - Maldives (Maldive Islands) Rufiyaa" }, { id: "MWK", name: "MWK - Malawi Kwacha" }, { id: "MXN", name: "MXN - Mexico Peso" }, { id: "MYR", name: "MYR - Malaysia Ringgit" }, { id: "MZN", name: "MZN - Mozambique Metical" }, { id: "NAD", name: "NAD - Namibia Dollar" }, { id: "NGN", name: "NGN - Nigeria Naira" }, { id: "NIO", name: "NIO - Nicaragua Cordoba" }, { id: "NOK", name: "NOK - Norway Krone" }, { id: "NPR", name: "NPR - Nepal Rupee" }, { id: "NZD", name: "NZD - New Zealand Dollar" }, { id: "OMR", name: "OMR - Oman Rial" }, { id: "PAB", name: "PAB - Panama Balboa" }, { id: "PEN", name: "PEN - Peru Nuevo Sol" }, { id: "PGK", name: "PGK - Papua New Guinea Kina" }, { id: "PHP", name: "PHP - Philippines Peso" }, { id: "PKR", name: "PKR - Pakistan Rupee" }, { id: "PLN", name: "PLN - Poland Zloty" }, { id: "PYG", name: "PYG - Paraguay Guarani" }, { id: "QAR", name: "QAR - Qatar Riyal" }, { id: "RON", name: "RON - Romania New Leu" }, { id: "RSD", name: "RSD - Serbia Dinar" }, { id: "RUB", name: "RUB - Russia Ruble" }, { id: "RWF", name: "RWF - Rwanda Franc" }, { id: "SAR", name: "SAR - Saudi Arabia Riyal" }, { id: "SBD", name: "SBD - Solomon Islands Dollar" }, { id: "SCR", name: "SCR - Seychelles Rupee" }, { id: "SDG", name: "SDG - Sudan Pound" }, { id: "SEK", name: "SEK - Sweden Krona" }, { id: "SGD", name: "SGD - Singapore Dollar" }, { id: "SHP", name: "SHP - Saint Helena Pound" }, { id: "SLL", name: "SLL - Sierra Leone Leone" }, { id: "SOS", name: "SOS - Somalia Shilling" }, { id: "SPL", name: "SPL - Seborga Luigino" }, { id: "SRD", name: "SRD - Suriname Dollar" }, { id: "STD", name: "STD - São Tomé and Príncipe Dobra" }, { id: "SVC", name: "SVC - El Salvador Colon" }, { id: "SYP", name: "SYP - Syria Pound" }, { id: "SZL", name: "SZL - Swaziland Lilangeni" }, { id: "THB", name: "THB - Thailand Baht" }, { id: "TJS", name: "TJS - Tajikistan Somoni" }, { id: "TMT", name: "TMT - Turkmenistan Manat" }, { id: "TND", name: "TND - Tunisia Dinar" }, { id: "TOP", name: "TOP - Tonga Pa'anga" }, { id: "TRY", name: "TRY - Turkey Lira" }, { id: "TTD", name: "TTD - Trinidad and Tobago Dollar" }, { id: "TVD", name: "TVD - Tuvalu Dollar" }, { id: "TWD", name: "TWD - Taiwan New Dollar" }, { id: "TZS", name: "TZS - Tanzania Shilling" }, { id: "UAH", name: "UAH - Ukraine Hryvnia" }, { id: "UGX", name: "UGX - Uganda Shilling" }, { id: "USD", name: "USD - United States Dollar" }, { id: "UYU", name: "UYU - Uruguay Peso" }, { id: "UZS", name: "UZS - Uzbekistan Som" }, { id: "VEF", name: "VEF - Venezuela Bolivar" }, { id: "VND", name: "VND - Viet Nam Dong" }, { id: "VUV", name: "VUV - Vanuatu Vatu" }, { id: "WST", name: "WST - Samoa Tala" }, { id: "XAF", name: "XAF - Communauté Financière Africaine (BEAC) CFA Franc BEAC" }, { id: "XCD", name: "XCD - East Caribbean Dollar" }, { id: "XDR", name: "XDR - International Monetary Fund (IMF) Special Drawing Rights" }, { id: "XOF", name: "XOF - Communauté Financière Africaine (BCEAO) Franc" }, { id: "XPF", name: "XPF - Comptoirs Français du Pacifique (CFP) Franc" }, { id: "YER", name: "YER - Yemen Rial" }, { id: "ZAR", name: "ZAR - South Africa Rand" }, { id: "ZMW", name: "ZMW - Zambia Kwacha" }, { id: "ZWD", name: "ZWD - Zimbabwe Dollar" }]
	});

});
define('frontend/controllers/policy/edit', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend(EmberValidations['default'].Mixin, {
		countryOptions: [{ id: "AF", name: "Afghanistan" }, { id: "AX", name: "Åland Islands" }, { id: "AL", name: "Albania" }, { id: "DZ", name: "Algeria" }, { id: "AS", name: "American Samoa" }, { id: "AD", name: "Andorra" }, { id: "AO", name: "Angola" }, { id: "AI", name: "Anguilla" }, { id: "AQ", name: "Antarctica" }, { id: "AG", name: "Antigua and Barbuda" }, { id: "AR", name: "Argentina" }, { id: "AM", name: "Armenia" }, { id: "AW", name: "Aruba" }, { id: "AU", name: "Australia" }, { id: "AT", name: "Austria" }, { id: "AZ", name: "Azerbaijan" }, { id: "BS", name: "Bahamas" }, { id: "BH", name: "Bahrain" }, { id: "BD", name: "Bangladesh" }, { id: "BB", name: "Barbados" }, { id: "BY", name: "Belarus" }, { id: "BE", name: "Belgium" }, { id: "BZ", name: "Belize" }, { id: "BJ", name: "Benin" }, { id: "BM", name: "Bermuda" }, { id: "BT", name: "Bhutan" }, { id: "BO", name: "Bolivia, Plurinational State of" }, { id: "BQ", name: "Bonaire, Sint Eustatius and Saba" }, { id: "BA", name: "Bosnia and Herzegovina" }, { id: "BW", name: "Botswana" }, { id: "BV", name: "Bouvet Island" }, { id: "BR", name: "Brazil" }, { id: "IO", name: "British Indian Ocean Territory" }, { id: "BN", name: "Brunei Darussalam" }, { id: "BG", name: "Bulgaria" }, { id: "BF", name: "Burkina Faso" }, { id: "BI", name: "Burundi" }, { id: "KH", name: "Cambodia" }, { id: "CM", name: "Cameroon" }, { id: "CA", name: "Canada" }, { id: "CV", name: "Cape Verde" }, { id: "KY", name: "Cayman Islands" }, { id: "CF", name: "Central African Republic" }, { id: "TD", name: "Chad" }, { id: "CL", name: "Chile" }, { id: "CN", name: "China" }, { id: "CX", name: "Christmas Island" }, { id: "CC", name: "Cocos (Keeling) Islands" }, { id: "CO", name: "Colombia" }, { id: "KM", name: "Comoros" }, { id: "CG", name: "Congo" }, { id: "CD", name: "Congo, the Democratic Republic of the" }, { id: "CK", name: "Cook Islands" }, { id: "CR", name: "Costa Rica" }, { id: "CI", name: "Côte d'Ivoire" }, { id: "HR", name: "Croatia" }, { id: "CU", name: "Cuba" }, { id: "CW", name: "Curaçao" }, { id: "CY", name: "Cyprus" }, { id: "CZ", name: "Czech Republic" }, { id: "DK", name: "Denmark" }, { id: "DJ", name: "Djibouti" }, { id: "DM", name: "Dominica" }, { id: "DO", name: "Dominican Republic" }, { id: "EC", name: "Ecuador" }, { id: "EG", name: "Egypt" }, { id: "SV", name: "El Salvador" }, { id: "GQ", name: "Equatorial Guinea" }, { id: "ER", name: "Eritrea" }, { id: "EE", name: "Estonia" }, { id: "ET", name: "Ethiopia" }, { id: "FK", name: "Falkland Islands (Malvinas)" }, { id: "FO", name: "Faroe Islands" }, { id: "FJ", name: "Fiji" }, { id: "FI", name: "Finland" }, { id: "FR", name: "France" }, { id: "GF", name: "French Guiana" }, { id: "PF", name: "French Polynesia" }, { id: "TF", name: "French Southern Territories" }, { id: "GA", name: "Gabon" }, { id: "GM", name: "Gambia" }, { id: "GE", name: "Georgia" }, { id: "DE", name: "Germany" }, { id: "GH", name: "Ghana" }, { id: "GI", name: "Gibraltar" }, { id: "GR", name: "Greece" }, { id: "GL", name: "Greenland" }, { id: "GD", name: "Grenada" }, { id: "GP", name: "Guadeloupe" }, { id: "GU", name: "Guam" }, { id: "GT", name: "Guatemala" }, { id: "GG", name: "Guernsey" }, { id: "GN", name: "Guinea" }, { id: "GW", name: "Guinea-Bissau" }, { id: "GY", name: "Guyana" }, { id: "HT", name: "Haiti" }, { id: "HM", name: "Heard Island and McDonald Islands" }, { id: "VA", name: "Holy See (Vatican City State)" }, { id: "HN", name: "Honduras" }, { id: "HK", name: "Hong Kong" }, { id: "HU", name: "Hungary" }, { id: "IS", name: "Iceland" }, { id: "IN", name: "India" }, { id: "ID", name: "Indonesia" }, { id: "IR", name: "Iran, Islamic Republic of" }, { id: "IQ", name: "Iraq" }, { id: "IE", name: "Ireland" }, { id: "IM", name: "Isle of Man" }, { id: "IL", name: "Israel" }, { id: "IT", name: "Italy" }, { id: "JM", name: "Jamaica" }, { id: "JP", name: "Japan" }, { id: "JE", name: "Jersey" }, { id: "JO", name: "Jordan" }, { id: "KZ", name: "Kazakhstan" }, { id: "KE", name: "Kenya" }, { id: "KI", name: "Kiribati" }, { id: "KP", name: "Korea, Democratic People's Republic of" }, { id: "KR", name: "Korea, Republic of" }, { id: "KW", name: "Kuwait" }, { id: "KG", name: "Kyrgyzstan" }, { id: "LA", name: "Lao People's Democratic Republic" }, { id: "LV", name: "Latvia" }, { id: "LB", name: "Lebanon" }, { id: "LS", name: "Lesotho" }, { id: "LR", name: "Liberia" }, { id: "LY", name: "Libya" }, { id: "LI", name: "Liechtenstein" }, { id: "LT", name: "Lithuania" }, { id: "LU", name: "Luxembourg" }, { id: "MO", name: "Macao" }, { id: "MK", name: "Macedonia, the former Yugoslav Republic of" }, { id: "MG", name: "Madagascar" }, { id: "MW", name: "Malawi" }, { id: "MY", name: "Malaysia" }, { id: "MV", name: "Maldives" }, { id: "ML", name: "Mali" }, { id: "MT", name: "Malta" }, { id: "MH", name: "Marshall Islands" }, { id: "MQ", name: "Martinique" }, { id: "MR", name: "Mauritania" }, { id: "MU", name: "Mauritius" }, { id: "YT", name: "Mayotte" }, { id: "MX", name: "Mexico" }, { id: "FM", name: "Micronesia, Federated States of" }, { id: "MD", name: "Moldova, Republic of" }, { id: "MC", name: "Monaco" }, { id: "MN", name: "Mongolia" }, { id: "ME", name: "Montenegro" }, { id: "MS", name: "Montserrat" }, { id: "MA", name: "Morocco" }, { id: "MZ", name: "Mozambique" }, { id: "MM", name: "Myanmar" }, { id: "NA", name: "Namibia" }, { id: "NR", name: "Nauru" }, { id: "NP", name: "Nepal" }, { id: "NL", name: "Netherlands" }, { id: "NC", name: "New Caledonia" }, { id: "NZ", name: "New Zealand" }, { id: "NI", name: "Nicaragua" }, { id: "NE", name: "Niger" }, { id: "NG", name: "Nigeria" }, { id: "NU", name: "Niue" }, { id: "NF", name: "Norfolk Island" }, { id: "MP", name: "Northern Mariana Islands" }, { id: "NO", name: "Norway" }, { id: "OM", name: "Oman" }, { id: "PK", name: "Pakistan" }, { id: "PW", name: "Palau" }, { id: "PS", name: "Palestinian Territory, Occupied" }, { id: "PA", name: "Panama" }, { id: "PG", name: "Papua New Guinea" }, { id: "PY", name: "Paraguay" }, { id: "PE", name: "Peru" }, { id: "PH", name: "Philippines" }, { id: "PN", name: "Pitcairn" }, { id: "PL", name: "Poland" }, { id: "PT", name: "Portugal" }, { id: "PR", name: "Puerto Rico" }, { id: "QA", name: "Qatar" }, { id: "RE", name: "Réunion" }, { id: "RO", name: "Romania" }, { id: "RU", name: "Russian Federation" }, { id: "RW", name: "Rwanda" }, { id: "BL", name: "Saint Barthélemy" }, { id: "SH", name: "Saint Helena, Ascension and Tristan da Cunha" }, { id: "KN", name: "Saint Kitts and Nevis" }, { id: "LC", name: "Saint Lucia" }, { id: "MF", name: "Saint Martin (French part)" }, { id: "PM", name: "Saint Pierre and Miquelon" }, { id: "VC", name: "Saint Vincent and the Grenadines" }, { id: "WS", name: "Samoa" }, { id: "SM", name: "San Marino" }, { id: "ST", name: "Sao Tome and Principe" }, { id: "SA", name: "Saudi Arabia" }, { id: "SN", name: "Senegal" }, { id: "RS", name: "Serbia" }, { id: "SC", name: "Seychelles" }, { id: "SL", name: "Sierra Leone" }, { id: "SG", name: "Singapore" }, { id: "SX", name: "Sint Maarten (Dutch part)" }, { id: "SK", name: "Slovakia" }, { id: "SI", name: "Slovenia" }, { id: "SB", name: "Solomon Islands" }, { id: "SO", name: "Somalia" }, { id: "ZA", name: "South Africa" }, { id: "GS", name: "South Georgia and the South Sandwich Islands" }, { id: "SS", name: "South Sudan" }, { id: "ES", name: "Spain" }, { id: "LK", name: "Sri Lanka" }, { id: "SD", name: "Sudan" }, { id: "SR", name: "Suriname" }, { id: "SJ", name: "Svalbard and Jan Mayen" }, { id: "SZ", name: "Swaziland" }, { id: "SE", name: "Sweden" }, { id: "CH", name: "Switzerland" }, { id: "SY", name: "Syrian Arab Republic" }, { id: "TW", name: "Taiwan, Province of China" }, { id: "TJ", name: "Tajikistan" }, { id: "TZ", name: "Tanzania, United Republic of" }, { id: "TH", name: "Thailand" }, { id: "TL", name: "Timor-Leste" }, { id: "TG", name: "Togo" }, { id: "TK", name: "Tokelau" }, { id: "TO", name: "Tonga" }, { id: "TT", name: "Trinidad and Tobago" }, { id: "TN", name: "Tunisia" }, { id: "TR", name: "Turkey" }, { id: "TM", name: "Turkmenistan" }, { id: "TC", name: "Turks and Caicos Islands" }, { id: "TV", name: "Tuvalu" }, { id: "UG", name: "Uganda" }, { id: "UA", name: "Ukraine" }, { id: "AE", name: "United Arab Emirates" }, { id: "GB", name: "United Kingdom" }, { id: "US", name: "United States" }, { id: "UM", name: "United States Minor Outlying Islands" }, { id: "UY", name: "Uruguay" }, { id: "UZ", name: "Uzbekistan" }, { id: "VU", name: "Vanuatu" }, { id: "VE", name: "Venezuela, Bolivarian Republic of" }, { id: "VN", name: "Viet Nam" }, { id: "VG", name: "Virgin Islands, British" }, { id: "VI", name: "Virgin Islands, U.S." }, { id: "WF", name: "Wallis and Futuna" }, { id: "EH", name: "Western Sahara" }, { id: "YE", name: "Yemen" }, { id: "ZM", name: "Zambia" }, { id: "ZW", name: "Zimbabwe" }],

		selectedObject: null,

		flagClass: (function () {
			var selectedObject = this.get("selectedObject.id") || "";
			return "flag-icon-" + selectedObject.toLowerCase();
		}).property("selectedObject"),

		isValid: Ember['default'].computed("model.title", "model.country", function () {
			return !Ember['default'].isEmpty(this.get("model.title")) && !Ember['default'].isEmpty(this.get("model.country"));
		}),
		actions: {
			save: function () {
				if (this.get("isValid")) {
					var _this = this;
					this.get("model").save().then(function (pyp) {
						_this.transitionToRoute("policy", pyp);
					});
				} else {
					this.set("errorMessage", "You have to at least specify a title and a country.");
				}
				return false;
			},
			cancel: function () {
				this.transitionToRoute("policy", this.get("model"));
				return false;
			}
		},

		typologyOptions: ["Policy", "Program", "Strategy", "Policy Framework", "Other"],
		rFrameworkOptions: ["Law", "Decree", "Constitutional Article", "Other"],
		gCoverageOptions: ["Nat", "Dep", "Prov", "Com", "Other"],

		currencyOptions: [{ id: "AED", name: "AED - United Arab Emirates Dirham" }, { id: "AFN", name: "AFN - Afghanistan Afghani" }, { id: "ALL", name: "ALL - Albania Lek" }, { id: "AMD", name: "AMD - Armenia Dram" }, { id: "ANG", name: "ANG - Netherlands Antilles Guilder" }, { id: "AOA", name: "AOA - Angola Kwanza" }, { id: "ARS", name: "ARS - Argentina Peso" }, { id: "AUD", name: "AUD - Australia Dollar" }, { id: "AWG", name: "AWG - Aruba Guilder" }, { id: "AZN", name: "AZN - Azerbaijan New Manat" }, { id: "BAM", name: "BAM - Bosnia and Herzegovina Convertible Marka" }, { id: "BBD", name: "BBD - Barbados Dollar" }, { id: "BDT", name: "BDT - Bangladesh Taka" }, { id: "BGN", name: "BGN - Bulgaria Lev" }, { id: "BHD", name: "BHD - Bahrain Dinar" }, { id: "BIF", name: "BIF - Burundi Franc" }, { id: "BMD", name: "BMD - Bermuda Dollar" }, { id: "BND", name: "BND - Brunei Darussalam Dollar" }, { id: "BOB", name: "BOB - Bolivia Boliviano" }, { id: "BRL", name: "BRL - Brazil Real" }, { id: "BSD", name: "BSD - Bahamas Dollar" }, { id: "BTN", name: "BTN - Bhutan Ngultrum" }, { id: "BWP", name: "BWP - Botswana Pula" }, { id: "BYR", name: "BYR - Belarus Ruble" }, { id: "BZD", name: "BZD - Belize Dollar" }, { id: "CAD", name: "CAD - Canada Dollar" }, { id: "CDF", name: "CDF - Congo/Kinshasa Franc" }, { id: "CHF", name: "CHF - Switzerland Franc" }, { id: "CLP", name: "CLP - Chile Peso" }, { id: "CNY", name: "CNY - China Yuan Renminbi" }, { id: "COP", name: "COP - Colombia Peso" }, { id: "CRC", name: "CRC - Costa Rica Colon" }, { id: "CUC", name: "CUC - Cuba Convertible Peso" }, { id: "CUP", name: "CUP - Cuba Peso" }, { id: "CVE", name: "CVE - Cape Verde Escudo" }, { id: "CZK", name: "CZK - Czech Republic Koruna" }, { id: "DJF", name: "DJF - Djibouti Franc" }, { id: "DKK", name: "DKK - Denmark Krone" }, { id: "DOP", name: "DOP - Dominican Republic Peso" }, { id: "DZD", name: "DZD - Algeria Dinar" }, { id: "EGP", name: "EGP - Egypt Pound" }, { id: "ERN", name: "ERN - Eritrea Nakfa" }, { id: "ETB", name: "ETB - Ethiopia Birr" }, { id: "EUR", name: "EUR - Euro Member Countries" }, { id: "FJD", name: "FJD - Fiji Dollar" }, { id: "FKP", name: "FKP - Falkland Islands (Malvinas) Pound" }, { id: "GBP", name: "GBP - United Kingdom Pound" }, { id: "GEL", name: "GEL - Georgia Lari" }, { id: "GGP", name: "GGP - Guernsey Pound" }, { id: "GHS", name: "GHS - Ghana Cedi" }, { id: "GIP", name: "GIP - Gibraltar Pound" }, { id: "GMD", name: "GMD - Gambia Dalasi" }, { id: "GNF", name: "GNF - Guinea Franc" }, { id: "GTQ", name: "GTQ - Guatemala Quetzal" }, { id: "GYD", name: "GYD - Guyana Dollar" }, { id: "HKD", name: "HKD - Hong Kong Dollar" }, { id: "HNL", name: "HNL - Honduras Lempira" }, { id: "HRK", name: "HRK - Croatia Kuna" }, { id: "HTG", name: "HTG - Haiti Gourde" }, { id: "HUF", name: "HUF - Hungary Forint" }, { id: "IDR", name: "IDR - Indonesia Rupiah" }, { id: "ILS", name: "ILS - Israel Shekel" }, { id: "IMP", name: "IMP - Isle of Man Pound" }, { id: "INR", name: "INR - India Rupee" }, { id: "IQD", name: "IQD - Iraq Dinar" }, { id: "IRR", name: "IRR - Iran Rial" }, { id: "ISK", name: "ISK - Iceland Krona" }, { id: "JEP", name: "JEP - Jersey Pound" }, { id: "JMD", name: "JMD - Jamaica Dollar" }, { id: "JOD", name: "JOD - Jordan Dinar" }, { id: "JPY", name: "JPY - Japan Yen" }, { id: "KES", name: "KES - Kenya Shilling" }, { id: "KGS", name: "KGS - Kyrgyzstan Som" }, { id: "KHR", name: "KHR - Cambodia Riel" }, { id: "KMF", name: "KMF - Comoros Franc" }, { id: "KPW", name: "KPW - Korea (North) Won" }, { id: "KRW", name: "KRW - Korea (South) Won" }, { id: "KWD", name: "KWD - Kuwait Dinar" }, { id: "KYD", name: "KYD - Cayman Islands Dollar" }, { id: "KZT", name: "KZT - Kazakhstan Tenge" }, { id: "LAK", name: "LAK - Laos Kip" }, { id: "LBP", name: "LBP - Lebanon Pound" }, { id: "LKR", name: "LKR - Sri Lanka Rupee" }, { id: "LRD", name: "LRD - Liberia Dollar" }, { id: "LSL", name: "LSL - Lesotho Loti" }, { id: "LYD", name: "LYD - Libya Dinar" }, { id: "MAD", name: "MAD - Morocco Dirham" }, { id: "MDL", name: "MDL - Moldova Leu" }, { id: "MGA", name: "MGA - Madagascar Ariary" }, { id: "MKD", name: "MKD - Macedonia Denar" }, { id: "MMK", name: "MMK - Myanmar (Burma) Kyat" }, { id: "MNT", name: "MNT - Mongolia Tughrik" }, { id: "MOP", name: "MOP - Macau Pataca" }, { id: "MRO", name: "MRO - Mauritania Ouguiya" }, { id: "MUR", name: "MUR - Mauritius Rupee" }, { id: "MVR", name: "MVR - Maldives (Maldive Islands) Rufiyaa" }, { id: "MWK", name: "MWK - Malawi Kwacha" }, { id: "MXN", name: "MXN - Mexico Peso" }, { id: "MYR", name: "MYR - Malaysia Ringgit" }, { id: "MZN", name: "MZN - Mozambique Metical" }, { id: "NAD", name: "NAD - Namibia Dollar" }, { id: "NGN", name: "NGN - Nigeria Naira" }, { id: "NIO", name: "NIO - Nicaragua Cordoba" }, { id: "NOK", name: "NOK - Norway Krone" }, { id: "NPR", name: "NPR - Nepal Rupee" }, { id: "NZD", name: "NZD - New Zealand Dollar" }, { id: "OMR", name: "OMR - Oman Rial" }, { id: "PAB", name: "PAB - Panama Balboa" }, { id: "PEN", name: "PEN - Peru Nuevo Sol" }, { id: "PGK", name: "PGK - Papua New Guinea Kina" }, { id: "PHP", name: "PHP - Philippines Peso" }, { id: "PKR", name: "PKR - Pakistan Rupee" }, { id: "PLN", name: "PLN - Poland Zloty" }, { id: "PYG", name: "PYG - Paraguay Guarani" }, { id: "QAR", name: "QAR - Qatar Riyal" }, { id: "RON", name: "RON - Romania New Leu" }, { id: "RSD", name: "RSD - Serbia Dinar" }, { id: "RUB", name: "RUB - Russia Ruble" }, { id: "RWF", name: "RWF - Rwanda Franc" }, { id: "SAR", name: "SAR - Saudi Arabia Riyal" }, { id: "SBD", name: "SBD - Solomon Islands Dollar" }, { id: "SCR", name: "SCR - Seychelles Rupee" }, { id: "SDG", name: "SDG - Sudan Pound" }, { id: "SEK", name: "SEK - Sweden Krona" }, { id: "SGD", name: "SGD - Singapore Dollar" }, { id: "SHP", name: "SHP - Saint Helena Pound" }, { id: "SLL", name: "SLL - Sierra Leone Leone" }, { id: "SOS", name: "SOS - Somalia Shilling" }, { id: "SPL", name: "SPL - Seborga Luigino" }, { id: "SRD", name: "SRD - Suriname Dollar" }, { id: "STD", name: "STD - São Tomé and Príncipe Dobra" }, { id: "SVC", name: "SVC - El Salvador Colon" }, { id: "SYP", name: "SYP - Syria Pound" }, { id: "SZL", name: "SZL - Swaziland Lilangeni" }, { id: "THB", name: "THB - Thailand Baht" }, { id: "TJS", name: "TJS - Tajikistan Somoni" }, { id: "TMT", name: "TMT - Turkmenistan Manat" }, { id: "TND", name: "TND - Tunisia Dinar" }, { id: "TOP", name: "TOP - Tonga Pa'anga" }, { id: "TRY", name: "TRY - Turkey Lira" }, { id: "TTD", name: "TTD - Trinidad and Tobago Dollar" }, { id: "TVD", name: "TVD - Tuvalu Dollar" }, { id: "TWD", name: "TWD - Taiwan New Dollar" }, { id: "TZS", name: "TZS - Tanzania Shilling" }, { id: "UAH", name: "UAH - Ukraine Hryvnia" }, { id: "UGX", name: "UGX - Uganda Shilling" }, { id: "USD", name: "USD - United States Dollar" }, { id: "UYU", name: "UYU - Uruguay Peso" }, { id: "UZS", name: "UZS - Uzbekistan Som" }, { id: "VEF", name: "VEF - Venezuela Bolivar" }, { id: "VND", name: "VND - Viet Nam Dong" }, { id: "VUV", name: "VUV - Vanuatu Vatu" }, { id: "WST", name: "WST - Samoa Tala" }, { id: "XAF", name: "XAF - Communauté Financière Africaine (BEAC) CFA Franc BEAC" }, { id: "XCD", name: "XCD - East Caribbean Dollar" }, { id: "XDR", name: "XDR - International Monetary Fund (IMF) Special Drawing Rights" }, { id: "XOF", name: "XOF - Communauté Financière Africaine (BCEAO) Franc" }, { id: "XPF", name: "XPF - Comptoirs Français du Pacifique (CFP) Franc" }, { id: "YER", name: "YER - Yemen Rial" }, { id: "ZAR", name: "ZAR - South Africa Rand" }, { id: "ZMW", name: "ZMW - Zambia Kwacha" }, { id: "ZWD", name: "ZWD - Zimbabwe Dollar" }]
	});

});
define('frontend/controllers/row', ['exports', 'ember-cli-ember-table/controllers/row'], function (exports, RowArrayController) {

	'use strict';

	exports['default'] = RowArrayController['default'];

});
define('frontend/controllers/studies', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({
		flagClass: (function () {
			var country = this.get("pyp.country");
			return "flag-icon-" + country.toLowerCase();
		}).property("pyp.country")
	});

});
define('frontend/controllers/studies/index', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend(EmberValidations['default'].Mixin, {});

});
define('frontend/controllers/studies/new', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend(EmberValidations['default'].Mixin, {
		isValid: Ember['default'].computed("model.study.title", function () {
			return !Ember['default'].isEmpty(this.get("model.study.title"));
		}),
		listVariables: Ember['default'].computed("model.variable", "model.study", function () {
			var variables = this.get("model.study.variables"),
			    fullList = this.get("model.variable"),
			    justList = [];
			fullList.forEach(function (item) {
				if (variables.indexOf(item) === -1) {
					justList.push(item);
				}
			});
			return justList;
		}),
		listPyps: Ember['default'].computed("model.pyp", "model.study", function () {
			var pyps = this.get("model.study.pyps"),
			    fullList = this.get("model.pyp"),
			    justList = [];
			fullList.forEach(function (item) {
				if (pyps.indexOf(item) === -1) {
					justList.push(item);
				}
			});
			return justList;
		}),
		// _this.transitionToRoute('study.edit', study);
		actions: {
			newVariable: function () {
				if (this.get("isValid")) {
					var newVariable = this.get("newVariable"),
					    study = this.get("model.study");
					if (newVariable) {
						study.get("variables").addObject(newVariable);
						study.save();
					}
				} else {
					this.set("errorMessage", "You have to define first a title for the Study");
				}
				return false;
			},
			removeVariable: function (variable) {
				if (this.get("isValid")) {
					var study = this.get("model.study");
					study.get("variables").removeObject(variable);
					study.save();
				} else {
					this.set("errorMessage", "You have to define first a title for the Study");
				}
				return false;
			},
			newPolicy: function () {
				if (this.get("isValid")) {
					var newPolicy = this.get("newPolicy"),
					    study = this.get("model.study");
					if (newPolicy) {
						study.get("pyps").addObject(newPolicy);
						study.save();
					}
				} else {
					this.set("errorMessage", "You have to define first a title for the Study");
				}
				return false;
			},
			removePolicy: function (pyp) {
				if (this.get("isValid")) {
					var study = this.get("model.study");
					study.get("pyps").removeObject(pyp);
					study.save();
				} else {
					this.set("errorMessage", "You have to define first a title for the Study");
				}
				return false;
			},
			save: function () {
				if (this.get("isValid")) {
					var _this = this;
					this.get("model.study").save().then(function (study) {
						_this.transitionToRoute("study", study);
					});
				} else {
					this.set("errorMessage", "You have to define first a title for the Study");
				}
				return false;
			},
			cancel: function () {
				this.transitionToRoute("studies");
				return false;
			}
		}
	});

});
define('frontend/controllers/study/edit', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend(EmberValidations['default'].Mixin, {
		isValid: Ember['default'].computed("model.study.title", function () {
			return !Ember['default'].isEmpty(this.get("model.study.title"));
		}),
		listVariables: Ember['default'].computed("model.variable", "model.study", function () {
			var variables = this.get("model.study.variables"),
			    fullList = this.get("model.variable"),
			    justList = [];
			fullList.forEach(function (item) {
				if (variables.indexOf(item) === -1) {
					justList.push(item);
				}
			});
			return justList;
		}),
		listPyps: Ember['default'].computed("model.pyp", "model.study", function () {
			var pyps = this.get("model.study.pyps"),
			    fullList = this.get("model.pyp"),
			    justList = [];
			fullList.forEach(function (item) {
				if (pyps.indexOf(item) === -1) {
					justList.push(item);
				}
			});
			return justList;
		}),
		newVariable: null,
		actions: {
			newVariable: function () {
				if (this.get("isValid")) {
					var _this = this,
					    newVariable = this.get("newVariable"),
					    study = this.get("model.study");
					if (newVariable) {
						study.get("variables").addObject(newVariable);
						study.save().then(function () {
							_this.send("reloadContentAfterEdit");
						});
					}
				} else {
					this.set("errorMessage", "You can't leave the Study title empty.");
				}
				return false;
			},
			removeVariable: function (variable) {
				if (this.get("isValid")) {
					var _this = this,
					    study = this.get("model.study");
					study.get("variables").removeObject(variable);
					study.save().then(function () {
						_this.send("reloadContentAfterEdit");
					});
				} else {
					this.set("errorMessage", "You can't leave the Study title empty.");
				}
				return false;
			},
			newPolicy: function () {
				if (this.get("isValid")) {
					var _this = this,
					    newPolicy = this.get("newPolicy"),
					    study = this.get("model.study");
					if (newPolicy) {
						study.get("pyps").addObject(newPolicy);
						study.save().then(function () {
							_this.send("reloadContentAfterEdit");
						});
					}
				} else {
					this.set("errorMessage", "You can't leave the Study title empty.");
				}
				return false;
			},
			removePolicy: function (pyp) {
				if (this.get("isValid")) {
					var _this = this,
					    study = this.get("model.study");
					study.get("pyps").removeObject(pyp);
					study.save().then(function () {
						_this.send("reloadContentAfterEdit");
					});
				} else {
					this.set("errorMessage", "You can't leave the Study title empty.");
				}
				return false;
			},
			save: function () {
				if (this.get("isValid")) {
					var _this = this;
					this.get("model.study").save().then(function (study) {
						_this.transitionToRoute("study", study);
					});
				} else {
					this.set("errorMessage", "You can't leave the Study title empty.");
				}
				return false;
			},
			cancel: function (study) {
				this.transitionToRoute("study", study);
				return false;
			},
			deleteStudy: function (study) {
				study.destroyRecord();
				this.transitionTo("studies");
			}
		}
	});

});
define('frontend/controllers/study/matrix', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({
		tripleLen: Ember['default'].computed("model.variables", function () {
			return 3 * this.get("model.variables.length") + 3;
		}),
		varIndex: Ember['default'].computed("model.variables", function () {
			var array = [];
			for (var i = 0; i < this.get("model.variables.length"); i++) {
				array.push(i + 1);
			}
			return array;
		}) });
	// scroll: function() {
	//   var self = this;
	//   this.$(".div-table").scroll(function(){
	//     self.$(".div-scroll").scrollLeft($(".div-table").scrollLeft());
	//   });
	//   this.$(".div-scroll").scroll(function(){
	//     self.$(".div-table").scrollLeft($(".div-scroll").scrollLeft());
	//   });
	// }

});
define('frontend/controllers/study/objective', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({
		isFirst: (function () {
			var objectives = this.get("model.pyp.objectives");
			var model = this.get("model");
			if (objectives.indexOf(model) === 0) {
				return true;
			} else {
				return false;
			}
		}).property("id") });

});
define('frontend/controllers/study/output', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({
			isFirst: (function () {
					var objectives = this.get("model.objective.outputs");
					var model = this.get("model");
					if (objectives.indexOf(model) === 0) {
							return true;
					} else {
							return false;
					}
			}).property("id"),
			chartData: {
					labels: ["Day1", "Day2", "Day3"],
					series: [[5, 4, 8], [10, 2, 7], [8, 3, 6]]
			}
	});

});
define('frontend/controllers/study/pyp', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({});

});
define('frontend/controllers/variable/edit', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend(EmberValidations['default'].Mixin, {
		newKeyword: null,
		typeOptions: ["Core Area", "Cross-cutting theme"],
		isValid: Ember['default'].computed("model.variable.name", "model.variable.tipo", function () {
			return !Ember['default'].isEmpty(this.get("model.variable.name")) && !Ember['default'].isEmpty(this.get("model.variable.tipo"));
		}),
		isKeywordValid: Ember['default'].computed("model.keyword.name", function () {
			return !Ember['default'].isEmpty(this.get("model.keyword.name"));
		}),
		actions: {
			save: function () {
				if (this.get("isValid")) {
					var _this = this,
					    variable = this.get("model.variable");
					variable.save().then(function () {
						_this.transitionToRoute("variables");
					});
				} else {
					this.set("errorMessage", "You have to fill all the fields");
				}
				return false;
			},
			cancel: function () {
				this.transitionToRoute("variable", this.get("model.variable"));
				return false;
			},
			addKeyword: function () {
				if (this.get("isKeywordValid")) {
					var _this = this,
					    variable = this.get("model.variable");
					variable.save().then(function () {
						_this.send("reloadContentAfterSaveKeyword");
					});
				} else {
					this.set("errorMessage", "You have to fill all the fields");
				}
				return false;
			}
		}
	});

});
define('frontend/controllers/variables/new', ['exports', 'ember', 'ember-validations'], function (exports, Ember, EmberValidations) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend(EmberValidations['default'].Mixin, {
		typeOptions: ["Core Area", "Cross-cutting theme"],
		isValid: Ember['default'].computed("model.variable.name", "model.variable.tipo", function () {
			return !Ember['default'].isEmpty(this.get("model.variable.name")) && !Ember['default'].isEmpty(this.get("model.variable.tipo"));
		}),
		isKeywordValid: Ember['default'].computed("model.keyword.name", function () {
			return !Ember['default'].isEmpty(this.get("model.keyword.name"));
		}),
		actions: {
			save: function () {
				if (this.get("isValid")) {
					var _this = this,
					    variable = this.get("model.variable");
					variable.save().then(function () {
						_this.transitionToRoute("variables");
					});
				} else {
					this.set("errorMessage", "You have to fill all the fields");
				}
				return false;
			},
			cancel: function () {
				this.transitionToRoute("variables");
				return false;
			},
			addKeyword: function () {
				if (this.get("isKeywordValid")) {
					var _this = this,
					    variable = this.get("model.variable");
					variable.save().then(function (variable) {
						_this.transitionToRoute("variable.edit", variable);
					});
				} else {
					this.set("errorMessage", "You have to fill all the fields");
				}
				return false;
			}
		}
	});

});
define('frontend/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function (name, options) {
    if (Ember['default'].typeOf(name) !== "string") {
      var message = "fa-icon: no icon specified";
      warn(message);
      return Ember['default'].String.htmlSafe(message);
    }

    var params = options.hash,
        classNames = [],
        html = "";

    classNames.push("fa");
    if (!name.match(FA_PREFIX)) {
      name = "fa-" + name;
    }
    classNames.push(name);
    if (params.spin) {
      classNames.push("fa-spin");
    }
    if (params.flip) {
      classNames.push("fa-flip-" + params.flip);
    }
    if (params.rotate) {
      classNames.push("fa-rotate-" + params.rotate);
    }
    if (params.lg) {
      warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
      classNames.push("fa-lg");
    }
    if (params.x) {
      warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
      classNames.push("fa-" + params.x + "x");
    }
    if (params.size) {
      if (Ember['default'].typeOf(params.size) === "string" && params.size.match(/\d+/)) {
        params.size = Number(params.size);
      }
      if (Ember['default'].typeOf(params.size) === "number") {
        classNames.push("fa-" + params.size + "x");
      } else {
        classNames.push("fa-" + params.size);
      }
    }
    if (params.fixedWidth) {
      classNames.push("fa-fw");
    }
    if (params.listItem) {
      classNames.push("fa-li");
    }
    if (params.pull) {
      classNames.push("pull-" + params.pull);
    }
    if (params.border) {
      classNames.push("fa-border");
    }
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }


    html += "<";
    var tagName = params.tagName || "i";
    html += tagName;
    html += " class='" + classNames.join(" ") + "'";
    if (params.title) {
      html += " title='" + params.title + "'";
    }
    if (params.ariaHidden === undefined || params.ariaHidden) {
      html += " aria-hidden=\"true\"";
    }
    html += "></" + tagName + ">";
    return Ember['default'].String.htmlSafe(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('frontend/helpers/liquid-bind', ['exports'], function (exports) {

  'use strict';

  /* liquid-bind is really just liquid-with with a pre-provided block
     that just says {{this}} */

  var isHTMLBars = !!Ember.HTMLBars;

  function liquidBindHelperFunc() {
    var options, container;

    if (isHTMLBars) {
      options = arguments[2];
      container = this.container;
    } else {
      options = arguments[arguments.length - 1];
      container = options.data.view.container;
    }

    var liquidWithSelf = container.lookupFactory("template:liquid-with-self");
    var liquidWith = container.lookupFactory("helper:liquid-with");

    if (isHTMLBars) {
      options.template = liquidWithSelf;
    } else {
      options.fn = liquidWithSelf;
    }

    if (isHTMLBars) {
      liquidWith.helperFunction.apply(this, arguments);
    } else {
      return liquidWith.apply(this, arguments);
    }
  }

  var liquidBindHelper = liquidBindHelperFunc;
  if (Ember.HTMLBars) {
    liquidBindHelper = {
      isHTMLBars: true,
      helperFunction: liquidBindHelperFunc,
      preprocessArguments: function () {}
    };
  }

  exports['default'] = liquidBindHelper;

});
define('frontend/helpers/liquid-if', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.factory = factory;

  var isHTMLBars = !!Ember['default'].HTMLBars;function factory(invert) {
    function helperFunc() {
      var property, hash, options, env, container;

      if (isHTMLBars) {
        property = arguments[0][0];
        hash = arguments[1];
        options = arguments[2];
        env = arguments[3];
        container = this.container;
      } else {
        property = arguments[0];
        options = arguments[1];
        hash = options.hash;
        container = options.data.view.container;
      }
      var View = container.lookupFactory("view:liquid-if");

      var templates = [options.fn || options.template, options.inverse];
      if (invert) {
        templates.reverse();
      }
      delete options.fn;
      delete options.template;
      delete options.inverse;

      if (hash.containerless) {
        View = View.extend(Ember['default']._Metamorph);
      }

      hash.templates = templates;

      if (isHTMLBars) {
        hash.showFirst = property;
        env.helpers.view.helperFunction.call(this, [View], hash, options, env);
      } else {
        hash.showFirstBinding = property;
        return Ember['default'].Handlebars.helpers.view.call(this, View, options);
      }
    }

    if (Ember['default'].HTMLBars) {
      return {
        isHTMLBars: true,
        helperFunction: helperFunc,
        preprocessArguments: function () {}
      };
    } else {
      return helperFunc;
    }
  }exports['default'] = factory(false);

});
define('frontend/helpers/liquid-measure', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = function () {
    Ember['default'].assert("liquid-measure is deprecated, see CHANGELOG.md", false);
  };

});
define('frontend/helpers/liquid-outlet', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  function liquidOutletHelperFunc(property, options) {
    var property, options, container, hash, env;

    if (isHTMLBars) {
      property = arguments[0][0]; // params[0]
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      container = this.container;

      if (!property) {
        property = "main";
        options.paramTypes = ["string"];
      }
    } else {
      property = arguments[0];

      if (property && property.data && property.data.isRenderData) {
        options = property;
        property = "main";
        options.types.push("STRING");
      }

      container = options.data.view.container;
      hash = options.hash;
    }

    var View = container.lookupFactory("view:liquid-outlet");
    if (hash.containerless) {
      View = View.extend(Ember['default']._Metamorph);
    }
    hash.viewClass = View;

    if (isHTMLBars) {
      env.helpers.outlet.helperFunction.call(this, [property], hash, options, env);
    } else {
      return Ember['default'].Handlebars.helpers.outlet.call(this, property, options);
    }
  }

  var liquidOutletHelper = liquidOutletHelperFunc;
  if (Ember['default'].HTMLBars) {
    liquidOutletHelper = {
      isHTMLBars: true,
      helperFunction: liquidOutletHelperFunc,
      preprocessArguments: function () {}
    };
  }

  exports['default'] = liquidOutletHelper;

});
define('frontend/helpers/liquid-unless', ['exports', 'frontend/helpers/liquid-if'], function (exports, liquid_if) {

	'use strict';

	exports['default'] = liquid_if.factory(true);

});
define('frontend/helpers/liquid-with', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  function liquidWithHelperFunc() {
    var params, context, options, container, innerOptions, data, hash, env;

    var innerOptions = {
      hashTypes: {}
    };

    var innerHash = {};

    if (isHTMLBars) {
      params = arguments[0];
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      context = params[0];
      container = this.container;
      data = arguments[3].data;
      innerOptions.morph = options.morph;

      if (params.length === 3) {
        hash.keywordName = params[2]._label;
        params = [context];
      }
    } else {
      params = Array.prototype.slice.apply(arguments, [0, -1]);
      context = arguments[0];
      options = arguments[arguments.length - 1];
      data = options.data;
      hash = options.hash;
      container = data.view.container;
      innerOptions.data = data;
      innerOptions.hash = innerHash;
    }

    var View = container.lookupFactory("view:liquid-with");

    View = View.extend({
      originalArgs: params,
      originalHash: hash,
      originalHashTypes: options.hashTypes,
      innerTemplate: options.fn || options.template
    });

    if (hash.containerless) {
      View = View.extend(Ember['default']._Metamorph);
    }

    innerHash.boundContextBinding = context;

    ["class", "classNames", "classNameBindings", "use", "id", "growDuration", "growPixelsPerSecond", "growEasing", "enableGrowth", "containerless"].forEach(function (field) {
      if (hash.hasOwnProperty(field)) {
        innerHash[field] = hash[field];
        innerOptions.hashTypes[field] = options.hashTypes ? options.hashTypes[field] : undefined;
      }
    });


    if (isHTMLBars) {
      env.helpers.view.helperFunction.call(this, [View], innerHash, innerOptions, env);
    } else {
      return Ember['default'].Handlebars.helpers.view.call(this, View, innerOptions);
    }
  }

  var liquidWithHelper = liquidWithHelperFunc;
  if (isHTMLBars) {
    liquidWithHelper = {
      isHTMLBars: true,
      helperFunction: liquidWithHelperFunc,
      preprocessArguments: function () {}
    };
  }

  exports['default'] = liquidWithHelper;

});
define('frontend/helpers/truncate-text', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports.truncateText = truncateText;

	function truncateText(text, options) {
		var limit = options.hash.limit || 1000,
		    rows = options.hash.rows || 1;
		if (text) {
			if (text.length > limit * rows) {
				text = text.substr(0, limit - 3) + "...";
			}
			return text;
		} else {
			return "";
		}
	}exports['default'] = Ember['default'].Handlebars.makeBoundHelper(truncateText);

});
define('frontend/helpers/with-apply', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  // This helper is internal to liquid-with.
  function withApplyHelperFunc() {
    var hash, options, env, view;

    if (isHTMLBars) {
      hash = arguments[1];
      options = arguments[2];
      env = arguments[3];
      view = this;
    } else {
      options = arguments[0];
      hash = options.hash;
      view = options.data.view;
    }

    var parent = view.get("liquidWithParent");
    var withArgs = parent.get("originalArgs").slice();

    withArgs[0] = "lwith-view.boundContext";
    options = Ember['default'].copy(options);

    // This works to inject our keyword in Ember >= 1.9
    if (!view._keywords) {
      view._keywords = {};
    }
    view._keywords["lwith-view"] = view;

    // This works to inject our keyword in Ember < 1.9
    if (!isHTMLBars) {
      if (!options.data.keywords) {
        options.data.keywords = {};
      }
      options.data.keywords["lwith-view"] = view;
    }

    if (isHTMLBars) {
      options.template = parent.get("innerTemplate");
    } else {
      options.fn = parent.get("innerTemplate");
    }

    hash = parent.get("originalHash");
    options.hashTypes = parent.get("originalHashTypes");

    if (isHTMLBars) {
      env.helpers["with"].helperFunction.call(this, [view.getStream(withArgs[0])], hash, options, env);
    } else {
      options.hash = hash;
      withArgs.push(options);
      return Ember['default'].Handlebars.helpers["with"].apply(this, withArgs);
    }
  }

  var withApplyHelper = withApplyHelperFunc;
  if (Ember['default'].HTMLBars) {
    withApplyHelper = {
      isHTMLBars: true,
      helperFunction: withApplyHelperFunc,
      preprocessArguments: function () {}
    };
  }

  exports['default'] = withApplyHelper;

});
define('frontend/initializers/app-version', ['exports', 'frontend/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;

  exports['default'] = {
    name: "App Version",
    initialize: function (container, application) {
      var appName = classify(application.toString());
      Ember['default'].libraries.register(appName, config['default'].APP.version);
    }
  };

});
define('frontend/initializers/ember-cli-ember-table', ['exports'], function (exports) {

  'use strict';

  /* global jQuery */

  exports['default'] = {
    name: "ember-cli-ember-table",
    initialize: function (container, app) {
      var VERSION = "0.2.2";
      if (Ember.libraries !== null) {
        Ember.libraries.register("Ember Table", VERSION);
      }

      /*
      jQuery.browser shim that makes HT working with jQuery 1.8+
       */
      if (!jQuery.browser) {
        (function () {
          var browser, matched, res;
          matched = void 0;
          browser = void 0;
          jQuery.uaMatch = function (ua) {
            var match;
            ua = ua.toLowerCase();
            match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];
            return {
              browser: match[1] || "",
              version: match[2] || "0"
            };
          };
          matched = jQuery.uaMatch(navigator.userAgent);
          browser = {};
          if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
          }
          if (browser.chrome) {
            browser.webkit = true;
          } else {
            if (browser.webkit) {
              browser.safari = true;
            }
          }
          res = jQuery.browser = browser;
          return res;
        })();
      }
    }
  };

});
define('frontend/initializers/export-application-global', ['exports', 'ember', 'frontend/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal && !window[classifiedName]) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('frontend/initializers/liquid-fire', ['exports', 'liquid-fire', 'ember'], function (exports, liquid_fire, Ember) {

  'use strict';

  exports['default'] = {
    name: "liquid-fire",

    initialize: function (container) {
      if (!Ember['default'].$.Velocity) {
        Ember['default'].warn("Velocity.js is missing");
      } else {
        var version = Ember['default'].$.Velocity.version;
        var recommended = [0, 11, 8];
        if (Ember['default'].compare(recommended, [version.major, version.minor, version.patch]) === 1) {
          Ember['default'].warn("You should probably upgrade Velocity.js, recommended minimum is " + recommended.join("."));
        }
      }

      liquid_fire.initialize(container);
    }
  };

});
define('frontend/initializers/register-helpers', ['exports', 'sl-ember-components/initializers/register-helpers'], function (exports, initializer) {

  'use strict';

  exports['default'] = {
    name: "sl-ember-components-register-helpers",

    initialize: initializer['default']
  };

});
define('frontend/models/cell', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    score: DS['default'].attr("number"),
    scoreIndex: DS['default'].attr("number"),
    study: DS['default'].belongsTo("study", { async: true }),
    variable: DS['default'].belongsTo("variable", { async: true }),
    output: DS['default'].belongsTo("output", { async: true }) });

});
define('frontend/models/keyword', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    definition: DS['default'].attr("string"),
    variable: DS['default'].belongsTo("variable")
  });

});
define('frontend/models/objective', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    title: DS['default'].attr("string"),
    outputs: DS['default'].hasMany("output", { async: true }),
    pyp: DS['default'].belongsTo("pyp"),
    description: DS['default'].attr("string"),
    baseline: DS['default'].attr("string"),
    target: DS['default'].attr("string") });

});
define('frontend/models/output', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    title: DS['default'].attr("string"),
    objective: DS['default'].belongsTo("objective"),
    description: DS['default'].attr("string"),
    baseline: DS['default'].attr("string"),
    target: DS['default'].attr("string"),

    budget: DS['default'].attr("string"),
    policyInstrument: DS['default'].attr("string"),
    activity: DS['default'].attr("string")
  });

});
define('frontend/models/pyp', ['exports', 'ember-data', 'ember', 'frontend/utils/countries'], function (exports, DS, Ember, countries) {

	'use strict';

	exports['default'] = DS['default'].Model.extend({
		country: DS['default'].attr("string"),
		title: DS['default'].attr("string"),
		acronym: DS['default'].attr("string"),
		description: DS['default'].attr("string"),
		typology: DS['default'].attr("string"),
		regulatoryFramework: DS['default'].attr("string"),
		regulatoryFrameworkReference: DS['default'].attr("string"),
		parents: DS['default'].attr("string"),
		childrens: DS['default'].attr("string"),
		beneficiaries: DS['default'].attr("string"),
		geographicalCoverage: DS['default'].attr("string"),
		geographicalPlace: DS['default'].attr("string"),
		dateEntry: DS['default'].attr("string"),
		timeFrame: DS['default'].attr("string"),

		totalBudget: DS['default'].attr("string"),
		currency: DS['default'].attr("string"),
		objectives: DS['default'].hasMany("objective", { async: true }),
		totalOutputs: DS['default'].attr("number"),

		goName: DS['default'].attr("string"),
		goTarget: DS['default'].attr("string"),
		goBaseline: DS['default'].attr("string"),

		responsible: DS['default'].attr("string"),
		responsibleDuties: DS['default'].attr("string"),
		institutionalArrangements: DS['default'].attr("string"),

		contactName: DS['default'].attr("string"),
		contactEmail: DS['default'].attr("string"),
		contactJob: DS['default'].attr("string"),
		contactNumber: DS['default'].attr("string"),

		source: DS['default'].attr("string"),
		comments: DS['default'].attr("string"),

		// Computed Properties
		flagClass: Ember['default'].computed("country", function () {
			var code = this.get("country") || "";
			return "flag-icon flag-icon-" + code.toLowerCase();
		}),
		countryName: Ember['default'].computed("country", function () {
			return countries.COUNTRIES_NAMES[this.get("country")];
		})
	});

});
define('frontend/models/study', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    title: DS['default'].attr("string"),
    variables: DS['default'].hasMany("variable", { async: true }),
    pyps: DS['default'].hasMany("pyp", { async: true }),
    cells: DS['default'].hasMany("cell", { async: true })
  });

});
define('frontend/models/variable', ['exports', 'ember-data', 'ember'], function (exports, DS, Ember) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    tipo: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    keywords: DS['default'].hasMany("keyword", { embedded: "always" }),

    cc: Ember['default'].computed("tipo", function () {
      if (this.get("tipo") === "Cross-cutting theme") {
        return true;
      } else {
        return false;
      }
    })
  });

});
define('frontend/router', ['exports', 'ember', 'frontend/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.resource("studies", function () {
      this.route("new");
    });
    this.resource("study", { path: "/study/:study_id" }, function () {
      this.route("edit");
      this.route("matrix");
    });

    this.resource("variables", function () {
      this.route("new");
    });
    this.resource("variable", { path: "/variable/:variable_id" }, function () {
      this.route("edit");
    });

    this.resource("policies", function () {
      this.route("new");
    });
    this.resource("policy", { path: "/policy/:pyp_id" }, function () {
      this.route("edit");
      this.resource("objectives", function () {
        this.route("index", { path: "" }, function () {
          this.route("new");
          this.route("show", { path: ":objective_id" }, function () {
            this.route("edit");
            this.resource("outputs", function () {
              this.route("new");
              this.route("show", { path: ":output_id" }, function () {
                this.route("edit");
              });
            });
          });
        });
      });
    });
  });

  exports['default'] = Router;

});
define('frontend/routes/components', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/matrix', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/objectives', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/objectives/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.modelFor("policy").get("objectives");
		}
	});

});
define('frontend/routes/objectives/index/new', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.store.createRecord("objective", {
				pyp: this.modelFor("policy")
			});
		},
		deactivate: function () {
			var model = this.modelFor("objectives.index.new");
			if (model.get("isNew")) {
				model.destroyRecord();
			}
		},
		actions: {
			save: function () {
				var _this = this;
				var model = this.modelFor("objectives.index.new");

				model.save().then(function () {
					_this.transitionTo("objectives.index");
				});
			},
			cancel: function () {
				this.transitionTo("objectives.index");
			}
		}
	});

});
define('frontend/routes/objectives/index/show', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});
	// model: function() {
	// 	return this.modelFor('objectives').get('outputs');
	// }

});
define('frontend/routes/objectives/index/show/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		actions: {
			save: function () {
				var _this = this;
				var model = this.modelFor("objectives.index.show.edit");

				model.save().then(function () {
					_this.transitionTo("objectives.index");
				});
			},
			cancel: function () {
				this.transitionTo("objectives.index");
			}
		}
	});

});
define('frontend/routes/outputs', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/outputs/new', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.store.createRecord("output", {
				objective: this.modelFor("objectives.index.show")
			});
		},
		deactivate: function () {
			var model = this.modelFor("outputs.new");
			if (model.get("isNew")) {
				model.destroyRecord();
			}
		},
		actions: {
			save: function () {
				var _this = this;
				var model = this.modelFor("outputs.new");

				model.save().then(function () {
					_this.transitionTo("objectives");
				});
			},
			cancel: function () {
				this.transitionTo("objectives");
			}
		}
	});

});
define('frontend/routes/outputs/show/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		actions: {
			save: function () {
				var _this = this;
				var model = this.modelFor("outputs.show.edit");

				model.save().then(function () {
					_this.transitionTo("objectives.index");
				});
			},
			cancel: function () {
				this.transitionTo("objectives.index");
			}
		}
	});

});
define('frontend/routes/policies', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/policies/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.store.find("pyp");
		},
		actions: {
			"delete": function (pyp) {
				pyp.destroyRecord();
				this.transitionTo("policies");
			}
		}
	});

});
define('frontend/routes/policies/new', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.store.createRecord("pyp");
		},
		deactivate: function () {
			var model = this.modelFor("policies/new");
			if (model.get("isNew")) {
				model.destroyRecord();
			}
		} });

});
define('frontend/routes/policy/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		deactivate: function () {
			var model = this.modelFor("policy/edit");

			if (model.get("isDirty")) {
				model.rollback();
			}
		}
	});

});
define('frontend/routes/policy/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/policy/show', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/studies/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.store.find("study");
		},
		actions: {
			"delete": function (study) {
				study.destroyRecord();
				this.transitionTo("studies");
			}
		}
	});

});
define('frontend/routes/studies/new', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return Ember['default'].RSVP.hash({
				study: this.store.createRecord("study"),
				variable: this.store.find("variable"),
				pyp: this.store.find("pyp")
			});
		},
		actions: {
			reloadContentAfterEdit: function () {
				this.refresh();
			}
		}
		// deactivate: function() {
		// 	var model = this.modelFor('studies');
		// 	if (model){
		// 		if (model.get('isNew')) {
		// 			model.destroyRecord();
		// 		}
		// 	}
		// }
	});

});
define('frontend/routes/study/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return Ember['default'].RSVP.hash({
				study: this.modelFor("study"),
				variable: this.store.find("variable"),
				pyp: this.store.find("pyp")
			});
		},
		actions: {
			reloadContentAfterEdit: function () {
				this.refresh();
			}
		}
		// deactivate: function() {
		// 	var model = this.modelFor('variable/edit');

		// 	if (model.get('isDirty')) {
		// 		model.rollback();
		// 	}
		// }
	});

});
define('frontend/routes/study/matrix', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.modelFor("study");
		}
	});

});
define('frontend/routes/variable/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return Ember['default'].RSVP.hash({
				variable: this.modelFor("variable"),
				keyword: this.store.createRecord("keyword", {
					variable: this.modelFor("variable")
				})
			});
		},
		actions: {
			reloadContentAfterSaveKeyword: function () {
				this.refresh();
			}
		}
		// deactivate: function() {
		// 	var model = this.modelFor('variable/edit');

		// 	if (model.get('isDirty')) {
		// 		model.rollback();
		// 	}
		// }
	});

});
define('frontend/routes/variable/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/variables', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('frontend/routes/variables/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return this.store.find("variable");
		},
		actions: {
			"delete": function (variable) {
				variable.destroyRecord();
				this.transitionTo("variables");
			}
		}
	});

});
define('frontend/routes/variables/new', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({
		model: function () {
			return Ember['default'].RSVP.hash({
				variable: this.store.createRecord("variable"),
				keyword: this.store.createRecord("keyword")
			});
		} });
	// deactivate: function() {
	// 	var model = this.modelFor('variables/new');
	// 	if (model.get('isNew')) {
	// 		model.destroyRecord();
	// 	}
	// },

});
define('frontend/row-definition', ['exports', 'ember-cli-ember-table/row-definition'], function (exports, RowDefinition) {

	'use strict';

	exports['default'] = RowDefinition['default'];

});
define('frontend/serializers/application', ['exports', 'ember-data', 'ember'], function (exports, DS, Ember) {

  'use strict';

  exports['default'] = DS['default'].RESTSerializer.extend({

    serializeIntoHash: function (hash, type, record, options) {
      Ember['default'].merge(hash, this.serialize(record, options));
    },

    extractMeta: function (store, type, payload) {
      if (payload && payload.kind) {
        // store.metaForType(type, { total: payload.kind });  // sets the metadata for "post"
        delete payload.kind; // keeps ember data from trying to parse "total" as a record
      }
      if (payload && payload.etag) {
        // store.metaForType(type, { total: payload.etag });  // sets the metadata for "post"
        delete payload.etag; // keeps ember data from trying to parse "total" as a record
      }
      if (!payload.studies) {
        payload.studies = [];
      }
      if (!payload.variables) {
        payload.variables = [];
      }
      if (!payload.pyps) {
        payload.pyps = [];
      }
      if (!payload.cells) {
        payload.cells = [];
      }
    }
  });

  // export default DS.RESTSerializer.extend({

  // serializeIntoHash: function(hash, type, record, options) {
  //   Ember.merge(hash, this.serialize(record, options));
  // },

  // extractMeta: function(store, type, payload) {
  //   if (payload && payload.kind) {
  //     // store.metaForType(type, { total: payload.kind });  // sets the metadata for "post"
  //     delete payload.kind;  // keeps ember data from trying to parse "total" as a record
  //   }
  //   if (payload && payload.etag) {
  //     // store.metaForType(type, { total: payload.etag });  // sets the metadata for "post"
  //     delete payload.etag;  // keeps ember data from trying to parse "total" as a record
  //   }
  //   if (!payload.studies) {
  //     payload.studies=[];
  //   }
  //   if (!payload.variables) {
  //     payload.variables=[];
  //   }
  //   if (!payload.pyps) {
  //     payload.pyps=[];
  //   }
  // }
  // });

});
define('frontend/serializers/study', ['exports', 'ember-data', 'frontend/serializers/application'], function (exports, DS, ApplicationSerializer) {

  'use strict';

  exports['default'] = ApplicationSerializer['default'].extend(DS['default'].EmbeddedRecordsMixin, {
    attrs: {
      cells: { embedded: "always" }
    } });

});
define('frontend/serializers/variable', ['exports', 'ember-data', 'frontend/serializers/application'], function (exports, DS, ApplicationSerializer) {

  'use strict';

  exports['default'] = ApplicationSerializer['default'].extend(DS['default'].EmbeddedRecordsMixin, {
    attrs: {
      keywords: { embedded: "always" }
    } });

});
define('frontend/services/validations', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Object.extend({
    init: function () {
      set(this, "cache", {});
    }
  });

});
define('frontend/templates/-form-objective', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<form class=\"form-horizontal\">\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Title</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.title"),
      'placeholder': ("Title of the objective"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n		<div class=\"col-sm-2\">\n	    <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-success btn-block\"><span class=\"glyphicon glyphicon-ok\"></span></button>\n	  </div>\n	  <div class=\"col-sm-2\">\n	    <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-danger btn-block\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n	  </div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Description</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.description"),
      'placeholder': ("Description of the objective"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Baseline</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.baseline"),
      'placeholder': ("Baseline of the objective"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Target</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.target"),
      'placeholder': ("Target of the objective"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n</form>");
    return buffer;
    
  });

});
define('frontend/templates/-form-output', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<form class=\"form-horizontal\">\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Title</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.title"),
      'placeholder': ("Title of the output"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n		<div class=\"col-sm-2\">\n	    <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-success btn-block\"><span class=\"glyphicon glyphicon-ok\"></span></button>\n	  </div>\n    <div class=\"col-sm-2\">\n      <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-danger btn-block\"><span class=\"glyphicon glyphicon-remove\"></span></button>\n    </div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Description</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.description"),
      'placeholder': ("Description of the output"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Baseline</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.baseline"),
      'placeholder': ("Baseline of the output"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Target</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.target"),
      'placeholder': ("Target of the output"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Policy Instrument</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.policyInstrument"),
      'placeholder': ("Policy instrument used by the output"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Activity</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.activity"),
      'placeholder': ("Activity for this output"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n	<div class=\"form-group\">\n		<label class=\"col-sm-2 control-label\">Budget</label>\n		<div class=\"col-sm-6\">\n			");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.budget"),
      'placeholder': ("Budget of the output"),
      'class': ("form-control")
    },hashTypes:{'value': "ID",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n		</div>\n	</div>\n</form>");
    return buffer;
    
  });

});
define('frontend/templates/-form-policy', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push(" <div class=\"panel-body\">\n  <form ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{
      'on': ("submit")
    },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n    <h6 style=\"color:red\">");
    stack1 = helpers._triageMustache.call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h6>\n    <div class=\"row\">\n      <div class=\"col-lg-11\">\n        <div class=\"form-horizontal\" >\n          <label class=\"col-sm-3 control-label\">Country:</label>\n          <div class=\"col-sm-9 m-5\">\n            <div class=\"input-group\">\n              <span class=\"input-group-addon\" id=\"basic-addon1\"><span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("flagClass :flag-icon")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></span></span>\n              ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("countryOptions"),
      'optionValuePath': ("content.id"),
      'optionLabelPath': ("content.name"),
      'prompt': ("Select a country"),
      'class': ("form-control m-5"),
      'value': ("model.country"),
      'selection': ("selectedObject")
    },hashTypes:{'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'class': "STRING",'value': "ID",'selection': "ID"},hashContexts:{'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'class': depth0,'value': depth0,'selection': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n            </div>\n          </div>\n          <label class=\"col-sm-3 control-label\">P&P Title:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.title"),
      'type': ("text"),
      'placeholder': ("Write the title of the policy or program"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Acronym:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.acronym"),
      'type': ("text"),
      'placeholder': ("If the policy or program have an acronym please specify"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Description:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
      'value': ("model.description"),
      'rows': (2),
      'placeholder': ("Add general information"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'rows': "INTEGER",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'rows': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">General Objective:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.goName"),
      'type': ("text"),
      'placeholder': ("Add the general objective"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Target:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.goTarget"),
      'type': ("text"),
      'placeholder': ("Add the general objective target"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Baseline:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.goBaseline"),
      'type': ("text"),
      'placeholder': ("Add the general objective baseline"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Contact person:</label>\n          <label class=\"col-sm-1 control-label\">Name:</label>\n          <div class=\"col-sm-3\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.contactName"),
      'type': ("text"),
      'placeholder': ("Name"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-1 control-label\">Email:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.contactEmail"),
      'type': ("text"),
      'placeholder': ("Email"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-1 col-sm-offset-3 control-label\">Job:</label>\n          <div class=\"col-sm-3\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.contactJob"),
      'type': ("text"),
      'placeholder': ("Job and Institution"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-1 control-label\">Number:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.contactNumber"),
      'type': ("text"),
      'placeholder': ("Number"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Typology:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("typologyOptions"),
      'prompt': ("Select a typology"),
      'class': ("form-control m-5"),
      'selection': ("model.typology")
    },hashTypes:{'content': "ID",'prompt': "STRING",'class': "STRING",'selection': "ID"},hashContexts:{'content': depth0,'prompt': depth0,'class': depth0,'selection': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Regulatory Framework:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("rFrameworkOptions"),
      'prompt': ("Select an option"),
      'class': ("form-control m-5"),
      'selection': ("model.regulatoryFramework")
    },hashTypes:{'content': "ID",'prompt': "STRING",'class': "STRING",'selection': "ID"},hashContexts:{'content': depth0,'prompt': depth0,'class': depth0,'selection': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-1 control-label\">Reference:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.regulatoryFrameworkReference"),
      'type': ("text"),
      'placeholder': ("Define details"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Beneficiaries:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.beneficiaries"),
      'type': ("text"),
      'placeholder': ("Add beneficiaries"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Geographical coverage:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("gCoverageOptions"),
      'prompt': ("Select coverage"),
      'class': ("form-control m-5"),
      'selection': ("model.geographicalCoverage")
    },hashTypes:{'content': "ID",'prompt': "STRING",'class': "STRING",'selection': "ID"},hashContexts:{'content': depth0,'prompt': depth0,'class': depth0,'selection': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-1 control-label\">Specify:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.geographicalPlace"),
      'type': ("text"),
      'placeholder': ("Write the name of the place or region"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Date of entry into force:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.dateEntry"),
      'type': ("text"),
      'placeholder': ("Starting date"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-1 control-label\">Timeframe:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.timeFrame"),
      'type': ("text"),
      'placeholder': ("Define the interval"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Total Budget:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.totalBudget"),
      'type': ("text"),
      'placeholder': ("Define the amount of money"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-1 control-label\">Currency:</label>\n          <div class=\"col-sm-4\">\n            ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("currencyOptions"),
      'optionValuePath': ("content.id"),
      'optionLabelPath': ("content.name"),
      'prompt': ("Select the money currency"),
      'class': ("form-control m-5"),
      'value': ("model.currency")
    },hashTypes:{'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'class': "STRING",'value': "ID"},hashContexts:{'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'class': depth0,'value': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Main Actor:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.responsible"),
      'type': ("text"),
      'placeholder': ("Main Actor/Institution of reference leading and/or responsible of the P&P"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Duties of Main Actor:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.responsibleDuties"),
      'type': ("text"),
      'placeholder': ("Duties and/or Responsabilities of the Main Actor/Institution"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Institutional Arrangements:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.institutionalArrangements"),
      'type': ("text"),
      'placeholder': ("Specify the Institutional Arrangements"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Source</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.source"),
      'type': ("text"),
      'placeholder': ("Specify the source of the P&P information"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n          <label class=\"col-sm-3 control-label\">Comments:</label>\n          <div class=\"col-sm-9\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
      'value': ("model.comments"),
      'rows': (2),
      'placeholder': ("Write any comment or observation"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'rows': "INTEGER",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'rows': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
    data.buffer.push("\n          </div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col-lg-11 text-center\">\n      <div class=\"row\">        \n        <input  class=\"btn btn-primary-blue\" style=\"margin:15px;\" type=\"submit\" value=\"Save Information\"/>\n        <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-default\" style=\"margin:15px;\">Cancel</button>\n      </div>\n    </div>\n  </form>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/-form-study', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n							  	<div class=\"row\">\n							  		<div class=\"col-sm-1\">\n								  		<button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "removeVariable", "variable", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" class=\"btn btn-danger\" style=\"padding:1px 6px\"><span aria-hidden=\"true\">&times;</span></button> \n								  	</div>\n								  	<div class=\"col-sm-11\">\n										  <li>\n										    <p class=\"form-control-static\" style=\"padding-bottom:0px\"><strong>");
    stack1 = helpers._triageMustache.call(depth0, "variable.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></p>\n										  </li>\n										</div>\n									</div>\n							  ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n								  <div class=\"row\">\n							  		<div class=\"col-sm-1\">\n								  		<button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "removePolicy", "pyp", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" class=\"btn btn-danger\" style=\"padding:1px 6px\"><span aria-hidden=\"true\">&times;</span></button> \n								  	</div>\n								  	<div class=\"col-sm-11\">\n										  <li> \n										    <p class=\"form-control-static\" style=\"padding-bottom:0px\"><span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("pyp.flagClass")
    },hashTypes:{'class': "ID"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></span> - <strong>");
    stack1 = helpers._triageMustache.call(depth0, "pyp.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></p>\n										  </li>\n										</div>\n									</div>\n							  ");
    return buffer;
    }

    data.buffer.push("<div class=\"panel-body\">\n  <div class=\"row\">\n		<div class=\"col-sm-10 col-sm-offset-1\">\n			<form ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{
      'on': ("submit")
    },hashTypes:{'on': "STRING"},hashContexts:{'on': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n				<h6 style=\"color:red\">");
    stack1 = helpers._triageMustache.call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h6>\n				<div class=\"row\">\n				  <div class=\"col-lg-11\">\n				  	<div class=\"form-horizontal\" >\n				      <label class=\"col-sm-3 control-label\">Study Title</label>\n							<div class=\"col-sm-9\">\n				        ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.study.title"),
      'type': ("text"),
      'placeholder': ("Write the title of the study"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n				      </div>\n						  <label class=\"col-sm-3 control-label\">Define the Variables:</label>\n						  <div class=\"col-sm-6\">\n						    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("listVariables"),
      'optionValuePath': ("content.id"),
      'optionLabelPath': ("content.name"),
      'prompt': ("Add an existing variable"),
      'class': ("form-control m-5"),
      'selection': ("newVariable")
    },hashTypes:{'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'class': "STRING",'selection': "ID"},hashContexts:{'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'class': depth0,'selection': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n						  </div>\n						  <div class=\"col-sm-3\">\n						    <p class=\"form-control-static\"><button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "newVariable", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-primary-blue\" style=\"padding:0px 10px;margin:0px;\">+ Add new variable</button></p>\n						  </div>\n						  <div class=\"col-sm-10 col-sm-offset-2\">\n						  	<ol class=\"listV\">\n							  ");
    stack1 = helpers.each.call(depth0, "variable", "in", "model.study.variables", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n						  	</ol>\n						  </div>\n						  <label class=\"col-sm-3 control-label\">Define new P&P:</label>\n							  <div class=\"col-sm-6\">\n						    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("listPyps"),
      'optionValuePath': ("content.id"),
      'optionLabelPath': ("content.title"),
      'prompt': ("Add an existing policy or program"),
      'class': ("form-control m-5"),
      'selection': ("newPolicy")
    },hashTypes:{'content': "ID",'optionValuePath': "STRING",'optionLabelPath': "STRING",'prompt': "STRING",'class': "STRING",'selection': "ID"},hashContexts:{'content': depth0,'optionValuePath': depth0,'optionLabelPath': depth0,'prompt': depth0,'class': depth0,'selection': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n						  </div>\n						  <div class=\"col-sm-3\">\n						    <p class=\"form-control-static\"><button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "newPolicy", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-primary-blue\" style=\"padding:0px 10px;margin:0px;\">+ Add new P&P</button></p>\n						  </div>\n						  <div class=\"col-sm-10 col-sm-offset-2\">\n						  	<ol class=\"listV\">\n							  ");
    stack1 = helpers.each.call(depth0, "pyp", "in", "model.study.pyps", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n						  	</ol>\n						  </div>\n			  		</div>\n				  </div>\n				</div>\n				<div class=\"col-lg-11 text-center\">\n				  <div class=\"row\">\n				  	<input  class=\"btn btn-primary-blue\" style=\"margin:15px;\" type=\"submit\" value=\"Save Study\"/>\n						<button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", "model.study", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" class=\"btn btn-default\" style=\"margin:15px;\">Cancel</button>\n				  </div>\n				</div>\n			</form>\n		</div>\n	</div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/-form-variable', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                    <span class=\"badge\">");
    stack1 = helpers._triageMustache.call(depth0, "keyword.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n                  ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                        ");
    stack1 = helpers['if'].call(depth0, "keyword.definition", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                      ");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                          <tr>\n                            <td><strong>");
    stack1 = helpers._triageMustache.call(depth0, "keyword.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></td>\n                            <td>");
    stack1 = helpers._triageMustache.call(depth0, "keyword.definition", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</td>\n                          </tr>\n                        ");
    return buffer;
    }

    data.buffer.push("<div class=\"panel-body\">\n  <div class=\"row\">\n    <div class=\"col-sm-10 col-sm-offset-1\">\n      <form>\n        <h6 style=\"color:red\">");
    stack1 = helpers._triageMustache.call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h6>\n        <div class=\"row\">\n          <div class=\"col-lg-11\">\n            <div class=\"form-horizontal\" >\n              <label class=\"col-sm-3 control-label\">Variable Name:</label>\n              <div class=\"col-sm-9\">\n                ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.variable.name"),
      'type': ("text"),
      'placeholder': ("Write the name of the variable"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n              </div>\n              <label class=\"col-sm-3 control-label\">Type:</label>\n              <div class=\"col-sm-9\">\n                ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "select", {hash:{
      'content': ("typeOptions"),
      'prompt': ("Select category of the variable"),
      'class': ("form-control m-5"),
      'selection': ("model.variable.tipo")
    },hashTypes:{'content': "ID",'prompt': "STRING",'class': "STRING",'selection': "ID"},hashContexts:{'content': depth0,'prompt': depth0,'class': depth0,'selection': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n              </div>\n              <label class=\"col-sm-3 control-label\">Description:</label>\n              <div class=\"col-sm-9\">\n                ");
    data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
      'value': ("model.variable.description"),
      'rows': (2),
      'placeholder': ("Add a description for this variable"),
      'class': ("form-control m-5")
    },hashTypes:{'value': "ID",'rows': "INTEGER",'placeholder': "STRING",'class': "STRING"},hashContexts:{'value': depth0,'rows': depth0,'placeholder': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
    data.buffer.push("\n              </div>\n            </div>\n          </div>\n        </div>\n        <br>\n        <br>\n        <div class=\"row\">\n          <div class=\"col-lg-5\">\n            <div class=\"row\">\n              <div class=\"col-lg-12\">\n                <form class=\"form-inline\">\n                  <div class=\"col-xs-7 form-np\">\n                    ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'value': ("model.keyword.name"),
      'type': ("text"),
      'placeholder': ("Keyword"),
      'class': ("form-control m-5"),
      'tabindex': (1)
    },hashTypes:{'value': "ID",'type': "STRING",'placeholder': "STRING",'class': "STRING",'tabindex': "INTEGER"},hashContexts:{'value': depth0,'type': depth0,'placeholder': depth0,'class': depth0,'tabindex': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n                  </div>\n                  <div class=\"col-xs-4 col-xs-offset-1 button-np\">\n                    <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "addKeyword", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-primary-blue pull-right\" style=\"padding:5px 6px;\" tabindex=3>Add New Keyword</button>\n                  </div>\n                  <div class=\"col-xs-12 form-np button-np\">\n                    ");
    data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
      'value': ("model.keyword.definition"),
      'rows': (2),
      'placeholder': ("Definition (optional)"),
      'class': ("form-control m-5"),
      'tabindex': (2)
    },hashTypes:{'value': "ID",'rows': "INTEGER",'placeholder': "STRING",'class': "STRING",'tabindex': "INTEGER"},hashContexts:{'value': depth0,'rows': depth0,'placeholder': depth0,'class': depth0,'tabindex': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
    data.buffer.push("\n                  </div>\n                </form>\n              </div>\n            </div>\n            <div class=\"panel panel-primary-blue\">\n              <div class=\"panel-heading\">\n                <h3 class=\"panel-title\">Variable Keywords</h3>\n              </div>\n              <div class=\"panel-body\">\n                <div class=\"list-group text-center\">\n                  ");
    stack1 = helpers.each.call(depth0, "keyword", "in", "model.variable.keywords", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                </div>\n              </div>\n            </div>\n          </div>\n          <div class=\"col-lg-7 \">\n            <div class=\"panel panel-primary-blue\">\n              <div class=\"panel-heading\">\n                <h3 class=\"panel-title\"></i> Basic Definitions</h3>\n              </div>\n              <div class=\"panel-body\">\n                <div class=\"table-responsive\">\n                  <table class=\"table table-bordered table-hover table-striped\">\n                    <thead>\n                      <tr>\n                        <th>Concept</th>\n                        <th>Definition</th>\n                      </tr>\n                    </thead>\n                    <tbody>\n                      ");
    stack1 = helpers.each.call(depth0, "keyword", "in", "model.variable.keywords", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                    </tbody>\n                  </table>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n        <div class=\"col-lg-11 text-center\">\n          <div class=\"row\">        \n            <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "save", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-primary-blue\" style=\"margin:15px;\">Save Changes</button>\n            <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "cancel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"btn btn-default\" style=\"margin:15px;\">Cancel</button>\n          </div>\n        </div>\n      </form>\n    </div>\n  </div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-fw fa-globe\"></i>Solutions for Public Policy<strong> ANALYSIS</strong><small> by FAO </small>");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-fw fa-clock-o\"></i> Previous Studies");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-fw fa-sitemap\"></i> Create New Study");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-fw fa-clock-o\"></i> Existing Variables");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-fw fa-sitemap\"></i> Create New Variable");
    }

  function program11(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-fw fa-clock-o\"></i> Existing Policies");
    }

  function program13(depth0,data) {
    
    
    data.buffer.push("<i class=\"fa fa-fw fa-sitemap\"></i> Create New Policy");
    }

    data.buffer.push("\n    <div id=\"wrapper\">\n        <!-- Navigation -->\n        <nav class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n            <!-- Brand and toggle get grouped for better mobile display -->\n            <div class=\"bigscreen\">\n                <div class=\"navbar-header\">\n                    <h3 style=\"margin-top: 0px;\">\n                        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("navbar-brand fa")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "index", options) : helperMissing.call(depth0, "link-to", "index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                    </h3>\n                </div>\n                <!-- Top Menu Items -->\n                <ul class=\"nav navbar-right top-nav\">\n                    <li><a href=\"#\" class=\"disabled\"><i class=\"fa fa-fw fa-user\"></i> Juan Gonzalo Jaramillo</a></li>\n                    <li>\n                        <a href=\"/logout\"><i class=\"fa fa-fw fa-power-off\"></i>Log out</a>\n                    </li>\n                </ul>\n            </div>\n            <div class=\"smallscreen\">\n                <ul class=\"nav navbar-right top-nav pull-left\" id=\"back-btn\">\n                    <li>\n                        <a onclick=\"back()\" style=\"padding: 15px 10px;\"><i class=\"fa fa-fw fa-chevron-left\" style=\"font-size:20px;\"></i></a>\n                    </li>\n                </ul>>\n                <div class=\"navbar-header\">\n                    <h4 style=\"margin-top: 0px;\">\n                    <a class=\"navbar-brand fa\" href=\"/index\" style=\"padding:15px 10px;\"><strong>SPP Analysis</strong><small> by FAO</small></a>\n                    </h4>\n                </div>\n                <!-- Top Menu Items -->\n                <ul class=\"nav navbar-right top-nav pull-right\">\n                    <li>\n                        <a href=\"#\" class=\"disabled\"><i class=\"fa fa-fw fa-user\"></i> ");
    stack1 = helpers._triageMustache.call(depth0, "user.usuario", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n                    </li>\n                    <li>\n                        <a href=\"/logout\" style=\"padding:15px 10px;\"><i class=\"fa fa-fw fa-power-off\" style=\"font-size:20px;\"></i></a>\n                    </li>\n                </ul>\n            </div>\n            <!-- Sidebar Menu Items - These collapse to the responsive navigation menu on small screens -->\n            <div class=\"collapse navbar-collapse navbar-ex1-collapse\">\n                <ul class=\"nav navbar-nav side-nav\">\n                    <li>\n                        <a href=\"javascript:;\" data-toggle=\"collapse\" data-target=\"#demo1\"><strong>STUDIES</strong><i class=\"fa fa-fw fa-caret-down\"></i></a>\n                        <ul id=\"demo1\" class=\"collapse\">\n                            <li>\n                                ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'data-toggle': ("collapse"),
      'data-target': ("#demo2")
    },hashTypes:{'data-toggle': "STRING",'data-target': "STRING"},hashContexts:{'data-toggle': depth0,'data-target': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "studies.index", options) : helperMissing.call(depth0, "link-to", "studies.index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                            </li>\n                            <li>\n                                ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'data-toggle': ("collapse"),
      'data-target': ("#demo2")
    },hashTypes:{'data-toggle': "STRING",'data-target': "STRING"},hashContexts:{'data-toggle': depth0,'data-target': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "studies.new", options) : helperMissing.call(depth0, "link-to", "studies.new", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                            </li>\n                        </ul>\n                    </li>\n                    <li>\n                        <a href=\"javascript:;\" data-toggle=\"collapse\" data-target=\"#demo2\"><strong>VARIABLES</strong><i class=\"fa fa-fw fa-caret-down\"></i></a>\n                        <ul id=\"demo2\" class=\"collapse\">\n                            <li>\n                                ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'data-toggle': ("collapse"),
      'data-target': ("#demo2")
    },hashTypes:{'data-toggle': "STRING",'data-target': "STRING"},hashContexts:{'data-toggle': depth0,'data-target': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "variables.index", options) : helperMissing.call(depth0, "link-to", "variables.index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                            </li>\n                            <li>\n                                ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'data-toggle': ("collapse"),
      'data-target': ("#demo2")
    },hashTypes:{'data-toggle': "STRING",'data-target': "STRING"},hashContexts:{'data-toggle': depth0,'data-target': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "variables.new", options) : helperMissing.call(depth0, "link-to", "variables.new", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                            </li>\n                        </ul>\n                    </li>\n                    <li>\n                        <a href=\"javascript:;\" data-toggle=\"collapse\" data-target=\"#demo3\"><strong>POLICIES & PROGRAMS</strong><i class=\"fa fa-fw fa-caret-down\"></i></a>\n                        <ul id=\"demo3\" class=\"collapse\">\n                            <li>\n                                ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'data-toggle': ("collapse"),
      'data-target': ("#demo2")
    },hashTypes:{'data-toggle': "STRING",'data-target': "STRING"},hashContexts:{'data-toggle': depth0,'data-target': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "policies.index", options) : helperMissing.call(depth0, "link-to", "policies.index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                            </li>\n                            <li>\n                                ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'data-toggle': ("collapse"),
      'data-target': ("#demo2")
    },hashTypes:{'data-toggle': "STRING",'data-target': "STRING"},hashContexts:{'data-toggle': depth0,'data-target': depth0},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "policies.new", options) : helperMissing.call(depth0, "link-to", "policies.new", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                            </li>\n                        </ul>\n                    </li>\n                </ul>\n            </div>\n            <!-- /.navbar-collapse -->\n        </nav>\n        <div id=\"page-wrapper\">\n            <div class=\"container-fluid\">\n                ");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </div>\n        </div>\n        <nav class=\"navbar navbar-inverse navbar-fixed-bottom hidden-print\" role=\"navigation\">\n            <div class=\"foot-nav\">\n                <div class=\"row\">\n                    <div class=\"col-xs-3 text-center\">\n                        <li>\n                            <br>\n                            <a href=\"/admin\" class=\"foot-a\">Guidelines</a>\n                            <br>\n                        </li>\n                    </div>\n                    <div class=\"col-xs-3 text-center\">\n                        <li>\n                            <br>\n                            <a href=\"/cliente\" class=\"foot-a\">User Manual</a>\n                            <br>\n                        </li>\n                    </div>\n                    <div class=\"col-xs-3 text-center\">\n                        <li>\n                            <br>\n                            <a href=\"/credito\" class=\"foot-a\">Policy Repository</a>\n                            <br>\n                        </li>\n                    </div>\n                    <div class=\"col-xs-3 text-center\">\n                        <li>\n                            <br>\n                            <a href=\"/credito\" class=\"foot-a\">Contact for Support</a>\n                            <br>\n                        </li>\n                    </div>\n                </div>\n            </div>\n        </nav>\n\n    </div>");
    return buffer;
    
  });

});
define('frontend/templates/body-table-container', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n        ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "lazy-table-block", {hash:{
      'classNames': ("ember-table-left-table-block"),
      'contentBinding': ("controller.bodyContent"),
      'columnsBinding': ("controller.fixedColumns"),
      'widthBinding': ("controller._fixedBlockWidth"),
      'numItemsShowingBinding': ("controller._numItemsShowing"),
      'scrollTopBinding': ("controller._scrollTop"),
      'startIndexBinding': ("controller._startIndex")
    },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'numItemsShowingBinding': "STRING",'scrollTopBinding': "STRING",'startIndexBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'widthBinding': depth0,'numItemsShowingBinding': depth0,'scrollTopBinding': depth0,'startIndexBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n      ");
    return buffer;
    }

    data.buffer.push("<div class=\"antiscroll-box\">\n  <div class=\"antiscroll-inner\">\n    <div class=\"ember-table-table-scrollable-wrapper\">\n      ");
    stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "lazy-table-block", {hash:{
      'classNames': ("ember-table-right-table-block"),
      'contentBinding': ("controller.bodyContent"),
      'columnsBinding': ("controller.tableColumns"),
      'scrollLeftBinding': ("controller._tableScrollLeft"),
      'widthBinding': ("controller._tableBlockWidth"),
      'numItemsShowingBinding': ("controller._numItemsShowing"),
      'scrollTopBinding': ("controller._scrollTop"),
      'startIndexBinding': ("controller._startIndex")
    },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'numItemsShowingBinding': "STRING",'scrollTopBinding': "STRING",'startIndexBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'numItemsShowingBinding': depth0,'scrollTopBinding': depth0,'startIndexBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n    </div>\n  </div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/components', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/bs-button', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("<i ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("icon")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></i> ");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "icon", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    stack1 = helpers._triageMustache.call(depth0, "text", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    
  });

});
define('frontend/templates/components/chartist-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/ember-table', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "header-table-container", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "footer-table-container", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "controller.hasHeader", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "body-table-container", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n");
    stack1 = helpers['if'].call(depth0, "controller.hasFooter", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-container", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "column-sortable-indicator", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/graph-average', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div id=\"graph\"></div>\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/graph-bars', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div id=\"graph\"></div>\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/graph-variable', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div class=\"div-body\">\n	<div id='dashboard'></div>\n</div>\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/liquid-measured', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1;


    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/liquid-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n  ");
    stack1 = (helper = helpers['lm-container'] || (depth0 && depth0['lm-container']),options={hash:{
      'action': ("escape")
    },hashTypes:{'action': "STRING"},hashContexts:{'action': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "lm-container", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n    <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":lf-dialog cc.options.dialogClass")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" role=\"dialog\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'aria-labelledby': ("cc.options.ariaLabelledBy"),
      'aria-label': ("cc.options.ariaLabel")
    },hashTypes:{'aria-labelledby': "STRING",'aria-label': "STRING"},hashContexts:{'aria-labelledby': depth0,'aria-label': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n      ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "innerView", {hash:{
      'dismiss': ("dismiss")
    },hashTypes:{'dismiss': "STRING"},hashContexts:{'dismiss': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n    </div>\n    ");
    data.buffer.push(escapeExpression((helper = helpers['lf-overlay'] || (depth0 && depth0['lf-overlay']),options={hash:{
      'clickAway': ("outsideClick")
    },hashTypes:{'clickAway': "STRING"},hashContexts:{'clickAway': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "lf-overlay", options))));
    data.buffer.push("\n  ");
    return buffer;
    }

    stack1 = (helper = helpers['liquid-with'] || (depth0 && depth0['liquid-with']),options={hash:{
      'class': ("lm-with"),
      'containerless': (true)
    },hashTypes:{'class': "STRING",'containerless': "BOOLEAN"},hashContexts:{'class': depth0,'containerless': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data},helper ? helper.call(depth0, "currentContext", "as", "cc", options) : helperMissing.call(depth0, "liquid-with", "currentContext", "as", "cc", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/liquid-spacer', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = (helper = helpers['liquid-measured'] || (depth0 && depth0['liquid-measured']),options={hash:{
      'width': ("width"),
      'height': ("height")
    },hashTypes:{'width': "ID",'height': "ID"},hashContexts:{'width': depth0,'height': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "liquid-measured", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/matrix-content', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression((helper = helpers['truncate-text'] || (depth0 && depth0['truncate-text']),options={hash:{
      'rows': ("rows")
    },hashTypes:{'rows': "ID"},hashContexts:{'rows': depth0},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "body", options) : helperMissing.call(depth0, "truncate-text", "body", options))));
    data.buffer.push("\n  ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers['if'].call(depth0, "acronym", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      ");
    stack1 = helpers._triageMustache.call(depth0, "acronym", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n    	");
    data.buffer.push(escapeExpression((helper = helpers['truncate-text'] || (depth0 && depth0['truncate-text']),options={hash:{
      'limit': (50),
      'rows': ("rows")
    },hashTypes:{'limit': "INTEGER",'rows': "ID"},hashContexts:{'limit': depth0,'rows': depth0},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "body", options) : helperMissing.call(depth0, "truncate-text", "body", options))));
    data.buffer.push("\n    ");
    return buffer;
    }

    data.buffer.push("<div ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleBody", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">\n  ");
    stack1 = helpers['if'].call(depth0, "isShowingBody", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/matrix-new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'style': ("max-width: 80%"),
      'value': ("ownCell.score"),
      'action': ("updatedByUser"),
      'on': ("key-press")
    },hashTypes:{'style': "STRING",'value': "ID",'action': "STRING",'on': "STRING"},hashContexts:{'style': depth0,'value': depth0,'action': depth0,'on': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/modal-container', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <modal-main>\n\n    ");
    stack1 = helpers['if'].call(depth0, "makeTitle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "makeTrigger", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  </modal-main>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}
    if (helper = helpers['modal-title']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['modal-title']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['modal-title']) { stack1 = blockHelperMissing.call(depth0, 'modal-title', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program3(depth0,data) {
    
    
    data.buffer.push("Modal Content");
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['modal-trigger'] || (depth0 && depth0['modal-trigger']),options={hash:{
      'class': ("modal-close"),
      'aria-label': ("close")
    },hashTypes:{'class': "STRING",'aria-label': "STRING"},hashContexts:{'class': depth0,'aria-label': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "modal-trigger", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program6(depth0,data) {
    
    
    data.buffer.push("×");
    }

    stack1 = helpers['if'].call(depth0, "isOpen", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/modal-form', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  <modal-main>\n\n    ");
    stack1 = helpers['if'].call(depth0, "makeTitle", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "makeTrigger", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  </modal-main>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}
    if (helper = helpers['modal-title']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['modal-title']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['modal-title']) { stack1 = blockHelperMissing.call(depth0, 'modal-title', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program3(depth0,data) {
    
    
    data.buffer.push("Modal Content");
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['modal-trigger'] || (depth0 && depth0['modal-trigger']),options={hash:{
      'class': ("modal-close"),
      'aria-label': ("close")
    },hashTypes:{'class': "STRING",'aria-label': "STRING"},hashContexts:{'class': depth0,'aria-label': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "modal-trigger", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program6(depth0,data) {
    
    
    data.buffer.push("×");
    }

    stack1 = helpers['if'].call(depth0, "isOpen", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-alert', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "dismiss", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class=\"close\" data-dismiss=\"alert\" type=\"button\">\n        <span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span>\n    </button>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "dismissable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-button', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/sl-calendar-day', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1;


    stack1 = helpers._triageMustache.call(depth0, "day", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/sl-calendar-month', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1;


    stack1 = helpers._triageMustache.call(depth0, "shortName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/sl-calendar-year', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1;


    stack1 = helpers._triageMustache.call(depth0, "year", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/sl-calendar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n        <div class=\"datepicker-days\" style=\"display: block;\">\n            <table class=\"table-condensed\">\n                <thead>\n                    <tr>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeMonth", -1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
    data.buffer.push(" class=\"prev\"><span class=\"fa fa-angle-left\"></span></th>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "setView", "months", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" colspan=\"5\" class=\"datepicker-switch\">");
    stack1 = helpers._triageMustache.call(depth0, "currentMonthString", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "currentYear", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</th>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeMonth", 1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
    data.buffer.push("class=\"next\"><span class=\"fa fa-angle-right\"></span></th>\n                    </tr>\n                    <tr>\n                        <th class=\"dow\">");
    data.buffer.push(escapeExpression((helper = helpers.shortWeekDayName || (depth0 && depth0.shortWeekDayName),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["INTEGER"],data:data},helper ? helper.call(depth0, 0, options) : helperMissing.call(depth0, "shortWeekDayName", 0, options))));
    data.buffer.push("</th>\n                        <th class=\"dow\">");
    data.buffer.push(escapeExpression((helper = helpers.shortWeekDayName || (depth0 && depth0.shortWeekDayName),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["INTEGER"],data:data},helper ? helper.call(depth0, 1, options) : helperMissing.call(depth0, "shortWeekDayName", 1, options))));
    data.buffer.push("</th>\n                        <th class=\"dow\">");
    data.buffer.push(escapeExpression((helper = helpers.shortWeekDayName || (depth0 && depth0.shortWeekDayName),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["INTEGER"],data:data},helper ? helper.call(depth0, 2, options) : helperMissing.call(depth0, "shortWeekDayName", 2, options))));
    data.buffer.push("</th>\n                        <th class=\"dow\">");
    data.buffer.push(escapeExpression((helper = helpers.shortWeekDayName || (depth0 && depth0.shortWeekDayName),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["INTEGER"],data:data},helper ? helper.call(depth0, 3, options) : helperMissing.call(depth0, "shortWeekDayName", 3, options))));
    data.buffer.push("</th>\n                        <th class=\"dow\">");
    data.buffer.push(escapeExpression((helper = helpers.shortWeekDayName || (depth0 && depth0.shortWeekDayName),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["INTEGER"],data:data},helper ? helper.call(depth0, 4, options) : helperMissing.call(depth0, "shortWeekDayName", 4, options))));
    data.buffer.push("</th>\n                        <th class=\"dow\">");
    data.buffer.push(escapeExpression((helper = helpers.shortWeekDayName || (depth0 && depth0.shortWeekDayName),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["INTEGER"],data:data},helper ? helper.call(depth0, 5, options) : helperMissing.call(depth0, "shortWeekDayName", 5, options))));
    data.buffer.push("</th>\n                        <th class=\"dow\">");
    data.buffer.push(escapeExpression((helper = helpers.shortWeekDayName || (depth0 && depth0.shortWeekDayName),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["INTEGER"],data:data},helper ? helper.call(depth0, 6, options) : helperMissing.call(depth0, "shortWeekDayName", 6, options))));
    data.buffer.push("</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    ");
    stack1 = helpers.each.call(depth0, "week", "in", "weeksInMonthView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                </tbody>\n            </table>\n        </div>\n    ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                        <tr>\n                            ");
    stack1 = helpers.each.call(depth0, "day", "in", "week", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </tr>\n                    ");
    return buffer;
    }
  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                                ");
    data.buffer.push(escapeExpression((helper = helpers['sl-calendar-day'] || (depth0 && depth0['sl-calendar-day']),options={hash:{
      'action': ("sendDateContent"),
      'active': ("day.active"),
      'content': ("day.content"),
      'day': ("day.day"),
      'new': ("day.new"),
      'old': ("day.old")
    },hashTypes:{'action': "STRING",'active': "ID",'content': "ID",'day': "ID",'new': "ID",'old': "ID"},hashContexts:{'action': depth0,'active': depth0,'content': depth0,'day': depth0,'new': depth0,'old': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-calendar-day", options))));
    data.buffer.push("\n                            ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <div class=\"datepicker-months\" style=\"display: block;\">\n            <table class=\"table-condensed\">\n                <thead>\n                    <tr>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeYear", -1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
    data.buffer.push(" class=\"prev\" style=\"visibility: visible;\"><span class=\"fa fa-angle-left\"></span></th>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "setView", "years", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" colspan=\"5\" class=\"datepicker-switch\">");
    stack1 = helpers._triageMustache.call(depth0, "currentYear", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</th>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeYear", 1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
    data.buffer.push(" class=\"next\" style=\"visibility: visible;\"><span class=\"fa fa-angle-right\"></span></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td colspan=\"7\">\n                            ");
    stack1 = helpers.each.call(depth0, "month", "in", "monthsInYearView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    ");
    return buffer;
    }
  function program6(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                                ");
    data.buffer.push(escapeExpression((helper = helpers['sl-calendar-month'] || (depth0 && depth0['sl-calendar-month']),options={hash:{
      'action': ("setMonth"),
      'active': ("month.active"),
      'month': ("month.month")
    },hashTypes:{'action': "STRING",'active': "ID",'month': "ID"},hashContexts:{'action': depth0,'active': depth0,'month': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-calendar-month", options))));
    data.buffer.push("\n                            ");
    return buffer;
    }

  function program8(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <div class=\"datepicker-years\" style=\"display: block;\">\n            <table class=\"table-condensed\">\n                <thead>\n                    <tr>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeDecade", -1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
    data.buffer.push(" class=\"prev\" style=\"visibility: visible;\"><span class=\"fa fa-angle-left\"></span></th>\n                        <th colspan=\"5\" class=\"datepicker-switch\">");
    stack1 = helpers._triageMustache.call(depth0, "decadeStart", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("-");
    stack1 = helpers._triageMustache.call(depth0, "decadeEnd", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</th>\n                        <th ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changeDecade", 1, {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","INTEGER"],data:data})));
    data.buffer.push(" class=\"next\" style=\"visibility: visible;\"><span class=\"fa fa-angle-right\"></span></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr>\n                        <td colspan=\"7\">\n                            ");
    stack1 = helpers.each.call(depth0, "year", "in", "yearsInDecadeView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    ");
    return buffer;
    }
  function program9(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                                ");
    data.buffer.push(escapeExpression((helper = helpers['sl-calendar-year'] || (depth0 && depth0['sl-calendar-year']),options={hash:{
      'action': ("setYear"),
      'active': ("year.active"),
      'old': ("year.old"),
      'new': ("year.new"),
      'year': ("year.year")
    },hashTypes:{'action': "STRING",'active': "ID",'old': "ID",'new': "ID",'year': "ID"},hashContexts:{'action': depth0,'active': depth0,'old': depth0,'new': depth0,'year': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-calendar-year", options))));
    data.buffer.push("\n                            ");
    return buffer;
    }

    data.buffer.push("<div class=\"datepicker datepicker-inline\">\n    ");
    stack1 = helpers['if'].call(depth0, "viewingDays", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "viewingMonths", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "viewingYears", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-chart', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <div class=\"panel-heading\">");
    stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<div class=\"panel-body\">\n    <div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'style': ("style")
    },hashTypes:{'style': "ID"},hashContexts:{'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" class=\"chart sl-maskable-content\"></div>\n    <div class=\"sl-mask\"></div>\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-checkbox', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<label>\n    ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'checked': ("value"),
      'disabled': ("disabled"),
      'name': ("name"),
      'type': ("checkbox")
    },hashTypes:{'checked': "ID",'disabled': "ID",'name': "ID",'type': "STRING"},hashContexts:{'checked': depth0,'disabled': depth0,'name': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</label>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-date-picker', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <label ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'for': ("sl-date-picker-view.elementId")
    },hashTypes:{'for': "STRING"},hashContexts:{'for': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</label>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <p class=\"help-block\">");
    stack1 = helpers._triageMustache.call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'viewName': ("sl-date-picker-view"),
      'type': ("text"),
      'action': ("enter"),
      'class': ("date-picker form-control"),
      'disabled': ("disabled"),
      'placeholder': ("placeholder"),
      'value': ("value")
    },hashTypes:{'viewName': "STRING",'type': "STRING",'action': "STRING",'class': "STRING",'disabled': "ID",'placeholder': "ID",'value': "ID"},hashContexts:{'viewName': depth0,'type': depth0,'action': depth0,'class': depth0,'disabled': depth0,'placeholder': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-date-range-picker', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <label ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'for': ("inputElementId")
    },hashTypes:{'for': "ID"},hashContexts:{'for': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</label>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <p class=\"help-block\">");
    stack1 = helpers._triageMustache.call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<div class=\"row\">\n    ");
    data.buffer.push(escapeExpression((helper = helpers['sl-date-picker'] || (depth0 && depth0['sl-date-picker']),options={hash:{
      'change': ("startDateChange"),
      'class': ("sl-daterange-start-date col-md-6"),
      'endDate': ("latestStartDate"),
      'placeholder': ("startDatePlaceholder"),
      'startDate': ("minDate"),
      'value': ("startDateValue"),
      'inputElementIdBinding': ("inputElementId")
    },hashTypes:{'change': "STRING",'class': "STRING",'endDate': "ID",'placeholder': "ID",'startDate': "ID",'value': "ID",'inputElementIdBinding': "STRING"},hashContexts:{'change': depth0,'class': depth0,'endDate': depth0,'placeholder': depth0,'startDate': depth0,'value': depth0,'inputElementIdBinding': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-date-picker", options))));
    data.buffer.push("\n\n    ");
    data.buffer.push(escapeExpression((helper = helpers['sl-date-picker'] || (depth0 && depth0['sl-date-picker']),options={hash:{
      'change': ("endDateChange"),
      'class': ("sl-daterange-end-date col-md-6"),
      'endDate': ("maxDate"),
      'placeholder': ("endDatePlaceholder"),
      'startDate': ("earliestEndDate"),
      'value': ("endDateValue")
    },hashTypes:{'change': "STRING",'class': "STRING",'endDate': "ID",'placeholder': "ID",'startDate': "ID",'value': "ID"},hashContexts:{'change': depth0,'class': depth0,'endDate': depth0,'placeholder': depth0,'startDate': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-date-picker", options))));
    data.buffer.push("\n</div>\n\n");
    stack1 = helpers['if'].call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    
  });

});
define('frontend/templates/components/sl-date-time', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "formattedValue", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-dialog', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                <span class=\"modal-title\">");
    stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n            ");
    return buffer;
    }

    data.buffer.push("<div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n        <div class=\"modal-header\">\n            <button class=\"close\" data-dismiss=\"modal\" type=\"button\">\n                <span aria-hidden=\"true\">&times;</span>\n                <span class=\"sr-only\">Close</span>\n            </button>\n\n            ");
    stack1 = helpers['if'].call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        </div>\n\n        <div class=\"modal-body\">\n            ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        </div>\n\n        <div class=\"modal-footer\">\n            <button class=\"btn btn-primary\" data-dismiss=\"modal\">");
    stack1 = helpers._triageMustache.call(depth0, "buttonText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</button>\n        </div>\n    </div>\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-drop-button', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers['if'].call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        ");
    stack1 = helpers._triageMustache.call(depth0, "view.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        <span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("iconClass")
    },hashTypes:{'class': "ID"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></span>\n    ");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        ");
    stack1 = helpers['if'].call(depth0, "content", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program5(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n            ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        ");
    stack1 = helpers.each.call(depth0, "option", "in", "content", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program8(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n            ");
    data.buffer.push(escapeExpression((helper = helpers['sl-drop-option'] || (depth0 && depth0['sl-drop-option']),options={hash:{
      'action': ("option.action"),
      'icon': ("option.icon"),
      'label': ("option.label")
    },hashTypes:{'action': "ID",'icon': "ID",'label': "ID"},hashContexts:{'action': depth0,'icon': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-drop-option", options))));
    data.buffer.push("\n        ");
    return buffer;
    }

  function program10(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }

    stack1 = (helper = helpers['sl-button'] || (depth0 && depth0['sl-button']),options={hash:{
      'class': ("dropdown-toggle"),
      'data-toggle': ("dropdown"),
      'size': ("size"),
      'type': ("button")
    },hashTypes:{'class': "STRING",'data-toggle': "STRING",'size': "ID",'type': "STRING"},hashContexts:{'class': depth0,'data-toggle': depth0,'size': depth0,'type': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<ul ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":dropdown-menu rightAligned:dropdown-menu-right")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" role=\"menu\">\n    ");
    stack1 = helpers['if'].call(depth0, "content", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(10, program10, data),fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</ul>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-drop-option', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "click", "action", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" role=\"menuitem\" tab-index=\"-1\">\n        ");
    stack1 = helpers['if'].call(depth0, "icon", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </a>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n            <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("icon")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("/>\n        ");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-grid-header-settings', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n        <li class=\"text-center\" role=\"presentation\">");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("translationKeys.actions")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("</li>\n        <li role=\"presentation\" class=\"divider\"></li>\n        ");
    stack1 = helpers.each.call(depth0, "entry", "in", "clickableActions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        <li role=\"presentation\" class=\"divider\"></li>\n    ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n            <li class=\"text-center\" role=\"presentation\" >\n                ");
    stack1 = helpers['if'].call(depth0, "entry.action", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </li>\n        ");
    return buffer;
    }
  function program3(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n                    <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "click", "entry.action", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" role=\"menuitem\" tab-index=\"-1\">\n                        ");
    stack1 = helpers['if'].call(depth0, "entry.icon", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                        ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("entry.label")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n                    </a>\n                ");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n                            <img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("entry.icon")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("/>\n                        ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                    ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("entry.label")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n                ");
    return buffer;
    }

  function program8(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n        <li class=\"text-center\" role=\"presentation\">");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("translationKeys.columns")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("</li>\n        <li role=\"presentation\" class=\"divider\"></li>\n        <li  class=\"text-center\" role=\"presentation\">\n            <a role=\"menuitem\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "click", "resetColumns", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(">\n                ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("translationKeys.resetColumnsToDefaults")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n            </a>\n        </li>\n        ");
    stack1 = helpers.each.call(depth0, "column", "in", "hideableColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program9(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n            <li role=\"presentation\" class=\"hideableColumn stay-open\">\n                ");
    stack1 = helpers['if'].call(depth0, "column.action", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </li>\n        ");
    return buffer;
    }
  function program10(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                    <label ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "click", "column.action", "column.key", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["STRING","ID","ID"],data:data})));
    data.buffer.push(">\n                        ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "view.columnCheckbox", {hash:{
      'column': ("column")
    },hashTypes:{'column': "ID"},hashContexts:{'column': depth0},contexts:[depth0],types:["ID"],data:data})));
    data.buffer.push("\n                        ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("column.label")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n                    </label>\n                ");
    return buffer;
    }

  function program12(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                    ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("column.label")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n                ");
    return buffer;
    }

    data.buffer.push("<button class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" type=\"button\">\n    <i class=\"fa fa-cog\"></i> <span class=\"caret\"></span>\n</button>\n\n<ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n    ");
    stack1 = helpers['if'].call(depth0, "showActions", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "showColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</ul>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-grid-table-cell-actions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['sl-drop-button'] || (depth0 && depth0['sl-drop-button']),options={hash:{
      'label': ("Actions"),
      'content': ("row.actionsButton"),
      'theme': ("hover"),
      'target': ("targetObject")
    },hashTypes:{'label': "STRING",'content': "ID",'theme': "STRING",'target': "ID"},hashContexts:{'label': depth0,'content': depth0,'theme': depth0,'target': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-drop-button", options))));
    
  });

});
define('frontend/templates/components/sl-grid-table-cell-link', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression((helper = helpers['get-key'] || (depth0 && depth0['get-key']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data},helper ? helper.call(depth0, "row", "column.key", "column.defaultText", options) : helperMissing.call(depth0, "get-key", "row", "column.key", "column.defaultText", options))));
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["ID","ID"],data:data},helper ? helper.call(depth0, "column.link", "row", options) : helperMissing.call(depth0, "link-to", "column.link", "row", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-grid-table-cell-row-expander', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<a href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleRowExpander", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("><i ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":fa expanded:fa-caret-down:fa-caret-right")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></i></a>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-grid-table-cell', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['get-key'] || (depth0 && depth0['get-key']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data},helper ? helper.call(depth0, "row", "column.key", "column.defaultText", options) : helperMissing.call(depth0, "get-key", "row", "column.key", "column.defaultText", options))));
    
  });

});
define('frontend/templates/components/sl-grid-table-column-resize', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("&nbsp;\n");
    
  });

});
define('frontend/templates/components/sl-grid-table-header', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers['if'].call(depth0, "column.sortable", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n        <a href=\"#\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortColumn", "column", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("column.title")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push(" \n        <span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("view.sortClasses")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("/>\n        </a>\n    ");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n        ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("column.title")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n    ");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "column.title", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/sl-grid-table-row-expander', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<td ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'colspan': ("visibleColumns"),
      'class': (":row-expander-cell")
    },hashTypes:{'colspan': "ID",'class': "STRING"},hashContexts:{'colspan': depth0,'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n    ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</td>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-input', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <label ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'for': ("sl-input-view.elementId")
    },hashTypes:{'for': "STRING"},hashContexts:{'for': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" class=\"control-label\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "optional", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "required", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </label>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-info\">Optional</small>\n        ");
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-danger\">Required</small>\n        ");
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <p class=\"help-block\">");
    stack1 = helpers._triageMustache.call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'viewName': ("sl-input-view"),
      'type': ("type"),
      'action': ("enter"),
      'class': ("inputClass"),
      'disabled': ("disabled"),
      'placeholder': ("placeholder"),
      'readonly': ("readonly"),
      'value': ("value")
    },hashTypes:{'viewName': "STRING",'type': "ID",'action': "STRING",'class': "ID",'disabled': "ID",'placeholder': "ID",'readonly': "ID",'value': "ID"},hashContexts:{'viewName': depth0,'type': depth0,'action': depth0,'class': depth0,'disabled': depth0,'placeholder': depth0,'readonly': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-menu', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <a href=\"#\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("menu.pages:submenu")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "selected", {hash:{
      'target': ("view"),
      'bubbles': (false)
    },hashTypes:{'target': "STRING",'bubbles': "BOOLEAN"},hashContexts:{'target': depth0,'bubbles': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(">");
    stack1 = helpers._triageMustache.call(depth0, "view.menu.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <ul ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("view.isRoot:list-inline")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n        ");
    stack1 = helpers.each.call(depth0, "page", "in", "menu.pages", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "view.displayShowAll", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </ul>\n");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n            ");
    data.buffer.push(escapeExpression((helper = helpers['sl-menu'] || (depth0 && depth0['sl-menu']),options={hash:{
      'tagName': ("li"),
      'menuBinding': ("page"),
      'isRoot': (false)
    },hashTypes:{'tagName': "STRING",'menuBinding': "STRING",'isRoot': "BOOLEAN"},hashContexts:{'tagName': depth0,'menuBinding': depth0,'isRoot': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-menu", options))));
    data.buffer.push("\n        ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n            ");
    stack1 = helpers.view.call(depth0, "view.AllView", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program7(depth0,data) {
    
    
    data.buffer.push("\n                <a href=\"#\" class=\"fa fa-chevron-circle-down\" style=\"font-size: 18px;\"></a>\n            ");
    }

    stack1 = helpers['if'].call(depth0, "menu.label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "menu.pages", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-pagination-controls', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<span class=\"sl-pagination-links\">\n    <ul class=\"pagination\">\n        <li ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("firstLinkDisabled:disabled")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("><a  ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changePage", "first", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" class=\"first-page\" title=\"First page\"><span class=\"fa fa-angle-double-left\"></span></a></li>\n        <li ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("prevLinkDisabled:disabled")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" ><a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changePage", "prev", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" class=\"previous-page\" title=\"Previous page\"><span class=\"fa fa-angle-left\"></span></a></li>\n    </ul>\n</span>\n\n<span class=\"sl-pagination-input form-inline\">\n        <div class=\"form-group\">\n            <span>Page</span> ");
    data.buffer.push(escapeExpression((helper = helpers['sl-input'] || (depth0 && depth0['sl-input']),options={hash:{
      'action': ("changePage"),
      'disabled': ("disabled"),
      'value': ("currentPageInput")
    },hashTypes:{'action': "STRING",'disabled': "ID",'value': "ID"},hashContexts:{'action': depth0,'disabled': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-input", options))));
    data.buffer.push(" <span>of ");
    stack1 = helpers._triageMustache.call(depth0, "totalPages", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n        </div>\n</span>\n\n<span class=\"sl-pagination-links\">\n    <ul class=\"pagination\">\n        <li ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("nextLinkDisabled:disabled")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("><a  ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changePage", "next", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" class=\"next-page\" title=\"Next page\"><span class=\"fa fa-angle-right\"></span></a></li>\n        <li ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("lastLinkDisabled:disabled")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("><a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "changePage", "last", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" class=\"last-page\" title=\"Last page\"><span class=\"fa fa-angle-double-right\"></span></a></li>\n    </ul>\n</span>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-pagination-info', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("pagingInfo"),
      '$0': ("pagingData.pageFirstRow"),
      '$1': ("pagingData.pageLastRow"),
      '$2': ("pagingData.totalRows"),
      '$3': ("pagingData.modelNames")
    },hashTypes:{'key': "ID",'$0': "ID",'$1': "ID",'$2': "ID",'$3': "ID"},hashContexts:{'key': depth0,'$0': depth0,'$1': depth0,'$2': depth0,'$3': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("\n    No data to display\n");
    }

    stack1 = helpers['if'].call(depth0, "pagingData.totalRows", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-pagination-per-page-select', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['sl-select'] || (depth0 && depth0['sl-select']),options={hash:{
      'content': ("perPageOptions"),
      'disableSearch': (true),
      'value': ("itemCountPerPage")
    },hashTypes:{'content': "ID",'disableSearch': "BOOLEAN",'value': "ID"},hashContexts:{'content': depth0,'disableSearch': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-select", options))));
    data.buffer.push(" ");
    data.buffer.push(escapeExpression((helper = helpers['sl-translate'] || (depth0 && depth0['sl-translate']),options={hash:{
      'key': ("label")
    },hashTypes:{'key': "ID"},hashContexts:{'key': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-translate", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-panel', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <div class=\"panel-heading\">");
    stack1 = helpers._triageMustache.call(depth0, "heading", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</div>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "heading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<div class=\"panel-body\">\n    <div class=\"sl-maskable-content\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n    <div class=\"sl-mask\"></div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-progress-bar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <span class=\"sl-progress-bar-value\">");
    stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("%</span>\n    ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <span class=\"sr-only\">");
    stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("% Complete</span>\n    ");
    return buffer;
    }

    data.buffer.push("<div aria-valuemin=\"0\" aria-valuemax=\"100\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'aria-valuenow': ("value"),
      'class': (":progress-bar striped:progress-bar-striped animated:active themeClassName"),
      'style': ("styleString")
    },hashTypes:{'aria-valuenow': "ID",'class': "STRING",'style': "ID"},hashContexts:{'aria-valuenow': depth0,'class': depth0,'style': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" role=\"progressbar\">\n    ");
    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-radio-group', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <label>\n        ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "optional", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "required", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </label>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-info\">Optional</small>\n        ");
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-danger\">Required</small>\n        ");
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-radio', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


    data.buffer.push("<label ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'for': ("sl-radio-view.elementId")
    },hashTypes:{'for': "STRING"},hashContexts:{'for': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n    ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'viewName': ("sl-radio-view"),
      'type': ("radio"),
      'disabled': ("disabled"),
      'id': ("inputId"),
      'name': ("name"),
      'readonly': ("readonly"),
      'value': ("value")
    },hashTypes:{'viewName': "STRING",'type': "STRING",'disabled': "ID",'id': "ID",'name': "ID",'readonly': "ID",'value': "ID"},hashContexts:{'viewName': depth0,'type': depth0,'disabled': depth0,'id': depth0,'name': depth0,'readonly': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n\n    ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</label>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-select', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <label ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'for': ("sl-select-view.elementId")
    },hashTypes:{'for': "STRING"},hashContexts:{'for': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" class=\"control-label\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "optional", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "required", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </label>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-info\">Optional</small>\n        ");
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-danger\">Required</small>\n        ");
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <p class=\"help-block\">");
    stack1 = helpers._triageMustache.call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'viewName': ("sl-select-view"),
      'type': ("hidden"),
      'class': ("form-control"),
      'disabled': ("disabled"),
      'readonly': ("readonly")
    },hashTypes:{'viewName': "STRING",'type': "STRING",'class': "STRING",'disabled': "ID",'readonly': "ID"},hashContexts:{'viewName': depth0,'type': depth0,'class': depth0,'disabled': depth0,'readonly': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-span', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "sl-loading-icon", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/components/sl-tab-pane', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression((helper = helpers['render-tab-pane'] || (depth0 && depth0['render-tab-pane']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "templateName", options) : helperMissing.call(depth0, "render-tab-pane", "templateName", options))));
    data.buffer.push("\n");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "templateName", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-tab-panel', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <li ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":tab tab.active"),
      'data-tab-name': ("tab.name")
    },hashTypes:{'class': "STRING",'data-tab-name': "ID"},hashContexts:{'class': depth0,'data-tab-name': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n            <a ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "change", "tab.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" role=\"tab\">");
    stack1 = helpers._triageMustache.call(depth0, "tab.label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n        </li>\n    ");
    return buffer;
    }

    data.buffer.push("<ul class=\"nav nav-tabs\" role=\"tablist\">\n    ");
    stack1 = helpers.each.call(depth0, "tab", "in", "tabs", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</ul>\n\n<div class=\"tab-content\">\n    ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/components/sl-textarea', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <label ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'for': ("sl-textarea-view.elementId")
    },hashTypes:{'for': "STRING"},hashContexts:{'for': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" class=\"control-label\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "optional", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        ");
    stack1 = helpers['if'].call(depth0, "required", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </label>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-info\">Optional</small>\n        ");
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("\n            <small class=\"text-danger\">Required</small>\n        ");
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    <p class=\"help-block\">");
    stack1 = helpers._triageMustache.call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</p>\n");
    return buffer;
    }

    stack1 = helpers['if'].call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
      'autofocus': ("autofocus"),
      'class': ("form-control"),
      'cols': ("cols"),
      'disabled': ("disabled"),
      'maxlength': ("maxlength"),
      'placeholder': ("placeholder"),
      'readonly': ("readonly"),
      'rows': ("rows"),
      'selectionDirection': ("selectionDirection"),
      'selectionEnd': ("selectionEnd"),
      'selectionStart': ("selectionStart"),
      'spellcheck': ("spellcheck"),
      'tabindex': ("tabindex"),
      'value': ("value"),
      'viewName': ("sl-textarea-view"),
      'wrap': ("wrap")
    },hashTypes:{'autofocus': "ID",'class': "STRING",'cols': "ID",'disabled': "ID",'maxlength': "ID",'placeholder': "ID",'readonly': "ID",'rows': "ID",'selectionDirection': "ID",'selectionEnd': "ID",'selectionStart': "ID",'spellcheck': "ID",'tabindex': "ID",'value': "ID",'viewName': "STRING",'wrap': "ID"},hashContexts:{'autofocus': depth0,'class': depth0,'cols': depth0,'disabled': depth0,'maxlength': depth0,'placeholder': depth0,'readonly': depth0,'rows': depth0,'selectionDirection': depth0,'selectionEnd': depth0,'selectionStart': depth0,'spellcheck': depth0,'tabindex': depth0,'value': depth0,'viewName': depth0,'wrap': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "helpText", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/footer-container', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "table-block", {hash:{
      'classNames': ("ember-table-left-table-block"),
      'contentBinding': ("controller.footerContent"),
      'columnsBinding': ("controller.fixedColumns"),
      'widthBinding': ("controller._fixedBlockWidth"),
      'heightBinding': ("controller.footerHeight")
    },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n  ");
    return buffer;
    }

    data.buffer.push("<div class=\"ember-table-table-fixed-wrapper\">\n  ");
    stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "table-block", {hash:{
      'classNames': ("ember-table-right-table-block"),
      'contentBinding': ("controller.footerContent"),
      'columnsBinding': ("controller.tableColumns"),
      'scrollLeftBinding': ("controller._tableScrollLeft"),
      'widthBinding': ("controller._tableBlockWidth"),
      'heightBinding': ("controller.footerHeight")
    },hashTypes:{'classNames': "STRING",'contentBinding': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'contentBinding': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/header-cell', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"ember-table-content-container\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "sortByColumn", "view.content", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(">\n  <span class=\"ember-table-content\">\n    ");
    stack1 = helpers._triageMustache.call(depth0, "view.content.headerCellName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </span>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/header-row', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression(helpers.view.call(depth0, "multi-item-view-collection", {hash:{
      'contentBinding': ("view.content"),
      'itemViewClassField': ("headerCellViewClass"),
      'widthBinding': ("controller._tableColumnsWidth")
    },hashTypes:{'contentBinding': "STRING",'itemViewClassField': "STRING",'widthBinding': "STRING"},hashContexts:{'contentBinding': depth0,'itemViewClassField': depth0,'widthBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/header-table-container', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "header-block", {hash:{
      'classNames': ("ember-table-left-table-block"),
      'columnsBinding': ("controller.fixedColumns"),
      'widthBinding': ("controller._fixedBlockWidth"),
      'heightBinding': ("controller.headerHeight")
    },hashTypes:{'classNames': "STRING",'columnsBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'columnsBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n  ");
    return buffer;
    }

    data.buffer.push("<div class=\"ember-table-table-fixed-wrapper\">\n  ");
    stack1 = helpers['if'].call(depth0, "controller.numFixedColumns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "header-block", {hash:{
      'classNames': ("ember-table-right-table-block"),
      'columnsBinding': ("controller.tableColumns"),
      'scrollLeftBinding': ("controller._tableScrollLeft"),
      'widthBinding': ("controller._tableBlockWidth"),
      'heightBinding': ("controller.headerHeight")
    },hashTypes:{'classNames': "STRING",'columnsBinding': "STRING",'scrollLeftBinding': "STRING",'widthBinding': "STRING",'heightBinding': "STRING"},hashContexts:{'classNames': depth0,'columnsBinding': depth0,'scrollLeftBinding': depth0,'widthBinding': depth0,'heightBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"container-fluid primary-blue\">\n	<div class=\"jumbotron primary-blue\">\n	  <img src=\"/assets/img/fao.gif\">\n	  <p>");
    data.buffer.push(escapeExpression((helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-lg btn-orangeish")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[depth0,depth0],types:["STRING","STRING"],data:data},helper ? helper.call(depth0, " View Studies", "studies", options) : helperMissing.call(depth0, "link-to", " View Studies", "studies", options))));
    data.buffer.push("</p>\n	  <h1>Welcome to Solutions to Public Policy Analysis</h1>\n	  <p><small>Demo developed for Food and Agriculture Organization by <strong><a class=\"no-decoration\" href=\"mailto:info@teachmeapp.com\">Teachme Solutions</a></strong></small></p>\n	</div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/liquid-with-self', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/liquid-with', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "with-apply", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n\n");
    return buffer;
    
  });

});
define('frontend/templates/objectives', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

    data.buffer.push("<h4 style=\"margin-top:0px\">Edit existing Policy or Program</h4>\n<div class=\"row\">\n	<div class=\"col-sm-12\">\n		<div class=\"panel panel-primary-blue\">\n		  <div class=\"panel-heading\">\n		    <h3 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "policy.index", "model", options) : helperMissing.call(depth0, "link-to", "policy.index", "model", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" Technical Information</h3>\n		  </div>\n		  <div class=\"panel-body\">\n		    <div class=\"row\">\n					<div class=\"col-sm-10 col-sm-offset-1\">\n						<h3>Specific Objectives</h3>\n						");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n					</div>\n				</div>\n		  </div>\n		</div>	\n	</div>\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/objectives/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n	<li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("no-decoration")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "objectives.index.show.edit", "objective", options) : helperMissing.call(depth0, "link-to", "objectives.index.show.edit", "objective", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n		<ol>\n			");
    stack1 = helpers.each.call(depth0, "output", "in", "objective.outputs", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-xs btn-primary-blue")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "outputs.new", "objective", options) : helperMissing.call(depth0, "link-to", "outputs.new", "objective", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n			</li>\n		</ol>\n	");
    return buffer;
    }
  function program2(depth0,data) {
    
    var stack1;
    stack1 = helpers._triageMustache.call(depth0, "objective.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }

  function program4(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n				<li>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("no-decoration")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "outputs.show.edit", "output", options) : helperMissing.call(depth0, "link-to", "outputs.show.edit", "output", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n			");
    return buffer;
    }
  function program5(depth0,data) {
    
    var stack1;
    stack1 = helpers._triageMustache.call(depth0, "output.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("\n					<span class=\"glyphicon glyphicon-plus\"></span>\n				");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-plus\"></span>");
    }

    data.buffer.push("<ol>\n	");
    stack1 = helpers.each.call(depth0, "objective", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary-blue")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "objectives.index.new", options) : helperMissing.call(depth0, "link-to", "objectives.index.new", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n</ol>\n");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/objectives/index/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<h4>New objective</h4>\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-objective", options) : helperMissing.call(depth0, "partial", "form-objective", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/objectives/index/show', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/objectives/index/show/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<h4>Edit Objective</h4>\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-objective", options) : helperMissing.call(depth0, "partial", "form-objective", options))));
    return buffer;
    
  });

});
define('frontend/templates/outputs', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/outputs/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<h4>New output</h4>\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-output", options) : helperMissing.call(depth0, "partial", "form-output", options))));
    data.buffer.push("\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/outputs/show/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<h4>Edit Output</h4>\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-output", options) : helperMissing.call(depth0, "partial", "form-output", options))));
    return buffer;
    
  });

});
define('frontend/templates/policies', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<h2>Policies And Programs</h2>\n");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/policies/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n\n<ul> \n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "policy", "pyp", options) : helperMissing.call(depth0, "link-to", "policy", "pyp", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" \n		<li><strong>Title: </styg>");
    stack1 = helpers._triageMustache.call(depth0, "pyp.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n		<li><strong>Country: </strong><span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("pyp.flagClass")
    },hashTypes:{'class': "ID"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></span> ");
    stack1 = helpers._triageMustache.call(depth0, "pyp.countryName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n</ul>\n");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary-blue"),
      'style': ("margin:15px;")
    },hashTypes:{'class': "STRING",'style': "STRING"},hashContexts:{'class': depth0,'style': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "policy.edit", "pyp", options) : helperMissing.call(depth0, "link-to", "policy.edit", "pyp", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete", "pyp", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" class=\"btn btn-danger\"><i class=\"fa fa-fw fa-trash\"></i></button>\n<br>\n<br>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("		\n		<li><strong>ID: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "pyp.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n	");
    return buffer;
    }

  function program4(depth0,data) {
    
    
    data.buffer.push(" <i class=\"fa fa-fw fa-edit\"></i>");
    }

    data.buffer.push("<h4>Total created policies: ");
    stack1 = helpers._triageMustache.call(depth0, "model.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n\n");
    stack1 = helpers.each.call(depth0, "pyp", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/policies/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

    data.buffer.push("<!-- Page Heading -->\n<h4 style=\"margin-top:0px\">Create New Policy or Program</h4>\n<div class=\"panel panel-primary-blue\">\n  <div class=\"panel-heading\">\n    <h4 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "policies.index", options) : helperMissing.call(depth0, "link-to", "policies.index", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("   General Information</h4>\n  </div>\n  ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-policy", options) : helperMissing.call(depth0, "partial", "form-policy", options))));
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/policy', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div class=\"row\">\n	<div class=\"col-sm-12\">\n		<h2><small>Policy</small> ");
    stack1 = helpers._triageMustache.call(depth0, "model.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <small>from</small> ");
    stack1 = helpers._triageMustache.call(depth0, "model.countryName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h2>\n		");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	</div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/policy/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

    data.buffer.push("<!-- Page Heading -->\n<h4 style=\"margin-top:0px\">Edit existing Policy or Program</h4>\n<div class=\"panel panel-primary-blue\">\n  <div class=\"panel-heading\">\n    <h4 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "policy.index", "model", options) : helperMissing.call(depth0, "link-to", "policy.index", "model", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" Editing P&P General Information</h4>\n  </div>\n  ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-policy", options) : helperMissing.call(depth0, "partial", "form-policy", options))));
    data.buffer.push("\n</div>\n\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/policy/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n						<li> <strong>");
    stack1 = helpers._triageMustache.call(depth0, "objective.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></li>\n							<ul>\n								<li><strong>Description: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "objective.description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n								<li><strong>Target: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "objective.target", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n								<li><strong>Baseline: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "objective.target", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n								<ol>\n									");
    stack1 = helpers.each.call(depth0, "output", "in", "objective.outputs", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n								</ol>\n							</ul>\n						</li>\n					");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n										<li><strong>");
    stack1 = helpers._triageMustache.call(depth0, "output.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></li>\n										<ul>\n											<li><strong>Description: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "output.description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n											<li><strong>Target: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "output.target", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n											<li><strong>Baseline: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "output.target", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n											<li><strong>Policy Instrument: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "output.policyInstrument", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n											<li><strong>Activity: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "output.activity", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n											<li><strong>Budget: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "output.budget", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n										</ul>\n									");
    return buffer;
    }

  function program6(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-pencil\"></span>  Edit General Information ");
    }

  function program8(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-pencil\"></span>  Edit Technical Information ");
    }

    data.buffer.push("<div class=\"panel panel-primary-blue\">\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "policies", options) : helperMissing.call(depth0, "link-to", "policies", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" General Information</h3>\n  </div>\n  <div class=\"panel-body\">\n  <p class=\"bg-primary-blue text-center\" style=\"margin:0px -15px 15px -15px\">General Information</p>\n  	<dl class=\"dl-horizontal\">\n\n  		<dt>Description:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Acronym:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.acronym", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>General Objective</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.goName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>General Target</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.goTarget", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>General Baseline</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.goBaseline", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Contact person:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.contactName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "model.contactNumber", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "model.contactEmail", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "model.contactJob", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Typology:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.typology", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Regulatory Framework:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.regulatoryFramework", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Reference:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.regulatoryFrameworkReference", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Beneficiaries:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.beneficiaries", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Geographical coverage:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.geographicalCoverage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Specify:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.geographicalPlace", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Date of entry into force:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.dateEntry", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Timeframe:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.timeFrame", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Total Budget:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.totalBudget", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Currency:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.currency", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Main Actor:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.responsible", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Main Actor Duties:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.responsibleDuties", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Institutional Arrangements:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.institutionalArrangements", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Source:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.source", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n\n		  <dt>Comments:</dt>\n		  <dd>");
    stack1 = helpers._triageMustache.call(depth0, "model.comments", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</dd>\n		</dl>\n		<p class=\"bg-primary-blue text-center\" style=\"margin:0px -15px 15px -15px\">Technical Information</p>\n		<dl class=\"dl-horizontal\">\n			<dt>Specific Objectives:</dt>\n		  <dd>\n		  	<ol>\n					");
    stack1 = helpers.each.call(depth0, "objective", "in", "model.objectives", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				</ol>\n		  </dd>\n		</dl>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-sm-4 col-sm-offset-2\">\n		");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary-blue btn-lg btn-block")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "policy.edit", options) : helperMissing.call(depth0, "link-to", "policy.edit", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	</div>\n	<div class=\"col-sm-4\">\n		");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary-blue btn-lg btn-block")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "objectives", options) : helperMissing.call(depth0, "link-to", "objectives", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	</div>\n</div>\n<br>\n<br>\n\n");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/scroll-container', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<div class=\"antiscroll-wrap\">\n  <div class=\"antiscroll-inner\">\n    ");
    data.buffer.push(escapeExpression(helpers.view.call(depth0, "scroll-panel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('frontend/templates/sl-grid', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                ");
    stack1 = helpers.unless.call(depth0, "column.hidden", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                    ");
    data.buffer.push(escapeExpression((helper = helpers['sl-grid-table-header'] || (depth0 && depth0['sl-grid-table-header']),options={hash:{
      'action': ("sortColumn"),
      'column': ("column"),
      'columns': ("columns"),
      'disabled': ("isLoading"),
      'totalWidthHints': ("totalWidthHints"),
      'totalFixedWidths': ("totalFixedWidths"),
      'cssThClass': ("column.cssThClass")
    },hashTypes:{'action': "STRING",'column': "ID",'columns': "ID",'disabled': "ID",'totalWidthHints': "ID",'totalFixedWidths': "ID",'cssThClass': "ID"},hashContexts:{'action': depth0,'column': depth0,'columns': depth0,'disabled': depth0,'totalWidthHints': depth0,'totalFixedWidths': depth0,'cssThClass': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-grid-table-header", options))));
    data.buffer.push(" \n                ");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '';
    data.buffer.push("\n        <tr>\n            <td ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'colspan': ("visibleColumns"),
      'class': (":shadow-mask")
    },hashTypes:{'colspan': "ID",'class': "STRING"},hashContexts:{'colspan': depth0,'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">&nbsp;\n            </td>\n        </tr>\n    ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        ");
    stack1 = helpers.each.call(depth0, "row", "in", "controller", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(15, program15, data),fn:self.program(7, program7, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    ");
    return buffer;
    }
  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n            <tr>\n                ");
    stack1 = helpers.each.call(depth0, "column", "in", "columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            </tr>\n            ");
    stack1 = helpers['if'].call(depth0, "options.rowExpander", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program8(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                    ");
    stack1 = helpers.unless.call(depth0, "column.hidden", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                ");
    return buffer;
    }
  function program9(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                       ");
    data.buffer.push(escapeExpression((helper = helpers['render-component'] || (depth0 && depth0['render-component']),options={hash:{
      'cssClass': ("column.cssClass"),
      'column': ("column"),
      'row': ("row")
    },hashTypes:{'cssClass': "ID",'column': "ID",'row': "ID"},hashContexts:{'cssClass': depth0,'column': depth0,'row': depth0},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "column.component", options) : helperMissing.call(depth0, "render-component", "column.component", options))));
    data.buffer.push("\n                    ");
    return buffer;
    }

  function program11(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n                ");
    stack1 = helpers['if'].call(depth0, "row.rowExpanderIsOpen", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            ");
    return buffer;
    }
  function program12(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n                    ");
    stack1 = (helper = helpers['sl-grid-table-row-expander'] || (depth0 && depth0['sl-grid-table-row-expander']),options={hash:{
      'row': ("row"),
      'visibleColumns': ("visibleColumns")
    },hashTypes:{'row': "ID",'visibleColumns': "ID"},hashContexts:{'row': depth0,'visibleColumns': depth0},inverse:self.noop,fn:self.program(13, program13, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sl-grid-table-row-expander", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n                ");
    return buffer;
    }
  function program13(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n                        ");
    data.buffer.push(escapeExpression((helper = helpers['render-component'] || (depth0 && depth0['render-component']),options={hash:{
      'options': ("options"),
      'data': ("row")
    },hashTypes:{'options': "ID",'data': "ID"},hashContexts:{'options': depth0,'data': depth0},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "row.rowExpanderComponent", options) : helperMissing.call(depth0, "render-component", "row.rowExpanderComponent", options))));
    data.buffer.push("\n                    ");
    return buffer;
    }

  function program15(depth0,data) {
    
    
    data.buffer.push("\n            <tr>\n                <td colspan=\"3\">No data found</td>\n            </tr>\n        ");
    }

    data.buffer.push("<table class=\"sl-grid table table-striped\">\n    <thead>\n        <tr>\n            ");
    stack1 = helpers.each.call(depth0, "column", "in", "columns", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        </tr>\n    </thead>\n    <tbody>\n    ");
    stack1 = helpers['if'].call(depth0, "isLoading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </tbody>\n</table>\n");
    return buffer;
    
  });

});
define('frontend/templates/sl-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/studies', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var stack1;


    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    
  });

});
define('frontend/templates/studies/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n\n<ul> \n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "study", "study", options) : helperMissing.call(depth0, "link-to", "study", "study", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" \n		<li><strong>Title: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "study.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n		<li><strong>Variables: </strong></li>\n		<ol>\n		  ");
    stack1 = helpers.each.call(depth0, "variable", "in", "study.variables", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		</ol>\n		<li><strong>Policies & Programs: </strong></li>\n		<ul>\n		  ");
    stack1 = helpers.each.call(depth0, "pyp", "in", "study.pyps", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		</ul>\n</ul>\n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-orangeish"),
      'style': ("margin:15px;")
    },hashTypes:{'class': "STRING",'style': "STRING"},hashContexts:{'class': depth0,'style': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "study.matrix", "study", options) : helperMissing.call(depth0, "link-to", "study.matrix", "study", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary-blue"),
      'style': ("margin:15px;")
    },hashTypes:{'class': "STRING",'style': "STRING"},hashContexts:{'class': depth0,'style': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "study.edit", "study", options) : helperMissing.call(depth0, "link-to", "study.edit", "study", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	<button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete", "study", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" class=\"btn btn-danger\"><i class=\"fa fa-fw fa-trash\"></i></button>\n	<br>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("		\n		<li><strong>ID: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "study.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n	");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n		    <li>");
    stack1 = helpers._triageMustache.call(depth0, "variable.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n		  ");
    return buffer;
    }

  function program6(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n		    <li><span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("pyp.flagClass")
    },hashTypes:{'class': "ID"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></span> - ");
    stack1 = helpers._triageMustache.call(depth0, "pyp.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n		  ");
    return buffer;
    }

  function program8(depth0,data) {
    
    
    data.buffer.push(" <i class=\"fa fa-fw fa-th\"></i>");
    }

  function program10(depth0,data) {
    
    
    data.buffer.push(" <i class=\"fa fa-fw fa-edit\"></i>");
    }

    data.buffer.push("<h1>Previous Studies</h1>\n\n<h4>Total created studies: ");
    stack1 = helpers._triageMustache.call(depth0, "model.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n\n");
    stack1 = helpers.each.call(depth0, "study", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    
  });

});
define('frontend/templates/studies/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

    data.buffer.push("<!-- Page Heading -->\n<h2 >Start a New Study</h2>\n<div class=\"row\">\n	<div class=\"col-sm-12\">\n		<div class=\"panel panel-primary-blue\">\n		  <div class=\"panel-heading\">\n		    <h3 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "studies", options) : helperMissing.call(depth0, "link-to", "studies", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" General Study Information</h3>\n		  </div>\n		  ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-study", options) : helperMissing.call(depth0, "partial", "form-study", options))));
    data.buffer.push("\n		</div>	\n	</div>\n</div>\n\n");
    return buffer;
    
  });

});
define('frontend/templates/study', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("\n");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/study/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

    data.buffer.push("<h2>Edit an Existing Study</h2>\n<div class=\"row\">\n	<div class=\"col-sm-12\">\n		<div class=\"panel panel-primary-blue\">\n		  <div class=\"panel-heading\">\n		    <h3 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "studies", options) : helperMissing.call(depth0, "link-to", "studies", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("   General Study Information</h3>\n		  </div>\n		  ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-study", options) : helperMissing.call(depth0, "partial", "form-study", options))));
    data.buffer.push("\n		</div>	\n	</div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/study/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n					    	<li>");
    stack1 = helpers['if'].call(depth0, "variable.cc", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(6, program6, data),fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" - ");
    stack1 = helpers._triageMustache.call(depth0, "variable.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n					    ");
    return buffer;
    }
  function program4(depth0,data) {
    
    
    data.buffer.push("CC");
    }

  function program6(depth0,data) {
    
    
    data.buffer.push("CA");
    }

  function program8(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n					    	<li><span ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': ("pyp.flagClass")
    },hashTypes:{'class': "ID"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("></span> - ");
    stack1 = helpers._triageMustache.call(depth0, "pyp.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n					    ");
    return buffer;
    }

  function program10(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-pencil\"></span>     Edit Study Information ");
    }

  function program12(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-th\"></span>     Generate P&P MATRIX ");
    }

    data.buffer.push("<div class=\"row\">\n	<div class=\"col-sm-12\">\n		<h2><small>Study: </small>");
    stack1 = helpers._triageMustache.call(depth0, "model.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h2>\n		<div class=\"panel panel-primary-blue\">\n		  <div class=\"panel-heading\">\n		    <h3 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "studies", options) : helperMissing.call(depth0, "link-to", "studies", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" Study General Information</h3>\n		  </div>\n\n		  <div class=\"panel-body\">\n		  	<p class=\"bg-primary-blue text-center\" style=\"margin:0px -15px 15px -15px\">Variables</p>\n		  	<dl class=\"dl-horizontal\">\n		  		<dt>Variables:</dt>\n				  <dd>\n				  	<ol>\n					    ");
    stack1 = helpers.each.call(depth0, "variable", "in", "model.variables", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				    </ol>\n				  </dd>\n				</dl>\n	\n				<p class=\"bg-primary-blue text-center\" style=\"margin:0px -15px 15px -15px\">Policies and Programs</p>\n				<dl class=\"dl-horizontal\">\n					<dt>Policies and Programs:</dt>\n				  <dd>\n				  	<ul>\n					    ");
    stack1 = helpers.each.call(depth0, "pyp", "in", "model.pyps", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				    </ul>\n				  </dd>\n				</dl>\n			</div>\n		</div>\n		<div class=\"row\">\n			<div class=\"col-sm-4 col-sm-offset-2\">\n				");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary-blue btn-lg btn-block")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "study.edit", options) : helperMissing.call(depth0, "link-to", "study.edit", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n			</div>\n			<div class=\"col-sm-4\">\n				");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-orangeish btn-lg btn-block")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "study.matrix", options) : helperMissing.call(depth0, "link-to", "study.matrix", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n			</div>\n		</div>\n		<br>\n		<br>\n	</div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/study/matrix', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n				<li>");
    stack1 = helpers._triageMustache.call(depth0, "variable.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n			");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n							<th class=\"success col-score\">");
    stack1 = helpers._triageMustache.call(depth0, "index", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</th>\n						");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n							<th class=\"warning col-score\">");
    stack1 = helpers._triageMustache.call(depth0, "index", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</th>\n						");
    return buffer;
    }

  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n							<th class=\"info col-score\">");
    stack1 = helpers._triageMustache.call(depth0, "index", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</th>\n						");
    return buffer;
    }

  function program9(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n						");
    stack1 = helpers.each.call(depth0, "objective", "in", "pyp.objectives", {hash:{
      'itemController': ("study/objective")
    },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n					");
    return buffer;
    }
  function program10(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n							");
    stack1 = helpers.each.call(depth0, "outputNUR", "in", "objective.outputs", {hash:{
      'itemController': ("study/output")
    },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(11, program11, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n						");
    return buffer;
    }
  function program11(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n								<tr>\n									");
    stack1 = helpers['if'].call(depth0, "outputNUR.isFirst", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("	\n									<td>");
    data.buffer.push(escapeExpression((helper = helpers['matrix-content'] || (depth0 && depth0['matrix-content']),options={hash:{
      'body': ("outputNUR.title")
    },hashTypes:{'body': "ID"},hashContexts:{'body': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-content", options))));
    data.buffer.push("</td>\n\n									");
    stack1 = helpers.each.call(depth0, "variable", "in", "model.variables", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(15, program15, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n									<td>");
    data.buffer.push(escapeExpression((helper = helpers['matrix-content'] || (depth0 && depth0['matrix-content']),options={hash:{
      'body': ("outputNUR.policyInstrument"),
      'number': ("outputs")
    },hashTypes:{'body': "ID",'number': "STRING"},hashContexts:{'body': depth0,'number': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-content", options))));
    data.buffer.push("</td>\n									");
    stack1 = helpers.each.call(depth0, "variable", "in", "model.variables", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n									<td>");
    data.buffer.push(escapeExpression((helper = helpers['matrix-content'] || (depth0 && depth0['matrix-content']),options={hash:{
      'body': ("outputNUR.activity")
    },hashTypes:{'body': "ID"},hashContexts:{'body': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-content", options))));
    data.buffer.push("</td>\n									");
    stack1 = helpers.each.call(depth0, "variable", "in", "model.variables", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n									<td>");
    data.buffer.push(escapeExpression((helper = helpers['matrix-content'] || (depth0 && depth0['matrix-content']),options={hash:{
      'body': ("outputNUR.budget")
    },hashTypes:{'body': "ID"},hashContexts:{'body': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-content", options))));
    data.buffer.push("</td>\n									<td>\n										");
    stack1 = (helper = helpers['modal-trigger'] || (depth0 && depth0['modal-trigger']),options={hash:{
      'controls': ("outputNUR.id")
    },hashTypes:{'controls': "ID"},hashContexts:{'controls': depth0},inverse:self.noop,fn:self.program(21, program21, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "modal-trigger", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n										");
    stack1 = (helper = helpers['modal-container'] || (depth0 && depth0['modal-container']),options={hash:{
      'id': ("outputNUR.id")
    },hashTypes:{'id': "ID"},hashContexts:{'id': depth0},inverse:self.noop,fn:self.program(23, program23, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "modal-container", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n									</td>\n								</tr>\n							");
    return buffer;
    }
  function program12(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n										");
    stack1 = helpers['if'].call(depth0, "objective.isFirst", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n										<td ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'rowspan': ("objective.outputs.length")
    },hashTypes:{'rowspan': "ID"},hashContexts:{'rowspan': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">");
    data.buffer.push(escapeExpression((helper = helpers['matrix-content'] || (depth0 && depth0['matrix-content']),options={hash:{
      'body': ("objective.title"),
      'rows': ("objective.outputs.length")
    },hashTypes:{'body': "ID",'rows': "ID"},hashContexts:{'body': depth0,'rows': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-content", options))));
    data.buffer.push("</td>\n									");
    return buffer;
    }
  function program13(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n										<td ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'rowspan': ("pyp.totalOutputs")
    },hashTypes:{'rowspan': "ID"},hashContexts:{'rowspan': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("><strong>");
    stack1 = helpers._triageMustache.call(depth0, "pyp.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "pyp.acronym", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></td>\n										<td ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'rowspan': ("pyp.totalOutputs")
    },hashTypes:{'rowspan': "ID"},hashContexts:{'rowspan': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("><strong>");
    data.buffer.push(escapeExpression((helper = helpers['matrix-content'] || (depth0 && depth0['matrix-content']),options={hash:{
      'body': ("pyp.goName"),
      'rows': ("pyp.totalOutputs")
    },hashTypes:{'body': "ID",'rows': "ID"},hashContexts:{'body': depth0,'rows': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-content", options))));
    data.buffer.push("</strong></td>\n										");
    return buffer;
    }

  function program15(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n										");
    data.buffer.push(escapeExpression((helper = helpers['matrix-new'] || (depth0 && depth0['matrix-new']),options={hash:{
      'study': ("model"),
      'variable': ("variable"),
      'outputNUR': ("outputNUR"),
      'scoreIndex': (1),
      'store': ("store")
    },hashTypes:{'study': "ID",'variable': "ID",'outputNUR': "ID",'scoreIndex': "INTEGER",'store': "ID"},hashContexts:{'study': depth0,'variable': depth0,'outputNUR': depth0,'scoreIndex': depth0,'store': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-new", options))));
    data.buffer.push("\n									");
    return buffer;
    }

  function program17(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n										");
    data.buffer.push(escapeExpression((helper = helpers['matrix-new'] || (depth0 && depth0['matrix-new']),options={hash:{
      'study': ("model"),
      'variable': ("variable"),
      'outputNUR': ("outputNUR"),
      'scoreIndex': (2),
      'store': ("store")
    },hashTypes:{'study': "ID",'variable': "ID",'outputNUR': "ID",'scoreIndex': "INTEGER",'store': "ID"},hashContexts:{'study': depth0,'variable': depth0,'outputNUR': depth0,'scoreIndex': depth0,'store': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-new", options))));
    data.buffer.push("\n									");
    return buffer;
    }

  function program19(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n										");
    data.buffer.push(escapeExpression((helper = helpers['matrix-new'] || (depth0 && depth0['matrix-new']),options={hash:{
      'study': ("model"),
      'variable': ("variable"),
      'outputNUR': ("outputNUR"),
      'scoreIndex': (3),
      'store': ("store")
    },hashTypes:{'study': "ID",'variable': "ID",'outputNUR': "ID",'scoreIndex': "INTEGER",'store': "ID"},hashContexts:{'study': depth0,'variable': depth0,'outputNUR': depth0,'scoreIndex': depth0,'store': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "matrix-new", options))));
    data.buffer.push("\n									");
    return buffer;
    }

  function program21(depth0,data) {
    
    
    data.buffer.push("\n											<span class=\"glyphicon glyphicon-stats\"></span>\n										");
    }

  function program23(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n											");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(24, program24, data),contexts:[],types:[],data:data}
    if (helper = helpers['modal-title']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['modal-title']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['modal-title']) { stack1 = blockHelperMissing.call(depth0, 'modal-title', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(24, program24, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n											<strong>OUTPUT:</strong> ");
    stack1 = helpers._triageMustache.call(depth0, "outputNUR.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("<br>\n											\n											");
    data.buffer.push(escapeExpression((helper = helpers['graph-variable'] || (depth0 && depth0['graph-variable']),options={hash:{
      'study': ("model"),
      'output': ("outputNUR"),
      'store': ("store")
    },hashTypes:{'study': "ID",'output': "ID",'store': "ID"},hashContexts:{'study': depth0,'output': depth0,'store': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "graph-variable", options))));
    data.buffer.push("\n										");
    return buffer;
    }
  function program24(depth0,data) {
    
    
    data.buffer.push("<strong>Horizontal Analysis</strong>");
    }

    data.buffer.push("<h2>Policy Mapping Matrix <small>for study: </small>");
    stack1 = helpers._triageMustache.call(depth0, "model.title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h2>\n<div class=\"row\">\n	<div class=\"col-sm-12\">\n		Variables:\n		<ol>\n			");
    stack1 = helpers.each.call(depth0, "variable", "in", "model.variables", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n		</ol>\n		<br>\n		<br>\n		\n		<div class=\"div-table\">\n			<table class=\"table table-bordered table-condensed table-hover centered-cells\">\n				<thead>\n					<tr>\n						<th colspan=\"4\">Policies</th>\n						<th ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'colspan': ("tripleLen")
    },hashTypes:{'colspan': "ID"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">Variables</th>\n					</tr>\n					<tr>\n						<th class=\"success\" rowspan=\"2\" class=\"col-fix\">Policy</th>\n						<th class=\"success\" rowspan=\"2\" class=\"col-fix\">General Objective</th>\n						<th class=\"success\" rowspan=\"2\" class=\"col-fix\">Specific Objectives</th>\n						<th class=\"success\" rowspan=\"2\" class=\"col-fix\">Outputs</th>\n						<th class=\"success\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'colspan': ("model.variables.length")
    },hashTypes:{'colspan': "ID"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">Scoring 1</th>\n						<th class=\"warning\" rowspan=\"2\" class=\"col-fix\">Policy Instruments</th>\n						<th class=\"warning\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'colspan': ("model.variables.length")
    },hashTypes:{'colspan': "ID"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">Scoring 2</th>\n						<th class=\"info\" rowspan=\"2\" class=\"col-fix\">Activities</th>\n						<th class=\"info\" ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'colspan': ("model.variables.length")
    },hashTypes:{'colspan': "ID"},hashContexts:{'colspan': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">Scoring 3</th>\n						<th rowspan=\"2\" class=\"col-fix\">Budget</th>\n					</tr>\n					<tr>\n						");
    stack1 = helpers.each.call(depth0, "index", "in", "varIndex", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n						");
    stack1 = helpers.each.call(depth0, "index", "in", "varIndex", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n						");
    stack1 = helpers.each.call(depth0, "index", "in", "varIndex", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n					</tr>\n				</thead>\n				<tbody>\n					");
    stack1 = helpers.each.call(depth0, "pyp", "in", "model.pyps", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n				</tbody>\n			</table>\n		</div>\n		<br>\n		<br>\n		<br>\n		<br>	\n	</div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/table-cell', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<span class=\"ember-table-content\">\n  ");
    stack1 = helpers._triageMustache.call(depth0, "view.cellContent", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</span>");
    return buffer;
    
  });

});
define('frontend/templates/table-row', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression(helpers.view.call(depth0, "multi-item-view-collection", {hash:{
      'rowBinding': ("view.row"),
      'contentBinding': ("view.columns"),
      'itemViewClassField': ("tableCellViewClass"),
      'widthBinding': ("controller._tableColumnsWidth")
    },hashTypes:{'rowBinding': "STRING",'contentBinding': "STRING",'itemViewClassField': "STRING",'widthBinding': "STRING"},hashContexts:{'rowBinding': depth0,'contentBinding': depth0,'itemViewClassField': depth0,'widthBinding': depth0},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/variable/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

    data.buffer.push("<h2>Edit Variable</h2>\n<div class=\"row\">\n	<div class=\"col-sm-12\">\n		<div class=\"panel panel-primary-blue\">\n		  <div class=\"panel-heading\">\n		    <h3 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "variable.index", "model", options) : helperMissing.call(depth0, "link-to", "variable.index", "model", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("   Variable Information</h3>\n		  </div>\n		  ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-variable", options) : helperMissing.call(depth0, "partial", "form-variable", options))));
    data.buffer.push("\n		</div>	\n	</div>\n</div>");
    return buffer;
    
  });

});
define('frontend/templates/variable/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '';


    return buffer;
    
  });

});
define('frontend/templates/variables', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/variables/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n\n<ul> \n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "variable", "variable", options) : helperMissing.call(depth0, "link-to", "variable", "variable", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" \n		<li><strong>Name: ");
    stack1 = helpers._triageMustache.call(depth0, "variable.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></li>\n		<li><strong>Type: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "variable.tipo", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n		<li><strong>Description: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "variable.description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n		<li><strong>keywords: </strong></li>\n			<ul>\n			");
    stack1 = helpers.each.call(depth0, "keyword", "in", "variable.keywords", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n			</ul>\n</ul>\n	");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary-blue"),
      'style': ("margin:15px;")
    },hashTypes:{'class': "STRING",'style': "STRING"},hashContexts:{'class': depth0,'style': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "variable.edit", "variable", options) : helperMissing.call(depth0, "link-to", "variable.edit", "variable", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n	<button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "delete", "variable", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push(" class=\"btn btn-danger\"><i class=\"fa fa-fw fa-trash\"></i></button>\n	<br>\n	<br>\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("		\n		<li><strong>ID: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "variable.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n	");
    return buffer;
    }

  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n				<li><strong>");
    stack1 = helpers._triageMustache.call(depth0, "keyword.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong>");
    stack1 = helpers['if'].call(depth0, "keyword.definition", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n			");
    return buffer;
    }
  function program5(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("<strong>: </strong>");
    stack1 = helpers._triageMustache.call(depth0, "keyword.definition", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    }

  function program7(depth0,data) {
    
    
    data.buffer.push(" <i class=\"fa fa-fw fa-edit\"></i>");
    }

    data.buffer.push("<h4>Total created variables: ");
    stack1 = helpers._triageMustache.call(depth0, "model.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</h4>\n\n");
    stack1 = helpers.each.call(depth0, "variable", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n\n");
    stack1 = helpers._triageMustache.call(depth0, "liquid-outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('frontend/templates/variables/new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("<span class=\"glyphicon glyphicon-chevron-left\"></span>");
    }

    data.buffer.push("<h2>Add New Variable</h2>\n<div class=\"row\">\n  <div class=\"col-sm-12\">\n    <div class=\"panel panel-primary-blue\">\n      <div class=\"panel-heading\">\n        <h3 class=\"panel-title\">");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "variables", options) : helperMissing.call(depth0, "link-to", "variables", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("   Variable Information</h3>\n      </div>\n      ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "form-variable", options) : helperMissing.call(depth0, "partial", "form-variable", options))));
    data.buffer.push("\n    </div>  \n  </div>\n</div>");
    return buffer;
    
  });

});
define('frontend/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('frontend/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('frontend/tests/components/graph-average.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/graph-average.js should pass jshint', function() { 
    ok(false, 'components/graph-average.js should pass jshint.\ncomponents/graph-average.js: line 11, col 20, \'_\' is not defined.\ncomponents/graph-average.js: line 16, col 20, \'_\' is not defined.\ncomponents/graph-average.js: line 21, col 20, \'_\' is not defined.\ncomponents/graph-average.js: line 36, col 17, \'d3\' is not defined.\ncomponents/graph-average.js: line 39, col 17, \'d3\' is not defined.\ncomponents/graph-average.js: line 42, col 21, \'d3\' is not defined.\ncomponents/graph-average.js: line 46, col 21, \'d3\' is not defined.\ncomponents/graph-average.js: line 50, col 19, \'d3\' is not defined.\ncomponents/graph-average.js: line 57, col 22, \'d3\' is not defined.\n\n9 errors'); 
  });

});
define('frontend/tests/components/graph-bars.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/graph-bars.js should pass jshint', function() { 
    ok(true, 'components/graph-bars.js should pass jshint.'); 
  });

});
define('frontend/tests/components/graph-variable.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/graph-variable.js should pass jshint', function() { 
    ok(false, 'components/graph-variable.js should pass jshint.\ncomponents/graph-variable.js: line 26, col 77, Don\'t make functions within a loop.\ncomponents/graph-variable.js: line 27, col 84, Don\'t make functions within a loop.\ncomponents/graph-variable.js: line 25, col 27, \'_\' is not defined.\ncomponents/graph-variable.js: line 50, col 21, \'d3\' is not defined.\ncomponents/graph-variable.js: line 56, col 17, \'d3\' is not defined.\ncomponents/graph-variable.js: line 62, col 19, \'d3\' is not defined.\ncomponents/graph-variable.js: line 72, col 17, \'d3\' is not defined.\ncomponents/graph-variable.js: line 73, col 29, \'d3\' is not defined.\ncomponents/graph-variable.js: line 90, col 54, \'d3\' is not defined.\ncomponents/graph-variable.js: line 98, col 22, \'d3\' is not defined.\ncomponents/graph-variable.js: line 114, col 26, \'d3\' is not defined.\ncomponents/graph-variable.js: line 127, col 43, \'d3\' is not defined.\ncomponents/graph-variable.js: line 139, col 22, \'d3\' is not defined.\ncomponents/graph-variable.js: line 144, col 19, \'d3\' is not defined.\ncomponents/graph-variable.js: line 147, col 19, \'d3\' is not defined.\ncomponents/graph-variable.js: line 175, col 21, \'d3\' is not defined.\ncomponents/graph-variable.js: line 189, col 22, \'d3\' is not defined.\ncomponents/graph-variable.js: line 204, col 39, \'d3\' is not defined.\ncomponents/graph-variable.js: line 216, col 63, \'d3\' is not defined.\ncomponents/graph-variable.js: line 223, col 20, \'d3\' is not defined.\ncomponents/graph-variable.js: line 223, col 43, \'d3\' is not defined.\ncomponents/graph-variable.js: line 230, col 32, \'d3\' is not defined.\n\n22 errors'); 
  });

});
define('frontend/tests/components/matrix-content.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/matrix-content.js should pass jshint', function() { 
    ok(true, 'components/matrix-content.js should pass jshint.'); 
  });

});
define('frontend/tests/components/matrix-new.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/matrix-new.js should pass jshint', function() { 
    ok(false, 'components/matrix-new.js should pass jshint.\ncomponents/matrix-new.js: line 24, col 24, \'_\' is not defined.\n\n1 error'); 
  });

});
define('frontend/tests/controllers/objectives/new.jshint', function () {

  'use strict';

  module('JSHint - controllers/objectives');
  test('controllers/objectives/new.js should pass jshint', function() { 
    ok(true, 'controllers/objectives/new.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/policies/new.jshint', function () {

  'use strict';

  module('JSHint - controllers/policies');
  test('controllers/policies/new.js should pass jshint', function() { 
    ok(true, 'controllers/policies/new.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/policy/edit.jshint', function () {

  'use strict';

  module('JSHint - controllers/policy');
  test('controllers/policy/edit.js should pass jshint', function() { 
    ok(true, 'controllers/policy/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/studies.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/studies.js should pass jshint', function() { 
    ok(true, 'controllers/studies.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/studies/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/studies');
  test('controllers/studies/index.js should pass jshint', function() { 
    ok(true, 'controllers/studies/index.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/studies/new.jshint', function () {

  'use strict';

  module('JSHint - controllers/studies');
  test('controllers/studies/new.js should pass jshint', function() { 
    ok(true, 'controllers/studies/new.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/study/edit.jshint', function () {

  'use strict';

  module('JSHint - controllers/study');
  test('controllers/study/edit.js should pass jshint', function() { 
    ok(true, 'controllers/study/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/study/matrix.jshint', function () {

  'use strict';

  module('JSHint - controllers/study');
  test('controllers/study/matrix.js should pass jshint', function() { 
    ok(true, 'controllers/study/matrix.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/study/objective.jshint', function () {

  'use strict';

  module('JSHint - controllers/study');
  test('controllers/study/objective.js should pass jshint', function() { 
    ok(true, 'controllers/study/objective.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/study/output.jshint', function () {

  'use strict';

  module('JSHint - controllers/study');
  test('controllers/study/output.js should pass jshint', function() { 
    ok(true, 'controllers/study/output.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/study/pyp.jshint', function () {

  'use strict';

  module('JSHint - controllers/study');
  test('controllers/study/pyp.js should pass jshint', function() { 
    ok(true, 'controllers/study/pyp.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/variable/edit.jshint', function () {

  'use strict';

  module('JSHint - controllers/variable');
  test('controllers/variable/edit.js should pass jshint', function() { 
    ok(true, 'controllers/variable/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/controllers/variables/new.jshint', function () {

  'use strict';

  module('JSHint - controllers/variables');
  test('controllers/variables/new.js should pass jshint', function() { 
    ok(true, 'controllers/variables/new.js should pass jshint.'); 
  });

});
define('frontend/tests/helpers/resolver', ['exports', 'ember/resolver', 'frontend/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('frontend/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('frontend/tests/helpers/start-app', ['exports', 'ember', 'frontend/app', 'frontend/router', 'frontend/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('frontend/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('frontend/tests/helpers/truncate-text.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/truncate-text.js should pass jshint', function() { 
    ok(true, 'helpers/truncate-text.js should pass jshint.'); 
  });

});
define('frontend/tests/models/cell.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/cell.js should pass jshint', function() { 
    ok(true, 'models/cell.js should pass jshint.'); 
  });

});
define('frontend/tests/models/keyword.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/keyword.js should pass jshint', function() { 
    ok(true, 'models/keyword.js should pass jshint.'); 
  });

});
define('frontend/tests/models/objective.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/objective.js should pass jshint', function() { 
    ok(true, 'models/objective.js should pass jshint.'); 
  });

});
define('frontend/tests/models/output.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/output.js should pass jshint', function() { 
    ok(true, 'models/output.js should pass jshint.'); 
  });

});
define('frontend/tests/models/pyp.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/pyp.js should pass jshint', function() { 
    ok(true, 'models/pyp.js should pass jshint.'); 
  });

});
define('frontend/tests/models/study.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/study.js should pass jshint', function() { 
    ok(true, 'models/study.js should pass jshint.'); 
  });

});
define('frontend/tests/models/variable.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/variable.js should pass jshint', function() { 
    ok(true, 'models/variable.js should pass jshint.'); 
  });

});
define('frontend/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/components.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/components.js should pass jshint', function() { 
    ok(true, 'routes/components.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/matrix.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/matrix.js should pass jshint', function() { 
    ok(true, 'routes/matrix.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/objectives.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/objectives.js should pass jshint', function() { 
    ok(true, 'routes/objectives.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/objectives/index.jshint', function () {

  'use strict';

  module('JSHint - routes/objectives');
  test('routes/objectives/index.js should pass jshint', function() { 
    ok(true, 'routes/objectives/index.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/objectives/index/new.jshint', function () {

  'use strict';

  module('JSHint - routes/objectives/index');
  test('routes/objectives/index/new.js should pass jshint', function() { 
    ok(true, 'routes/objectives/index/new.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/objectives/index/show.jshint', function () {

  'use strict';

  module('JSHint - routes/objectives/index');
  test('routes/objectives/index/show.js should pass jshint', function() { 
    ok(true, 'routes/objectives/index/show.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/objectives/index/show/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/objectives/index/show');
  test('routes/objectives/index/show/edit.js should pass jshint', function() { 
    ok(true, 'routes/objectives/index/show/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/outputs.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/outputs.js should pass jshint', function() { 
    ok(true, 'routes/outputs.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/outputs/new.jshint', function () {

  'use strict';

  module('JSHint - routes/outputs');
  test('routes/outputs/new.js should pass jshint', function() { 
    ok(true, 'routes/outputs/new.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/outputs/show/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/outputs/show');
  test('routes/outputs/show/edit.js should pass jshint', function() { 
    ok(true, 'routes/outputs/show/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/policies.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/policies.js should pass jshint', function() { 
    ok(true, 'routes/policies.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/policies/index.jshint', function () {

  'use strict';

  module('JSHint - routes/policies');
  test('routes/policies/index.js should pass jshint', function() { 
    ok(true, 'routes/policies/index.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/policies/new.jshint', function () {

  'use strict';

  module('JSHint - routes/policies');
  test('routes/policies/new.js should pass jshint', function() { 
    ok(true, 'routes/policies/new.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/policy/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/policy');
  test('routes/policy/edit.js should pass jshint', function() { 
    ok(true, 'routes/policy/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/policy/index.jshint', function () {

  'use strict';

  module('JSHint - routes/policy');
  test('routes/policy/index.js should pass jshint', function() { 
    ok(true, 'routes/policy/index.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/policy/show.jshint', function () {

  'use strict';

  module('JSHint - routes/policy');
  test('routes/policy/show.js should pass jshint', function() { 
    ok(true, 'routes/policy/show.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/studies/index.jshint', function () {

  'use strict';

  module('JSHint - routes/studies');
  test('routes/studies/index.js should pass jshint', function() { 
    ok(true, 'routes/studies/index.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/studies/new.jshint', function () {

  'use strict';

  module('JSHint - routes/studies');
  test('routes/studies/new.js should pass jshint', function() { 
    ok(true, 'routes/studies/new.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/study/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/study');
  test('routes/study/edit.js should pass jshint', function() { 
    ok(true, 'routes/study/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/study/matrix.jshint', function () {

  'use strict';

  module('JSHint - routes/study');
  test('routes/study/matrix.js should pass jshint', function() { 
    ok(true, 'routes/study/matrix.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/variable/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/variable');
  test('routes/variable/edit.js should pass jshint', function() { 
    ok(true, 'routes/variable/edit.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/variable/index.jshint', function () {

  'use strict';

  module('JSHint - routes/variable');
  test('routes/variable/index.js should pass jshint', function() { 
    ok(true, 'routes/variable/index.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/variables.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/variables.js should pass jshint', function() { 
    ok(true, 'routes/variables.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/variables/index.jshint', function () {

  'use strict';

  module('JSHint - routes/variables');
  test('routes/variables/index.js should pass jshint', function() { 
    ok(true, 'routes/variables/index.js should pass jshint.'); 
  });

});
define('frontend/tests/routes/variables/new.jshint', function () {

  'use strict';

  module('JSHint - routes/variables');
  test('routes/variables/new.js should pass jshint', function() { 
    ok(true, 'routes/variables/new.js should pass jshint.'); 
  });

});
define('frontend/tests/serializers/application.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/application.js should pass jshint', function() { 
    ok(true, 'serializers/application.js should pass jshint.'); 
  });

});
define('frontend/tests/serializers/study.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/study.js should pass jshint', function() { 
    ok(true, 'serializers/study.js should pass jshint.'); 
  });

});
define('frontend/tests/serializers/variable.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/variable.js should pass jshint', function() { 
    ok(true, 'serializers/variable.js should pass jshint.'); 
  });

});
define('frontend/tests/test-helper', ['frontend/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('frontend/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('frontend/tests/transitions.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('transitions.js should pass jshint', function() { 
    ok(true, 'transitions.js should pass jshint.'); 
  });

});
define('frontend/tests/utils/countries.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/countries.js should pass jshint', function() { 
    ok(true, 'utils/countries.js should pass jshint.'); 
  });

});
define('frontend/tests/utils/data.jshint', function () {

  'use strict';

  module('JSHint - utils');
  test('utils/data.js should pass jshint', function() { 
    ok(true, 'utils/data.js should pass jshint.'); 
  });

});
define('frontend/transitions', ['exports'], function (exports) {

	'use strict';

	exports['default'] = function () {
		this.transition(this.fromRoute("objectives.index"), this.toRoute("objectives.new"), this.use("toLeft"), this.reverse("toRight"));

		this.transition(this.toRoute("policy"), this.use("toLeft"), this.reverse("toRight"));

		this.transition(this.toRoute("study"), this.use("toLeft"), this.reverse("toRight"));

		this.transition(this.toRoute("objectives"), this.use("toLeft"), this.reverse("toRight"));
		this.transition(this.toRoute("new"), this.use("toLeft"), this.reverse("toRight"));

		this.transition(this.toRoute("policy.edit"), this.use("toLeft"), this.reverse("toRight"));

		this.transition(this.fromRoute("studies.index"), this.toRoute("studies.new"), this.use("toUp"), this.reverse("toDown"));

		this.transition(this.fromRoute("policies.index"), this.toRoute("policies.new"), this.use("toUp"), this.reverse("toDown"));

		this.transition(this.hasClass("cell"), this.toModel(true), this.use("crossFade", { duration: 100 }), this.reverse("crossFade"));
	};

});
define('frontend/transitions/cross-fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = crossFade;
  // BEGIN-SNIPPET cross-fade-definition
  function crossFade(oldView, insertNewView, opts) {
    liquid_fire.stop(oldView);
    return insertNewView().then(function (newView) {
      return liquid_fire.Promise.all([liquid_fire.animate(oldView, { opacity: 0 }, opts), liquid_fire.animate(newView, { opacity: [1, 0] }, opts)]);
    });
  } // END-SNIPPET

});
define('frontend/transitions/fade', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = fade;
  // BEGIN-SNIPPET fade-definition
  function fade(oldView, insertNewView, opts) {
    var firstStep,
        outOpts = opts;

    if (liquid_fire.isAnimating(oldView, "fade-out")) {
      // if the old view is already fading out, let it finish.
      firstStep = liquid_fire.finish(oldView, "fade-out");
    } else {
      if (liquid_fire.isAnimating(oldView, "fade-in")) {
        // if the old view is partially faded in, scale its fade-out
        // duration appropriately.
        outOpts = { duration: liquid_fire.timeSpent(oldView, "fade-in") };
      }
      liquid_fire.stop(oldView);
      firstStep = liquid_fire.animate(oldView, { opacity: 0 }, outOpts, "fade-out");
    }

    return firstStep.then(insertNewView).then(function (newView) {
      return liquid_fire.animate(newView, { opacity: [1, 0] }, opts, "fade-in");
    });
  } // END-SNIPPET

});
define('frontend/transitions/flex-grow', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';


  exports['default'] = flexGrow;
  function flexGrow(oldView, insertNewView, opts) {
    liquid_fire.stop(oldView);
    return insertNewView().then(function (newView) {
      return liquid_fire.Promise.all([liquid_fire.animate(oldView, { "flex-grow": 0 }, opts), liquid_fire.animate(newView, { "flex-grow": [1, 0] }, opts)]);
    });
  }

});
define('frontend/transitions/modal-popup', ['exports', 'ember', 'liquid-fire'], function (exports, Ember, liquid_fire) {

  'use strict';



  exports['default'] = modalPopup;
  var Velocity = Ember['default'].$.Velocity;

  function hideModal(oldView) {
    var box, obscure;
    if (!oldView || !(box = oldView.$(".lm-container > div")) || !(box = box[0]) || !(obscure = oldView.$(".lf-overlay")) || !(obscure = obscure[0])) {
      return liquid_fire.Promise.resolve();
    }

    return liquid_fire.Promise.all([Velocity.animate(obscure, { opacity: [0, 0.5] }, { duration: 250 }), Velocity.animate(box, { scale: [0, 1] }, { duration: 250 })]);
  }

  function revealModal(insertNewView) {
    return insertNewView().then(function (newView) {
      var box, obscure;
      if (!newView || !(box = newView.$(".lm-container > div")[0]) || !(obscure = newView.$(".lf-overlay")[0])) {
        return;
      }

      // we're not going to animate the whole view, rather we're going
      // to animate two pieces of it separately. So we move the view
      // properties down onto the individual elements, so that the
      // animate function can reveal them at precisely the right time.
      Ember['default'].$(box).css({
        display: "none"
      });

      Ember['default'].$(obscure).css({
        display: "none"
      });
      newView.$().css({
        display: "",
        visibility: ""
      });

      return liquid_fire.Promise.all([Velocity.animate(obscure, { opacity: [0.5, 0] }, { duration: 250, display: "" }), Velocity.animate(box, { scale: [1, 0] }, { duration: 250, display: "" })]);
    });
  }function modalPopup(oldView, insertNewView) {
    return hideModal(oldView).then(function () {
      return revealModal(insertNewView);
    });
  }

});
define('frontend/transitions/move-over', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

  'use strict';



  exports['default'] = moveOver;
  function moveOver(oldView, insertNewView, dimension, direction, opts) {
    var oldParams = {},
        newParams = {},
        firstStep,
        property,
        measure;

    if (dimension.toLowerCase() === "x") {
      property = "translateX";
      measure = "width";
    } else {
      property = "translateY";
      measure = "height";
    }

    if (liquid_fire.isAnimating(oldView, "moving-in")) {
      firstStep = liquid_fire.finish(oldView, "moving-in");
    } else {
      liquid_fire.stop(oldView);
      firstStep = liquid_fire.Promise.resolve();
    }


    return firstStep.then(insertNewView).then(function (newView) {
      if (newView && newView.$() && oldView && oldView.$()) {
        var sizes = [parseInt(newView.$().css(measure), 10), parseInt(oldView.$().css(measure), 10)];
        var bigger = Math.max.apply(null, sizes);
        oldParams[property] = bigger * direction + "px";
        newParams[property] = ["0px", -1 * bigger * direction + "px"];
      } else {
        oldParams[property] = 100 * direction + "%";
        newParams[property] = ["0%", -100 * direction + "%"];
      }

      return liquid_fire.Promise.all([liquid_fire.animate(oldView, oldParams, opts), liquid_fire.animate(newView, newParams, opts, "moving-in")]);
    });
  }

});
define('frontend/transitions/scroll-then', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = function () {
    Ember['default'].assert("You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')", "string" === typeof arguments[2]);

    var el = document.getElementsByTagName("html"),
        transitionArgs = Array.prototype.slice.call(arguments, 0, 2),
        nextTransition = this.lookup(arguments[2]),
        self = this,
        options = arguments[3] || {};

    Ember['default'].assert("The second argument to scrollThen is passed to Velocity's scroll function and must be an object", "object" === typeof options);

    // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})
    options = Ember['default'].merge({ duration: 500, offset: 0 }, options);

    // additional args can be passed through after the scroll options object
    // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);
    transitionArgs.push.apply(transitionArgs, Array.prototype.slice.call(arguments, 4));

    return window.$.Velocity(el, "scroll", options).then(function () {
      nextTransition.apply(self, transitionArgs);
    });
  };

});
define('frontend/transitions/to-down', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "y", 1);

});
define('frontend/transitions/to-left', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "x", -1);

});
define('frontend/transitions/to-right', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "x", 1);

});
define('frontend/transitions/to-up', ['exports', 'liquid-fire'], function (exports, liquid_fire) {

	'use strict';

	exports['default'] = liquid_fire.curryTransition("move-over", "y", -1);

});
define('frontend/utils/countries', ['exports'], function (exports) {

	'use strict';

	var COUNTRIES_NAMES = {
		AF: "Afghanistan",
		AX: "Åland Islands",
		AL: "Albania",
		DZ: "Algeria",
		AS: "American Samoa",
		AD: "Andorra",
		AO: "Angola",
		AI: "Anguilla",
		AQ: "Antarctica",
		AG: "Antigua and Barbuda",
		AR: "Argentina",
		AM: "Armenia",
		AW: "Aruba",
		AU: "Australia",
		AT: "Austria",
		AZ: "Azerbaijan",
		BS: "Bahamas",
		BH: "Bahrain",
		BD: "Bangladesh",
		BB: "Barbados",
		BY: "Belarus",
		BE: "Belgium",
		BZ: "Belize",
		BJ: "Benin",
		BM: "Bermuda",
		BT: "Bhutan",
		BO: "Bolivia, Plurinational State of",
		BQ: "Bonaire, Sint Eustatius and Saba",
		BA: "Bosnia and Herzegovina",
		BW: "Botswana",
		BV: "Bouvet Island",
		BR: "Brazil",
		IO: "British Indian Ocean Territory",
		BN: "Brunei Darussalam",
		BG: "Bulgaria",
		BF: "Burkina Faso",
		BI: "Burundi",
		KH: "Cambodia",
		CM: "Cameroon",
		CA: "Canada",
		CV: "Cape Verde",
		KY: "Cayman Islands",
		CF: "Central African Republic",
		TD: "Chad",
		CL: "Chile",
		CN: "China",
		CX: "Christmas Island",
		CC: "Cocos (Keeling) Islands",
		CO: "Colombia",
		KM: "Comoros",
		CG: "Congo",
		CD: "Congo, the Democratic Republic of the",
		CK: "Cook Islands",
		CR: "Costa Rica",
		CI: "Côte d'Ivoire",
		HR: "Croatia",
		CU: "Cuba",
		CW: "Curaçao",
		CY: "Cyprus",
		CZ: "Czech Republic",
		DK: "Denmark",
		DJ: "Djibouti",
		DM: "Dominica",
		DO: "Dominican Republic",
		EC: "Ecuador",
		EG: "Egypt",
		SV: "El Salvador",
		GQ: "Equatorial Guinea",
		ER: "Eritrea",
		EE: "Estonia",
		ET: "Ethiopia",
		FK: "Falkland Islands (Malvinas)",
		FO: "Faroe Islands",
		FJ: "Fiji",
		FI: "Finland",
		FR: "France",
		GF: "French Guiana",
		PF: "French Polynesia",
		TF: "French Southern Territories",
		GA: "Gabon",
		GM: "Gambia",
		GE: "Georgia",
		DE: "Germany",
		GH: "Ghana",
		GI: "Gibraltar",
		GR: "Greece",
		GL: "Greenland",
		GD: "Grenada",
		GP: "Guadeloupe",
		GU: "Guam",
		GT: "Guatemala",
		GG: "Guernsey",
		GN: "Guinea",
		GW: "Guinea-Bissau",
		GY: "Guyana",
		HT: "Haiti",
		HM: "Heard Island and McDonald Islands",
		VA: "Holy See (Vatican City State)",
		HN: "Honduras",
		HK: "Hong Kong",
		HU: "Hungary",
		IS: "Iceland",
		IN: "India",
		ID: "Indonesia",
		IR: "Iran, Islamic Republic of",
		IQ: "Iraq",
		IE: "Ireland",
		IM: "Isle of Man",
		IL: "Israel",
		IT: "Italy",
		JM: "Jamaica",
		JP: "Japan",
		JE: "Jersey",
		JO: "Jordan",
		KZ: "Kazakhstan",
		KE: "Kenya",
		KI: "Kiribati",
		KP: "Korea, Democratic People's Republic of",
		KR: "Korea, Republic of",
		KW: "Kuwait",
		KG: "Kyrgyzstan",
		LA: "Lao People's Democratic Republic",
		LV: "Latvia",
		LB: "Lebanon",
		LS: "Lesotho",
		LR: "Liberia",
		LY: "Libya",
		LI: "Liechtenstein",
		LT: "Lithuania",
		LU: "Luxembourg",
		MO: "Macao",
		MK: "Macedonia, the former Yugoslav Republic of",
		MG: "Madagascar",
		MW: "Malawi",
		MY: "Malaysia",
		MV: "Maldives",
		ML: "Mali",
		MT: "Malta",
		MH: "Marshall Islands",
		MQ: "Martinique",
		MR: "Mauritania",
		MU: "Mauritius",
		YT: "Mayotte",
		MX: "Mexico",
		FM: "Micronesia, Federated States of",
		MD: "Moldova, Republic of",
		MC: "Monaco",
		MN: "Mongolia",
		ME: "Montenegro",
		MS: "Montserrat",
		MA: "Morocco",
		MZ: "Mozambique",
		MM: "Myanmar",
		NA: "Namibia",
		NR: "Nauru",
		NP: "Nepal",
		NL: "Netherlands",
		NC: "New Caledonia",
		NZ: "New Zealand",
		NI: "Nicaragua",
		NE: "Niger",
		NG: "Nigeria",
		NU: "Niue",
		NF: "Norfolk Island",
		MP: "Northern Mariana Islands",
		NO: "Norway",
		OM: "Oman",
		PK: "Pakistan",
		PW: "Palau",
		PS: "Palestinian Territory, Occupied",
		PA: "Panama",
		PG: "Papua New Guinea",
		PY: "Paraguay",
		PE: "Peru",
		PH: "Philippines",
		PN: "Pitcairn",
		PL: "Poland",
		PT: "Portugal",
		PR: "Puerto Rico",
		QA: "Qatar",
		RE: "Réunion",
		RO: "Romania",
		RU: "Russian Federation",
		RW: "Rwanda",
		BL: "Saint Barthélemy",
		SH: "Saint Helena, Ascension and Tristan da Cunha",
		KN: "Saint Kitts and Nevis",
		LC: "Saint Lucia",
		MF: "Saint Martin (French part)",
		PM: "Saint Pierre and Miquelon",
		VC: "Saint Vincent and the Grenadines",
		WS: "Samoa",
		SM: "San Marino",
		ST: "Sao Tome and Principe",
		SA: "Saudi Arabia",
		SN: "Senegal",
		RS: "Serbia",
		SC: "Seychelles",
		SL: "Sierra Leone",
		SG: "Singapore",
		SX: "Sint Maarten (Dutch part)",
		SK: "Slovakia",
		SI: "Slovenia",
		SB: "Solomon Islands",
		SO: "Somalia",
		ZA: "South Africa",
		GS: "South Georgia and the South Sandwich Islands",
		SS: "South Sudan",
		ES: "Spain",
		LK: "Sri Lanka",
		SD: "Sudan",
		SR: "Suriname",
		SJ: "Svalbard and Jan Mayen",
		SZ: "Swaziland",
		SE: "Sweden",
		CH: "Switzerland",
		SY: "Syrian Arab Republic",
		TW: "Taiwan, Province of China",
		TJ: "Tajikistan",
		TZ: "Tanzania, United Republic of",
		TH: "Thailand",
		TL: "Timor-Leste",
		TG: "Togo",
		TK: "Tokelau",
		TO: "Tonga",
		TT: "Trinidad and Tobago",
		TN: "Tunisia",
		TR: "Turkey",
		TM: "Turkmenistan",
		TC: "Turks and Caicos Islands",
		TV: "Tuvalu",
		UG: "Uganda",
		UA: "Ukraine",
		AE: "United Arab Emirates",
		GB: "United Kingdom",
		US: "United States",
		UM: "United States Minor Outlying Islands",
		UY: "Uruguay",
		UZ: "Uzbekistan",
		VU: "Vanuatu",
		VE: "Venezuela, Bolivarian Republic of",
		VN: "Viet Nam",
		VG: "Virgin Islands, British",
		VI: "Virgin Islands, U.S.",
		WF: "Wallis and Futuna",
		EH: "Western Sahara",
		YE: "Yemen",
		ZM: "Zambia",
		ZW: "Zimbabwe"
	};

	exports.COUNTRIES_NAMES = COUNTRIES_NAMES;

});
define('frontend/utils/data', ['exports'], function (exports) {

	'use strict';

	var BARDATA = [{ letter: "A", frequency: ".08167" }, { letter: "B", frequency: ".01492" }, { letter: "C", frequency: ".02782" }, { letter: "D", frequency: ".04253" }, { letter: "E", frequency: ".12702" }, { letter: "F", frequency: ".02288" }, { letter: "G", frequency: ".02015" }, { letter: "H", frequency: ".06094" }, { letter: "I", frequency: ".06966" }, { letter: "J", frequency: ".00153" }, { letter: "K", frequency: ".00772" }, { letter: "L", frequency: ".04025" }, { letter: "M", frequency: ".02406" }, { letter: "N", frequency: ".06749" }, { letter: "O", frequency: ".07507" }, { letter: "P", frequency: ".01929" }, { letter: "Q", frequency: ".00095" }, { letter: "R", frequency: ".05987" }, { letter: "S", frequency: ".06327" }, { letter: "T", frequency: ".09056" }, { letter: "U", frequency: ".02758" }, { letter: "V", frequency: ".00978" }, { letter: "W", frequency: ".02360" }, { letter: "X", frequency: ".00150" }, { letter: "Y", frequency: ".01974" }, { letter: "Z", frequency: ".00074" }];

	exports.BARDATA = BARDATA;

});
define('frontend/views/body-table-container', ['exports', 'ember-cli-ember-table/views/body-table-container'], function (exports, BodyTableContainer) {

	'use strict';

	exports['default'] = BodyTableContainer['default'];

});
define('frontend/views/column-sortable-indicator', ['exports', 'ember-cli-ember-table/views/column-sortable-indicator'], function (exports, ColumnSortableIndicator) {

	'use strict';

	exports['default'] = ColumnSortableIndicator['default'];

});
define('frontend/views/footer-table-container', ['exports', 'ember-cli-ember-table/views/footer-table-container'], function (exports, FooterTableContainer) {

	'use strict';

	exports['default'] = FooterTableContainer['default'];

});
define('frontend/views/header-block', ['exports', 'ember-cli-ember-table/views/header-block'], function (exports, HeaderBlock) {

	'use strict';

	exports['default'] = HeaderBlock['default'];

});
define('frontend/views/header-cell', ['exports', 'ember-cli-ember-table/views/header-cell'], function (exports, HeaderCell) {

	'use strict';

	exports['default'] = HeaderCell['default'];

});
define('frontend/views/header-row', ['exports', 'ember-cli-ember-table/views/header-row'], function (exports, HeaderRow) {

	'use strict';

	exports['default'] = HeaderRow['default'];

});
define('frontend/views/header-table-container', ['exports', 'ember-cli-ember-table/views/header-table-container'], function (exports, HeaderTableContainer) {

	'use strict';

	exports['default'] = HeaderTableContainer['default'];

});
define('frontend/views/lazy-container', ['exports', 'ember-cli-ember-table/views/lazy-container'], function (exports, LazyContainer) {

	'use strict';

	exports['default'] = LazyContainer['default'];

});
define('frontend/views/lazy-item', ['exports', 'ember-cli-ember-table/views/lazy-item'], function (exports, LazyItemView) {

	'use strict';

	exports['default'] = LazyItemView['default'];

});
define('frontend/views/lazy-table-block', ['exports', 'ember-cli-ember-table/views/lazy-table-block'], function (exports, LazyTableBlock) {

	'use strict';

	exports['default'] = LazyTableBlock['default'];

});
define('frontend/views/liquid-child', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ContainerView.extend({
    classNames: ["liquid-child"],
    resolveInsertionPromise: Ember['default'].on("didInsertElement", function () {
      // Children start out hidden and invisible.
      // Measurement will `show` them and Velocity will make them visible.
      // This prevents a flash of pre-animated content.
      this.$().css({ visibility: "hidden" }).hide();
      if (this._resolveInsertion) {
        this._resolveInsertion(this);
      }
    })
  });

});
define('frontend/views/liquid-if', ['exports', 'frontend/views/liquid-outlet', 'ember'], function (exports, LiquidOutlet, Ember) {

  'use strict';

  var isHTMLBars = !!Ember['default'].HTMLBars;

  exports['default'] = LiquidOutlet['default'].extend({
    liquidUpdate: Ember['default'].on("init", Ember['default'].observer("showFirst", function () {
      var template = this.get("templates")[this.get("showFirst") ? 0 : 1];
      if (!template || !isHTMLBars && template === Ember['default'].Handlebars.VM.noop) {
        this.set("currentView", null);
        return;
      }
      var view = Ember['default']._MetamorphView.create({
        container: this.container,
        template: template,
        liquidParent: this,
        contextBinding: "liquidParent.context",
        liquidContext: this.get("showFirst"),
        hasLiquidContext: true
      });
      this.set("currentView", view);
    }))

  });

});
define('frontend/views/liquid-outlet', ['exports', 'ember', 'liquid-fire'], function (exports, Ember, liquid_fire) {

  'use strict';

  var capitalize = Ember['default'].String.capitalize;

  exports['default'] = Ember['default'].ContainerView.extend({
    classNames: ["liquid-container"],
    growDuration: 250,
    growPixelsPerSecond: 200,
    growEasing: "slide",
    enableGrowth: true,

    init: function () {
      // The ContainerView constructor normally sticks our "currentView"
      // directly into _childViews, but we want to leave that up to
      // _currentViewDidChange so we have the opportunity to launch a
      // transition.
      this._super();
      Ember['default'].A(this._childViews).clear();

      if (this.get("containerless")) {
        // This prevents Ember from throwing an assertion when we try to
        // render as a virtual view.
        this.set("innerClassNameBindings", this.get("classNameBindings"));
        this.set("classNameBindings", Ember['default'].A());
      }
    },

    // Deliberately overriding a private method from
    // Ember.ContainerView!
    //
    // We need to stop it from destroying our outgoing child view
    // prematurely.
    _currentViewWillChange: Ember['default'].beforeObserver("currentView", function () {}),

    // Deliberately overriding a private method from
    // Ember.ContainerView!
    _currentViewDidChange: Ember['default'].on("init", Ember['default'].observer("currentView", function () {
      // Normally there is only one child (the view we're
      // replacing). But sometimes there may be two children (because a
      // transition is already in progress). In any case, we tell all of
      // them to start heading for the exits now.

      var oldView = this.get("childViews.lastObject"),
          newView = this.get("currentView"),
          firstTime;

      // For the convenience of the transition rules, we explicitly
      // track our first transition, which happens at initial render.
      firstTime = !this._hasTransitioned;
      this._hasTransitioned = true;

      // Idempotence
      if (!oldView && !newView || oldView && oldView.get("currentView") === newView || this._runningTransition && this._runningTransition.oldView === oldView && this._runningTransition.newContent === newView) {
        return;
      }

      // `transitions` comes from dependency injection, see the
      // liquid-fire app initializer.
      var transition = this.get("transitions").transitionFor(this, oldView, newView, this.get("use"), firstTime);

      if (this._runningTransition) {
        this._runningTransition.interrupt();
      }

      this._runningTransition = transition;
      transition.run()["catch"](function (err) {
        // Force any errors through to the RSVP error handler, because
        // of https://github.com/tildeio/rsvp.js/pull/278.  The fix got
        // into Ember 1.7, so we can drop this once we decide 1.6 is
        // EOL.
        Ember['default'].RSVP.Promise.resolve()._onerror(err);
      });
    })),

    _liquidChildFor: function (content) {
      if (content && !content.get("hasLiquidContext")) {
        content.set("liquidContext", content.get("context"));
      }
      var LiquidChild = this.container.lookupFactory("view:liquid-child");
      var childProperties = {
        currentView: content
      };
      if (this.get("containerless")) {
        childProperties.classNames = this.get("classNames").without("liquid-container");
        childProperties.classNameBindings = this.get("innerClassNameBindings");
      }
      return LiquidChild.create(childProperties);
    },

    _pushNewView: function (newView) {
      if (!newView) {
        return liquid_fire.Promise.resolve();
      }
      var child = this._liquidChildFor(newView),
          promise = new liquid_fire.Promise(function (resolve) {
        child._resolveInsertion = resolve;
      });
      this.pushObject(child);
      return promise;
    },

    cacheSize: function () {
      var elt = this.$();
      if (elt) {
        // Measure original size.
        this._cachedSize = getSize(elt);
      }
    },

    unlockSize: function () {
      var self = this;
      function doUnlock() {
        var elt = self.$();
        if (elt) {
          elt.css({ width: "", height: "" });
        }
      }
      if (this._scaling) {
        this._scaling.then(doUnlock);
      } else {
        doUnlock();
      }
    },

    _durationFor: function (before, after) {
      return Math.min(this.get("growDuration"), 1000 * Math.abs(before - after) / this.get("growPixelsPerSecond"));
    },

    _adaptDimension: function (dimension, before, after) {
      if (before[dimension] === after[dimension] || !this.get("enableGrowth")) {
        var elt = this.$();
        if (elt) {
          elt[dimension](after[dimension]);
        }
        return liquid_fire.Promise.resolve();
      } else {
        // Velocity deals in literal width/height, whereas jQuery deals
        // in box-sizing-dependent measurements.
        var target = {};
        target[dimension] = [after["literal" + capitalize(dimension)], before["literal" + capitalize(dimension)]];
        return liquid_fire.animate(this, target, {
          duration: this._durationFor(before[dimension], after[dimension]),
          queue: false,
          easing: this.get("growEasing")
        });
      }
    },

    adaptSize: function () {
      liquid_fire.stop(this);

      var elt = this.$();
      if (!elt) {
        return;
      }

      // Measure new size.
      var newSize = getSize(elt);
      if (typeof this._cachedSize === "undefined") {
        this._cachedSize = newSize;
      }

      // Now that measurements have been taken, lock the size
      // before the invoking the scaling transition.
      elt.width(this._cachedSize.width);
      elt.height(this._cachedSize.height);

      this._scaling = liquid_fire.Promise.all([this._adaptDimension("width", this._cachedSize, newSize), this._adaptDimension("height", this._cachedSize, newSize)]);
    }

  });

  // We're tracking both jQuery's box-sizing dependent measurements and
  // the literal CSS properties, because it's nice to get/set dimensions
  // with jQuery and not worry about boz-sizing *but* Velocity needs the
  // raw values.
  function getSize(elt) {
    return {
      width: elt.width(),
      literalWidth: parseInt(elt.css("width"), 10),
      height: elt.height(),
      literalHeight: parseInt(elt.css("height"), 10)
    };
  }

});
define('frontend/views/liquid-with', ['exports', 'frontend/views/liquid-outlet', 'ember'], function (exports, LiquidOutlet, Ember) {

  'use strict';

  exports['default'] = LiquidOutlet['default'].extend({
    liquidUpdate: Ember['default'].on("init", Ember['default'].observer("boundContext", function () {
      var context = this.get("boundContext");
      if (Ember['default'].isEmpty(context)) {
        this.set("currentView", null);
        return;
      }
      var view = Ember['default']._MetamorphView.create({
        container: this.container,
        templateName: "liquid-with",
        boundContext: context,
        liquidWithParent: this,
        liquidContext: context,
        hasLiquidContext: true });
      this.set("currentView", view);
    }))

  });

});
define('frontend/views/multi-item-view-collection', ['exports', 'ember-cli-ember-table/views/multi-item-view-collection'], function (exports, MultiItemViewCollection) {

	'use strict';

	exports['default'] = MultiItemViewCollection['default'];

});
define('frontend/views/scroll-container', ['exports', 'ember-cli-ember-table/views/scroll-container'], function (exports, ScrollContainer) {

	'use strict';

	exports['default'] = ScrollContainer['default'];

});
define('frontend/views/scroll-panel', ['exports', 'ember-cli-ember-table/views/scroll-panel'], function (exports, ScrollPanel) {

	'use strict';

	exports['default'] = ScrollPanel['default'];

});
define('frontend/views/table-block', ['exports', 'ember-cli-ember-table/views/table-block'], function (exports, TableBlock) {

	'use strict';

	exports['default'] = TableBlock['default'];

});
define('frontend/views/table-cell', ['exports', 'ember-cli-ember-table/views/table-cell'], function (exports, TableCell) {

	'use strict';

	exports['default'] = TableCell['default'];

});
define('frontend/views/table-container', ['exports', 'ember-cli-ember-table/views/table-container'], function (exports, TableContainer) {

	'use strict';

	exports['default'] = TableContainer['default'];

});
define('frontend/views/table-row', ['exports', 'ember-cli-ember-table/views/table-row'], function (exports, TableRow) {

	'use strict';

	exports['default'] = TableRow['default'];

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('frontend/config/environment', ['ember'], function(Ember) {
  var prefix = 'frontend';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("frontend/tests/test-helper");
} else {
  require("frontend/app")["default"].create({"name":"frontend","version":"0.0.0.d9cc3ecf"});
}

/* jshint ignore:end */
//# sourceMappingURL=frontend.map