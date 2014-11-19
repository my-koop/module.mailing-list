import Express = require("express");
import endpoints = require("../../metadata/endpoints");
import utils = require("mykoop-utils");

import validation = require("../validation/index");

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
      return {
        name: req.param("name"),
        description: req.param("description")
      };
    })
  );

  binder.attach(
    {
      endPoint: endpoints.mailinglist.udpate,
      validation: validation.mailingListDefinition
    },
    binder.makeSimpleController("updateMailingList", function (req: Express.Request) {
      return {
        id: parseInt(req.param("id")),
        name: req.param("name"),
        description: req.param("description")
      };
    })
  );

  binder.attach(
    {
      endPoint: endpoints.mailinglist.delete
    },
    binder.makeSimpleController("deleteMailingList", function (req: Express.Request) {
      return {
        id: req.param("id")
      };
    })
  );

  binder.attach(
    {
      endPoint: endpoints.mailinglist.list
    },
    binder.makeSimpleController("getMailingLists")
  );
}
