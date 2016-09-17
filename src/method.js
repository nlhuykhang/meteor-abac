import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Method = new Mongo.Collection('meteor_abac_method');

export const addMethod = function addMethod(method) {
  check(method, {
    name: String,
    desc: Match.Optional(String),
  });

  const now = new Date();

  Method.upsert({
    name: method.name,
  }, {
    $set: {
      ...method,
      createdAt: now,
      modifiedAt: now,
    },
  });
};

export const removeMethod = function removeMethod(name) {
  check(name, String);

  Method.remove({
    name,
  });
};

export const doesMethodExist = function doesMethodExist(name) {
  check(name, String);

  return !!Method.findOne({
    name,
  });
};
