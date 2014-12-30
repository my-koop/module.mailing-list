var uiHooks = {
    navbar_main_dashboard: {
        quickactions: {
            content: {
                children: {
                    sendEmail: {
                        type: "item",
                        content: {
                            icon: "envelope",
                            text: "mailinglist::navbar.quickActions.sendEmail",
                            link: "sendEmail"
                        },
                        priority: 200,
                        permissions: {
                            mailinglists: {
                                send: true
                            }
                        }
                    },
                },
            }
        }
    },
    sidebar: {
        mailinglists: {
            type: "item",
            content: {
                icon: "envelope",
                text: "mailinglist::sidebar.mailinglists",
                children: {
                    sendEmail: {
                        type: "item",
                        content: {
                            icon: "pencil-square-o",
                            text: "mailinglist::sidebar.sendEmail",
                            link: "sendEmail"
                        },
                        priority: 100,
                        permissions: {
                            mailinglists: {
                                send: true
                            }
                        }
                    },
                    manageLists: {
                        type: "item",
                        content: {
                            icon: "list-ul",
                            text: "mailinglist::sidebar.manageLists",
                            link: "editMailingList"
                        },
                        permissions: {
                            mailinglists: {
                                read: true
                            }
                        },
                        priority: 150
                    }
                }
            },
            priority: 300,
            permissions: {
                mailinglists: {}
            }
        }
    }
};
module.exports = uiHooks;
