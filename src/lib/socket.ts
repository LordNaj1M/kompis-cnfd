// lib/socket.ts
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  "io-crowd-result": (result: CrowdResult) => void;
  "io-fatigue-result": (result: FatigueResult) => void;
  connect_error: (error: Error) => void;
  disconnect: (reason: string) => void;
}

interface ClientToServerEvents {
  // connected: (areaId: string) => void;
  "io-crowd-frame": (
    imageData: string,
    capacity: number,
    area_id: string
  ) => void;
  "io-fatigue-frame": (imageData: string, user_id: string) => void;
}

interface CrowdResult {
  detection_data: Detection_Data[];
  status: "";
  count: number;
  createdAt: string;
}

interface Detection_Data {
  bounding_box: BoundingBox;
}

interface BoundingBox {
  x_min: number;
  y_min: number;
  x_max: number;
  y_max: number;
}

interface FatigueResult {
  detection_data: Detection_Data[];
  status: "";
  // user_id: string;
  createdAt: string;
}

// Singleton instance untuk socket connection
class SocketClient {
  private static instance: Socket<ServerToClientEvents, ClientToServerEvents>;
  private static isInitialized = false;

  public static getInstance(): Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > {
    if (!this.isInitialized) {
      const socketUrl = import.meta.env.VITE_APP_SOCKET_URL;
      console.log("Connecting to socket URL:", socketUrl);

      SocketClient.instance = io(socketUrl, {
        autoConnect: false,
        // reconnection: true,
        // reconnectionAttempts: 5,
        // reconnectionDelay: 1000,
        // reconnectionDelayMax: 5000,
        // timeout: 20000,
        transports: ["websocket"],
      });

      // Debug listeners
      this.instance.on("connect", () => {
        console.log("Socket Connected with ID:", this.instance.id);
      });

      this.instance.on("disconnect", (reason) => {
        console.log("Socket Disconnected. Reason:", reason);
      });

      this.instance.on("connect_error", (error) => {
        console.error("Socket Connection Error:", error.message);
      });

      this.isInitialized = true;
    }

    return SocketClient.instance;
  }

  // Method untuk disconnect socket
  public static disconnect(): void {
    if (this.instance && this.instance.connected) {
      console.log("Disconnecting socket:", this.instance.id);
      this.instance.disconnect();
    }
  }

  // Method untuk reconnect socket
  public static reconnect(): void {
    if (this.instance) {
      this.instance.connect();
    }
  }

  // Method untuk cek status koneksi
  public static isConnected(): boolean {
    return this.instance?.connected || false;
  }
}

// Export singleton instance
export const socket = SocketClient.getInstance();
