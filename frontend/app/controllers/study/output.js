import Ember from 'ember';

export default Ember.ObjectController.extend({
	isFirst: function(){
		var objectives = this.get('model.objective.outputs');
	 	var model = this.get('model')
	 	if (objectives.indexOf(model)==0){
	 		return true;
	 	} else {
	 		return false;
	 	}
	}.property('id'),
});