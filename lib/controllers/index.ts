import Express = require("express");
import endpoints = require("../../metadata/endpoints");
import utils = require("mykoop-utils");

import validation = require("../validation/index");
import _ = require("lodash");
// Controllers.

export function attachControllers(
  binder: utils.ModuleControllersBinder<mkmailinglist.Module>
) {
  binder.attach(
    {
      endPoint: endpoints.mailinglist.add,
      validation: validation.mailingListDefinition
    },
    binder.makeSimpleController("addMailingList", function (req: Express.Request) {
      var params: MailingList.AddMailingList.Params = {
        name: req.param("name"),
        description: req.param("description")
      };
      return params;
    })
  );

  binder.attach(
    {
      endPoint: endpoints.mailinglist.update,
      validation: validation.mailingListDefinition
    },
    binder.makeSimpleController("updateMailingList", function (req: Express.Request) {
      var params: MailingList.UpdateMailingList.Params = {
        id: parseInt(req.param("id")),
        name: req.param("name"),
        description: req.param("description")
      };
      return params;
    })
  );

  binder.attach(
    {
      endPoint: endpoints.mailinglist.delete,
      validation: validation.mailinglistId
    },
    binder.makeSimpleController("deleteMailingList", function (req: Express.Request) {
      var params: MailingList.DeleteMailingList.Params = {
        id: parseInt(req.param("id"))
      };
      return params;
    })
  );

  binder.attach(
    {
      endPoint: endpoints.mailinglist.list
    },
    binder.makeSimpleController("getMailingLists")
  );

  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.register
    },
    binder.makeSimpleController("registerToMailingLists", function (req: Express.Request) {
      console.log("Registering to mailing list", req.param("idMailingLists"));
      var params: MailingList.RegisterToMailingLists.Params = {
        idMailingLists: _.map(req.param("idMailingLists"), function(id: string) {
          return parseInt(id);
        }),
        idUser: parseInt(req.param("id"))
      };
      return params;
    })
  );

  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.unregister
    },
    binder.makeSimpleController("unregisterToMailingLists", function (req: Express.Request) {
      console.log("Unregistering to mailing list", req.param("idMailingLists"));
      var params: MailingList.RegisterToMailingLists.Params = {
        idMailingLists: _.map(req.param("idMailingLists"), function(id: string) {
          return parseInt(id);
        }),
        idUser: parseInt(req.param("id"))
      };
      return params;
    })
  );

  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.list,
      validation: validation.mailinglistId
    },
    binder.makeSimpleController("getUserMailingLists", function (req: Express.Request) {
      var params: MailingList.GetUserMailingLists.Params = {
        id: parseInt(req.param("id"))
      };
      return params;
    })
  );
}
