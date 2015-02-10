import Ember from 'ember';
import EmberValidations from 'ember-validations';
// import ColumnDefinition from '../column-definition';

export default Ember.Controller.extend(EmberValidations.Mixin,{
	// numRows: 10000,

 //  columns: function() {
 //    var dateColumn, openColumn, highColumn, lowColumn, closeColumn;
 //    dateColumn = ColumnDefinition.create({
 //      columnWidth: 150,
 //      textAlign: 'text-align-left',
 //      headerCellName: 'Date',
 //      getCellContent: function(row) {
 //        return row.get('date').toDateString();
 //      }
 //    });
 //    openColumn = ColumnDefinition.create({
 //      columnWidth: 100,
 //      headerCellName: 'Open',
 //      getCellContent: function(row) {
 //        return row.get('open').toFixed(2);
 //      }
 //    });
 //    highColumn = ColumnDefinition.create({
 //      columnWidth: 100,
 //      headerCellName: 'High',
 //      getCellContent: function(row) {
 //        return row.get('high').toFixed(2);
 //      }
 //    });
 //    lowColumn = ColumnDefinition.create({
 //      columnWidth: 100,
 //      headerCellName: 'Low',
 //      getCellContent: function(row) {
 //        return row.get('low').toFixed(2);
 //      }
 //    });
 //    closeColumn = ColumnDefinition.create({
 //      columnWidth: 100,
 //      headerCellName: 'Close',
 //      getCellContent: function(row) {
 //        return row.get('close').toFixed(2);
 //      }
 //    });
 //    return [dateColumn, openColumn, highColumn, lowColumn, closeColumn];
 //  }.property(),

 //  content: function() {
 //    var generatedContent = [];
 //    for (var i = 0; i < this.get('numRows'); i++) {
 //      var date = new Date();
 //      date.setDate(date.getDate() + i);
 //      generatedContent.push(Ember.Object.create({
 //        date: date,
 //        open:  Math.random() * 100,
 //        high:  Math.random() * 100 + 50,
 //        low:   Math.random() * 100 - 50,
 //        close: Math.random() * 100
 //      }));
 //    }
 //    return generatedContent;
 //  }.property('numRows'),
});