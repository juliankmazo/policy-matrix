import Ember from 'ember';

export default Ember.Route.extend({
	deactivate: function() {
		var model = this.modelFor('variable/edit');

		if (model.get('isDirty')) {
			model.rollback();
		}
	}
});
