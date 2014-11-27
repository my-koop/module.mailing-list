import utils = require("mykoop-utils");
export function addRoutes(builder: utils.MetaDataBuilder) {
  builder.addFrontendRoute({
    idPath: ["dashboard", "mailinglist"],
    component: "MailingListAdminPage",
    name: "editMailingList",
    path: "mailinglist"
  });
}
