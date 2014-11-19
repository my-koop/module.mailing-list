
declare module MailingList {

  module AddMailingList {
    export interface Params {
      name: string;
      description?: string;
      permissions?: any; // no support for now
    }
    export interface Callback {
      (err?) : void;
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
    }
    export interface Callback {
      (err?, result?: {
        id: number;
        name: string;
        description: string;
      }[]) : void;
    }
  }

  module UpdateMailingList {
    export interface Params {
      id: number;
      name: string;
      description?: string;
      permissions?: any; // no support for now
    }
    export interface Callback {
      (err?) : void;
    }
  }
}
