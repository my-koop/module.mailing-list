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
        hash: "mailinglist",
        component: {
          resolve: "component",
          value: "MailingListUserInfo"
        },
        priority: 250,
        permissions: {
          user: {
            profile: {
              mailinglists: {
                  view: true
              }
            }
          }
        }
      }
    }
  }
};

export = contributions;
