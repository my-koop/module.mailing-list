var contributions = {
    user: {
        registerForm: {
            mailingList: {
                titleKey: "mailinglist::mailingLists",
                component: {
                    resolve: "component",
                    value: "RegisterMailingList"
                },
                priority: 100
            }
        },
        myAccount: {
            mailingList: {
                titleKey: "mailinglist::mailingListTab",
                hash: "mailinglists",
                component: {
                    resolve: "component",
                    value: "MailingListUserInfo"
                },
                priority: 300
            }
        },
        profileEdit: {
            mailingList: {
                titleKey: "mailinglist::mailingListTab",
                hash: "mailinglists",
                component: {
                    resolve: "component",
                    value: "MailingListUserInfo"
                },
                priority: 250,
                permissions: {
                    mailinglists: {
                        users: {
                            view: true
                        }
                    }
                }
            }
        }
    }
};
module.exports = contributions;
