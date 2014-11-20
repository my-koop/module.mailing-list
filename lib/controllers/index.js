var endpoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
// Controllers.
function attachControllers(binder) {
    binder.attach({
        endPoint: endpoints.mailinglist.add,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController("addMailingList", function (req) {
        var params = {
            name: req.param("name"),
            description: req.param("description")
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.update,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController("updateMailingList", function (req) {
        var params = {
            id: parseInt(req.param("id")),
            name: req.param("name"),
            description: req.param("description")
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.delete,
        validation: validation.mailinglistId
    }, binder.makeSimpleController("deleteMailingList", function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.list
    }, binder.makeSimpleController("getMailingLists"));
    binder.attach({
        endPoint: endpoints.mailinglist.register,
        validation: validation.mailinglistIdPlusUserId
    }, binder.makeSimpleController("registerToMailingList", function (req) {
        var params = {
            idMailingList: parseInt(req.param("id")),
            idUser: parseInt(req.param("idUser"))
        };
        return params;
    }));
}
exports.attachControllers = attachControllers;
