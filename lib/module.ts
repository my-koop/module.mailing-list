import utils = require("mykoop-utils");
import async = require("async");
import _ = require("lodash");
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
    params: MailingList.AddMailingList.Params,
    callback: MailingList.AddMailingList.Callback
  ) {
    this.callWithConnection(
      this.__addMailingList,
      params,
      callback
    );
  }

  __addMailingList(
    connection: mysql.IConnection,
    params: MailingList.AddMailingList.Params,
    callback: MailingList.AddMailingList.Callback
  ) {
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
      callback(err);
    });
  }

  deleteMailingList(
    params: MailingList.DeleteMailingList.Params,
    callback: MailingList.DeleteMailingList.Callback
  ) {
    this.callWithConnection(
      this.__deleteMailingList,
      params,
      callback
    );
  }

  __deleteMailingList(
    connection: mysql.IConnection,
    params: MailingList.DeleteMailingList.Params,
    callback: MailingList.DeleteMailingList.Callback
  ) {
    async.waterfall([
      function(callback) {
        connection.query(
          "DELETE FROM mailinglist WHERE idMailingList = ?",
          [params.id],
          function(err, res) {
            if(!err && res.affectedRows === 0) {
              return callback(new ApplicationError(
                null,
                {
                  id: "invalid"
                }
              ));
            }
            callback(err && new DatabaseError(err));
          }
        )
      }
    ], function(err) {
      callback(err);
    });
  }

  getMailingLists(
    params: MailingList.GetMailingList.Params,
    callback: MailingList.GetMailingList.Callback
  ) {
    this.callWithConnection(
      this.__getMailingLists,
      params,
      callback
    );
  }

  __getMailingLists(
    connection: mysql.IConnection,
    params: MailingList.GetMailingList.Params,
    callback: MailingList.GetMailingList.Callback
  ) {
    async.waterfall([
      function(callback) {
        connection.query(
          "SELECT idMailingList AS id, name, description FROM mailinglist",
          [],
          function(err, rows) {
            if(err) {
              return callback(new DatabaseError(err));
            }
            var mailingLists = _.map(rows, function(row: any) {
              return {
                id: row.id,
                name: row.name,
                description: row.description
              }
            });
            callback(null, mailingLists);
          }
        )
      }
    ], function(err, result: any[]) {
      callback(err, result);
    });
  }

  updateMailingList(
    params: MailingList.UpdateMailingList.Params,
    callback: MailingList.UpdateMailingList.Callback
  ) {
    this.callWithConnection(
      this.__updateMailingList,
      params,
      callback
    );
  }

  __updateMailingList(
    connection: mysql.IConnection,
    params: MailingList.UpdateMailingList.Params,
    callback: MailingList.UpdateMailingList.Callback
  ) {
    async.waterfall([
      function(callback) {
        var mailingList = {
          name: params.name,
          description: params.description
        };
        connection.query(
          "UPDATE mailinglist SET ? WHERE idMailingList = ?",
          [mailingList, params.id],
          function(err, res) {
            if(err) {
              if(err.code === "ER_DUP_ENTRY") {
                return callback(new ApplicationError(
                  err,
                  {
                    name: "duplicate"
                  }
                ));
              }
              return callback(new DatabaseError(err));
            }
            if(res.affectedRows === 0) {
              return callback(new ApplicationError(null,
                {
                  id: "invalid"
                }
              ));
            }
            callback();
          }
        )
      }
    ], function(err) {
      callback(err);
    });
  }

}

export = Module;
