;import Ember from 'ember';
import ColumnDefinition from 'ember-cli-ember-table/column-definition'


export default Ember.Controller.extend({
	tripleLen: Ember.computed(
		'model.variables',
		function(){
			return 3*this.get('model.variables.length')+3;
		}
	),
	varIndex: Ember.computed(
		'model.variables',
		function(){
			var array = [];
			for (var i=0; i<this.get('model.variables.length'); i++) { 
		    array.push(i+1);
			}
			return array;
		}
	),
	scroll: function() {
	  var self = this;
	  this.$(".div-table").scroll(function(){
	    self.$(".div-scroll").scrollLeft($(".div-table").scrollLeft());
	  });
	  this.$(".div-scroll").scroll(function(){
	    self.$(".div-table").scrollLeft($(".div-scroll").scrollLeft());
	  });
	}
});