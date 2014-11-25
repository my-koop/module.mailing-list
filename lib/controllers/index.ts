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
  binder.attach(
    {
      endPoint: endpoints.mailinglist.add,
      validation: validation.mailingListDefinition
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

  binder.attach(
    {
      endPoint: endpoints.mailinglist.update,
      validation: validation.mailingListDefinition
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

  binder.attach(
    {
      endPoint: endpoints.mailinglist.delete,
      validation: validation.mailinglistId
    },
    binder.makeSimpleController(mailingList.deleteMailingList, function (req: Express.Request) {
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
    binder.makeSimpleController(mailingList.getMailingLists)
  );

  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.register
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

  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.unregister
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

  binder.attach(
    {
      endPoint: endpoints.user.mailinglist.list,
      validation: validation.mailinglistId
    },
    binder.makeSimpleController(mailingList.getUserMailingLists, function (req: Express.Request) {
      var params: MailingList.GetUserMailingLists.Params = {
        id: parseInt(req.param("id"))
      };
      return params;
    })
  );
}
