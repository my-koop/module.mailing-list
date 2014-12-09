import utils = require("mykoop-utils");
export function addRoutes(builder: utils.MetaDataBuilder) {
  builder.addFrontendRoute({
    idPath: ["dashboard", "mailinglist"],
    path: "mailinglist"
  });

  builder.addFrontendRoute({
    idPath: ["dashboard", "mailinglist", "edit"],
    i18nKey: "mailinglist::sidebar.manageLists",
    component: "MailingListAdminPage",
    name: "editMailingList",
    path: "edit",
    permissions: {
      mailinglists: {
        read: true
      }
    }
  });

  builder.addFrontendRoute({
    idPath: ["dashboard", "mailinglist", "send"],
    i18nKey: "mailinglist::navbar.quickActions.sendEmail",
    component: "SendEmailPage",
    name: "sendEmail",
    path: "send",
    permissions: {
      mailinglists: {
        send: true
      }
    }
  });
}
