import utils = require("mykoop-utils");
import async = require("async");
import controllerList = require("./controllers/index");
var ApplicationError = utils.errors.ApplicationError;
var DatabaseError = utils.errors.DatabaseError;

class Module extends utils.BaseModule implements mkmailinglist.Module {
  db: mkdatabase.Module;
  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    controllerList.attachControllers(new utils.ModuleControllersBinder(this));
  }

  addMailingList(
    params: {
      name: string;
      description?: string;
      permissions?: any; // no support for now
    },
    callback: (err?) => void
  ) {
    this.db.getConnection(function(err, connection, cleanup) {
      if(err) {
        return callback(new DatabaseError(err));
      }
      async.waterfall([
        function(callback) {
          var mailingList = {
            name: params.name,
            description: params.description
          };
          connection.query(
            "INSERT INTO mailinglist SET ?",
            [mailingList],
            function(err, res) {
              if(err && err.code === "ER_DUP_ENTRY") {
                return callback(new ApplicationError(
                  err,
                  {
                    name: "duplicate"
                  }
                ));
              }
              callback(err && new DatabaseError(err));
            }
          )
        }
      ], function(err) {
        cleanup();
        callback(err);
      });
    });
  }

}

export = Module;
