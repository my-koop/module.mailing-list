var endpoints = {
  mailinglist: {
    add: {
      path: "/mailinglist",
      method: "post",
      validation: {
        resolve: "validation",
        value: "addMailingList"
      }
    }
  }
}
export = endpoints;
