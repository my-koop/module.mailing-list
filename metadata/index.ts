import utils = require("mykoop-utils");
import routes = require("./routes");
import translations = require("../locales/index");
import endpoints = require("./endpoints");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("endpoints", endpoints);

metaDataBuilder.addData("myAccountPlugins", {
  mailingList: {
    titleKey: "mailinglist::mailingListTab",
    component: {
      resolve: "component",
      value: "MailingListUserInfo"
    }
  }
});

metaDataBuilder.addData("adminEditPlugins", {
  mailingList: {
    titleKey: "mailinglist::mailingListTab",
    component: {
      resolve: "component",
      value: "MailingListUserInfo"
    }
  }
});

var metaData = metaDataBuilder.get();
export = metaData;
