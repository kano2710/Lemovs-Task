import { PanelExtensionContext } from "@foxglove/extension";
import { useEffect } from "react";
import { handleMessages } from "../utils/messageParser";

interface UseInstrumentDataProps {
    context: PanelExtensionContext;
    topics: string[];
    topicHandlers: Record<string, (value: number | undefined) => void>;
    demoMode: boolean;
    demoGenerator: () => void;
    onDataReceived: () => void;
}

/**
 * Custom hook to manage instrument data from topics or demo mode
 * Handles message parsing and demo data generation
 */
export function useInstrumentData({
    context,
    topics,
    topicHandlers,
    demoMode,
    demoGenerator,
    onDataReceived,
}: UseInstrumentDataProps): void {
    // Handle incoming messages
    useEffect(() => {
        const handleMessage = (renderState: any) => {
            if (renderState.currentFrame && renderState.currentFrame.length > 0) {
                onDataReceived();
                handleMessages(renderState.currentFrame, topicHandlers);
            }
        };

        // Store handler on context so parent can call it
        const handlerKey = `_${topics[0]?.split("/")[2] || "unknown"}MessageHandler`; // e.g., _thrusterMessageHandler
        (context as any)[handlerKey] = handleMessage;

        return () => {
            delete (context as any)[handlerKey];
        };
    }, [context, topics, topicHandlers, onDataReceived]);

    // Generate simulated data in demo mode
    useEffect(() => {
        if (!demoMode) return;

        const interval = setInterval(() => {
            demoGenerator();
        }, 100); // 10Hz update rate

        return () => clearInterval(interval);
    }, [demoMode, demoGenerator]);
}
