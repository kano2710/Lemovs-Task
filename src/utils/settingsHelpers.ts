import { InstrumentState } from "@oicl/openbridge-webcomponents/dist/navigation-instruments/types";

/**
 * Create standard instrument settings node for SettingsTree
 * @param label Display label for the instrument
 * @param width Current width value
 * @param state Current state value
 * @returns Settings node configuration
 */
export function createInstrumentSettings(
    label: string,
    width: number,
    state: InstrumentState
) {
    return {
        label,
        fields: {
            width: {
                label: "Size (px)",
                input: "number" as const,
                value: width,
                step: 25,
                min: 32,
                max: 1028,
            },
            state: {
                label: "State",
                input: "select" as const,
                value: state,
                options: [
                    { label: "In Command", value: InstrumentState.inCommand },
                    { label: "Active", value: InstrumentState.active },
                    { label: "Loading", value: InstrumentState.loading },
                    { label: "Off", value: InstrumentState.off },
                ],
            },
        },
    };
}
