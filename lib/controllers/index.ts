import Express = require("express");
import endpoints = require("../../metadata/endpoints");
import utils = require("mykoop-utils");

import validation = require("../validation/index");
import _ = require("lodash");

// Controllers.
export function attachControllers(
  binder: utils.ModuleControllersBinder<mkmailinglist.Module>
) {
  var mailingList = binder.moduleInstance;
  var user = <mkuser.Module>mailingList.getModuleManager().get("user");
  var validateCurrentUser = (<any>user.constructor).validateCurrentUser;

  // Add new Mailing list
  binder.attach(
    {
      endPoint: endpoints.mailinglist.add,
      validation: validation.mailingListDefinition,
      permissions: {
        mailinglists: {
          create: true
        }
      }
    },
    binder.makeSimpleController(mailingList.addMailingList, function (req: Express.Request) {
      var params: mkmailinglist.AddMailingList.Params = {
        showAtRegistration: !!req.param("showAtRegistration", false),
        name: req.param("name"),
        description: req.param("description"),
        permissions: req.body.permissions || {}
      };
      return params;
    })
  );

  // Update Mailing list
  binder.attach(
    {
      endPoint: endpoints.mailinglist.update,
      validation: validation.mailingListDefinition,
      permissions: {
        mailinglists: {
          update: true
        }
      }
    },
    binder.makeSimpleController(mailingList.updateMailingList, function (req: Express.Request) {
      var params: mkmailinglist.UpdateMailingList.Params = {
        id: parseInt(req.param("id")),
        name: req.param("name"),
        description: req.param("description"),
        showAtRegistration: !!req.param("showAtRegistration", false),
        permissions: req.body.permissions || {}
      };
      return params;
    })
  );

  // Delete Mailing list
  binder.attach(
    {
      endPoint: endpoints.mailinglist.delete,
      validation: validation.mailinglistId,
      permissions: {
        mailinglists: {
          delete: true
        }
      }
    },
    binder.makeSimpleController(mailingList.deleteMailingList, function (req: Express.Request) {
      var params: mkmailinglist.DeleteMailingList.Params = {
        id: parseInt(req.param("id"))
      };
      return params;
    })
  );

  // Get all mailing lists
  binder.attach(
    {
      endPoint: endpoints.mailinglist.list,
      permissions: {
        mailinglists: {
          read: true
        }
      }
    },
    binder.makeSimpleController(mailingList.getMailingLists)
  );

  // Get all available mailing lists
  binder.attach(
    {
      endPoint: endpoints.mailinglist.listAvailable,
      customPermissionGranted: function(req: Express.Request, callback) {
        if(!req.session.user) {
          return callback(new Error("Not logged in"));
        }
        var userId = req.query.userId;
        if(userId) {
          // Requesting mailing list for another user, make sure this profile is
          // allowed to query someone else's profile
          var user = <mkuser.Module>mailingList.getModuleManager().get("user");
          if(!user.validatePermissions(req.session.user.perms, {
            user: {profile: {view: true}},
            mailinglists: {read: true}
          })) {
            return callback(new Error("Not allowed to see user profile &| mailing lists"));
          }
        }
        callback();
      }
    },
    binder.makeSimpleController(mailingList.getMailingLists, function(req) {
      var userId = req.query.userId;
      return {
        requesterPermissions: userId ? req.session.user.perms || {} : undefined,
        userId: userId
      }
    })
  );

  // Get mailing for registration only
  binder.attach(
    {endPoint: endpoints.mailinglist.registration},
    binder.makeSimpleController<mkmailinglist.GetMailingLists.Params>(
      mailingList.getMailingLists,
      function() {
        return {
          inRegistration: true
        };
      }
    )
  );

  // Get mailing for registration only
  binder.attach(
    {
      endPoint: endpoints.mailinglist.listUsers,
      permissions: {
        mailinglists: {
          read: true,
          users: {
            view: true,
          }
        }
      }
    },
    binder.makeSimpleController<mkmailinglist.GetMailingListUsers.Params>(
      mailingList.getMailingListUsers,
      function(req) {
        return {
          id: parseInt(req.param("id")) || 0
        };
      }
    )
  );

  // Register a user to multiple mailing lists
  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.register,
      permissions: {
        mailinglists: {
          users: {
            add: true
          }
        }
      },
      customPermissionDenied: validateCurrentUser
    },
    binder.makeSimpleController(mailingList.registerToMailingLists, function (req: Express.Request) {
      var params: mkmailinglist.RegisterToMailingLists.Params = {
        idMailingLists: _.map(req.param("idMailingLists"), function(id: string) {
          return parseInt(id);
        }),
        idUser: parseInt(req.param("id"))
      };
      return params;
    })
  );

  // Unregister a user to multiple mailing lists
  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.unregister,
      permissions: {
        mailinglists: {
          users: {
            remove: true
          }
        }
      },
      customPermissionDenied: validateCurrentUser
    },
    binder.makeSimpleController(mailingList.unregisterToMailingLists, function (req: Express.Request) {
      var params: mkmailinglist.RegisterToMailingLists.Params = {
        idMailingLists: _.map(req.param("idMailingLists"), function(id: string) {
          return parseInt(id);
        }),
        idUser: parseInt(req.param("id"))
      };
      return params;
    })
  );

  // Get mailing list the user is registered to
  binder.attach(
    {
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
    },
    binder.makeSimpleController(mailingList.getUserMailingLists, function (req: Express.Request) {
      var params: mkmailinglist.GetUserMailingLists.Params = {
        id: parseInt(req.param("id"))
      };
      return params;
    })
  );

  // Send email to the mailing list
  binder.attach(
    {
      endPoint: endpoints.mailinglist.send,
      permissions: {
        mailinglists: {
          send: true
        }
      }
    },
    binder.makeSimpleController<mkmailinglist.SendEmail.Params>(
      mailingList.sendEmail,
      function(req) {
        return {
          id: parseInt(req.param("id", 0)),
          content: req.param("content",""),
          subject: req.param("subject","No Subject")
        }
      }
    )
  );
}
