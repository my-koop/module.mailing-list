
declare module mkmailinglist {

  export interface MailingList {
    id?: number
    name: string;
    description: string;
    permissions: any;
    showAtRegistration: boolean;
  }

  module AddMailingList {
    export interface Params extends MailingList {}
    export interface Callback {
      (err?, result?: {id: number}) : void;
    }
  }

  module DeleteMailingList {
    export interface Params {
      id: number;
    }
    export interface Callback {
      (err?) : void;
    }
  }

  module GetMailingList {
    export interface Params {
      id: number;
    }
    export interface Callback {
      (err?, result?: MailingList) : void;
    }
  }

  module GetMailingLists {
    export interface Params {
      inRegistration?: boolean;
      requesterPermissions?: any;
      userId?: number;
    }
    export interface Callback {
      (err?, result?: MailingList[]) : void;
    }
  }

  module UpdateMailingList {
    export interface Params extends MailingList {}
    export interface Callback {
      (err?) : void;
    }
  }

  module RegisterToMailingLists {
    export interface Params {
      idUser: number;
      idMailingLists: number[];
    }
    export interface Callback {
      (err?) : void;
    }
  }

  module UnregisterToMailingLists {
    export interface Params {
      idUser: number;
      idMailingLists: number[];
    }
    export interface Callback {
      (err?) : void;
    }
  }

  module GetUserMailingLists {
    export interface Params {
      id: number;
    }
    export interface Callback {
      (err?, result?: {id: number;}[]) : void;
    }
  }

  module SendEmail {
    export interface Params {
      id: number; //mailing list id
      content: string;
      subject: string;
    }
    export interface Callback {
      (err?: Error): void;
    }
  }

  module GetMailingListUsers {
    export interface Params {
      // mailing list id
      id: number;
    }
    export interface Result {
      users: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        permissions: any;
      }[];
    }
    export interface Callback {
      (err: Error, result?: Result): void;
    }
  }
}
