// Methods related to links

import {
    Meteor
} from 'meteor/meteor';
import {
    HTTP
} from 'meteor/http'

Meteor.methods({
    'Python.getBookingData': getBookingData,
    'Python.getData': getData
});

let base_url = 'http://14.231.140.53:6969'

function getBookingData() {
    return HTTP.call('GET', base_url, {});
}


function getData(data) {
    let url = `${base_url}/api/v1/p1`
    console.log(data, url)
    return HTTP.call('POST', url, {
        data
    });
}