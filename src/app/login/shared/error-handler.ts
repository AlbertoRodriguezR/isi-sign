import { LoginErrorTypes } from "@core/index"

export function loginErrorHandler(errorCode: number): string{
    switch(errorCode){
        case LoginErrorTypes.LOGIN_UNAUTHORIZED:
            return 'login.error.unauthorized'
        case LoginErrorTypes.LOGIN_FORBIDDEN:
            return 'auth.error.forbidden'
        case LoginErrorTypes.LOGIN_NOT_FOUND:
            return 'login.error.not.found'
        case LoginErrorTypes.LOGIN_UNKNOWN:
            return 'login.error.unknown'
        case LoginErrorTypes.LOGIN_SESSION_NOT_FOUND:
            return 'login.error.session.not.found'
        case LoginErrorTypes.LOGIN_SESSION_UNKNOWN:
            return 'login.error.session.unknown'    
        case LoginErrorTypes.PROFILE_IMAGE_NOT_FOUND:
            return 'login.profile.image.error.not.found'
        case LoginErrorTypes.PROFILE_IMAGE_UNKNOWN:
            return 'login.profile.image.error.unknown'    
        default:
            return 'login.error.unknown'
    }
}