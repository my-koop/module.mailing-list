// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
/// <reference path="./interfaces.d.ts" />
declare module mkmailinglist {

  export interface Module extends mykoop.IModule {
    addMailingList(
      params: MailingList.AddMailingList.Params,
      callback: MailingList.AddMailingList.Callback
    );
    __addMailingList(
      connection: mysql.IConnection,
      params: MailingList.AddMailingList.Params,
      callback: MailingList.AddMailingList.Callback
    );

    deleteMailingList(
      params: MailingList.DeleteMailingList.Params,
      callback: MailingList.DeleteMailingList.Callback
    );
    __deleteMailingList(
      connection: mysql.IConnection,
      params: MailingList.DeleteMailingList.Params,
      callback: MailingList.DeleteMailingList.Callback
    );

    getMailingLists(
      params: MailingList.GetMailingList.Params,
      callback: MailingList.GetMailingList.Callback
    );
    __getMailingLists(
      connection: mysql.IConnection,
      params: MailingList.GetMailingList.Params,
      callback: MailingList.GetMailingList.Callback
    );

    updateMailingList(
      params: MailingList.UpdateMailingList.Params,
      callback: MailingList.UpdateMailingList.Callback
    );
    __updateMailingList(
      connection: mysql.IConnection,
      params: MailingList.UpdateMailingList.Params,
      callback: MailingList.UpdateMailingList.Callback
    );

  }

}

