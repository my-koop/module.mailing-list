var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils = require("mykoop-utils");
var async = require("async");
var controllerList = require("./controllers/index");
var ApplicationError = utils.errors.ApplicationError;
var DatabaseError = utils.errors.DatabaseError;
var Module = (function (_super) {
    __extends(Module, _super);
    function Module() {
        _super.apply(this, arguments);
    }
    Module.prototype.init = function () {
        this.db = this.getModuleManager().get("database");
        controllerList.attachControllers(new utils.ModuleControllersBinder(this));
    };
    Module.prototype.addMailingList = function (params, callback) {
        this.db.getConnection(function (err, connection, cleanup) {
            if (err) {
                return callback(new DatabaseError(err));
            }
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
                        callback(err && new DatabaseError(err));
                    });
                }
            ], function (err) {
                cleanup();
                callback(err);
            });
        });
    };
    return Module;
})(utils.BaseModule);
module.exports = Module;
