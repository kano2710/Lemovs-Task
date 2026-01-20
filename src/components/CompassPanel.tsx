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
}

export function CompassPanel({
    context,
    width,
    demoMode,
    onDataReceived,
}: CompassPanelProps): ReactElement {
    // State for compass data
    const [heading, setHeading] = useState<number>(0);
    const [courseOverGround, setCourseOverGround] = useState<number>(0);

    const height = width; // 1:1 aspect ratio

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
            <h3>Compass</h3>
            <div className="wrapper" style={{ width: `${width}px`, height: `${height}px` }}>
                <ObcCompass
                    heading={heading}
                    courseOverGround={courseOverGround}>
                </ObcCompass>
            </div>
        </div>
    );
}

export function getCompassSettings(width: number) {
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
        },
    };
}
