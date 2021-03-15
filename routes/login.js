var express = require('express');
var router = express.Router();


var mid_check_content_type = require('./middleware/mid_check_content_type.js');

var User = require('../models/User.js');

const Result = require("../models/Result.js");
const Strings = require("../bin/Strings.js");




/* GET users listing. */
router.use(mid_check_content_type.json);

///////  Login  ///////

router.post('/',  function(req, res){
    if(!req.body.user_name){res.json(Result.create(Result.E_010, Strings.E_010_MESS("user_name"), null));}
    if(!req.body.device_id){res.json(Result.create(Result.E_010, Strings.E_010_MESS("device_id"), null));}
    

    var _user = new User(req.body);
    
    _user.login(function(err, row){
        if(err){
            res.json(Result.create(Result.E_500, Strings.E_500_MESS, null));
        }else{
            res.json(Result.create(Result.OK, Strings.OK_LOGIN, _user.toJSON()));
        }
    });
});

module.exports = router;