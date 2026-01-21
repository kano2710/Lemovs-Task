# Lemovs-Task version history

## 0.0.7 (21.01.2026)

- Added "Show Direction" toggle in Compass settings to display/hide 8-point compass directions
- Added detailed README.md

## 0.0.6 (20.01.2026)

- Added Angle Unit setting (Degrees/Radians) to Azimuth Thruster settings panel
- Angle unit conversion for text displays (component still receives degrees)
- Updated state persistence to include angle unit preference
- Added 8-point compass direction display (N, NE, E, SE, S, SW, W, NW) after degree values in Compass component
- Improved Compass text display formatting

## 0.0.5 (20.01.2026)

- Added angleAdvices and thrustAdvices properties to Azimuth Thruster
- Support for advice zones (warnings/cautions) configuration via JSON
- Added placeholder examples for angle and thrust advice configurations

## 0.0.4 (20.01.2026)

- Added additional Azimuth Thruster properties: singleDirection, topPropeller, bottomPropeller
- Implemented PropellerType enum (none, cap, single) for thruster configuration
- Enhanced settings panel with new thruster customization options

## 0.0.3 (20.01.2026)

- Add Compass component

## 0.0.2 (20.01.2026)

- Added Main Engine instrument with thrust, speed, and setpoint displays
- Added Compass instrument with heading and course over ground
- Implemented side-by-side layout for multiple instruments with independent sizing
- Added InstrumentState controls (inCommand, active, loading, off) for Azimuth Thruster and Main Engine
- Implemented demo mode with 2-second timeout and 10Hz data generation
- Added theme selector (day, dusk, night, bright) in General settings
- Refactored architecture: separated components into individual files (AzimuthThrusterPanel, MainEnginePanel, CompassPanel)
- Created shared utilities (useInstrumentData hook, messageParser, settingsHelpers)
- Implemented flexible message parsing supporting both msg.data and msg[fieldName] formats
- Added scrolling support for panel content

## 0.0.1 (20.01.2026)

- Added OpenBridge Azimuth Thruster component with angle, thrust, and setpoint displays
- Implemented settings panel with width and state controls
- Added topic subscription for maritime data (/maritime/thruster/*)
- Implemented demo mode with simulated data generation
- Added settings persistence across sessions

## 0.0.0 (20.01.2026)

- Initial project setup
