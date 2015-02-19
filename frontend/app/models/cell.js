import DS from 'ember-data';

export default DS.Model.extend({
  score: DS.attr('number'),
  scoreIndex: DS.attr("number"),
  study: DS.belongsTo('study', { async: true }),
  variable: DS.belongsTo('variable', { async: true }),
  output: DS.belongsTo('output',{ async: true }),
});