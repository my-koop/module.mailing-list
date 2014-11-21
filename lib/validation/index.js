// see http://validatejs.org/ for documentation on how to do contraints
var commons = require("mykoop-utils/common");
var _ = require("lodash");
var validate = commons.validation;
var id = {
    numericality: {
        onlyInteger: { message: "^notAnInteger" },
        message: "^notAnInteger"
    }
};
var requiredId = _.assign(_.clone(id), { presence: { message: "^empty" } });
function mailingListDefinition(obj) {
    var constraint = {
        id: id,
        name: {
            presence: { message: "^empty" },
            length: {
                minimum: 4,
                maximum: 45,
                tooShort: "^tooShort__%{count}__",
                tooLong: "^tooLong__%{count}__"
            }
        },
        description: {},
        permissions: {}
    };
    return validate(obj, constraint);
}
exports.mailingListDefinition = mailingListDefinition;
function mailinglistId(obj) {
    var constraint = {
        id: requiredId
    };
    return validate(obj, constraint);
}
exports.mailinglistId = mailinglistId;
function mailinglistIdPlusUserId(obj) {
    var constraint = {
        id: requiredId,
        idUser: requiredId
    };
    return validate(obj, constraint);
}
exports.mailinglistIdPlusUserId = mailinglistIdPlusUserId;
