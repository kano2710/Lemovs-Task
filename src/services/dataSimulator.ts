/**
 * Data Simulator for Demo Mode
 */

export interface ThrusterData {
    angle: number;
    angleSetpoint?: number;
    thrust: number;
    thrustSetpoint?: number;
}

export interface MainEngineData {
    thrust: number;
    thrustSetpoint?: number;
    speed: number;
    speedSetpoint?: number;
}

/**
 * Generate simulated azimuth thruster data
 * @returns Object containing angle (degrees) and thrust (percentage)
 */
export function generateThrusterData(): ThrusterData {
    const time = Date.now() / 1000;

    // Oscillate angle between -45 and 45 degrees
    const angle = Math.sin(time * 0.5) * 45;
    const angleSetpoint = 10;

    // Oscillate thrust between 0 and 80%
    const thrust = (Math.sin(time * 0.3) + 1) * 40;
    const thrustSetpoint = 70;

    return { angle, angleSetpoint, thrust, thrustSetpoint };
}

/**
 * Generate simulated main engine data
 * @returns Object containing thrust, thrustSetpoint, speed, and speedSetpoint
 */
export function generateMainEngineData(): MainEngineData {
    const time = Date.now() / 1000;

    // Oscillate thrust between 0 and 100%
    const thrust = (Math.sin(time * 0.4) + 1) * 50;
    const thrustSetpoint = 80;

    // Oscillate speed between 0 and 100
    const speed = (Math.sin(time * 0.5) + 1) * 45;
    const speedSetpoint = 40;

    return { thrust, thrustSetpoint, speed, speedSetpoint };
}
