import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return Ember.RSVP.hash({
          study: this.store.createRecord('study'),
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
	// 	var model = this.modelFor('studies');
	// 	if (model){
	// 		if (model.get('isNew')) {
	// 			model.destroyRecord();
	// 		}
	// 	}
	// }
});
