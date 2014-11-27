function addRoutes(builder) {
    builder.addFrontendRoute({
        idPath: ["dashboard", "mailinglist"],
        component: "MailingListAdminPage",
        name: "editMailingList",
        path: "mailinglist"
    });
}
exports.addRoutes = addRoutes;
