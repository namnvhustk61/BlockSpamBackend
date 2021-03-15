'use strict';

class PhoneBlock{

    constructor(resBody){
        this.conDB = require('../app.js').conDB();
        this.name_table = "blockphone";

        this.idx = resBody.idx; // not null
        this.phone = resBody.phone; // not null
        this.name = resBody.name; // not null
        
        this.type = resBody.type; // not null
        this.status = resBody.status;

        this.count = resBody.count; // not null
        
    }

    toJSON(){
        return {
            
            "phone":  (this.phone === undefined)?null:this.phone,
            "name": (this.name === undefined)?null:this.name,
            "type":  (this.type === undefined)?null:this.type,
            "status":  (this.status === undefined)?null:this.status,
        }
    }

    insertDB(callback){
        var sql_query = `Insert into ${this.name_table}
                ( phone, name, type)
         values(      ?,    ?,    ?)`;
        
        var data_query = [this.phone, this.name, this.type];

        this.conDB.query(sql_query, data_query, callback);   
    }

    getAllDB(callback){
        var sql_query = `SELECT * FROM ${this.name_table}`;
        
        var data_query = [this.phone, this.name, this.type];

        this.conDB.query(sql_query, data_query, callback);   
    }


///////// Action //////

    getAllPhoneBlock(callback){
        this.getAllDB(function(err, result, fields){
            callback(err, result)
        })
    }

}


module.exports = PhoneBlock;