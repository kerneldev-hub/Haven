import * as Ably from 'ably';

let ablyClient: Ably.Realtime | null = null;

export function getAblyClient(): Ably.Realtime {
  if (ablyClient) return ablyClient;

  // We connect to our Express back-end proxy token endpoint
  ablyClient = new Ably.Realtime({
    authUrl: '/api/ably/token',
    autoConnect: true,
  });

  return ablyClient;
}
