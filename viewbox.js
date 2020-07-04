const doc = document;

const qs = (sel, ctx = doc) => ctx.querySelector(sel);

const qsa = (sel, ctx = doc) => ctx.querySelectorAll(sel);

const hasProp = (o, p) => ({}).hasOwnProperty.call(o, p);

const isFunc = v => typeof v === 'function';

class Viewbox {

  constructor(options = {}) {

    this.options = Object.assign({

      default: 'default'

    }, options);

    this.changeListeners = [];

    this.errorListeners = [];

    this.viewbox = qs('#viewbox');

    this.views =  [...qsa('[data-view]')].reduce((_views, el) => {

      const name = el.getAttribute('data-view');

      _views[name] = el;

      if(name !== this.options.default) el.classList.add('hidden');

      return _views;

    }, {});

    this.currentView = null;

  }

  init() {

    if(this.currentView === null) {

      const name = this.options.default;

      this.currentView = {
      
        el: this.views[name],

        name
      
      };

      this.notifyChangeListeners(null, name);

    }

  }

  notifyChangeListeners(prev, curr) {

    this.changeListeners.forEach(listener => listener(prev, curr));

  }

  notifyErrorListeners(err) {

    this.errorListeners.forEach(listener => listener(err));

  }

  setView(name) {
  
    if(!!name && hasProp(this.views, name)) {
      
      const view = this.views[name];

      if(this.currentView.name !== name) {

        this.notifyChangeListeners(this.currentView.name, name);

        this.currentView.el.classList.add('hidden');

        this.currentView = {
          
          el: view,
          
          name

        };

        this.currentView.el.classList.remove('hidden');

      }

    } else {

      this.notifyErrorListeners(`Error: view "${name}" not found!`);

    }

  }

  onChange(listener) {

    if(isFunc(listener)) {

      this.changeListeners.push(listener);
      
    } else {

      console.error('Error: listener is not a function');

    }

  }

  onError(listener) {

    if(isFunc(listener)) {

      this.errorListeners.push(listener);
      
    } else {

      console.error('Error: listener is not a function');

    }

  }

}

export default Viewbox;
