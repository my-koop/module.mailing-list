var endpoints = {
    mailinglist: {
        list: {
            path: "/mailinglist",
            method: "get",
        },
        add: {
            path: "/mailinglist",
            method: "post",
            validation: {
                resolve: "validation",
                value: "mailingListDefinition"
            }
        },
        update: {
            path: "/mailinglist/:id",
            method: "put",
            validation: {
                resolve: "validation",
                value: "mailingListDefinition"
            }
        },
        delete: {
            path: "/mailinglist/:id",
            method: "delete"
        },
        register: {
            path: "/mailinglist/:id/register",
            method: "post"
        }
    }
};
module.exports = endpoints;
