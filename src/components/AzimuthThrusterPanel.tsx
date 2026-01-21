import { PanelExtensionContext } from "@foxglove/extension";
import { ReactElement, useState, useCallback } from "react";
import { ObcAzimuthThruster } from "@oicl/openbridge-webcomponents-react/navigation-instruments/azimuth-thruster/azimuth-thruster";
import { InstrumentState } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";
import { PropellerType } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/thruster/propeller";
import { AngleAdvice } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/watch/advice";
import { LinearAdvice } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/thruster/advice";
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
    singleDirection?: boolean;
    topPropeller?: PropellerType;
    bottomPropeller?: PropellerType;
    angleAdvices?: AngleAdvice[];
    thrustAdvices?: LinearAdvice[];
    angleUnit?: string;
}

export function AzimuthThrusterPanel({
    context,
    width,
    state,
    demoMode,
    onDataReceived,
    singleDirection,
    topPropeller,
    bottomPropeller,
    angleAdvices,
    thrustAdvices,
    angleUnit = "degrees",
}: AzimuthThrusterPanelProps): ReactElement {
    // State for thruster data
    const [angle, setAngle] = useState<number>(0);
    const [angleSetpoint, setAngleSetpoint] = useState<number | undefined>(undefined);
    const [thrust, setThrust] = useState<number>(0);
    const [thrustSetpoint, setThrustSetpoint] = useState<number | undefined>(undefined);

    const height = width; // 1:1 aspect ratio

    // Convert degrees to radians if needed
    const degToRad = (value: number) => angleUnit === "radians" ? (value * (Math.PI / 180)) : value;
    const displayAngle = degToRad(angle);

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
                    state={state}
                    singleDirection={singleDirection}
                    topPropeller={topPropeller}
                    bottomPropeller={bottomPropeller}
                    angleAdvices={angleAdvices}
                    thrustAdvices={thrustAdvices}>
                </ObcAzimuthThruster>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-around", fontSize: "0.875rem" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.25rem" }}>Angle</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#94a3b8" }}>{angleUnit === "radians" ? `${displayAngle.toFixed(3)} rad` : `${angle.toFixed(1)}°`}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.25rem" }}>Thrust</div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#94a3b8" }}>{thrust.toFixed(0)}%</div>
                </div>
            </div>
        </div>
    );
}

export function getAzimuthThrusterSettings(
    width: number,
    state: InstrumentState,
    angleUnit: string,
    singleDirection: boolean,
    topPropeller: PropellerType,
    bottomPropeller: PropellerType,
    angleAdvicesJson: string,
    thrustAdvicesJson: string
) {
    const baseSettings = createInstrumentSettings("Azimuth Thruster", width, state);

    return {
        ...baseSettings,
        fields: {
            ...baseSettings.fields,
            angleUnit: {
                label: "Angle Unit",
                input: "select" as const,
                value: angleUnit,
                options: [
                    { label: "Degrees", value: "degrees" },
                    { label: "Radians", value: "radians" },
                ],
            },
            singleDirection: {
                label: "Single Direction",
                input: "boolean" as const,
                value: singleDirection,
            },
            topPropeller: {
                label: "Top Propeller",
                input: "select" as const,
                value: topPropeller,
                options: [
                    { label: "None", value: PropellerType.none },
                    { label: "Cap", value: PropellerType.cap },
                    { label: "Single", value: PropellerType.single },
                ],
            },
            bottomPropeller: {
                label: "Bottom Propeller",
                input: "select" as const,
                value: bottomPropeller,
                options: [
                    { label: "None", value: PropellerType.none },
                    { label: "Cap", value: PropellerType.cap },
                    { label: "Single", value: PropellerType.single },
                ],
            },
            angleAdvices: {
                label: "Angle Advices",
                input: "string" as const,
                value: angleAdvicesJson,
            },
            thrustAdvices: {
                label: "Thrust Advices",
                input: "string" as const,
                value: thrustAdvicesJson,
            },
        },
    };
}
