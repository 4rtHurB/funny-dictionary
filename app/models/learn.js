import DS from 'ember-data';

export default DS.Model.extend({
  current_word: DS.attr(),
  language: DS.attr(),
  passed_words: DS.attr()
});
