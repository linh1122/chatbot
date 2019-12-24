// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const Customers = new Mongo.Collection('customers');
export const Admins = new Mongo.Collection('admins');
export const Messages = new Mongo.Collection('messages');
export const Deleted_Msgs = new Mongo.Collection('deleted_msgs');