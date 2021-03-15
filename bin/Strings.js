// Strings.js

var Strings={
    KEY_HASH: "namstork",
    // ERROR MESSAGE
    E_001_MESS:"Content-Type must be application/json",

    E_010_MESS: function(field_name){return `${field_name} field require not null`}, // field null

    E_500_MESS: "Error: Connect to Server Faild!", // server faild

    OK_LOGIN: "Successfully: Welcome to My Pay Smart",

}

module.exports = Strings;