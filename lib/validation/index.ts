// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common").validation;

export function addMailingList(obj) {
  var addMailingListConstraint = {
    name: {
      presence: {message: "^empty"},
      length: {
        minimum: 4,
        maximum: 45,
        tooShort: "^tooShort",
        tooLong: "^tooLong"
      }
    },
    description: {},
    permissions: {}
  };
  return validate(obj, addMailingListConstraint);
}
