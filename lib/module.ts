import utils = require("mykoop-utils");
import controllerList = require("./controllers/index");
var ApplicationError = utils.errors.ApplicationError;

class Module extends utils.BaseModule implements mkmailinglist.Module {
  init() {
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

}

export = Module;
