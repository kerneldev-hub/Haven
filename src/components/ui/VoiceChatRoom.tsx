import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, Volume2 } from 'lucide-react';
import { useAblyChannel } from '../../hooks/useAbly';
import { useAuth } from '../../hooks/useAuth';

interface Participant {
  userId: string;
  username: string;
  displayName: string | null;
  hasMic: boolean;
  hasVideo: boolean;
  stream?: MediaStream;
  peerId?: string;
}

interface Props {
  roomId: string;
  roomName?: string;
}

export function VoiceChatRoom({ roomId, roomName = 'Voice Room' }: Props) {
  const { user } = useAuth();
  const [inRoom, setInRoom] = useState(false);
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const peerConnections = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());

  const { subscribe, publish, connected } = useAblyChannel(`voice:${roomId}`);

  const createPeerConnection = useCallback((targetUserId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        publish('ice-candidate', {
          from: user?.id,
          to: targetUserId,
          candidate: e.candidate,
        });
      }
    };

    pc.ontrack = (e) => {
      const stream = e.streams[0];
      remoteStreamsRef.current.set(targetUserId, stream);
      setParticipants(prev => {
        const next = new Map(prev);
        const p = next.get(targetUserId);
        if (p) next.set(targetUserId, { ...p as any, stream });
        return next;
      });
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        peerConnections.current.delete(targetUserId);
      }
    };

    peerConnections.current.set(targetUserId, pc);
    return pc;
  }, [user?.id, publish]);

  // Handle signaling messages via Ably
  useEffect(() => {
    if (!inRoom || !user) return;

    const unsub1 = subscribe('user-joined', (msg) => {
      const { userId, username, displayName, hasMic, hasVideo } = msg.data;
      if (userId === user.id) return;
      setParticipants(prev => new Map(prev).set(userId, { userId, username, displayName, hasMic, hasVideo }));
      initiateOffer(userId);
    });

    const unsub2 = subscribe('user-left', (msg) => {
      const { userId } = msg.data;
      peerConnections.current.get(userId)?.close();
      peerConnections.current.delete(userId);
      setParticipants(prev => { const next = new Map(prev); next.delete(userId); return next; });
    });

    const unsub3 = subscribe('offer', async (msg) => {
      const { from, offer } = msg.data;
      if (from === user.id || msg.data.to !== user.id) return;
      const pc = createPeerConnection(from);
      if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      publish('answer', { from: user.id, to: from, answer });
    });

    const unsub4 = subscribe('answer', async (msg) => {
      const { from, answer } = msg.data;
      if (msg.data.to !== user.id) return;
      const pc = peerConnections.current.get(from);
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    const unsub5 = subscribe('ice-candidate', async (msg) => {
      const { from, candidate } = msg.data;
      if (msg.data.to !== user.id) return;
      const pc = peerConnections.current.get(from);
      if (pc) await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
    });

    const unsub6 = subscribe('participant-update', (msg) => {
      const { userId, hasMic, hasVideo } = msg.data;
      setParticipants(prev => {
        const next = new Map(prev);
        const p = next.get(userId);
        if (p) next.set(userId, { ...p as any, hasMic, hasVideo });
        return next;
      });
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
      unsub5();
      unsub6();
    };
  }, [inRoom, user, subscribe, publish, createPeerConnection, localStream]);

  const initiateOffer = useCallback(async (targetUserId: string) => {
    const pc = createPeerConnection(targetUserId);
    if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    publish('offer', { from: user?.id, to: targetUserId, offer });
  }, [createPeerConnection, localStream, publish, user?.id]);

  const joinRoom = async () => {
    setConnectionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: videoEnabled,
      });
      setLocalStream(stream);
      if (localVideoRef.current && videoEnabled) {
        localVideoRef.current.srcObject = stream;
      }
      setInRoom(true);
      publish('user-joined', {
        userId: user?.id,
        username: user?.username,
        displayName: user?.displayName,
        hasMic: micEnabled,
        hasVideo: videoEnabled,
      });
    } catch (err: any) {
      setConnectionError(err.message || 'Could not access microphone. Check browser permissions.');
    }
  };

  const leaveRoom = () => {
    localStream?.getTracks().forEach(t => t.stop());
    peerConnections.current.forEach(pc => pc.close());
    peerConnections.current.clear();
    publish('user-left', { userId: user?.id });
    setLocalStream(null);
    setParticipants(new Map());
    setInRoom(false);
  };

  const toggleMic = () => {
    if (!localStream) return;
    const enabled = !micEnabled;
    localStream.getAudioTracks().forEach(t => { t.enabled = enabled; });
    setMicEnabled(enabled);
    publish('participant-update', { userId: user?.id, hasMic: enabled, hasVideo: videoEnabled });
  };

  const toggleVideo = async () => {
    if (!localStream) return;
    const enabled = !videoEnabled;
    if (enabled) {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoTrack = videoStream.getVideoTracks()[0];
        localStream.addTrack(videoTrack);
        if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
        peerConnections.current.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === 'video');
          if (sender) sender.replaceTrack(videoTrack);
          else pc.addTrack(videoTrack, localStream);
        });
      } catch { return; }
    } else {
      localStream.getVideoTracks().forEach(t => { t.stop(); localStream.removeTrack(t); });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
    }
    setVideoEnabled(enabled);
    publish('participant-update', { userId: user?.id, hasMic: micEnabled, hasVideo: enabled });
  };

  const totalCount = participants.size + (inRoom ? 1 : 0);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-sm">{roomName}</span>
          {inRoom && (
            <span className="flex items-center gap-1 text-xs text-emerald-500 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          {totalCount}
        </div>
      </div>

      {/* Participants grid */}
      <div className="p-4 min-h-[200px]">
        {!inRoom ? (
          <div className="flex flex-col items-center justify-center h-40 gap-4">
            <p className="text-sm text-muted-foreground">Join to see who's here</p>
            {connectionError && (
              <p className="text-xs text-destructive text-center max-w-xs">{connectionError}</p>
            )}
            {!user ? (
              <p className="text-xs text-muted-foreground">Sign in to join voice</p>
            ) : (
              <button
                onClick={joinRoom}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Join Voice
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Self */}
            <div className="relative aspect-video bg-muted/40 rounded-xl overflow-hidden flex items-center justify-center">
              {videoEnabled ? (
                <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                  {user?.displayName?.[0] || user?.username?.[0] || '?'}
                </div>
              )}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur px-2 py-1 rounded-lg">
                {micEnabled ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-destructive" />}
                <span className="text-[10px] font-semibold">{user?.displayName || user?.username} (You)</span>
              </div>
            </div>

            {/* Remote participants */}
            {Array.from(participants.values()).map((p: any) => (
              <div key={p.userId} className="relative aspect-video bg-muted/40 rounded-xl overflow-hidden flex items-center justify-center">
                {p.stream && p.hasVideo ? (
                  <video
                    autoPlay playsInline
                    className="w-full h-full object-cover"
                    ref={el => { if (el && p.stream) el.srcObject = p.stream; }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
                    {(p.displayName || p.username)[0].toUpperCase()}
                  </div>
                )}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur px-2 py-1 rounded-lg">
                  {p.hasMic ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3 text-destructive" />}
                  <span className="text-[10px] font-semibold">{p.displayName || p.username}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      {inRoom && (
        <div className="px-5 py-4 border-t border-border flex items-center justify-center gap-3">
          <button
            onClick={toggleMic}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${micEnabled ? 'bg-muted hover:bg-muted/80' : 'bg-destructive text-white hover:bg-destructive/90'}`}
            title={micEnabled ? 'Mute' : 'Unmute'}
          >
            {micEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleVideo}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${videoEnabled ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'}`}
            title={videoEnabled ? 'Stop video' : 'Start video'}
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          <button
            onClick={leaveRoom}
            className="w-12 h-12 rounded-xl bg-destructive text-white flex items-center justify-center hover:bg-destructive/90 transition-colors"
            title="Leave room"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
