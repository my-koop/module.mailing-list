// see http://validatejs.org/ for documentation on how to do contraints
var validate = require("mykoop-utils/common").validation;

export function mailingListDefinition(obj) {
  var addMailingListConstraint = {
    id: {
      numericality: {
        onlyInteger: {message: "^notAnInteger"},
        message: "^NaN"
      }
    },
    name: {
      presence: {message: "^empty"},
      length: {
        minimum: 4,
        maximum: 45,
        tooShort: "^tooShort_%{count}",
        tooLong: "^tooLong_%{count}"
      }
    },
    description: {},
    permissions: {}
  };
  return validate(obj, addMailingListConstraint);
}
