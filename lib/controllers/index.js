var endpoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
var _ = require("lodash");
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
        endPoint: endpoints.user.mailinglist.register
    }, binder.makeSimpleController("registerToMailingLists", function (req) {
        console.log("Registering to mailing list", req.param("idMailingLists"));
        var params = {
            idMailingLists: _.map(req.param("idMailingLists"), function (id) {
                return parseInt(id);
            }),
            idUser: parseInt(req.param("id"))
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.user.mailinglist.unregister
    }, binder.makeSimpleController("unregisterToMailingLists", function (req) {
        console.log("Unregistering to mailing list", req.param("idMailingLists"));
        var params = {
            idMailingLists: _.map(req.param("idMailingLists"), function (id) {
                return parseInt(id);
            }),
            idUser: parseInt(req.param("id"))
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.user.mailinglist.list,
        validation: validation.mailinglistId
    }, binder.makeSimpleController("getUserMailingLists", function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
}
exports.attachControllers = attachControllers;
