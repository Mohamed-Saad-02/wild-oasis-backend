import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { UserProvider } from '@/users/entities/user.entity';

export type UserGoogleProfile = {
  name: string;
  email: string;
  avatar: string;
};

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;

    const user: RegisterDto = {
      email: emails[0].value,
      name: displayName,
      provider: UserProvider.GOOGLE,
      avatar: photos[0].value,
    };

    // لازم ترجع user
    done(null, user);
  }
}
