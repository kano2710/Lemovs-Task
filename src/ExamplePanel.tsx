import { PanelExtensionContext } from "@foxglove/extension";
import { ReactElement, useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./assets/variables.css";
import "./assets/fonts.css";

import { InstrumentState } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";

// Import instrument components
import { AzimuthThrusterPanel, getAzimuthThrusterSettings, THRUSTER_TOPICS } from "./components/AzimuthThrusterPanel";
import { MainEnginePanel, getMainEngineSettings, ENGINE_TOPICS } from "./components/MainEnginePanel";
import { CompassPanel, getCompassSettings, COMPASS_TOPICS } from "./components/CompassPanel";

function ExamplePanel({ context }: { context: PanelExtensionContext }): ReactElement {
    const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

    const [demoMode, setDemoMode] = useState<boolean>(true);
    const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());

    // General settings
    const [theme, setTheme] = useState<string>("day");

    // Settings state
    const [thrusterWidth, setThrusterWidth] = useState<number>(500);
    const [thrusterState, setThrusterState] = useState<InstrumentState>(InstrumentState.inCommand);
    const [engineWidth, setEngineWidth] = useState<number>(500);
    const [engineState, setEngineState] = useState<InstrumentState>(InstrumentState.inCommand);
    const [compassWidth, setCompassWidth] = useState<number>(500);

    // Callback for when instruments receive data
    const handleDataReceived = () => {
        setLastMessageTime(Date.now());
        setDemoMode(false);
    };

    // Demo mode simulation - check if we haven't received messages in 2 seconds
    useEffect(() => {
        const checkInterval = setInterval(() => {
            if (Date.now() - lastMessageTime > 2000) {
                setDemoMode(true);
            }
        }, 1000);

        return () => clearInterval(checkInterval);
    }, [lastMessageTime]);

    // Setup render handling and topic subscriptions
    useLayoutEffect(() => {
        // The render handler is run by the broader Foxglove system during playback when your panel
        // needs to render because the fields it is watching have changed. How you handle rendering depends on your framework.
        // You can only setup one render handler - usually early on in setting up your panel.
        //
        // Without a render handler your panel will never receive updates.
        //
        // The render handler could be invoked as often as 60hz during playback if fields are changing often.
        context.onRender = (renderState, done) => {
            // render functions receive a _done_ callback. You MUST call this callback to indicate your panel has finished rendering.
            // Your panel will not receive another render callback until _done_ is called from a prior render. If your panel is not done
            // rendering before the next render call, Foxglove shows a notification to the user that your panel is delayed.
            //
            // Set the done callback into a state variable to trigger a re-render.
            setRenderDone(() => done);

            // Call message handlers from instrument components
            if ((context as any)._thrusterMessageHandler) {
                (context as any)._thrusterMessageHandler(renderState);
            }
            if ((context as any)._engineMessageHandler) {
                (context as any)._engineMessageHandler(renderState);
            }
            if ((context as any)._compassMessageHandler) {
                (context as any)._compassMessageHandler(renderState);
            }
        };

        // After adding a render handler, you must indicate which fields from RenderState will trigger updates.
        // If you do not watch any fields then your panel will never render since the panel context will assume you do not want any updates.

        // tell the panel context that we care about any update to the _topic_ field of RenderState
        context.watch("topics");

        // tell the panel context we want messages for the current frame for topics we've subscribed to
        // This corresponds to the _currentFrame_ field of render state.
        context.watch("currentFrame");

        // Subscribe to all topics from instruments
        const allTopics = [...THRUSTER_TOPICS, ...ENGINE_TOPICS, ...COMPASS_TOPICS].map((topic) => ({ topic }));
        context.subscribe(allTopics);

        // Load saved settings from panel state
        context.saveState({});
        setTheme((context.initialState as any)?.theme ?? "day");
        setThrusterWidth((context.initialState as any)?.thrusterWidth ?? 500);
        setThrusterState((context.initialState as any)?.thrusterState ?? InstrumentState.inCommand);
        setEngineWidth((context.initialState as any)?.engineWidth ?? 500);
        setEngineState((context.initialState as any)?.engineState ?? InstrumentState.inCommand);
        setCompassWidth((context.initialState as any)?.compassWidth ?? 500);
    }, [context]);

    // Set up and update settings tree
    useEffect(() => {
        context.updatePanelSettingsEditor({
            actionHandler: (action) => {
                if (action.action === "update") {
                    const path = action.payload.path;
                    const value = action.payload.value;

                    if (path.length === 2) {
                        const nodeName = path[0];
                        const fieldName = path[1];

                        if (nodeName === "general") {
                            if (fieldName === "theme") {
                                setTheme(value as string);
                                context.saveState({ theme: value, thrusterWidth, thrusterState, engineWidth, engineState, compassWidth });
                            }
                        } else if (nodeName === "azimuthThruster") {
                            if (fieldName === "width") {
                                setThrusterWidth(value as number);
                                context.saveState({ theme, thrusterWidth: value, thrusterState, engineWidth, engineState, compassWidth });
                            } else if (fieldName === "state") {
                                setThrusterState(value as InstrumentState);
                                context.saveState({ theme, thrusterWidth, thrusterState: value, engineWidth, engineState, compassWidth });
                            }
                        } else if (nodeName === "mainEngine") {
                            if (fieldName === "width") {
                                setEngineWidth(value as number);
                                context.saveState({ theme, thrusterWidth, thrusterState, engineWidth: value, engineState, compassWidth });
                            } else if (fieldName === "state") {
                                setEngineState(value as InstrumentState);
                                context.saveState({ theme, thrusterWidth, thrusterState, engineWidth, engineState: value, compassWidth });
                            }
                        } else if (nodeName === "compass") {
                            if (fieldName === "width") {
                                setCompassWidth(value as number);
                                context.saveState({ theme, thrusterWidth, thrusterState, engineWidth, engineState, compassWidth: value });
                            }
                        }
                    }
                }
            },
            nodes: {
                general: {
                    label: "General",
                    fields: {
                        theme: {
                            label: "Theme",
                            input: "select" as const,
                            value: theme,
                            options: [
                                { label: "Day", value: "day" },
                                { label: "Dusk", value: "dusk" },
                                { label: "Night", value: "night" },
                                { label: "Bright", value: "bright" },
                            ],
                        },
                    },
                },
                azimuthThruster: getAzimuthThrusterSettings(thrusterWidth, thrusterState),
                mainEngine: getMainEngineSettings(engineWidth, engineState),
                compass: getCompassSettings(compassWidth),
            },
        });
    }, [context, theme, thrusterWidth, thrusterState, engineWidth, engineState, compassWidth]);

    // invoke the done callback once the render is complete
    useEffect(() => {
        renderDone?.();
    }, [renderDone]);

    return (
        <div style={{ padding: "1rem", height: "100%", overflow: "auto", boxSizing: "border-box" }} data-obc-theme={theme} className="obc-component-size-regular">
            <h2>Foxglove Extension with OpenBridge Components!</h2>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <AzimuthThrusterPanel
                    context={context}
                    width={thrusterWidth}
                    state={thrusterState}
                    demoMode={demoMode}
                    onDataReceived={handleDataReceived}
                />
                <MainEnginePanel
                    context={context}
                    width={engineWidth}
                    state={engineState}
                    demoMode={demoMode}
                    onDataReceived={handleDataReceived}
                />
                <CompassPanel
                    context={context}
                    width={compassWidth}
                    demoMode={demoMode}
                    onDataReceived={handleDataReceived}
                />
            </div>
        </div>
    );
}

export function initExamplePanel(context: PanelExtensionContext): () => void {
    const root = createRoot(context.panelElement);
    root.render(<ExamplePanel context={context} />);

    // Return a function to run when the panel is removed
    return () => {
        root.unmount();
    };
}
