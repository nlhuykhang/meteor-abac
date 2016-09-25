// import { Mongo } from 'meteor/mongo';
// import { check, Match } from 'meteor/check';

export const Method = new Mongo.Collection('meteor_abac_method');

export const addMethod = function addMethod(method) {
  check(method, {
    name: String,
    desc: Match.Optional(String),
    isPublished: Match.Optional(Boolean),
  });

  const now = new Date();

  Method.upsert({
    name: method.name,
  }, {
    $set: {
      isPublished: false, // default to be false
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

export const isMethodPublished = function isMethodPublished(name) {
  check(name, String);

  const m = Method.findOne({
    name,
  });

  return m && m.isPublished;
};
