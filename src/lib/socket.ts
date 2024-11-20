// lib/socket.ts
import { io, Socket } from 'socket.io-client';

interface ServerToClientEvents {
  crowd_update: (data: {
    count: number;
    status: 'sepi' | 'sedang' | 'padat';
    timestamp: string;
  }) => void;
  connect_error: (error: Error) => void;
  disconnect: (reason: string) => void;
}

interface ClientToServerEvents {
  frame: (imageData: string) => void;
}

// Singleton instance untuk socket connection
class SocketClient {
  private static instance: Socket<ServerToClientEvents, ClientToServerEvents>;

  public static getInstance(): Socket<ServerToClientEvents, ClientToServerEvents> {
    if (!SocketClient.instance) {
      SocketClient.instance = io(import.meta.env.VITE_APP_SOCKET_URL, {
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ['websocket'],
      });

      // Setup listeners untuk debugging
      SocketClient.instance.on('connect', () => {
        console.log('Socket Connected');
      });

      SocketClient.instance.on('disconnect', (reason) => {
        console.log('Socket Disconnected:', reason);
      });

      SocketClient.instance.on('connect_error', (error) => {
        console.error('Socket Connection Error:', error);
      });
    }

    return SocketClient.instance;
  }

  // Method untuk disconnect socket
  public static disconnect(): void {
    if (SocketClient.instance) {
      SocketClient.instance.disconnect();
    }
  }

  // Method untuk reconnect socket
  public static reconnect(): void {
    if (SocketClient.instance) {
      SocketClient.instance.connect();
    }
  }

  // Method untuk cek status koneksi
  public static isConnected(): boolean {
    return SocketClient.instance?.connected || false;
  }
}

// Export singleton instance
export const socket = SocketClient.getInstance();

// Export type untuk digunakan di komponen
export type { ServerToClientEvents, ClientToServerEvents };