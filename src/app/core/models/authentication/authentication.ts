export interface AuthenticationInterface {
    username: string,
    password: string
}

export class Authentication implements AuthenticationInterface{
    private _auth: AuthenticationInterface

    constructor(){
        this._auth = {
            username: '',
            password: ''
        }
    }

    setAuthObject(authObject: AuthenticationInterface){
        this._auth = authObject
    }

    getAuthenticationRequestData(): string {
        const body = new URLSearchParams()
        body.set('j_username', this._auth.username)
        body.set('j_password', this._auth.password)

        return body.toString()
    }

    // getContentType(authenticationType: string):string{
    //     switch(authenticationType.toUpperCase()){
    //         case 'BASIC':
    //             return 'application/json'
    //         case 'SSI-OE':
    //             return 'application/x-www-form-urlencoded'
    //         default:
    //             return 'application/json'
    //     }
    // }

    get username(): string{
        return this._auth.username
    }

    get password(): string{
        return this._auth.password
    }
}