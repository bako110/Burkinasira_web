import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Room,
  RoomEvent,
  Track,
  createLocalTracks,
  type RemoteParticipant,
  type RemoteTrack,
  type RemoteTrackPublication,
} from 'livekit-client';
import { Mic, MicOff, Video, VideoOff, Send, Users } from 'lucide-react';

import { Spinner } from '../../../shared/ui';
import { useAuthStore } from '../../../store/auth.store';
import type { LiveToken } from '../types';
import styles from './LiveRoom.module.css';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
}

interface LiveRoomProps {
  liveToken: LiveToken;
  isHost: boolean;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function LiveRoom({ liveToken, isHost }: LiveRoomProps) {
  const { t } = useTranslation();
  const userId = useAuthStore((s) => s.user?.id);
  const userName = useAuthStore((s) => s.user?.full_name) ?? t('common.appName');

  const roomRef = useRef<Room | null>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    let cancelled = false;
    const room = new Room({ adaptiveStream: true, dynacast: true });
    roomRef.current = room;

    function attachTrack(track: RemoteTrack | Track) {
      if (track.kind !== Track.Kind.Video && track.kind !== Track.Kind.Audio) return;
      const el = track.attach();
      if (track.kind === Track.Kind.Video && videoContainerRef.current) {
        videoContainerRef.current.innerHTML = '';
        el.classList.add(styles.video);
        videoContainerRef.current.appendChild(el);
      } else if (track.kind === Track.Kind.Audio) {
        document.body.appendChild(el);
        el.style.display = 'none';
      }
    }

    function updateViewerCount() {
      setViewerCount(room.numParticipants);
    }

    room
      .on(RoomEvent.Connected, () => {
        if (cancelled) return;
        setConnectionState('connected');
        updateViewerCount();
      })
      .on(RoomEvent.Disconnected, () => {
        if (cancelled) return;
        setConnectionState('disconnected');
      })
      .on(RoomEvent.ParticipantConnected, updateViewerCount)
      .on(RoomEvent.ParticipantDisconnected, updateViewerCount)
      .on(RoomEvent.TrackSubscribed, (track: RemoteTrack, _pub: RemoteTrackPublication, _participant: RemoteParticipant) => {
        attachTrack(track);
      })
      .on(RoomEvent.DataReceived, (payload: Uint8Array, participant) => {
        try {
          const parsed = JSON.parse(decoder.decode(payload)) as { text: string; senderName: string };
          setMessages((prev) => [
            ...prev,
            {
              id: `${Date.now()}-${Math.random()}`,
              senderId: participant?.identity ?? 'unknown',
              senderName: parsed.senderName,
              text: parsed.text,
            },
          ]);
        } catch {
          // message malformé, ignoré
        }
      });

    room
      .connect(liveToken.url, liveToken.token)
      .then(async () => {
        if (cancelled) return;
        if (isHost) {
          const tracks = await createLocalTracks({ audio: true, video: true });
          for (const track of tracks) {
            await room.localParticipant.publishTrack(track);
            if (track.kind === Track.Kind.Video) attachTrack(track);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setConnectionState('disconnected');
      });

    return () => {
      cancelled = true;
      room.disconnect();
      roomRef.current = null;
    };
  }, [liveToken.url, liveToken.token, isHost]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  function toggleMic() {
    const room = roomRef.current;
    if (!room) return;
    const next = !micEnabled;
    room.localParticipant.setMicrophoneEnabled(next);
    setMicEnabled(next);
  }

  function toggleCam() {
    const room = roomRef.current;
    if (!room) return;
    const next = !camEnabled;
    room.localParticipant.setCameraEnabled(next);
    setCamEnabled(next);
  }

  function handleSendMessage(e: FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    const room = roomRef.current;
    if (!text || !room) return;
    const payload = encoder.encode(JSON.stringify({ text, senderName: userName }));
    room.localParticipant.publishData(payload, { reliable: true });
    setMessages((prev) => [...prev, { id: `${Date.now()}-me`, senderId: userId ?? 'me', senderName: userName, text }]);
    setDraft('');
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <div ref={videoContainerRef} className={styles.videoContainer}>
          {connectionState === 'connecting' && (
            <div className={styles.overlay}>
              <Spinner size={28} />
              <span>{t('community.liveConnecting')}</span>
            </div>
          )}
          {connectionState === 'disconnected' && (
            <div className={styles.overlay}>
              <span>{t('community.liveDisconnected')}</span>
            </div>
          )}
        </div>

        <div className={styles.viewerBadge}>
          <Users size={13} strokeWidth={2} />
          {viewerCount}
        </div>

        {isHost && connectionState === 'connected' && (
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={toggleMic}
              aria-label={micEnabled ? t('community.liveMuteMic') : t('community.liveUnmuteMic')}
            >
              {micEnabled ? <Mic size={18} strokeWidth={2} /> : <MicOff size={18} strokeWidth={2} />}
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={toggleCam}
              aria-label={camEnabled ? t('community.liveDisableCam') : t('community.liveEnableCam')}
            >
              {camEnabled ? <Video size={18} strokeWidth={2} /> : <VideoOff size={18} strokeWidth={2} />}
            </button>
          </div>
        )}
      </div>

      <div className={styles.chat}>
        <div className={styles.chatMessages}>
          {messages.length === 0 && <p className={styles.chatEmpty}>{t('community.liveChatEmpty')}</p>}
          {messages.map((m) => (
            <div key={m.id} className={styles.chatMessage}>
              <span className={styles.chatSender}>{m.senderName}</span>
              <span className={styles.chatText}>{m.text}</span>
            </div>
          ))}
          <div ref={chatBottomRef} />
        </div>
        <form onSubmit={handleSendMessage} className={styles.chatForm}>
          <input
            type="text"
            className={styles.chatInput}
            placeholder={t('community.liveChatPlaceholder')}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={connectionState !== 'connected'}
          />
          <button type="submit" className={styles.chatSendBtn} disabled={!draft.trim() || connectionState !== 'connected'}>
            <Send size={16} strokeWidth={2} />
          </button>
        </form>
      </div>
    </div>
  );
}
