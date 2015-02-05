import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return Ember.RSVP.hash({
          study: this.modelFor('study'),
          variable: this.store.find('variable'),
          pyp: this.store.find('pyp')
        });
	}
});
