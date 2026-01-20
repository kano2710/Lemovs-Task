import { PanelExtensionContext } from "@foxglove/extension";
import { ReactElement, useState, useCallback } from "react";
import { ObcAzimuthThruster } from "@oicl/openbridge-webcomponents-react/navigation-instruments/azimuth-thruster/azimuth-thruster";
import { InstrumentState } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { generateThrusterData } from "../services/dataSimulator";
import { useInstrumentData } from "../hooks/useInstrumentData";
import { createInstrumentSettings } from "../utils/settingsHelpers";

export const THRUSTER_TOPICS = [
    "/maritime/thruster/angle",
    "/maritime/thruster/angle_setpoint",
    "/maritime/thruster/thrust",
    "/maritime/thruster/thrust_setpoint",
];

interface AzimuthThrusterPanelProps {
    context: PanelExtensionContext;
    width: number;
    state: InstrumentState;
    demoMode: boolean;
    onDataReceived: () => void;
}

export function AzimuthThrusterPanel({
    context,
    width,
    state,
    demoMode,
    onDataReceived,
}: AzimuthThrusterPanelProps): ReactElement {
    // State for thruster data
    const [angle, setAngle] = useState<number>(0);
    const [angleSetpoint, setAngleSetpoint] = useState<number | undefined>(undefined);
    const [thrust, setThrust] = useState<number>(0);
    const [thrustSetpoint, setThrustSetpoint] = useState<number | undefined>(undefined);

    const height = width; // 1:1 aspect ratio

    // Demo data generator
    const demoGenerator = useCallback(() => {
        const data = generateThrusterData();
        setAngle(data.angle);
        setAngleSetpoint(data.angleSetpoint);
        setThrust(data.thrust);
        setThrustSetpoint(data.thrustSetpoint);
    }, []);

    // Topic handlers mapping
    const topicHandlers = {
        "/maritime/thruster/angle": (v: number | undefined) => v !== undefined && setAngle(v),
        "/maritime/thruster/angle_setpoint": setAngleSetpoint,
        "/maritime/thruster/thrust": (v: number | undefined) => v !== undefined && setThrust(v),
        "/maritime/thruster/thrust_setpoint": setThrustSetpoint,
    };

    // Use shared hook for data management
    useInstrumentData({
        context,
        topics: THRUSTER_TOPICS,
        topicHandlers,
        demoMode,
        demoGenerator,
        onDataReceived,
    });

    return (
        <div>
            <h3>Azimuth Thruster</h3>
            <div className="wrapper" style={{ width: `${width}px`, height: `${height}px` }}>
                <ObcAzimuthThruster
                    angle={angle}
                    angleSetpoint={angleSetpoint}
                    thrust={thrust}
                    thrustSetpoint={thrustSetpoint}
                    state={state}>
                </ObcAzimuthThruster>
            </div>
        </div>
    );
}

export function getAzimuthThrusterSettings(width: number, state: InstrumentState) {
    return createInstrumentSettings("Azimuth Thruster", width, state);
}
