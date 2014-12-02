var endpoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
var _ = require("lodash");
// Controllers.
function attachControllers(binder) {
    var mailingList = binder.moduleInstance;
    // Add new Mailing list
    binder.attach({
        endPoint: endpoints.mailinglist.add,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController(mailingList.addMailingList, function (req) {
        var params = {
            showAtRegistration: !!req.param("showAtRegistration", false),
            name: req.param("name"),
            description: req.param("description")
        };
        return params;
    }));
    // Update Mailing list
    binder.attach({
        endPoint: endpoints.mailinglist.update,
        validation: validation.mailingListDefinition
    }, binder.makeSimpleController(mailingList.updateMailingList, function (req) {
        var params = {
            id: parseInt(req.param("id")),
            name: req.param("name"),
            description: req.param("description"),
            showAtRegistration: !!req.param("showAtRegistration", false)
        };
        return params;
    }));
    // Delete Mailing list
    binder.attach({
        endPoint: endpoints.mailinglist.delete,
        validation: validation.mailinglistId
    }, binder.makeSimpleController(mailingList.deleteMailingList, function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
    // Get all mailing lists
    binder.attach({ endPoint: endpoints.mailinglist.list }, binder.makeSimpleController(mailingList.getMailingLists));
    // Get mailing for registration only
    binder.attach({ endPoint: endpoints.mailinglist.registration }, binder.makeSimpleController(mailingList.getMailingLists, function () {
        return {
            inRegistration: true
        };
    }));
    // Register a user to multiple mailing lists
    binder.attach({
        endPoint: endpoints.user.mailinglist.register
    }, binder.makeSimpleController(mailingList.registerToMailingLists, function (req) {
        var params = {
            idMailingLists: _.map(req.param("idMailingLists"), function (id) {
                return parseInt(id);
            }),
            idUser: parseInt(req.param("id"))
        };
        return params;
    }));
    // Unregister a user to multiple mailing lists
    binder.attach({
        endPoint: endpoints.user.mailinglist.unregister
    }, binder.makeSimpleController(mailingList.unregisterToMailingLists, function (req) {
        var params = {
            idMailingLists: _.map(req.param("idMailingLists"), function (id) {
                return parseInt(id);
            }),
            idUser: parseInt(req.param("id"))
        };
        return params;
    }));
    // Get mailing list the user is registered to
    binder.attach({
        endPoint: endpoints.user.mailinglist.list,
        validation: validation.mailinglistId
    }, binder.makeSimpleController(mailingList.getUserMailingLists, function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
    // Set mailing list configuration
    binder.attach({
        endPoint: endpoints.mailinglist.config.set
    }, binder.makeSimpleController(mailingList.setConfigurations, function (req) {
        return {
            globalSender: req.param("globalSender", "")
        };
    }));
    // Get mailing list configuration
    binder.attach({
        endPoint: endpoints.mailinglist.config.get
    }, binder.makeSimpleController(mailingList.getConfigurations));
    // Send email to the mailing list
    binder.attach({
        endPoint: endpoints.mailinglist.send
    }, binder.makeSimpleController(mailingList.sendEmail, function (req) {
        return {
            id: parseInt(req.param("id", 0)),
            content: req.param("content", ""),
            subject: req.param("subject", "No Subject")
        };
    }));
}
exports.attachControllers = attachControllers;
