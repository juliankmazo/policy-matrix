import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  outputs: DS.hasMany('output', {async: true}),
  objective: DS.belongsTo('objective'),
  definition: DS.attr('string'),
});
