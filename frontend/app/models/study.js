import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  country: DS.attr('string'),
  variables: DS.hasMany('variables')
});
