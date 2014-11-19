var endpoints = require("../../metadata/endpoints");
var validation = require("../validation/index");
// Controllers.
function attachControllers(binder) {
    binder.attach({
        endPoint: endpoints.mailinglist.add,
        validation: validation.addMailingList
    }, binder.makeSimpleController("addMailingList", function (req) {
        return {
            name: req.param("name"),
            description: req.param("description")
        };
    }));
}
exports.attachControllers = attachControllers;
