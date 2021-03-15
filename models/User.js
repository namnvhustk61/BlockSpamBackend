'use strict';

var md5 = require("../utils/hash/md5.js");
var Date = require("../utils/Date.js");
/* 
CREATE TABLE USER_ (
    
    user_id INT NOT NULL AUTO_INCREMENT,
    auth_jwt_token VARCHAR(255),
    fcm_token VARCHAR(255),
        
    user_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),

    device_id VARCHAR(255) NOT NULL,
    third_party_id  VARCHAR(255),
        
    date_created DATETIME ,
    date_late DATETIME ,
        
    PRIMARY KEY (user_id)
);

*/
class User{
   
    
    constructor(resBody){
        this.conDB = require('../app.js').conDB();
        this.name_table = "USER_";
        this.user_id = resBody.user_id; // not null
        this.auth_jwt_token = resBody.auth_jwt_token; 
        this.fcm_token = resBody.fcm_token;
        
        this.user_name = resBody.user_name; // not null
        this.full_name = resBody.full_name;
        this.avatar_url = resBody.avatar_url;
        this.email = resBody.email;
        this.phone = resBody.phone;

        this.device_id = resBody.device_id; // GAID với android, UDID với iOS  // not null
        this.third_party_id = resBody.third_party_id; // facebook user id

        this.date_created = resBody.date_created;
        this.date_late = resBody.date_late;
    
    }
////////////////////////////////////////// SQL ////////////

 
     hasInDB(callback) {
     
        var sql_query = `select * from ${this.name_table} where user_name=?`;
        var data_query = [this.user_name];

        this.conDB.query(sql_query, data_query, function(err, rows){
            if(err){
                callback(err, null);
            }else{
                callback(null, rows.length > 0)
            }
        });   
    }

    add2DB(callback){
        var sql_query = `Insert into ${this.name_table}
                ( auth_jwt_token, fcm_token, user_name, full_name, avatar_url, email, phone, device_id, third_party_id, date_created, date_late)
         values(               ?,        ?,         ?,         ?,          ?,     ?,     ?,         ?,              ?,            ?,         ?)`;
        
        var data_query = [this.auth_jwt_token, this.fcm_token, this.user_name, 
            this.full_name, this.avatar_url,this. email, this.phone,
            this.device_id, this.third_party_id, this.date_created, this.date_late];

        this.conDB.query(sql_query, data_query, callback);   
    }

    update2DB(callback){
        var sql_query = `update ${this.name_table} set auth_jwt_token=?, fcm_token=?, date_late=? where user_name=?`;
        
        var data_query = [this.auth_jwt_token, this.fcm_token, this.date_late, this.user_name];

        this.conDB.query(sql_query, data_query, callback);   
    }

    //// toJSON
    toJSON(){
        return {
            "auth_jwt_token": this.auth_jwt_token,
            "user_name": this.user_name,
            "full_name": (this.full_name === undefined)?null:this.full_name,
            "avatar_url":  (this.avatar_url === undefined)?null:this.avatar_url,
            "email": (this.email === undefined)?null:this.email,
            "phone":  (this.phone === undefined)?null:this.phone,
        }
    }

    //// create auth_jwt_token
    create_auth_jwt_token(){
        var dateNow = Date.getTimeNow();
        var str = `${this.user_name}.${this.device_id}.${dateNow}`;
        this.auth_jwt_token = md5.encrypt(str);
    }

    create_date_late(){
        var dateNow = Date.getTimeNow();
        this.date_late = dateNow;
    }

    create_date_created(){
        var dateNow = Date.getTimeNow();
        this.date_created = dateNow;
    }


   ///////////// Model Action///////////

    login(callback){
         this.hasInDB((err, value)=>{
            if(err){
                callback(err, null);
            }else{
                this.create_auth_jwt_token();
                this.create_date_late();
                if(value){
                    this.update2DB(callback);
                }else{
                    this.create_date_created();
                     this.add2DB(callback);
                }
            }
         });
        
    }

}

module.exports = User;