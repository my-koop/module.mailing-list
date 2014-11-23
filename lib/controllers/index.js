var endpoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
var _ = require("lodash");
// Controllers.
function attachControllers(binder) {
    var ml = binder.moduleInstance;
    binder.attach({
        endPoint: endpoints.mailinglist.add,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController(ml.addMailingList, function (req) {
        var params = {
            showAtRegistration: !!req.param("showAtRegistration", false),
            name: req.param("name"),
            description: req.param("description")
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.update,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController(ml.updateMailingList, function (req) {
        var params = {
            id: parseInt(req.param("id")),
            name: req.param("name"),
            description: req.param("description"),
            showAtRegistration: !!req.param("showAtRegistration", false)
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.delete,
        validation: validation.mailinglistId
    }, binder.makeSimpleController(ml.deleteMailingList, function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
    binder.attach({
        endPoint: endpoints.mailinglist.list
    }, binder.makeSimpleController(ml.getMailingLists));
    binder.attach({
        endPoint: endpoints.user.mailinglist.register
    }, binder.makeSimpleController(ml.registerToMailingLists, function (req) {
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
    }, binder.makeSimpleController(ml.unregisterToMailingLists, function (req) {
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
    }, binder.makeSimpleController(ml.getUserMailingLists, function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
}
exports.attachControllers = attachControllers;
