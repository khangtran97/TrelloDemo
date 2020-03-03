import {
    SocialLoginModule,
    AuthServiceConfig,
    GoogleLoginProvider
} from 'angularx-social-login';

export function getAuthServiceConfigs() {
    const config = new AuthServiceConfig([
        {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('735185930723-u0pr17fmtufja486a2naf6o83mi6gspd.apps.googleusercontent.com')
        }
    ]);

    return config;
}
