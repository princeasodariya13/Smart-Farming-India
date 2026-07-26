import { EventEmitter } from "events";

// Global singleton — survives across hot-reloads in dev via globalThis
const globalEmitter = globalThis as typeof globalThis & {
  __marketplaceEmitter?: EventEmitter;
};

if (!globalEmitter.__marketplaceEmitter) {
  globalEmitter.__marketplaceEmitter = new EventEmitter();
  globalEmitter.__marketplaceEmitter.setMaxListeners(100);
}

export const marketplaceEmitter = globalEmitter.__marketplaceEmitter;

/**
 * Emit an event to a specific user's SSE stream.
 * @param userId - Target user's ID
 * @param event - Event payload
 */
export function emitToUser(userId: string, event: object) {
  marketplaceEmitter.emit(`user:${userId}`, event);
}
