"use client";

import { useEffect, useRef, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import type { ReceivedChatMessage } from "@/types";

interface UseSignalROptions {
  /**
   * Called when hub emits "ReceiveChat".
   * Backend sends three positional args: senderId, message, timestamp.
   */
  onReceiveChat?: (msg: ReceivedChatMessage) => void;
  /** JWT access token – connection is skipped when falsy */
  token: string | null;
}

interface UseSignalRReturn {
  /**
   * Invoke "SendMessage" on the hub.
   * Backend signature: SendMessage(Guid receiverId, string message)
   */
  sendMessage: (receiverId: string, message: string) => Promise<void>;
  connectionState: signalR.HubConnectionState;
}

export function useSignalR({
  onReceiveChat,
  token,
}: UseSignalROptions): UseSignalRReturn {
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const stateRef = useRef<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );

  useEffect(() => {
    if (!token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiUrl}/hubs/chat`, {
        /*
         * Backend: [Authorize] on ChatHub → expects a valid JWT.
         * accessTokenFactory is used by the SignalR client; the library
         * appends it as ?access_token= for WebSockets and as a header for
         * other transports, matching the backend's token extraction.
         */
        accessTokenFactory: () => token,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2_000, 5_000, 10_000, 30_000])
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    /*
     * Hub event: "ReceiveChat"
     * Backend sends: Clients.User(receiverId).SendAsync("ReceiveChat", senderId, message, timestamp)
     * Three positional parameters → destructure into ReceivedChatMessage.
     */
    if (onReceiveChat) {
      connection.on(
        "ReceiveChat",
        (senderId: string, message: string, timestamp: string) => {
          onReceiveChat({ senderId, message, timestamp });
        }
      );
    }

    connection.onreconnecting(() => {
      stateRef.current = signalR.HubConnectionState.Reconnecting;
    });
    connection.onreconnected(() => {
      stateRef.current = signalR.HubConnectionState.Connected;
    });
    connection.onclose(() => {
      stateRef.current = signalR.HubConnectionState.Disconnected;
    });

    connection
      .start()
      .then(() => {
        stateRef.current = signalR.HubConnectionState.Connected;
      })
      .catch((err) =>
        console.warn("[SignalR] Connection failed:", err?.message)
      );

    connectionRef.current = connection;

    return () => {
      connection.off("ReceiveChat");
      connection.stop().catch(() => null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /**
   * Send a direct message to another user.
   * Matches backend hub method: SendMessage(Guid receiverId, string message)
   */
  const sendMessage = useCallback(
    async (receiverId: string, message: string) => {
      const conn = connectionRef.current;
      if (conn?.state === signalR.HubConnectionState.Connected) {
        await conn.invoke("SendMessage", receiverId, message);
      }
    },
    []
  );

  return { sendMessage, connectionState: stateRef.current };
}
