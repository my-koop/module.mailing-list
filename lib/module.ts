import utils = require("mykoop-utils");
import async = require("async");
import _ = require("lodash");
import controllerList = require("./controllers/index");
var logger = utils.getLogger(module);
var ApplicationError = utils.errors.ApplicationError;
var DatabaseError = utils.errors.DatabaseError;

class Module extends utils.BaseModule implements mkmailinglist.Module {
  db: mkdatabase.Module;
  user: mkuser.Module;
  init() {
    this.db = <mkdatabase.Module>this.getModuleManager().get("database");
    this.user = <mkuser.Module>this.getModuleManager().get("user");
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
            callback(
              err && new DatabaseError(err),
              res && res.insertId
            );
          }
        )
      }
    ], function(err, id: any) {
      callback(err, {id: id});
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

  registerToMailingLists(
    params: MailingList.RegisterToMailingLists.Params,
    callback: MailingList.RegisterToMailingLists.Callback
  ) {
    this.callWithConnection(
      this.__registerToMailingLists,
      params,
      callback
    );
  }

  __registerToMailingLists(
    connection: mysql.IConnection,
    params: MailingList.RegisterToMailingLists.Params,
    callback: MailingList.RegisterToMailingLists.Callback
  ) {
    var self = this;
    logger.debug("User registering to mailing lists", params);
    async.waterfall([
      function(callback) {
        self.user.__userExists(connection, {id: params.idUser}, function(err) {
          callback(err && new ApplicationError(err, {idUser: "invalid"}));
        });
      },
      function(callback) {
        async.eachSeries(params.idMailingLists, function(id, next) {
          var mailingListUser = {
            idUser: params.idUser,
            idMailingList: id
          };
          logger.debug("User registering to mailing list %d", id);
          connection.query(
            "INSERT INTO mailinglist_users set ?",
            [mailingListUser],
            function(err, res) {
              if(err) {
                //accepted errors
                if(err.code === "ER_NO_REFERENCED_ROW_2" || // invalid mailing list
                  err.code === "ER_NO_REFERENCED_ROW_" ||
                  err.code === "ER_NO_REFERENCED_ROW" ||
                  err.code === "ER_DUP_ENTRY" // already registered
                ) {
                  return next(null, null);
                } else {
                  return next(new DatabaseError(err), null);
                }
              }
              next(null, null);
            }
          )
        }, function(err) {
          callback(err);
        });
      }
    ],
    function(err) {
      callback(err)
    });
  }

  unregisterToMailingLists(
    params: MailingList.RegisterToMailingLists.Params,
    callback: MailingList.RegisterToMailingLists.Callback
  ) {
    this.callWithConnection(
      this.__unregisterToMailingLists,
      params,
      callback
    );
  }

  __unregisterToMailingLists(
    connection: mysql.IConnection,
    params: MailingList.RegisterToMailingLists.Params,
    callback: MailingList.RegisterToMailingLists.Callback
  ) {
    var self = this;
    logger.debug("User unregistering to mailing lists", params);
    async.waterfall([
      function(callback) {
        self.user.__userExists(connection, {id: params.idUser}, function(err) {
          callback(err && new ApplicationError(err, {idUser: "invalid"}));
        });
      },
      function(callback) {
        async.eachSeries(params.idMailingLists, function(id, next) {
          logger.debug("User unregistering to mailing list %d", id);
          connection.query(
            "DELETE FROM mailinglist_users WHERE idUser=? AND idMailingList=?",
            [params.idUser, id],
            function(err, res) {
              next(err && new DatabaseError(err), null);
            }
          )
        }, function(err) {
          callback(err);
        });
      }
    ],
    function(err) {
      callback(err)
    });
  }

  getUserMailingLists (
    params: MailingList.GetUserMailingLists.Params,
    callback: MailingList.GetUserMailingLists.Callback
  ) {
    this.callWithConnection(
      this.__getUserMailingLists,
      params,
      callback
    );
  }

  __getUserMailingLists (
    connection: mysql.IConnection,
    params: MailingList.GetUserMailingLists.Params,
    callback: MailingList.GetUserMailingLists.Callback
  ) {
    connection.query(
      " SELECT idMailingList\
        FROM mailinglist_users\
        WHERE idUser = ?",
      [params.id],
      function(err, rows: any[]) {
        callback(
          err && new DatabaseError(err),
          _.map(rows, function(row) {
            return {
              id: row.idMailingList
            }
          })
        );
      }
    )
  }

}

export = Module;
