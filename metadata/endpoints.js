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
        },
        register: {
            path: "/mailinglists/:id/register",
            method: "post",
            validation: {
                resolve: "validation",
                value: "mailinglistIdPlusUserId"
            }
        }
    },
    user: {
        mailinglist: {
            path: "/users/:id/mailinglists",
            method: "get",
            validation: {
                resolve: "validation",
                value: "mailinglistId"
            }
        }
    }
};
module.exports = endpoints;
