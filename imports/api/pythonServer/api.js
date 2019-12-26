// Methods related to links

import {
    Meteor
} from 'meteor/meteor';
import {
    HTTP
} from 'meteor/http'

Meteor.methods({
    'Messages.send': sendMessage
});

let base_url = 'http://192.168.100.69:6969/'

function sendMessage() {
    return HTTP.call('GET', base_url, {});
}