'use strict';

class UserReport{

    constructor(resBody){
        this.conDB = require('../app.js').conDB();
        this.name_table = "UserReport";

        this.user_id = resBody.user_id; // not null
        this.phone = resBody.phone; // not null
    }

    
    insertDB(callback){
        var sql_query = `Insert into ${this.name_table}
                ( user_id, phone)
         values(      ?,    ?)`;
        
        var data_query = [this.user_id, this.phone];

        this.conDB.query(sql_query, data_query, callback);   
    }


    hasInDB(callback) {
     
        var sql_query = `select * from ${this.name_table} where user_id=? and phone=?`;
        var data_query = [this.user_id, this.phone];

        this.conDB.query(sql_query, data_query, function(err, rows){
            if(err){
                callback(err, null);
            }else{
                callback(null, rows.length > 0)
            }
        });   
    }

///////// Action //////

    addIntoDB(callback){
        this.hasInDB((err, value)=>{
            if(err){
                callback(err, null);
            }else{
                if(value){
                    callback("already exist", true);
                }else{
                    this.insertDB(callback)
                }
               
            }
        });
        
    }

}


module.exports = UserReport;