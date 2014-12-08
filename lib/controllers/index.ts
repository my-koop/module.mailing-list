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
      var params: MailingList.AddMailingList.Params = {
        showAtRegistration: !!req.param("showAtRegistration", false),
        name: req.param("name"),
        description: req.param("description")
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
      var params: MailingList.UpdateMailingList.Params = {
        id: parseInt(req.param("id")),
        name: req.param("name"),
        description: req.param("description"),
        showAtRegistration: !!req.param("showAtRegistration", false)
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
      var params: MailingList.DeleteMailingList.Params = {
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

  // Get mailing for registration only
  binder.attach(
    {endPoint: endpoints.mailinglist.registration},
    binder.makeSimpleController<MailingList.GetMailingList.Params>(
      mailingList.getMailingLists,
      function() {
        return {
          inRegistration: true
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
      var params: MailingList.RegisterToMailingLists.Params = {
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
      var params: MailingList.RegisterToMailingLists.Params = {
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
      /*FIXME: Need a separate route for public mailing lists.
      permissions: {
        mailinglists: {
          users: {
            view: true
          }
        }
      },
      */
      customPermissionDenied: validateCurrentUser
    },
    binder.makeSimpleController(mailingList.getUserMailingLists, function (req: Express.Request) {
      var params: MailingList.GetUserMailingLists.Params = {
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
    binder.makeSimpleController<MailingList.SendEmail.Params>(
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
