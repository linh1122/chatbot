// Methods related to links

import {
    Meteor
} from 'meteor/meteor';


export const Messages = new Mongo.Collection('messages')

if (Meteor.isServer) {
    Meteor.methods({
        'Messages.create': createMessage,
        'Messages.send': userSendFirstMessage
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
    return new Promise((resolve, reject) => {
        Messages.insert({
            sendBy,
            content,
            sendTo,
            createdAt: Date.now(),
        }, (err, result) => {
            if (err) reject(err)
            if (result.error) reject(result.error)
            resolve(result)
        })
    })
}


function userSendFirstMessage(content, sendBy, sendTo) {
    return createMessage(content, sendBy, sendTo).then(result => {
        if (content)
            return createMessage(`<div>Xin chào quý khách</div>`, null, sendBy)
    }).then(result => {
        return result
    }).catch(error => {
        console.log(error)
    })
}