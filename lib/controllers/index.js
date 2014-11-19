var endpoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
// Controllers.
function attachControllers(binder) {
    binder.attach({
        endPoint: endpoints.mailinglist.add,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController("addMailingList", function (req) {
        return {
            name: req.param("name"),
            description: req.param("description")
        };
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.udpate,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController("updateMailingList", function (req) {
        return {
            id: parseInt(req.param("id")),
            name: req.param("name"),
            description: req.param("description")
        };
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.delete
    }, binder.makeSimpleController("deleteMailingList", function (req) {
        return {
            id: req.param("id")
        };
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.list
    }, binder.makeSimpleController("getMailingLists"));
}
exports.attachControllers = attachControllers;
