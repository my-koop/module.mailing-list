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
      validation: validation.addMailingList
    },
    binder.makeSimpleController("addMailingList", function (req: Express.Request) {
      return {
        name: req.param("name"),
        description: req.param("description")
      };
    })
  );
}
