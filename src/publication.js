import { Mongo } from 'meteor/mongo';
import { check, Match } from 'meteor/check';

export const Publication = new Mongo.Collection('meteor_abac_publication');

export const addPublication = function addPublication(pub) {
  check(pub, {
    name: String,
    desc: Match.Optional(String),
  });

  const now = new Date();

  Publication.upsert({
    name: pub.name,
  }, {
    $set: {
      ...pub,
      createdAt: now,
      modifiedAt: now,
    },
  });
};

export const removePublication = function removePublication(name) {
  check(name, String);

  Publication.remove({
    name,
  });
};

export const doesPublicationExist = function doesPublicationExist(name) {
  check(name, String);

  return !!Publication.findOne({
    name,
  });
};
