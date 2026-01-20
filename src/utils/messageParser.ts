/**
 * Parse a message value from either msg.data or msg[fieldName]
 * @param msg The message object
 * @param fieldName The field name to look for
 * @returns The parsed number value or undefined
 */
export function parseMessageValue(msg: any, fieldName: string): number | undefined {
    if (typeof msg.data === "number") {
        return msg.data;
    }
    if (typeof msg[fieldName] === "number") {
        return msg[fieldName];
    }
    return undefined;
}

/**
 * Handle incoming messages for multiple topics
 * @param currentFrame Array of message events
 * @param topicHandlers Map of topic to handler function
 */
export function handleMessages(
    currentFrame: any[],
    topicHandlers: Record<string, (value: number | undefined) => void>
): void {
    for (const msgEvent of currentFrame) {
        const topic = msgEvent.topic;
        const handler = topicHandlers[topic];

        if (handler) {
            const msg = msgEvent.message as any;
            // Try to extract field name from topic (e.g., "/maritime/thruster/angle" -> "angle")
            const fieldName = topic.split("/").pop() || "";
            const value = parseMessageValue(msg, fieldName);

            if (value !== undefined) {
                handler(value);
            }
        }
    }
}
