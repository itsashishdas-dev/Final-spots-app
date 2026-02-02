
import { DomainEvent, EventType } from './types';

type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

class EventBus {
  private handlers: Map<EventType, Set<EventHandler>> = new Map();

  /**
   * Subscribe to a specific event type.
   * Returns an unsubscribe function.
   */
  subscribe<T>(type: EventType, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    
    return () => {
      const handlers = this.handlers.get(type);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  /**
   * Publish an event to all subscribers.
   */
  emit<T>(type: EventType, payload: T) {
    const event: DomainEvent<T> = {
      id: crypto.randomUUID ? crypto.randomUUID() : `evt-${Date.now()}-${Math.random()}`,
      type,
      payload,
      timestamp: Date.now(),
    };

    // Logging in development
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(`[EventBus] ${type}`);
      console.log('Payload:', payload);
      console.log('Timestamp:', new Date(event.timestamp).toISOString());
      console.groupEnd();
    }

    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          // Execute handlers asynchronously to avoid blocking the emitter
          Promise.resolve(handler(event)).catch(err => {
            console.error(`[EventBus] Error in async handler for ${type}:`, err);
          });
        } catch (err) {
          console.error(`[EventBus] Error in handler for ${type}:`, err);
        }
      });
    }
  }
}

export const eventBus = new EventBus();
