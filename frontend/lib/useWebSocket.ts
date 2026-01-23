'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
}

export function useWebSocket(roomId: string | null, options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnect = true,
    reconnectInterval = 3000,
  } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    if (!roomId || typeof window === 'undefined') return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      // Connect to WebSocket
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const protocol = apiUrl.startsWith('https://') ? 'wss:' : 'ws:';
      // Remove http:// or https:// prefix and construct WebSocket URL
      const host = apiUrl.replace(/^https?:\/\//, '');
      const wsUrl = `${protocol}//${host}/ws/${roomId}`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        onOpen?.();
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', { 
          code: event.code, 
          reason: event.reason || 'No reason provided',
          wasClean: event.wasClean 
        });
        setIsConnected(false);
        wsRef.current = null;
        onClose?.();

        // Attempt to reconnect only for abnormal closures
        if (reconnect && shouldReconnect.current && !event.wasClean) {
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        // WebSocket errors don't provide detailed information in browsers
        // Only log if we're not connected (actual connection error)
        if (!isConnected) {
          console.warn('WebSocket connection error - will retry if reconnect is enabled');
        }
        onError?.(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [roomId, onMessage, onOpen, onClose, onError, reconnect, reconnectInterval]);

  // Connect on mount and when roomId changes
  useEffect(() => {
    if (roomId) {
      shouldReconnect.current = true;
      connect();
    }

    // Cleanup on unmount
    return () => {
      shouldReconnect.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [roomId, connect]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  return {
    isConnected,
    sendMessage,
  };
}
