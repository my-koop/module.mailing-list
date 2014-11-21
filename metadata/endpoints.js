var endpoints = {
    mailinglist: {
        list: {
            path: "/mailinglists",
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
};
module.exports = endpoints;
