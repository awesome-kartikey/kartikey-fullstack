// Typed EventBus: Extend the minimal EventBus with a user:updated event. Emit this event when a user’s profile changes, and write a subscriber that prints the update. Show how TypeScript enforces the payload structure.

type Events = {
  "user:created": { id: string; email: string };
  "user:updated": { id: string; email: string };
  "user:deleted": { id: string };
};

export class EventBus<E extends Record<string, any>> {
  private listeners: { [K in keyof E]?: Array<(e: E[K]) => void> } = {};
  on<K extends keyof E>(name: K, fn: (e: E[K]) => void) {
    (this.listeners[name] ||= []).push(fn);
  }
  emit<K extends keyof E>(name: K, payload: E[K]) {
    this.listeners[name]?.forEach((fn) => fn(payload));
  }
}

export const bus = new EventBus<Events>();

//Subscriber

bus.on("user:created", ({ id, email }) => {
  console.log(`User ${id} created with email ${email}`);
});

//Emitter
function updateUser(id: string, email: string) {
  bus.emit("user:updated", { id, email });
}

updateUser("1", "alice@example.com");
