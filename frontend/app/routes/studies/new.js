import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return Ember.RSVP.hash({
          study: this.store.createRecord('study'),
          variable: this.store.find('variable'),
          pyp: this.store.find('pyp')
        });
	},
	// deactivate: function() {
	// 	var model = this.modelFor('studies/new');
	// 	if (model.get('isNew')) {
	// 		model.destroyRecord();
	// 	}
	// }
});
