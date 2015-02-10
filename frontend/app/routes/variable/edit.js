import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return Ember.RSVP.hash({
          variable: this.modelFor('variable'),
          keyword: this.store.createRecord('keyword', {
						variable: this.modelFor('variable')
					})
        });
	},
	actions: {
		reloadContentAfterSaveKeyword: function() {
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
