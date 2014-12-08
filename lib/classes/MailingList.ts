class MailingList implements MailingList.MailingList {
  static queryMailingListInfo = "SELECT\
    idMailingList AS id,\
    name,\
    description,\
    showAtRegistration,\
    permissions \
  FROM mailinglist ";

  id: number
  name: string;
  description: string;
  permissions: any;
  showAtRegistration: boolean;
  constructor(dbResult: any, module: mkmailinglist.Module) {
    this.id = dbResult.id;
    this.name = dbResult.name;
    this.description = dbResult.description;
    this.permissions = module.deserializePermissions(dbResult.permissions);
    this.showAtRegistration = dbResult.showAtRegistration;
  }
}

export = MailingList;
