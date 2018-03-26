import DS from 'ember-data';

export default DS.Model.extend({
  word: DS.attr(),
  meaning: DS.attr(),
  language: DS.attr()
});
