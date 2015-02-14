import DS from 'ember-data';

export default DS.Model.extend({
  score: DS.attr('number'),
  scoreIndex: DS.attr("number"),
  study: DS.belongsTo('study'),
  variable: DS.belongsTo('variable'),
  output: DS.belongsTo('output'),
});