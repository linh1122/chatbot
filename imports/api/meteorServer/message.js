// Methods related to links

import {
    Meteor
} from 'meteor/meteor';


export const Messages = new Mongo.Collection('messages')

if (Meteor.isServer) {
    Meteor.methods({
        'Messages.create': createMessage
    });

    Meteor.publish(
        'Messages.byUser', getUserMessage
    );
}

function getUserMessage(userID) {
    return Messages.find({
        $or: [{
            sendBy: userID
        }, {
            sendTo: userID
        }]
    }, {
        sort: {
            createdAt: 1
        },
        fields: {
            content: 1,
            sendBy: 1,
            sendTo: 1,
            createdAt: 1
        }
    })
}

function createMessage(content, sendBy, sendTo) {
    return Messages.insert({
        sendBy,
        content,
        sendTo,
        createdAt: Date.now(),
    })
}