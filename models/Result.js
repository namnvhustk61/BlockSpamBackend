// Result.js

var Result={

    create:function(code, message, data){
        return {
            "code" : code,
            
            "message" : message,
            "data" : data,
        };
    },
    // status
    
    // code
    OK:"OK", 

    E_001:"E_001", // header content_type != application/json
    
    E_010:"E_010", // field is require

    E_500:"E_500", // err connect server

}

module.exports = Result;