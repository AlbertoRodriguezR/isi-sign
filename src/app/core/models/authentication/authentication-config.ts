interface AuthenticationObjectInterface {
    authentication: {
        'url': string
        'logout': string,
    }
}

export interface AuthenticationConfigInterface {
    url: string,
    authentication: AuthenticationObjectInterface
}

export class AuthenticationConfig {
    private _url: string
    private _authentication: AuthenticationObjectInterface

    constructor(url: string, authentication: AuthenticationObjectInterface){
        this._url = url
        this._authentication = authentication
    }

    get url(): string{
        return this._url
    }

    get authentication(): any{
        return this._authentication
    }

    get authenticationConfig(): AuthenticationConfigInterface{
        const authenticationConfigObject = {
            url: this._url,
            authentication: this._authentication
        }

        return authenticationConfigObject as AuthenticationConfigInterface
    }
}
