import { Meteor } from 'meteor/meteor';

import { doesMethodExist } from './method.js';

import { doesPublicationExist } from './publication.js';

import {
  canUserExecuteMethod,
  canUserSubscribePublication,
} from './roles.js';

const hookMethods = function hookMethods() {
  console.log('hookMethods');

  const oldMethods = Meteor.methods;

  const newMethods = function newMethods(...args) {
    const methods = args[0];

    const wrapMethods = {};

    for (const m in methods) {
      if (methods.hasOwnProperty(m)) {
        wrapMethods[m] = function wrapMethod(...v) {
          const userId = Meteor.userId();

          if (!doesMethodExist(m)) {
            if (Meteor.isDevelopment) {
              console.warn(`Meteor ABAC: method ${m} has not been checked`);
            }
          } else {
            if (!canUserExecuteMethod(userId, m)) {
              if (Meteor.isDevelopment) {
                throw new Meteor.Error(403, `Do not have permission to execute ${m}`);
              }
              throw new Meteor.Error(403, 'Do not have permission');
            }
          }
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
      const userId = this.userId;

      if (!doesPublicationExist(name)) {
        if (Meteor.isDevelopment) {
          console.warn(`Meteor ABAC: publication ${name} has not been checked`);
        }
      } else {
        if (!canUserSubscribePublication(userId, name)) {
          if (Meteor.isDevelopment) {
            throw new Meteor.Error(403, `Do not have permission to subscribe ${name}`);
          }
          throw new Meteor.Error(403, 'Do not have permission');
        }
      }

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
