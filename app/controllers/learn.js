import Controller from '@ember/controller';

export default Controller.extend({
  ajax: Ember.inject.service(),
  local: Ember.inject.service(),
  currentWord: null,
  passedWords: [],
  learningLang: null,
  skipped: 0,
  passed: Ember.computed('skipped', 'passedWords', function () {
    return this.get('passedWords').length - this.get('skipped');
  }),
  translate: '',
  actions: {
    setLearningLang(e) {
      const langId = e.target.value;
      this.set('learningLang', langId);
      this.send('fetchFirstWord');
    },
    fetchFirstWord() {
      const route = `http://localhost:3000/api/first_translate?from=${this.get('learningLang')}`;
      this.get('ajax').request(route).then(response => {
        this.set('currentWord', response.first);
        return response.first;
      }).catch(err => {
        console.log('error');
      });
    },
    fetchNextWord() {
      this.set('passedWords', [
        ...(this.get('passedWords') || []),
        this.get('currentWord').id
      ]);

      const route = `http://localhost:3000/api/next_translate?from=${this.get('learningLang')}`;
      this.get('ajax').request(route, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          words: this.get('passedWords') || []
        }
      }).then(response => {
        this.set('currentWord', response.next || null);
        this.set('translate', '');
        return response.next;
      }).catch(err => {
        console.log(err);
      });
    },
    checkTranslate() {
      const from = this.get('local').getNativeLang().id;
      const to = this.get('learningLang');
      const word = this.get('currentWord').id;
      const translate = this.get('translate');

      const route =
        `http://localhost:3000/api/check_translate?from=${from}&to=${to}&word=${word}&translate=${translate}`;
      this.get('ajax').request(route).then(response => {
        if(response.success)
          this.send('fetchNextWord');
        return response;
      }).catch(err => {
        console.log(err);
      });
    },
    skipWord() {
      this.set('skipped', (this.get('skipped') || 0) + 1);
      this.send('fetchNextWord');
    },
    clearWords() {
      this.set('passedWords', []);
      this.set('skipped', 0);
      this.set('currentWord', null);
    },
    clearPassed() {
      this.send('clearWords');
      this.send('fetchFirstWord');
    },
    clearLang() {
      this.send('clearWords');
      this.set('learningLang', null);
    },
    onChangeTranslate(e) {
      this.set('translate', e.target.value);
      const res = this.send('checkTranslate');
    }
  }
});
