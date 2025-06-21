import { loginBotDiscord } from '../../integrations/discord/discord-client.gateway';
import { initYoutubeTest } from './youtube';

export async function initConfigDiscord() {
  await loginBotDiscord();
  initYoutubeTest();
}
