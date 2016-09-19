import { hook } from './hook.js';

import './publication.js';

export function init() {
  if (typeof Meteor === 'undefined') {
    console.error('meteor-abac can only be used in a Meteor project');
    return;
  }

  hook();
}


export { addMethod, removeMethod } from './method.js';
export { addPublication, removePublication } from './publication.js';
export {
  addRole,
  addUserToRole,
  removeUserFromRole,
  addMethodToRole,
  addPublicationToRole,
} from './roles.js';
