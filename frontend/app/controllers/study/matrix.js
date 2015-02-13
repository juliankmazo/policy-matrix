;import Ember from 'ember';
import ColumnDefinition from 'ember-cli-ember-table/column-definition'


export default Ember.Controller.extend({
	tripleLen: Ember.computed(
		'model.variables',
		function(){
			return 3*this.get('model.variables.length');
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
	tripleVarIndex: Ember.computed(
		'model.variables',
		function(){
			var array = [];
			for (var i=0; i<3*this.get('model.variables.length'); i++) { 
		    array.push(i+1);
			}
			return array;
		}
	)
});