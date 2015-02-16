import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  outputs: DS.hasMany('output', {async: true}),
  pyp: DS.belongsTo('pyp'),
  description: DS.attr('string'),
  baseline: DS.attr('string'),
  target: DS.attr('string'),
});


