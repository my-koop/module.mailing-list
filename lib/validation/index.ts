// see http://validatejs.org/ for documentation on how to do contraints
import commons = require("mykoop-utils/common");
import _ = require("lodash");
var validate = commons.validation;

var id = {
  numericality: {
    onlyInteger: {message: "^notAnInteger"},
    message: "^NaN"
  }
};
var requiredId = _.assign(id, {presence: {message: "^empty"}});

export function mailingListDefinition(obj) {
  var constraint = {
    id: id,
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
  return validate(obj, constraint);
}

export function mailinglistId(obj) {
  var constraint = {
    id: requiredId
  }
  return validate(obj, constraint);
}

export function mailinglistIdPlusUserId(obj) {
  var constraint = {
    id: requiredId,
    idUser: requiredId
  }
  return validate(obj, constraint);
}
