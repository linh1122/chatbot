// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  process.env.MONGO_URL = "mongodb://localhost:27017/meteorChat";
});
