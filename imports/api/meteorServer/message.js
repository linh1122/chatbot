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
                                <div class="row">
                                    <div class="col-12">
                                        <button class="btn btn-primary comment">Viết nhận xét</button>
                                    </div>
                                    <div class="col-12">
                                        <button class="btn btn-primary booking">Đặt chuyến đi</button>
                                    </div>
                                </div>
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
        Meteor.call('Python.getData', {
            status: 1,
            data: messages
        }, (err, result) => {
            if (err) throw err
            console.log(result.data)
            if (result.data.point < 0)
                return createMessage(`Chúng tôi xin lỗi vì sự bất tiện, mong quý khách thông cảm và tiếp tục sử dụng dịch vụ!`, null, userID)
            else return createMessage(`Cám ơn quý khách đã đóng góp ý kiến, chúng tôi rất hân hạnh được phục vụ quý khách!`, null, userID)
        })
    })

}

function userBooking(data, userID) {
    return createMessage(data.seats, userID, null).then(result => {
        Meteor.call('Python.getData', {
            status: 0,
            data
        }, (error, result) => {
            if (error)
                return createMessage(`Có lỗi xảy ra, vui lòng đặt lại!`, null, userID)
            console.log(result.data)
            if (result.data)
                return createMessage(`Chúng tôi đã đặt cho quý khách ${result.data.seats} chỗ ngồi trên chuyến đi từ ${result.data.pickupAddress} đến ${result.data.takeoffAddress} vào lúc ${new Date(result.data.startTime).toLocaleString()}! Chúc quý khách có một chuyến đi vui vẻ!`, null, userID)
            else return createMessage(`Có lỗi xảy ra, vui lòng đặt lại!`, null, userID)
        })
    })
}