import { PanelExtensionContext } from "@foxglove/extension";
import { ReactElement, useState, useCallback } from "react";
import { ObcCompass } from "@oicl/openbridge-webcomponents-react/navigation-instruments/compass/compass";
import { generateCompassData } from "../services/dataSimulator";
import { useInstrumentData } from "../hooks/useInstrumentData";

export const COMPASS_TOPICS = [
    "/maritime/compass/heading",
    "/maritime/compass/course_over_ground",
];

interface CompassPanelProps {
    context: PanelExtensionContext;
    width: number;
    demoMode: boolean;
    onDataReceived: () => void;
    showDirection?: boolean;
}

export function CompassPanel({
    context,
    width,
    demoMode,
    onDataReceived,
    showDirection = true,
}: CompassPanelProps): ReactElement {
    // State for compass data
    const [heading, setHeading] = useState<number>(0);
    const [courseOverGround, setCourseOverGround] = useState<number>(0);

    const height = width; // 1:1 aspect ratio

    // Convert degrees to direction
    const getDirection = (degrees: number): string => {
        const normalized = ((degrees % 360) + 360) % 360;
        
        if (normalized >= 337.5 || normalized < 22.5) return "N";
        if (normalized >= 22.5 && normalized < 67.5) return "NE";
        if (normalized >= 67.5 && normalized < 112.5) return "E";
        if (normalized >= 112.5 && normalized < 157.5) return "SE";
        if (normalized >= 157.5 && normalized < 202.5) return "S";
        if (normalized >= 202.5 && normalized < 247.5) return "SW";
        if (normalized >= 247.5 && normalized < 292.5) return "W";
        if (normalized >= 292.5 && normalized < 337.5) return "NW";
        return "N";
    };

    // Demo data generator
    const demoGenerator = useCallback(() => {
        const data = generateCompassData();
        setHeading(data.heading);
        setCourseOverGround(data.courseOverGround);
    }, []);

    // Topic handlers mapping
    const topicHandlers = {
        "/maritime/compass/heading": (v: number | undefined) => v !== undefined && setHeading(v),
        "/maritime/compass/course_over_ground": (v: number | undefined) => v !== undefined && setCourseOverGround(v),
    };

    // Use shared hook for data management
    useInstrumentData({
        context,
        topics: COMPASS_TOPICS,
        topicHandlers,
        demoMode,
        demoGenerator,
        onDataReceived,
    });

    return (
        <div>
            <h3 style={{textAlign: "center"}}>Compass</h3>
            <div className="wrapper" style={{ width: `${width}px`, height: `${height}px` }}>
                <ObcCompass
                    heading={heading}
                    courseOverGround={courseOverGround}>
                </ObcCompass>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-around", fontSize: "0.875rem" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.25rem" }}>Heading</div>
                    <div style={{ fontSize: "1.25rem", color: "#94a3b8" }}>{showDirection ? `${heading.toFixed(1)}° ${getDirection(heading)}` : `${heading.toFixed(1)}°`}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                    <div style={{ color: "#94a3b8", marginBottom: "0.25rem" }}>Course Over Ground</div>
                    <div style={{ fontSize: "1.25rem", color: "#94a3b8" }}>{showDirection ? `${courseOverGround.toFixed(1)}° ${getDirection(courseOverGround)}` : `${courseOverGround.toFixed(1)}°`}</div>
                </div>
            </div>
        </div>
    );
}

export function getCompassSettings(width: number, showDirection: boolean) {
    return {
        label: "Compass",
        fields: {
            width: {
                label: "Size (px)",
                input: "number" as const,
                value: width,
                step: 25,
                min: 32,
                max: 1028,
            },
            showDirection: {
                label: "Show Direction",
                input: "boolean" as const,
                value: showDirection,
            },
        },
    };
}
