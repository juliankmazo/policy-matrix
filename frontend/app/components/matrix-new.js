import Ember from 'ember';
// import { lodash as _ } from "lodash";

export default Ember.Component.extend({
	tagName: 'td',

	ownCell: null,

	ownCellSetter: function() {
		var variable = this.get("variable"),
				study = this.get("study"),
				scoreIndex = this.get("scoreIndex"),
				outputNUR = this.get("outputNUR.model"),
				myCells = study.get("cells"),
				self = this;

		Ember.RSVP.hash({
			variable: variable,
			study: study,
			scoreIndex: scoreIndex,
			outputNUR: outputNUR,
			myCells: myCells,
		}).then(function(hash) {

			// var cell = _.chain(study.get("cells").toArray())
			// 	.filter(function(c) { return c.get("variable") === hash.variable; })
			// 	.filter(function(c) { return c.get("scoreIndex") === hash.scoreIndex; })
			// 	.filter(function(c) { return c.get("outputNUR") === hash.outputNUR; })
			// 	.value()[0];

			var cell = self.store.find('cell', {variable: hash.variable.id, 
																					study: hash.study.id, 
																				  scoreIndex: hash.scoreIndex, 
																				  output: hash.outputNUR.id})
																				  	
			
			if (!cell) {
				cell = self.store.createRecord("cell", {
				  scoreIndex: hash.scoreIndex,
				  study: hash.study,
				  variable: hash.variable,
				  output: hash.outputNUR,
				});
			}

			
			self.set("ownCell", cell);
		});

	}.observes("variable", "outputNUR", "study", "scoreIndex").on("didInsertElement"),

	saveCell: function() {
		var ownCell = this.get("ownCell");

		ownCell.save();
	},

	actions: {
		updatedByUser: function() {
			console.log(this.get("ownCell.score"))
			Ember.run.debounce(this, this.saveCell, 1000);
		}
	}
});
