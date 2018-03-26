import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  local: service(),
  nativeLang: null,
  init: function () {
    this._super();
    this.set('nativeLang', this.get('local').getNativeLang());
  },
  actions: {
    handleSelectLang(e) {
      const langId = e.target.value;

      this.get('store').findRecord('language', langId).then(record => {
        this.get('local').saveNativeLang({
          id: langId,
          language: record.get('language')
        });

        this.set('nativeLang', this.get('local').getNativeLang());
      });
    }
  }
});
