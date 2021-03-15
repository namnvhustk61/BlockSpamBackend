
module.exports.getTimeNow = function(){   ////// 2021-02-27_15:52:30
    var datetime = new Date();
    return datetime.toISOString().replace(/T/, '_').replace(/\..+/, '') ;
};
