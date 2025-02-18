const G = 6.67430e-11; 
const AU = 149597870700; 
const SCALE_FACTOR = 100000000; 
const EARTH_YEAR = 31557600; 
const TIME_STEP = 86400; 

const PLANET_DATA = {
    mercury: {
        name: "Merkür",
        mass: "3.285 × 10^23",
        diameter: "4,879",
        orbitalPeriod: "88",
        averageTemp: "167"
    },
    venus: {
        name: "Venüs",
        mass: "4.867 × 10^24",
        diameter: "12,104",
        orbitalPeriod: "225",
        averageTemp: "464"
    },
    earth: {
        name: "Dünya",
        mass: "5.972 × 10^24",
        diameter: "12,742",
        orbitalPeriod: "365",
        averageTemp: "15"
    },
    mars: {
        name: "Mars",
        mass: "6.39 × 10^23",
        diameter: "6,779",
        orbitalPeriod: "687",
        averageTemp: "-63"
    },
    jupiter: {
        name: "Jüpiter",
        mass: "1.898 × 10^27",
        diameter: "139,820",
        orbitalPeriod: "4,333",
        averageTemp: "-110"
    },
    saturn: {
        name: "Satürn",
        mass: "5.683 × 10^26",
        diameter: "116,460",
        orbitalPeriod: "10,759",
        averageTemp: "-140"
    },
    uranus: {
        name: "Uranüs",
        mass: "8.681 × 10^25",
        diameter: "50,724",
        orbitalPeriod: "30,687",
        averageTemp: "-195"
    },
    neptune: {
        name: "Neptün",
        mass: "1.024 × 10^26",
        diameter: "49,244",
        orbitalPeriod: "60,190",
        averageTemp: "-200"
    }
};

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