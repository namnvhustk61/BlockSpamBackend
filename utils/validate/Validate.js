
module.exports.phonenumber = function phonenumber(inputtxt) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,9})$/;
    return phoneno.test(inputtxt);
  };