var express = require('express');
var router = express.Router();

const Result = require("../models/Result.js");
const Strings = require("../bin/Strings.js");
const Validate = require("../utils/validate/Validate");

var PhoneBlock = require('../models/PhoneBlock.Model');
var UserReport = require('../models/UserReport.model');

var mid_check_content_type = require('./middleware/mid_check_content_type.js');
const e = require('express');
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

/** ADD  */
router.post('/add',  function(req, res, next){
  /** Check Not null */
  if(!req.body.name){res.json(Result.create(Result.E_010, Strings.E_010_MESS("name"), null)); return;}
  if(!req.body.phone){res.json(Result.create(Result.E_010, Strings.E_010_MESS("phone"), null)); return;}
  if(!req.body.type){res.json(Result.create(Result.E_010, Strings.E_010_MESS("type"), null)); return;}
  if(!req.body.user_id){res.json(Result.create(Result.E_010, Strings.E_010_MESS("user_id"), null));  return;}
   /** Validate Phonel */
  if(!Validate.phonenumber(req.body.phone)){res.json(Result.create(Result.E_015, Strings.E_015_MESS("number phone"), null));  return;}

  var _blockPhone = new PhoneBlock(req.body);
   /** Check Table */
  _blockPhone.hasPhoneDB(function(err, bool){
    if(err){
       /** Err return E_500*/
      res.json(Result.create(Result.E_500, Strings.E_500_MESS, null));
    }else{
       /** */

      if(bool){
         /** TRue: Da Ton tai */
         /** Check Phone and Uer_ID in tabel UserReport */
        var jsUserReport = {user_id: req.body.user_id, phone: req.body.phone}
        var userReport = new UserReport(jsUserReport)
        userReport.addIntoDB(function(err, value){
          if(err){
            /** Err */
            res.json(Result.create(Result.OK, Strings.ADD_PHONE_BLOCK_SUCCESS + "(E_insert UserReport)", null));
          }else{
            /**  */
            // Update Count ++ of Phone in tabel  BlockPhone
            _blockPhone.updateIncresmentCount(function(err, row){
              if(err){
                res.json(Result.create(Result.OK, Strings.ADD_PHONE_BLOCK_SUCCESS + "(E_update_count)", null));
              }else{
                res.json(Result.create(Result.OK, Strings.ADD_PHONE_BLOCK_SUCCESS, null));
              }
            })
          }
        })
        
      }else{
         /** TRue: Chua Ton tai  --> Insert */
         _blockPhone.insertDB(function(err, row){
            /** Insert Table BlockPhone */
            if(err){
              /** ERR */
              res.json(Result.create(Result.E_500, Strings.E_500_MESS, null));
            }else{
              /** */
              /** Insert Table UserReport */
              var jsUserReport = {user_id: req.body.user_id, phone: req.body.phone}
              var userReport = new UserReport(jsUserReport)
                userReport.insertDB(function(err, row){
                  /** SUCC OR ERR --> return OK */
                  res.json(Result.create(Result.OK, Strings.ADD_PHONE_BLOCK_SUCCESS, null));
                })
            }
         })
      }

    }
  })
});

module.exports = router;
