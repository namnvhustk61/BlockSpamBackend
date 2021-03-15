const Result = require("../../models/Result.js");
const Strings = require("../../bin/Strings.js");

// mid_check_content_type

module.exports = {

    json: function (req, res, next) {
            if(req.headers["content-type"] == "application/json"){
                next();
            }else{
                res.json(Result.create(Result.E_001, Strings.E_001_MESS, null));
            }
            
    },

    text: function (req, res, next) {
    
        next();
    },

};