import Ember from 'ember';

export function truncateText(text, options) {
  var limit = options.hash.limit || 1000,
  		rows = options.hash.rows || 1;
  if (text){
	  if (text.length > limit*rows){
	    text = text.substr(0, limit - 3) + "...";
	  }
	  return text;
	} else {
		return ""
	}

}

export default Ember.Handlebars.makeBoundHelper(truncateText);
