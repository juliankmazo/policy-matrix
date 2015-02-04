import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.ObjectController.extend(EmberValidations.Mixin,{
	typologyOptions: ["Policy","Program","Strategy","Vision","Project","Plan","Other"],
	validations:{},
	actions: {}
});
