import Ember from 'ember';

export function truncateText(text, options) {
  var limit = options.hash.limit || 46;
  if (text){
	  if (text.length > limit){
	    text = text.substr(0, limit - 3) + "...";
	  }
	  return text;
	} else {
		return ""
	}

}

export default Ember.Handlebars.makeBoundHelper(truncateText);
