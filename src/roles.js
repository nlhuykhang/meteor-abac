import { Mongo } from 'meteor/mongo';

export const Roles = new Mongo.Collection('meteor_abac_roles');
