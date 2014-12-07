var endpoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
var _ = require("lodash");
// Controllers.
function attachControllers(binder) {
    var mailingList = binder.moduleInstance;
    var user = mailingList.getModuleManager().get("user");
    var validateCurrentUser = user.constructor.validateCurrentUser;
    // Add new Mailing list
    binder.attach({
        endPoint: endpoints.mailinglist.add,
        validation: validation.mailingListDefinition,
        permissions: {
            mailinglists: {
                create: true
            }
        }
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
        validation: validation.mailingListDefinition,
        permissions: {
            mailinglists: {
                update: true
            }
        }
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
        validation: validation.mailinglistId,
        permissions: {
            mailinglists: {
                delete: true
            }
        }
    }, binder.makeSimpleController(mailingList.deleteMailingList, function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
    // Get all mailing lists
    binder.attach({
        endPoint: endpoints.mailinglist.list,
        permissions: {
            mailinglists: {
                read: true
            }
        }
    }, binder.makeSimpleController(mailingList.getMailingLists));
    // Get mailing for registration only
    binder.attach({ endPoint: endpoints.mailinglist.registration }, binder.makeSimpleController(mailingList.getMailingLists, function () {
        return {
            inRegistration: true
        };
    }));
    // Register a user to multiple mailing lists
    binder.attach({
        endPoint: endpoints.user.mailinglist.register,
        permissions: {
            mailinglists: {
                users: {
                    add: true
                }
            }
        },
        customPermissionDenied: validateCurrentUser
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
        endPoint: endpoints.user.mailinglist.unregister,
        permissions: {
            mailinglists: {
                users: {
                    remove: true
                }
            }
        },
        customPermissionDenied: validateCurrentUser
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
        validation: validation.mailinglistId,
        permissions: {
            mailinglists: {
                users: {
                    view: true
                }
            }
        },
        customPermissionDenied: validateCurrentUser
    }, binder.makeSimpleController(mailingList.getUserMailingLists, function (req) {
        var params = {
            id: parseInt(req.param("id"))
        };
        return params;
    }));
    // Send email to the mailing list
    binder.attach({
        endPoint: endpoints.mailinglist.send,
        permissions: {
            mailinglists: {
                send: true
            }
        }
    }, binder.makeSimpleController(mailingList.sendEmail, function (req) {
        return {
            id: parseInt(req.param("id", 0)),
            content: req.param("content", ""),
            subject: req.param("subject", "No Subject")
        };
    }));
}
exports.attachControllers = attachControllers;
