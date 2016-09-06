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
          console.log(m);
          console.log(Meteor.userId());
          return methods[m](...v);
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

  const newPublish = function newPublish(...args) {
    // console.log('newPublish');
    return oldPublish(...args);
  };

  Meteor.publish = newPublish;
};

export function hook() {
  hookMethods();
  hookPublish();
}


// ok so my wrapped function run prior to validatedmethod mixin
