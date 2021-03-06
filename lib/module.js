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
var MailingList = require("./classes/MailingList");
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
        this.communications = this.getModuleManager().get("communications");
        controllerList.attachControllers(new utils.ModuleControllersBinder(this));
        this.deserializePermissions = this.user.constructor.deserializePermissions;
        this.serializePermissions = this.user.constructor.serializePermissions;
    };
    Module.prototype.addMailingList = function (params, callback) {
        this.callWithConnection(this.__addMailingList, params, callback);
    };
    Module.prototype.__addMailingList = function (connection, params, callback) {
        var self = this;
        async.waterfall([
            function (callback) {
                var mailingList = {
                    name: params.name,
                    description: params.description,
                    showAtRegistration: params.showAtRegistration,
                    permissions: self.serializePermissions(params.permissions || {})
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
        ], callback);
    };
    Module.prototype.getMailingList = function (params, callback) {
        this.callWithConnection(this.__getMailingList, params, callback);
    };
    Module.prototype.__getMailingList = function (connection, params, callback) {
        var self = this;
        connection.query(MailingList.queryMailingListInfo + " WHERE idMailingList=?", [params.id], function (err, res) {
            if (err) {
                return callback(new DatabaseError(err));
            }
            if (res.length !== 1) {
                return callback(new ResourceNotFoundError(null, { id: "notFound" }));
            }
            callback(null, new MailingList(res[0], self));
        });
    };
    Module.prototype.getMailingLists = function (params, callback) {
        this.callWithConnection(this.__getMailingLists, params, callback);
    };
    Module.prototype.__getMailingLists = function (connection, params, callback) {
        var self = this;
        async.waterfall([
            function (next) {
                if (params.userId) {
                    return self.user.__getProfile(connection, { id: params.userId }, next);
                }
                next(null, null);
            },
            function (profile, callback) {
                var whereClause = "";
                if (params.inRegistration) {
                    whereClause = "WHERE showAtRegistration = 1";
                }
                connection.query(MailingList.queryMailingListInfo + whereClause, [], function (err, rows) {
                    if (err) {
                        return callback(new DatabaseError(err));
                    }
                    var mailingLists = _.map(rows, function (row) {
                        return new MailingList(row, self);
                    });
                    logger.debug("mailing lists before filter", mailingLists);
                    if (profile) {
                        profile.permissions = profile.permissions || {};
                    }
                    if (profile || params.requesterPermissions !== undefined) {
                        var permissionsToValidate = (profile && profile.permissions) || params.requesterPermissions;
                        mailingLists = mailingLists.filter(function (mailingList) {
                            return self.user.validatePermissions(permissionsToValidate, mailingList.permissions);
                        });
                    }
                    logger.debug("Available mailing list after filter", mailingLists);
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
        var self = this;
        async.waterfall([
            function (callback) {
                var mailingList = {
                    name: params.name,
                    description: params.description,
                    showAtRegistration: params.showAtRegistration,
                    permissions: self.serializePermissions(params.permissions || {})
                };
                console.log(mailingList.permissions);
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
        ], callback);
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
                            return next(new DatabaseError(err), null);
                        }
                        next(null, null);
                    });
                }, callback);
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
                }, callback);
            }
        ], callback);
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
    Module.prototype.getMailingListUsers = function (params, callback) {
        this.callWithConnection(this.__getMailingListUsers, params, callback);
    };
    Module.prototype.__getMailingListUsers = function (connection, params, callback) {
        var self = this;
        var userInMailingList;
        var requiredPermissions;
        async.waterfall([
            function (next) {
                self.__getMailingList(connection, params, next);
            },
            function (mailingList, next) {
                connection.query("SELECT \
            email, \
            idUser, \
            firstname AS firstName,\
            lastname AS lastName,\
            perms \
          FROM mailinglist_users\
          INNER JOIN user ON idUser=id\
          WHERE idMailingList=?", [params.id], function (err, res) {
                    if (err) {
                        return next(new DatabaseError(err));
                    }
                    if (res.length === 0) {
                        return next(null, []);
                    }
                    requiredPermissions = _.isEqual(mailingList.permissions, {}) ? null : mailingList.permissions;
                    userInMailingList = _.map(res, function (user) {
                        return {
                            email: user.email,
                            id: user.idUser,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            // Deserialize only if there are permissions on the mailing list
                            permissions: requiredPermissions && self.deserializePermissions(user.perms)
                        };
                    });
                    next(null);
                });
            },
            function (next) {
                userInMailingList = _.filter(userInMailingList, function (user) {
                    return user.email && (!requiredPermissions || self.user.validatePermissions(user.permissions, requiredPermissions));
                });
                _.each(userInMailingList, function (user) {
                    // don't leak permissions through this route
                    delete user.permissions;
                });
                next(null, { users: userInMailingList });
            }
        ], callback);
    };
    Module.prototype.sendEmail = function (params, callback) {
        this.callWithConnection(this.__sendEmail, params, callback);
    };
    Module.prototype.__sendEmail = function (connection, params, callback) {
        var self = this;
        var toEmails;
        var requiredPermissions;
        logger.verbose("Sending Email");
        async.waterfall([
            function (next) {
                self.__getMailingListUsers(connection, params, next);
            },
            function (res, next) {
                logger.verbose(res);
                toEmails = _.pluck(res.users, "email");
                logger.verbose(toEmails);
                next();
            },
            function (next) {
                self.communications.sendEmail({
                    message: params.content,
                    subject: params.subject,
                    bcc: toEmails
                }, next);
            }
        ], callback);
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
