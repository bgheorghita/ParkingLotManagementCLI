import { Token } from "../services/auth.service";

export class User {
      constructor(
    private _username: string, 
    private _userType: string,
    private _roles: [],
    private _token: string,
    private _tokenExpirationDateInMillis: string,
    private _isValidatedAccount: boolean){}
    

    get username(){
      return this._username;
    }

    get userType(){
        return this._userType;
    }

    get roles(){
      return this._roles;
    }

    get token(){
        if(!this._tokenExpirationDateInMillis || new Date().getMilliseconds() > Number(this._tokenExpirationDateInMillis)){
            return null;
        }
        return this._token;
    }

    get tokenExpirationDateInMillis(){
        return this._tokenExpirationDateInMillis;
    }

    get isValidatedAccount(){
      return this._isValidatedAccount;
    }
}