import Ember from 'ember';

export default Ember.Route.extend({
	model: function(){
		return this.store.find('study', params.study_id);
	}
});
