import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';
import { flatten } from 'ramda';
import { Random } from 'meteor/random';

import { doesMethodExist } from './method.js';
import { doesPublicationExist } from './publication.js';

export const Role = new Mongo.Collection('meteor_abac_roles');
export const UserInRole = new Mongo.Collection('meteor_abac_userinrole');

const isString = val => Object.prototype.toString.call(val) === '[object String]';

const doesRoleExist = function doesroleexist(role) {
  return !!Role.findOne({
    name: role,
  });
};

const isUserInRole = function isUserInRole(userId, roles) {
  check(userId, String);

  check(roles, Match.OneOf(
    String,
    [String]
  ));

  let rs = roles;

  if (isString(roles)) {
    rs = [roles];
  }

  return UserInRole.find({
    userId,
    role: {
      $in: rs,
    },
  }).count() > 0;
};

const findRolesByMethod = function findRolesByMethod(methodName) {
  return Role.find({
    method: methodName,
  }).fetch();
};

const findRolesByPublication = function findRolesByPublication(pubName) {
  return Role.find({
    publication: pubName,
  }).fetch();
};

export const addUserToRole = function addUserToRole(userIds, roles) {
  check(userIds, Match.OneOf(
    String,
    [String],
  ));

  check(roles, Match.OneOf(
    String,
    [String],
  ));

  let uids = userIds;
  let rs = roles;

  if (isString(userIds)) {
    uids = [userIds];
  }

  if (isString(roles)) {
    rs = [roles];
  }

  rs.forEach(r => {
    if (!doesRoleExist(r)) {
      throw new Meteor.Error('not-existed', `Role ${r} does not exist`);
    }
  });

  const userInRoles = uids.map(userId => {
    return rs.map(role => ({
      userId,
      role,
    }));
  });

  const filterList = flatten(userInRoles).filter(uir => {
    return !UserInRole.findOne(uir);
  });

  if (filterList.length > 0) {
    const bulk = UserInRole.rawCollection().initializeUnorderedBulkOp();
    const now = new Date();

    filterList.forEach(uir => {
      bulk.insert({
        _id: Random.id(),
        ...uir,
        createdAt: now,
        modifiedAt: now,
      });
    });

    bulk.execute(() => {});
  }
};

export const removeUserFromRole = function removeUserFromRole(userIds, roles) {
  check(userIds, Match.OneOf(
    String,
    [String],
  ));

  check(roles, Match.OneOf(
    String,
    [String],
  ));

  let uids = userIds;
  let rs = roles;

  if (isString(userIds)) {
    uids = [userIds];
  }

  if (isString(roles)) {
    rs = [roles];
  }

  UserInRole.remove({
    userId: {
      $in: uids,
    },
    role: {
      $in: rs,
    },
  });
};

export const addRole = function addRoles(role) {
  check(role, {
    name: String,
    method: Match.Optional([String]),
    publication: Match.Optional([String]),
    component: Match.Optional([String]),
  });

  const now = new Date();

  Role.upsert({
    name: role.name,
  }, {
    $set: {
      method: [],
      publication: [],
      component: [],
      ...role,
      createdAt: now,
      modifiedAt: now,
    },
  });
};

export const removeRole = function removeRole(role) {
  check(role, Match.OneOf(
    String,
    [String],
  ));

  let r = role;

  if (isString(role)) {
    r = [role];
  }

  Role.remove({
    name: {
      $in: r,
    },
  });

  UserInRole.remove({
    role: {
      $in: r,
    },
  });
};

export const editRole = function editRole(role) {
  check(role, {
    _id: String,
    name: Match.Optional(String),
    method: Match.Optional([String]),
    publication: Match.Optional([String]),
    component: Match.Optional([String]),
  });

  const now = new Date();

  Role.update({
    _id: role._id,
  }, {
    $set: {
      ...role,
      modifiedAt: now,
    },
  });
};

export const getRole = function getRole(idOrName) {
  check(idOrName, String);

  return Role.findOne({
    $or: [{
      _id: idOrName,
    }, {
      name: idOrName,
    }],
  });
};

export const addMethodToRole = function addMethodToRole(roleNameOrId, methods) {
  check(roleNameOrId, String);
  check(methods, Match.OneOf(
    String,
    [String],
  ));

  let m = methods;

  if (isString(methods)) {
    m = [methods];
  }

  if (!doesRoleExist(roleNameOrId)) {
    throw new Meteor.Error('not-existed', `Role ${roleNameOrId} does not eixst`);
  }

  m.forEach(obj => {
    if (!doesMethodExist(obj)) {
      throw new Meteor.Error('not-existed', `Method ${m} does not exist`);
    }
  });

  Role.update({
    $or: [{
      _id: roleNameOrId,
    }, {
      name: roleNameOrId,
    }],
  }, {
    $push: {
      method: {
        $each: m,
      },
    },
  });
};

export const addPublicationToRole = function addPublicationToRole(roleNameOrId, pub) {
  check(roleNameOrId, String);
  check(pub, Match.OneOf(
    String,
    [String],
  ));

  let m = pub;

  if (isString(pub)) {
    m = [pub];
  }

  if (!doesRoleExist(roleNameOrId)) {
    throw new Meteor.Error('not-existed', `Role ${roleNameOrId} does not eixst`);
  }

  m.forEach(obj => {
    if (!doesPublicationExist(obj)) {
      throw new Meteor.Error('not-existed', `Publication ${m} does not exist`);
    }
  });

  Role.update({
    $or: [{
      _id: roleNameOrId,
    }, {
      name: roleNameOrId,
    }],
  }, {
    $push: {
      publication: {
        $each: m,
      },
    },
  });
};

export const addComponentToRole = function addComponentToRole(roleNameOrId, component) {
  check(roleNameOrId, String);
  check(component, Match.OneOf(
    String,
    [String],
  ));

  let m = component;

  if (isString(component)) {
    m = [component];
  }

  if (!doesRoleExist(roleNameOrId)) {
    throw new Meteor.Error('not-existed', `Role ${roleNameOrId} does not eixst`);
  }

  Role.update({
    $or: [{
      _id: roleNameOrId,
    }, {
      name: roleNameOrId,
    }],
  }, {
    $push: {
      component: {
        $each: m,
      },
    },
  });
};

export const canUserExecuteMethod = function canUserExecuteMethod(userId, method) {
  const rolesCanDoOp = findRolesByMethod(method).map(obj => obj.name);

  return isUserInRole(userId, rolesCanDoOp);
};

export const canUserSubscribePublication = function canUserSubscribePublication(userId, pub) {
  const rolesCanSubscribe = findRolesByPublication(pub).map(obj => obj.name);

  return isUserInRole(userId, rolesCanSubscribe);
};
