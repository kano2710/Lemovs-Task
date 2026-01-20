import { PanelExtensionContext } from "@foxglove/extension";
import { ReactElement, useEffect, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";

import "./assets/variables.css";
import "./assets/fonts.css";

import { ObcAzimuthThruster } from "@oicl/openbridge-webcomponents-react/navigation-instruments/azimuth-thruster/azimuth-thruster";
import { InstrumentState } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";

// Import data simulator
import { generateThrusterData } from "./services/dataSimulator";

function ExamplePanel({ context }: { context: PanelExtensionContext }): ReactElement {
    const [renderDone, setRenderDone] = useState<(() => void) | undefined>();

    // State for thruster data
    const [thrusterAngle, setThrusterAngle] = useState<number>(0);
    const [thrusterThrust, setThrusterThrust] = useState<number>(0);

    const [demoMode, setDemoMode] = useState<boolean>(true);
    const [lastMessageTime, setLastMessageTime] = useState<number>(Date.now());

    // Settings state
    const [width, setWidth] = useState<number>(512);

    // Calculate height based on width (1:1 aspect ratio)
    const height = width;

    // Demo mode simulation
    useEffect(() => {
        // Check if we haven't received messages in 2 seconds, enable demo mode
        const checkInterval = setInterval(() => {
            if (Date.now() - lastMessageTime > 2000) {
                setDemoMode(true);
            }
        }, 1000);

        return () => clearInterval(checkInterval);
    }, [lastMessageTime]);

    // Generate simulated data in demo mode
    useEffect(() => {
        if (!demoMode) return;

        const interval = setInterval(() => {
            const data = generateThrusterData();
            setThrusterAngle(data.angle);
            setThrusterThrust(data.thrust);
        }, 100); // 10Hz update rate

        return () => clearInterval(interval);
    }, [demoMode]);

    // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
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

            if (renderState.currentFrame && renderState.currentFrame.length > 0) {
                setLastMessageTime(Date.now());
                setDemoMode(false); // Disable demo mode when receiving real data

                for (const msgEvent of renderState.currentFrame) {
                    const msg = msgEvent.message as any;

                    // Handle thruster angle topic
                    if (msgEvent.topic === "/maritime/thruster/angle") {
                        if (typeof msg.data === "number") {
                            setThrusterAngle(msg.data);
                        } else if (typeof msg.angle === "number") {
                            setThrusterAngle(msg.angle);
                        }
                    }

                    // Handle thruster thrust topic
                    if (msgEvent.topic === "/maritime/thruster/thrust") {
                        if (typeof msg.data === "number") {
                            setThrusterThrust(msg.data);
                        } else if (typeof msg.thrust === "number") {
                            setThrusterThrust(msg.thrust);
                        }
                    }
                }
            }
        };

        // After adding a render handler, you must indicate which fields from RenderState will trigger updates.
        // If you do not watch any fields then your panel will never render since the panel context will assume you do not want any updates.

        // tell the panel context that we care about any update to the _topic_ field of RenderState
        context.watch("topics");

        // tell the panel context we want messages for the current frame for topics we've subscribed to
        // This corresponds to the _currentFrame_ field of render state.
        context.watch("currentFrame");

        // subscribe to some topics, you could do this within other effects, based on input fields, etc
        // Once you subscribe to topics, currentFrame will contain message events from those topics (assuming there are messages).
        context.subscribe([{ topic: "/maritime/thruster/angle" }, { topic: "/maritime/thruster/thrust" }]);

        // Load saved settings from panel state
        context.saveState({});
        setWidth((context.initialState as any)?.width ?? 512);
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

                        if (nodeName === "azimuthThruster") {
                            if (fieldName === "width") {
                                setWidth(value as number);
                                context.saveState({ width: value });
                            }
                        }
                    }
                }
            },
            nodes: {
                azimuthThruster: {
                    label: "Azimuth Thruster",
                    fields: {
                        width: {
                            label: "Size (px)",
                            input: "number",
                            value: width,
                            step: 25,
                            min: 32,
                            max: 1028,
                            help: "Width and height of the component (maintains 1:1 aspect ratio)",
                        },
                    },
                },
            },
        });
    }, [context, width]);

    // invoke the done callback once the render is complete
    useEffect(() => {
        renderDone?.();
    }, [renderDone]);

    return (
        <div style={{ padding: "1rem" }} data-obc-theme="day" className={`obc-component-size-regular`}>
            <h2>Foxglove Extension with OpenBridge Components!</h2>
            <div className="wrapper" style={{ width: `${width}px`, height: `${height}px` }}>
                <ObcAzimuthThruster
                    angle={thrusterAngle}
                    thrust={thrusterThrust}
                    state={InstrumentState.inCommand}>
                </ObcAzimuthThruster>
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
