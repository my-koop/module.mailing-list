var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales/index");
var endpoints = require("./endpoints");
var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);
metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("endpoints", endpoints);
metaDataBuilder.addData("myAccountPlugins", [
    {
        titleKey: "mailinglist::mailingListTab",
        component: {
            resolve: "component",
            value: "MailingListUserInfo"
        }
    }
]);
metaDataBuilder.addData("adminEditPlugins", [
    {
        titleKey: "mailinglist::mailingListTab",
        component: {
            resolve: "component",
            value: "MailingListUserInfo"
        }
    }
]);
var metaData = metaDataBuilder.get();
module.exports = metaData;
