import { PanelExtensionContext } from "@foxglove/extension";
import { ReactElement, useState, useCallback } from "react";
import { ObcMainEngine } from "@oicl/openbridge-webcomponents-react/navigation-instruments/main-engine/main-engine";
import { InstrumentState } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { generateMainEngineData } from "../services/dataSimulator";
import { useInstrumentData } from "../hooks/useInstrumentData";
import { createInstrumentSettings } from "../utils/settingsHelpers";

export const ENGINE_TOPICS = [
    "/maritime/engine/thrust",
    "/maritime/engine/thrust_setpoint",
    "/maritime/engine/speed",
    "/maritime/engine/speed_setpoint",
];

interface MainEnginePanelProps {
    context: PanelExtensionContext;
    width: number;
    state: InstrumentState;
    demoMode: boolean;
    onDataReceived: () => void;
}

export function MainEnginePanel({
    context,
    width,
    state,
    demoMode,
    onDataReceived,
}: MainEnginePanelProps): ReactElement {
    // State for engine data
    const [thrust, setThrust] = useState<number>(0);
    const [thrustSetpoint, setThrustSetpoint] = useState<number | undefined>(undefined);
    const [speed, setSpeed] = useState<number>(0);
    const [speedSetpoint, setSpeedSetpoint] = useState<number | undefined>(undefined);

    const height = width; // 1:1 aspect ratio

    // Demo data generator
    const demoGenerator = useCallback(() => {
        const data = generateMainEngineData();
        setThrust(data.thrust);
        setThrustSetpoint(data.thrustSetpoint);
        setSpeed(data.speed);
        setSpeedSetpoint(data.speedSetpoint);
    }, []);

    // Topic handlers mapping
    const topicHandlers = {
        "/maritime/engine/thrust": (v: number | undefined) => v !== undefined && setThrust(v),
        "/maritime/engine/thrust_setpoint": setThrustSetpoint,
        "/maritime/engine/speed": (v: number | undefined) => v !== undefined && setSpeed(v),
        "/maritime/engine/speed_setpoint": setSpeedSetpoint,
    };

    // Use shared hook for data management
    useInstrumentData({
        context,
        topics: ENGINE_TOPICS,
        topicHandlers,
        demoMode,
        demoGenerator,
        onDataReceived,
    });

    return (
        <div>
            <h3 style={{textAlign: "center"}}>Main Engine</h3>
            <div className="wrapper" style={{ width: `${width}px`, height: `${height}px` }}>
                <ObcMainEngine
                    thrust={thrust}
                    thrustSetpoint={thrustSetpoint}
                    speed={speed}
                    speedSetpoint={speedSetpoint}
                    state={state}>
                </ObcMainEngine>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-around", fontSize: "0.875rem" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.25rem" }}>Speed</div>
                    <div style={{ fontSize: "1.25rem", color: "#94a3b8" }}>{speed.toFixed(0)}nm/h</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.25rem" }}>Thrust</div>
                    <div style={{ fontSize: "1.25rem", color: "#94a3b8" }}>{thrust.toFixed(1)}%</div>
                </div>
            </div>
        </div>
    );
}

export function getMainEngineSettings(width: number, state: InstrumentState) {
    return createInstrumentSettings("Main Engine", width, state);
}
