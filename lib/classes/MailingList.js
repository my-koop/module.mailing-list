var MailingList = (function () {
    function MailingList(dbResult, module) {
        this.id = dbResult.id;
        this.name = dbResult.name;
        this.description = dbResult.description;
        this.permissions = module.deserializePermissions(dbResult.permissions);
        this.showAtRegistration = dbResult.showAtRegistration;
    }
    MailingList.queryMailingListInfo = "SELECT\
    idMailingList AS id,\
    name,\
    description,\
    showAtRegistration,\
    permissions \
  FROM mailinglist ";
    return MailingList;
})();
module.exports = MailingList;
