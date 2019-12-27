// Methods related to links

import {
    Meteor
} from 'meteor/meteor';


export const Messages = new Mongo.Collection('messages')

if (Meteor.isServer) {
    Meteor.methods({
        'Messages.create': createMessage,
        'Messages.send': userSendFirstMessage,
        'Messages.comment': userComment,
        'Messages.booking': userBooking,
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
        if (content) {
            let welcomeMessage = `
                            <div class="bg-secondary">Xin chào quý khách
                                Đây là chế độ trả lời tự động!
                                Quý khách vui lòng chọn dịch vụ
                                <button class="btn btn-primary comment">Viết nhận xét</button>
                                <button class="btn btn-primary booking">Đặt chuyến đi</button>
                            </div>`
            return createMessage(welcomeMessage, null, sendBy)
        }
    }).then(result => {
        return result
    }).catch(error => {
        console.log(error)
    })
}

function userComment(messages, userID) {
    return createMessage(messages, userID, null).then(result => {
        return createMessage(`Chúng tôi đã ghi nhận ý kiến, mong quý khách tiếp tục cống tiền cho chúng tôi`, null, userID)
    })

}

function userBooking(messages, userID) {
    return createMessage(messages, userID, null).then(result => {
        return createMessage(`Chúng tôi đã đặt chuyến đi cho quý khách`, null, userID)
    })

}