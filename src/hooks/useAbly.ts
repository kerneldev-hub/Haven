import { useState, useEffect, useCallback, useRef } from 'react';
import Ably from 'ably';

let ablyClient: Ably.Realtime | null = null;

function getAblyClient(): Ably.Realtime {
  if (!ablyClient) {
    ablyClient = new Ably.Realtime({
      authUrl: '/api/ably/auth',
      authMethod: 'POST',
    });
  }
  return ablyClient;
}

export function useAblyChannel(channelName: string) {
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<Ably.RealtimeChannel | null>(null);

  useEffect(() => {
    const client = getAblyClient();
    const channel = client.channels.get(channelName);
    channelRef.current = channel;

    const onConnected = () => setConnected(true);
    const onDisconnected = () => setConnected(false);

    client.connection.on('connected', onConnected);
    client.connection.on('disconnected', onDisconnected);
    client.connection.on('failed', onDisconnected);

    if (client.connection.state === 'connected') setConnected(true);

    return () => {
      client.connection.off('connected', onConnected);
      client.connection.off('disconnected', onDisconnected);
      client.connection.off('failed', onDisconnected);
      channel.detach();
    };
  }, [channelName]);

  const publish = useCallback((event: string, data: unknown) => {
    channelRef.current?.publish(event, data);
  }, []);

  const subscribe = useCallback((event: string, handler: (msg: Ably.Message) => void) => {
    channelRef.current?.subscribe(event, handler);
    return () => {
      channelRef.current?.unsubscribe(event, handler);
    };
  }, []);

  return { channel: channelRef.current, publish, subscribe, connected };
}
