export interface UserModel {
    readonly email: string;
    readonly password?: string;
    readonly uid: string;
    readonly displayName: string;
    readonly photoURL: string;

  }