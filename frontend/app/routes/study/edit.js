import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return Ember.RSVP.hash({
          study: this.modelFor('study'),
          variable: this.store.find('variable'),
          pyp: this.store.find('pyp')
        });
	},
	actions: {
		reloadContentAfterEdit: function() {
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
