function addRoutes(builder) {
    builder.addFrontendRoute({
        idPath: ["dashboard", "mailinglist"],
        path: "mailinglist"
    });
    builder.addFrontendRoute({
        idPath: ["dashboard", "mailinglist", "edit"],
        component: "MailingListAdminPage",
        name: "editMailingList",
        path: "edit"
    });
    builder.addFrontendRoute({
        idPath: ["dashboard", "mailinglist", "send"],
        component: "SendEmailPage",
        name: "sendEmail",
        path: "send"
    });
}
exports.addRoutes = addRoutes;
