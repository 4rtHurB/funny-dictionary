import Service from '@ember/service';

export default Service.extend({
  nativeLang: null,
  getNativeLang() {
    if(!this.get('nativeLang'))
      this.set('nativeLang', JSON.parse(localStorage.getItem('nativeLang') || null));

    return this.get('nativeLang');
  },
  saveNativeLang(lang) {
    window.localStorage.setItem('nativeLang', JSON.stringify(lang));
  },
  clearNativeLang() {
    window.localStorage.removeItem('nativeLang');
  }
});
