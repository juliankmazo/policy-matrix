import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin,{
	typeOptions:['Core Area', 'Cross-cutting theme' ],
	validations:{},
	actions: {}
});
