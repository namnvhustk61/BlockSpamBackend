var express = require('express');
var router = express.Router();

const Result = require("../models/Result.js");
const Strings = require("../bin/Strings.js");

var PhoneBlock = require('../models/PhoneBlock.Model');


var mid_check_content_type = require('./middleware/mid_check_content_type.js');
/* GET  listing. */
router.use(mid_check_content_type.json);

/* GET home page. */
router.get('/all', function(req, res, next) {
  var _blockPhone = new PhoneBlock({});

  _blockPhone.getAllPhoneBlock(function(err, results){
    if(err){
      res.json(Result.create(Result.E_500, Strings.E_500_MESS, null));
  }else{
      var data = (results.length == 0)?null:[];
      for (var i = 0;i < results.length; i++) {
        _blockPhone = new PhoneBlock(results[i]);
          data.push(_blockPhone.toJSON());
      }
      res.json(Result.create(Result.OK, Strings.OK_LOGIN, data));
  }
  })
});

module.exports = router;
