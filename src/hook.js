/* global Meteor */

const hookMethods = function hookMethods() {
  console.log('hookMethods');

  const oldMethods = Meteor.methods;

  const newMethods = function newMethods(...args) {
    const methods = args[0];

    const wrapMethods = {};

    for (const m in methods) {
      if (methods.hasOwnProperty(m)) {
        wrapMethods[m] = function wrapMethod(...v) {
          return methods[m].bind(this)(...v);
        };
      }
    }

    return oldMethods(wrapMethods);
  };

  Meteor.methods = newMethods;
};

const hookPublish = function hookPublish() {
  console.log('hookPublish');
  const oldPublish = Meteor.publish;

  const newPublish = function newPublish(name, func) {
    const wrapFunc = function wrapFunc(...args) {
      return func.bind(this)(...args);
    };
    return oldPublish(name, wrapFunc);
  };

  Meteor.publish = newPublish;
};

export function hook() {
  hookMethods();
  hookPublish();
}
