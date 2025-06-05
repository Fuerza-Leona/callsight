import { useEffect, useRef, useState } from 'react';
import api from '@/utils/api'; // your configured axios instance

export function useRealtimeSession() {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const [connected, setConnected] = useState(false);
  const [remoteAudioEl] = useState(() => new Audio());
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Set autoplay but also handle user interaction requirements
  remoteAudioEl.autoplay = true;

  async function initRealtime(
    mood: string,
    description: string,
    voice: string = 'verse'
  ) {
    try {
      const { data: session } = await api.post(
        '/chatbot/realtime/create-session',
        {
          mood,
          description,
          voice,
        }
      );

      const EPHEMERAL_KEY = session.client_secret;
      const model = session.model;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = async (e) => {
        console.log('Received remote audio track', e.streams[0]);
        const stream = e.streams[0];
        remoteAudioEl.srcObject = stream;

        // Wait a bit for the stream to be ready
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Ensure audio plays (handle autoplay restrictions)
        try {
          await remoteAudioEl.play();
          console.log('Audio element playing');
        } catch (err) {
          console.warn('Autoplay prevented, user interaction needed:', err);
          // Try to play on user interaction
          document.addEventListener(
            'click',
            async () => {
              try {
                await remoteAudioEl.play();
                console.log('Audio started after user interaction');
              } catch (e) {
                console.error('Still cannot play audio:', e);
              }
            },
            { once: true }
          );
        }

        // Create audio context and analyser - try both approaches
        try {
          // Create new audio context if needed
          if (
            !audioContextRef.current ||
            audioContextRef.current.state === 'closed'
          ) {
            audioContextRef.current = new AudioContext();
            console.log('Created new AudioContext');
          }

          const ctx = audioContextRef.current;
          console.log('AudioContext state:', ctx.state);

          // Resume context if suspended (required for some browsers)
          if (ctx.state === 'suspended') {
            await ctx.resume();
            console.log('AudioContext resumed');
          }

          // Try direct stream analysis first (better for WebRTC)
          let analyser: AnalyserNode;
          let source: MediaElementAudioSourceNode | MediaStreamAudioSourceNode;

          try {
            // Method 1: Direct stream analysis (preferred for WebRTC)
            source = ctx.createMediaStreamSource(stream);
            analyser = ctx.createAnalyser();
            console.log('Using MediaStreamSource (direct stream analysis)');
          } catch (streamErr) {
            console.warn(
              'MediaStreamSource failed, falling back to MediaElementSource:',
              streamErr
            );
            // Method 2: Through audio element
            source = ctx.createMediaElementSource(remoteAudioEl);
            analyser = ctx.createAnalyser();
            console.log('Using MediaElementSource (through audio element)');
          }

          // Configure analyser for better visualization
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.3; // Less smoothing for more responsive visualization
          analyser.minDecibels = -100;
          analyser.maxDecibels = -30;

          source.connect(analyser);

          // Only connect to destination if using MediaElementSource (avoid double audio)
          if (source instanceof MediaElementAudioSourceNode) {
            analyser.connect(ctx.destination);
          }

          analyserRef.current = analyser;
          console.log('Audio analyser setup complete');

          // Test if we're getting data
          const testData = new Uint8Array(analyser.frequencyBinCount);
          let testCount = 0;
          const testInterval = setInterval(() => {
            analyser.getByteFrequencyData(testData);
            const hasData = testData.some((v) => v > 0);
            const maxValue = Math.max(...testData);
            const avgValue =
              testData.reduce((a, b) => a + b, 0) / testData.length;

            testCount++;
            console.log(`Analyser test ${testCount}:`, {
              hasData: hasData ? true : false,
              maxValue,
              avgValue: avgValue.toFixed(1),
              sampleValues: Array.from(testData.slice(0, 10)),
            });

            if (hasData || testCount >= 15) {
              clearInterval(testInterval);
              if (hasData) {
                console.log('Audio visualization working!');
              } else {
                console.log('No audio data detected after 15 seconds');
              }
            }
          }, 1000);
        } catch (err) {
          console.error('Error setting up audio analyser:', err);
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onopen = () => console.log('[datachannel] open');
      dc.onerror = (e) => console.error('[datachannel] error', e);
      dc.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data);
          console.log('[AI event]', msg);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
          console.warn('[invalid AI message]', e.data);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdp = pc.localDescription?.sdp;
      if (!sdp) throw new Error('localDescription.sdp is null');

      const sdpRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            'Content-Type': 'application/sdp',
            'OpenAI-Beta': 'realtime=v1',
          },
          body: sdp,
        }
      );

      const answerSDP = await sdpRes.text();
      if (!sdpRes.ok || !answerSDP.startsWith('v=0')) {
        throw new Error(`Invalid SDP response:\n${answerSDP}`);
      }

      await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP });
      setConnected(true);
    } catch (err) {
      console.error('initRealtime failed:', err);
      setConnected(false);
    }
  }

  function stopSession() {
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    audioContextRef.current = null;
    analyserRef.current = null;

    // Stop all tracks
    pcRef.current?.getSenders().forEach((sender) => {
      try {
        sender.track?.stop();
      } catch {}
    });

    // Close connections
    pcRef.current?.close();
    dcRef.current?.close();
    pcRef.current = null;
    dcRef.current = null;

    // Stop audio element
    remoteAudioEl.pause();
    remoteAudioEl.srcObject = null;

    setConnected(false);
  }

  function sendTextInput(text: string) {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== 'open') {
      console.warn('Data channel not ready');
      return;
    }

    dc.send(
      JSON.stringify({
        type: 'conversation.item.create',
        message: {
          role: 'user',
          content: text,
        },
      })
    );
  }
  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    initRealtime,
    sendTextInput,
    stopSession,
    connected,
    audioEl: remoteAudioEl,
    analyserNode: analyserRef,
  };
}
