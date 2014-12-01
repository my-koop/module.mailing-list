var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales/index");
var endpoints = require("./endpoints");
var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);
metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("endpoints", endpoints);
metaDataBuilder.addData("myAccountPlugins", {
    mailingList: {
        titleKey: "mailinglist::mailingListTab",
        hash: "mailinglist",
        component: {
            resolve: "component",
            value: "MailingListUserInfo"
        }
    }
});
metaDataBuilder.addData("adminEditPlugins", {
    mailingList: {
        titleKey: "mailinglist::mailingListTab",
        hash: "mailinglist",
        component: {
            resolve: "component",
            value: "MailingListUserInfo"
        }
    }
});
metaDataBuilder.addData("user", {
    contributions: {
        registerForm: {
            mailingList: {
                titleKey: "mailinglist::mailingLists",
                component: {
                    resolve: "component",
                    value: "RegisterMailingList"
                }
            }
        }
    }
});
var metaData = metaDataBuilder.get();
module.exports = metaData;
