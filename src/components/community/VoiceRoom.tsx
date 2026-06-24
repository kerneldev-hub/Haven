import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Headphones, HeadphonesIcon, PhoneOff, Settings2 } from 'lucide-react';
import { Button } from '../ui/components';
import { getAblyClient } from '../../lib/ablyClient';

interface VoiceRoomProps {
  channelName: string;
  onDisconnect: () => void;
}

export function VoiceRoom({ channelName, onDisconnect }: VoiceRoomProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [micVolume, setMicVolume] = useState(80);
  const [speakerVolume, setSpeakerVolume] = useState(100);
  const [statusMessage, setStatusMessage] = useState('Initializing...');

  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnections = useRef<{ [peerId: string]: RTCPeerConnection }>({});
  const sessionIdRef = useRef<string | null>(null);
  const ablyChannelRef = useRef<any>(null);
  const myClientIdRef = useRef<string>('');

  useEffect(() => {
    let active = true;

    async function setupVoice() {
      // 1. Join voice session in SQLite database for auditing
      try {
        const joinRes = await fetch('/api/voice/sessions/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId: channelName })
        });
        const joinData = await joinRes.json();
        if (joinData.status === 'ok') {
          sessionIdRef.current = joinData.sessionId;
        }
      } catch (dbErr) {
        console.warn("DB voice session audit skipped:", dbErr);
      }

      // 2. Request user microphone access
      try {
        setStatusMessage('Connecting mic...');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;
        setStatusMessage('Voice Active');
      } catch (err) {
        console.warn("Microphone access denied or unavailable. Running in visual-mock mode.", err);
        setStatusMessage('Mic Unavail (Demo Mode)');
      }

      // 3. Setup Ably Signaling & WebRTC mesh
      try {
        const ably = getAblyClient();
        myClientIdRef.current = ably.auth.clientId || 'client_' + Math.random().toString(36).substr(2, 9);
        const signalingChannel = ably.channels.get(`voice:signaling:${channelName}`);
        ablyChannelRef.current = signalingChannel;

        // Subscribe to signaling messages
        await signalingChannel.subscribe('signal', async (message: any) => {
          if (!active) return;
          const { sender, target, type, sdp, candidate } = message.data;

          // Ignore messages sent by ourselves or targeted to someone else
          if (sender === myClientIdRef.current) return;
          if (target && target !== myClientIdRef.current) return;

          if (type === 'join' && !peerConnections.current[sender]) {
            // New peer joined, create PeerConnection and send Offer
            await initiatePeerConnection(sender, signalingChannel, true);
          } else if (type === 'offer') {
            await handleOffer(sender, sdp, signalingChannel);
          } else if (type === 'answer') {
            await handleAnswer(sender, sdp);
          } else if (type === 'candidate') {
            await handleCandidate(sender, candidate);
          }
        });

        // Publish join announcement
        signalingChannel.publish('signal', {
          sender: myClientIdRef.current,
          type: 'join'
        });

      } catch (ablyErr) {
        console.warn("Ably signaling unconfigured or offline. Voice running in solo demo mode.", ablyErr);
        setStatusMessage('Voice Solo Mode');
      }
    }

    setupVoice();

    return () => {
      active = false;
      cleanup();
    };
  }, [channelName]);

  // Handle Mute actions
  useEffect(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
    }
  }, [isMuted]);

  const initiatePeerConnection = async (peerId: string, channel: any, isInitiator: boolean) => {
    const pcConfig = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ]
    };

    const pc = new RTCPeerConnection(pcConfig);
    peerConnections.current[peerId] = pc;

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // ICE Candidate handler
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        channel.publish('signal', {
          sender: myClientIdRef.current,
          target: peerId,
          type: 'candidate',
          candidate: event.candidate
        });
      }
    };

    // Remote Track handler
    pc.ontrack = (event) => {
      const remoteAudio = document.createElement('audio');
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
      // Hook up remote audio elements inside the page
      document.body.appendChild(remoteAudio);
    };

    if (isInitiator) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      channel.publish('signal', {
        sender: myClientIdRef.current,
        target: peerId,
        type: 'offer',
        sdp: pc.localDescription
      });
    }
  };

  const handleOffer = async (peerId: string, sdp: RTCSessionDescriptionInit, channel: any) => {
    await initiatePeerConnection(peerId, channel, false);
    const pc = peerConnections.current[peerId];
    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    channel.publish('signal', {
      sender: myClientIdRef.current,
      target: peerId,
      type: 'answer',
      sdp: pc.localDescription
    });
  };

  const handleAnswer = async (peerId: string, sdp: RTCSessionDescriptionInit) => {
    const pc = peerConnections.current[peerId];
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    }
  };

  const handleCandidate = async (peerId: string, candidate: RTCIceCandidateInit) => {
    const pc = peerConnections.current[peerId];
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const cleanup = async () => {
    // Stop local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close RTCPeerConnections
    Object.keys(peerConnections.current).forEach(peerId => {
      peerConnections.current[peerId].close();
    });
    peerConnections.current = {};

    // Leave SQLite audit session
    if (sessionIdRef.current) {
      try {
        await fetch('/api/voice/sessions/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current })
        });
      } catch (dbErr) {
        console.warn("DB voice session leave auditing skipped:", dbErr);
      }
    }

    // Unsubscribe from Ably signaling
    if (ablyChannelRef.current) {
      try {
        ablyChannelRef.current.unsubscribe();
      } catch (e) {
        // ignore
      }
    }
  };

  const handleDisconnect = () => {
    cleanup();
    onDisconnect();
  };

  return (
    <div className="p-3 bg-card border-t border-border/50 transition-all flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-emerald-500 font-bold flex items-center">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1.5"></span> 
          {statusMessage}
        </span>
        <span className="text-muted-foreground truncate ml-2 font-medium">{channelName}</span>
      </div>

      <div className="flex gap-1 justify-center">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsMuted(!isMuted)} 
          className={isMuted ? 'text-destructive bg-destructive/10 cursor-pointer' : 'cursor-pointer'}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsDeafened(!isDeafened)} 
          className={isDeafened ? 'text-destructive bg-destructive/10 cursor-pointer' : 'cursor-pointer'}
          title={isDeafened ? "Undeafen" : "Deafen"}
        >
          {isDeafened ? <HeadphonesIcon className="w-4 h-4 text-destructive" /> : <Headphones className="w-4 h-4" />}
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setShowSettings(!showSettings)}
          className={showSettings ? 'bg-primary/10 text-primary cursor-pointer' : 'cursor-pointer'}
          title="Audio Settings"
        >
          <Settings2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="destructive" 
          size="icon" 
          onClick={handleDisconnect}
          title="Disconnect"
          className="cursor-pointer"
        >
          <PhoneOff className="w-4 h-4" />
        </Button>
      </div>

      {showSettings && (
        <div className="pt-2 border-t border-border/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
              <span>Input (Mic)</span>
              <span>{micVolume}%</span>
            </div>
            <input 
              type="range" 
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              min="0" max="100" 
              value={micVolume} 
              onChange={(e) => setMicVolume(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
              <span>Output (Speakers)</span>
              <span>{speakerVolume}%</span>
            </div>
            <input 
              type="range" 
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
              min="0" max="200" 
              value={speakerVolume} 
              onChange={(e) => setSpeakerVolume(parseInt(e.target.value))}
            />
          </div>
        </div>
      )}
    </div>
  );
}
