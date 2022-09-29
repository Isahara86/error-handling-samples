import { BlazeConsumerUserDto } from './blaze-consumer-user.dto';

export interface BlazeConsumerAuthResultDto {
  accessToken: string;
  assetAccessToken: string;
  expirationTime: number;
  loginTime: number;
  sessionId: string;
  user: BlazeConsumerUserDto;
}
