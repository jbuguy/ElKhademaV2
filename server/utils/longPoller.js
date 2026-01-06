/* Simple long-polling manager for conversations
 * - waitForNewMessages(conversationId, timeoutMs)
 *   returns a promise that resolves when notifyNewMessage(conversationId) is called or when timeout elapses
 * - notifyNewMessage(conversationId)
 *   notifies all waiters for the conversation
 */

const waiters = new Map(); // conversationId -> Set<waiter>

export function waitForNewMessages(conversationId, timeoutMs = 25000) {
    return new Promise((resolve) => {
        const waiter = { resolve };

        let set = waiters.get(conversationId);
        if (!set) {
            set = new Set();
            waiters.set(conversationId, set);
        }
        set.add(waiter);

        // timeout cleanup
        const timer = setTimeout(() => {
            set.delete(waiter);
            if (set.size === 0) waiters.delete(conversationId);
            resolve(); // resolve with undefined -> controller will re-query DB and return [] if nothing
        }, timeoutMs);

        // replace resolve so it cleans up the timer
        const originalResolve = waiter.resolve;
        waiter.resolve = (val) => {
            clearTimeout(timer);
            set.delete(waiter);
            if (set.size === 0) waiters.delete(conversationId);
            originalResolve(val);
        };
    });
}

export function notifyNewMessage(conversationId) {
    const set = waiters.get(conversationId);
    if (!set) return;
    // call resolve for all waiters
    for (const waiter of Array.from(set)) {
        try {
            waiter.resolve();
        } catch (err) {
            // ignore
        }
    }
}

export default {
    waitForNewMessages,
    notifyNewMessage,
};
