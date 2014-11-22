var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var async = require("async");
var _ = require("lodash");
var controllerList = require("./controllers/index");
var logger = utils.getLogger(module);
var ApplicationError = utils.errors.ApplicationError;
var DatabaseError = utils.errors.DatabaseError;
var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
    }
    Module.prototype.init = function () {
        this.db = this.getModuleManager().get("database");
        this.user = this.getModuleManager().get("user");
        controllerList.attachControllers(new utils.ModuleControllersBinder(this));
    };
    Module.prototype.addMailingList = function (params, callback) {
        this.callWithConnection(this.__addMailingList, params, callback);
    };
    Module.prototype.__addMailingList = function (connection, params, callback) {
        async.waterfall([
            function (callback) {
                var mailingList = {
                    name: params.name,
                    description: params.description
                };
                connection.query("INSERT INTO mailinglist SET ?", [mailingList], function (err, res) {
                    if (err && err.code === "ER_DUP_ENTRY") {
                        return callback(new ApplicationError(err, {
                            name: "duplicate"
                        }));
                    }
                    callback(err && new DatabaseError(err), res && res.insertId);
                });
            }
        ], function (err, id) {
            callback(err, { id: id });
        });
    };
    Module.prototype.deleteMailingList = function (params, callback) {
        this.callWithConnection(this.__deleteMailingList, params, callback);
    };
    Module.prototype.__deleteMailingList = function (connection, params, callback) {
        async.waterfall([
            function (callback) {
                connection.query("DELETE FROM mailinglist WHERE idMailingList = ?", [params.id], function (err, res) {
                    if (!err && res.affectedRows === 0) {
                        return callback(new ApplicationError(null, {
                            id: "invalid"
                        }));
                    }
                    callback(err && new DatabaseError(err));
                });
            }
        ], function (err) {
            callback(err);
        });
    };
    Module.prototype.getMailingLists = function (params, callback) {
        this.callWithConnection(this.__getMailingLists, params, callback);
    };
    Module.prototype.__getMailingLists = function (connection, params, callback) {
        async.waterfall([
            function (callback) {
                connection.query("SELECT idMailingList AS id, name, description FROM mailinglist", [], function (err, rows) {
                    if (err) {
                        return callback(new DatabaseError(err));
                    }
                    var mailingLists = _.map(rows, function (row) {
                        return {
                            id: row.id,
                            name: row.name,
                            description: row.description
                        };
                    });
                    callback(null, mailingLists);
                });
            }
        ], function (err, result) {
            callback(err, result);
        });
    };
    Module.prototype.updateMailingList = function (params, callback) {
        this.callWithConnection(this.__updateMailingList, params, callback);
    };
    Module.prototype.__updateMailingList = function (connection, params, callback) {
        async.waterfall([
            function (callback) {
                var mailingList = {
                    name: params.name,
                    description: params.description
                };
                connection.query("UPDATE mailinglist SET ? WHERE idMailingList = ?", [mailingList, params.id], function (err, res) {
                    if (err) {
                        if (err.code === "ER_DUP_ENTRY") {
                            return callback(new ApplicationError(err, {
                                name: "duplicate"
                            }));
                        }
                        return callback(new DatabaseError(err));
                    }
                    if (res.affectedRows === 0) {
                        return callback(new ApplicationError(null, {
                            id: "invalid"
                        }));
                    }
                    callback();
                });
            }
        ], function (err) {
            callback(err);
        });
    };
    Module.prototype.registerToMailingLists = function (params, callback) {
        this.callWithConnection(this.__registerToMailingLists, params, callback);
    };
    Module.prototype.__registerToMailingLists = function (connection, params, callback) {
        var self = this;
        logger.debug("User registering to mailing lists", params);
        async.waterfall([
            function (callback) {
                self.user.__userExists(connection, { id: params.idUser }, function (err) {
                    callback(err && new ApplicationError(err, { idUser: "invalid" }));
                });
            },
            function (callback) {
                async.eachSeries(params.idMailingLists, function (id, next) {
                    var mailingListUser = {
                        idUser: params.idUser,
                        idMailingList: id
                    };
                    logger.debug("User registering to mailing list %d", id);
                    connection.query("INSERT INTO mailinglist_users set ?", [mailingListUser], function (err, res) {
                        if (err) {
                            //accepted errors
                            if (err.code === "ER_NO_REFERENCED_ROW_2" || err.code === "ER_NO_REFERENCED_ROW_" || err.code === "ER_NO_REFERENCED_ROW" || err.code === "ER_DUP_ENTRY") {
                                return next(null, null);
                            }
                            else {
                                return next(new DatabaseError(err), null);
                            }
                        }
                        next(null, null);
                    });
                }, function (err) {
                    callback(err);
                });
            }
        ], callback);
    };
    Module.prototype.unregisterToMailingLists = function (params, callback) {
        this.callWithConnection(this.__unregisterToMailingLists, params, callback);
    };
    Module.prototype.__unregisterToMailingLists = function (connection, params, callback) {
        var self = this;
        logger.debug("User unregistering to mailing lists", params);
        async.waterfall([
            function (callback) {
                self.user.__userExists(connection, { id: params.idUser }, function (err) {
                    callback(err && new ApplicationError(err, { idUser: "invalid" }));
                });
            },
            function (callback) {
                async.eachSeries(params.idMailingLists, function (id, next) {
                    logger.debug("User unregistering to mailing list %d", id);
                    connection.query("DELETE FROM mailinglist_users WHERE idUser=? AND idMailingList=?", [params.idUser, id], function (err, res) {
                        next(err && new DatabaseError(err), null);
                    });
                }, function (err) {
                    callback(err);
                });
            }
        ], function (err) {
            callback(err);
        });
    };
    Module.prototype.getUserMailingLists = function (params, callback) {
        this.callWithConnection(this.__getUserMailingLists, params, callback);
    };
    Module.prototype.__getUserMailingLists = function (connection, params, callback) {
        connection.query(" SELECT idMailingList\
        FROM mailinglist_users\
        WHERE idUser = ?", [params.id], function (err, rows) {
            callback(err && new DatabaseError(err), _.map(rows, function (row) {
                return {
                    id: row.idMailingList
                };
            }));
        });
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
