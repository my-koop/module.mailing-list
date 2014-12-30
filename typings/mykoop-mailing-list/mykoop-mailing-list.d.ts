// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
/// <reference path="./interfaces.d.ts" />
declare module mkmailinglist {

  export interface Module extends mykoop.IModule {
    deserializePermissions: (permissions: string) => any;
    serializePermissions: (permissions: any) => string;
    addMailingList(
      params: mkmailinglist.AddMailingList.Params,
      callback: mkmailinglist.AddMailingList.Callback
    );
    __addMailingList(
      connection: mysql.IConnection,
      params: mkmailinglist.AddMailingList.Params,
      callback: mkmailinglist.AddMailingList.Callback
    );

    deleteMailingList(
      params: mkmailinglist.DeleteMailingList.Params,
      callback: mkmailinglist.DeleteMailingList.Callback
    );
    __deleteMailingList(
      connection: mysql.IConnection,
      params: mkmailinglist.DeleteMailingList.Params,
      callback: mkmailinglist.DeleteMailingList.Callback
    );

    getMailingLists(
      params: mkmailinglist.GetMailingLists.Params,
      callback: mkmailinglist.GetMailingLists.Callback
    );
    __getMailingLists(
      connection: mysql.IConnection,
      params: mkmailinglist.GetMailingLists.Params,
      callback: mkmailinglist.GetMailingLists.Callback
    );

    // Get mailing list the user is registered to
    getUserMailingLists (
      params: mkmailinglist.GetUserMailingLists.Params,
      callback: mkmailinglist.GetUserMailingLists.Callback
    );
    __getUserMailingLists (
      connection: mysql.IConnection,
      params: mkmailinglist.GetUserMailingLists.Params,
      callback: mkmailinglist.GetUserMailingLists.Callback
    );

    // Get users registered to the mailing list
    getMailingListUsers(
      params: mkmailinglist.GetMailingListUsers.Params,
      callback: mkmailinglist.GetMailingListUsers.Callback
    );
    __getMailingListUsers(
      connection: mysql.IConnection,
      params: mkmailinglist.GetMailingListUsers.Params,
      callback: mkmailinglist.GetMailingListUsers.Callback
    );

    updateMailingList(
      params: mkmailinglist.UpdateMailingList.Params,
      callback: mkmailinglist.UpdateMailingList.Callback
    );
    __updateMailingList(
      connection: mysql.IConnection,
      params: mkmailinglist.UpdateMailingList.Params,
      callback: mkmailinglist.UpdateMailingList.Callback
    );

    registerToMailingLists(
      params: mkmailinglist.RegisterToMailingLists.Params,
      callback: mkmailinglist.RegisterToMailingLists.Callback
    );
    __registerToMailingLists(
      connection: mysql.IConnection,
      params: mkmailinglist.RegisterToMailingLists.Params,
      callback: mkmailinglist.RegisterToMailingLists.Callback
    );

    unregisterToMailingLists(
      params: mkmailinglist.UnregisterToMailingLists.Params,
      callback: mkmailinglist.UnregisterToMailingLists.Callback
    );
    __unregisterToMailingLists(
      connection: mysql.IConnection,
      params: mkmailinglist.UnregisterToMailingLists.Params,
      callback: mkmailinglist.UnregisterToMailingLists.Callback
    );

    sendEmail(
      params: mkmailinglist.SendEmail.Params,
      callback: mkmailinglist.SendEmail.Callback
    );
    __sendEmail(
      connection: mysql.IConnection,
      params: mkmailinglist.SendEmail.Params,
      callback: mkmailinglist.SendEmail.Callback
    );
  }

}

