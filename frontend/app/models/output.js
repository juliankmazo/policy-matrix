import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  objective: DS.belongsTo('objective'),
  description: DS.attr('string'),
  baseline: DS.attr('string'),
  target: DS.attr('string')
});
