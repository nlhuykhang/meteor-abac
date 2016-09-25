import { Role } from './roles.js';
import { Method } from './method.js';
import { Publication } from './publication.js';

Role.rawCollection().createIndex({
  name: 1,
}, {
  unique: true,
});

Method.rawCollection().createIndex({
  name: 1,
}, {
  unique: true,
});

Publication.rawCollection().createIndex({
  name: 1,
}, {
  unique: true,
});
