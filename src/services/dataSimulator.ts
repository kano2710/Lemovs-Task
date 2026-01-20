/**
 * Data Simulator for Demo Mode
 */

export interface ThrusterData {
    angle: number;
    thrust: number;
}

/**
 * Generate simulated azimuth thruster data
 * @returns Object containing angle (degrees) and thrust (percentage)
 */
export function generateThrusterData(): ThrusterData {
    const time = Date.now() / 1000;
    
    // Oscillate angle between -45 and 45 degrees
    const angle = Math.sin(time * 0.5) * 45;
    
    // Oscillate thrust between 0 and 80%
    const thrust = (Math.sin(time * 0.3) + 1) * 40;
    
    return { angle, thrust };
}
