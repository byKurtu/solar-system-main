const G = 6.67430e-11; 
const AU = 149597870700; 
const SCALE_FACTOR = 100000000; 
const EARTH_YEAR = 31557600; 
const TIME_STEP = 86400; 


const CELESTIAL_BODIES = {
    sun: {
        name: 'Sun',
        mass: 1.989e30, 
        radius: 696340,
        color: 0xffff00,
        rotationPeriod: 2.07e6, 
        axisTilt: 7.25, 
    },
    mercury: {
        name: 'Mercury',
        mass: 3.285e23,
        radius: 2439.7,
        color: 0x8c8c8c,
        semiMajorAxis: 0.387 * AU,
        eccentricity: 0.206,
        orbitalPeriod: 0.24 * EARTH_YEAR,
        rotationPeriod: 5067360,
        axisTilt: 0.034,
    },
    venus: {
        name: 'Venus',
        mass: 4.867e24,
        radius: 6051.8,
        color: 0xffd700,
        semiMajorAxis: 0.723 * AU,
        eccentricity: 0.007,
        orbitalPeriod: 0.62 * EARTH_YEAR,
        rotationPeriod: 20996800,
        axisTilt: 177.4,
    },
    earth: {
        name: 'Earth',
        mass: 5.972e24,
        radius: 6371,
        color: 0x0099ff,
        semiMajorAxis: 1.000 * AU,
        eccentricity: 0.017,
        orbitalPeriod: EARTH_YEAR,
        rotationPeriod: 86400,
        axisTilt: 23.44,
        satellites: {
            moon: {
                name: 'Moon',
                mass: 7.34767309e22,
                radius: 1737.1,
                color: 0xcccccc,
                semiMajorAxis: 384400e3,
                eccentricity: 0.0549,
                orbitalPeriod: 27.322 * 86400,
                rotationPeriod: 27.322 * 86400,
                axisTilt: 6.687,
            }
        }
    },
    mars: {
        name: 'Mars',
        mass: 6.39e23,
        radius: 3389.5,
        color: 0xff4400,
        semiMajorAxis: 1.524 * AU,
        eccentricity: 0.093,
        orbitalPeriod: 1.88 * EARTH_YEAR,
        rotationPeriod: 88642.6632,
        axisTilt: 25.19,
    },
    jupiter: {
        name: 'Jupiter',
        mass: 1.898e27,
        radius: 69911,
        color: 0xffaa88,
        semiMajorAxis: 5.203 * AU,
        eccentricity: 0.048,
        orbitalPeriod: 11.862 * EARTH_YEAR,
        rotationPeriod: 35730,
        axisTilt: 3.13,
    },
    saturn: {
        name: 'Saturn',
        mass: 5.683e26,
        radius: 58232,
        color: 0xffcc99,
        semiMajorAxis: 9.537 * AU,
        eccentricity: 0.054,
        orbitalPeriod: 29.457 * EARTH_YEAR,
        rotationPeriod: 38361.6,
        axisTilt: 26.73,
    },
    uranus: {
        name: 'Uranus',
        mass: 8.681e25,
        radius: 25362,
        color: 0x99ffff,
        semiMajorAxis: 19.191 * AU,
        eccentricity: 0.047,
        orbitalPeriod: 84.017 * EARTH_YEAR,
        rotationPeriod: 62064.0,
        axisTilt: 97.77,
    },
    neptune: {
        name: 'Neptune',
        mass: 1.024e26,
        radius: 24622,
        color: 0x3366ff,
        semiMajorAxis: 30.069 * AU,
        eccentricity: 0.009,
        orbitalPeriod: 164.79 * EARTH_YEAR,
        rotationPeriod: 57996.0,
        axisTilt: 28.32,
    }
}; 