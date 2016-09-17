import { hook } from './hook.js';

import './publication.js';

export function init() {
  if (typeof Meteor === 'undefined') {
    console.error('meteor-abac can only be used in a Meteor project');
    return;
  }

  hook();

  // addRole({
  //   name: 'sdf',
  // });
}

// export function test(...args) {
//   return addUserToRole(...args);
// }
//
// export function test2(...args) {
//   return removeUserFromRole(...args);
// }


export { addMethod, removeMethod } from './method.js';
export {
  addRole,
  addUserToRole,
  removeUserFromRole,
  addMethodToRole,
} from './roles.js';
