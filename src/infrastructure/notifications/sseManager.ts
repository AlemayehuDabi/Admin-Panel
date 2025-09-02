import { Response } from "express";

class SSEManager {
  private clients: Map<string, Response> = new Map();

  addClient(userId: string, res: Response) {
    this.clients.set(userId, res);
  }

  removeClient(userId: string) {
    this.clients.delete(userId);
  }

  sendToUser(userId: string, event: string, data: any) {
    const res = this.clients.get(userId);
    if (res) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }

  broadcast(event: string, data: any) {
    for (const res of this.clients.values()) {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
  }
}

export const sseManager = new SSEManager();
