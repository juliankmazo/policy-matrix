import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.createRecord('variable');
	},
	deactivate: function() {
		var model = this.modelFor('variables/new');
		if (model.get('isNew')) {
			model.destroyRecord();
		}
	},
});