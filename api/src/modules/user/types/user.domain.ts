import { User } from '../../../../prisma/generated/client';

export type UserDomain = Omit<User, 'ivAccessTokenDiscord' | 'ivRefreshTokenDiscord'>;
