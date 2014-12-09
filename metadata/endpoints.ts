var endpoints = {
  mailinglist: {
    list: {
      path: "/mailinglists",
      method: "get",
    },
    listAvailable: {
      path: "/mailinglists/available",
      method: "get",
    },
    registration: {
      path: "/mailinglists/registration",
      method: "get",
    },
    add: {
      path: "/mailinglists",
      method: "post",
      validation: {
        resolve: "validation",
        value: "mailingListDefinition"
      }
    },
    update: {
      path: "/mailinglists/:id",
      method: "put",
      validation: {
        resolve: "validation",
        value: "mailingListDefinition"
      }
    },
    delete: {
      path: "/mailinglists/:id",
      method: "delete",
      validation: {
        resolve: "validation",
        value: "mailinglistId"
      }
    },
    send: {
      path: "/mailinglists/:id/send",
      method: "post"
    },
    config: {
      get: {
        path: "/mailinglists/config/all",
        method: "get"
      },
      set: {
        path: "/mailinglists/config/all",
        method: "put"
      }
    }
  },
  user: {
    mailinglist: {
      list: {
        path: "/users/:id/mailinglists",
        method: "get",
        validation: {
          resolve: "validation",
          value: "mailinglistId"
        }
      },
      register: {
        path: "/users/:id/mailinglists",
        method: "post"
      },
      unregister: {
        path: "/users/:id/mailinglists",
        method: "delete"
      }
    }
  }
}
export = endpoints;
