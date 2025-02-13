class PhysicsEngine {
    constructor() {
        this.bodies = new Map();
    }

    calculateGravitationalForce(body1, body2) {
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        const dz = body2.position.z - body1.position.z;
        
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const forceMagnitude = (G * body1.mass * body2.mass) / (distance * distance);
        
        return {
            x: (forceMagnitude * dx) / distance,
            y: (forceMagnitude * dy) / distance,
            z: (forceMagnitude * dz) / distance
        };
    }

    calculateOrbitalVelocity(centralMass, distance) {
        return Math.sqrt((G * centralMass) / distance);
    }

    calculateEllipticalOrbit(body, centralBody, time) {
        const a = body.semiMajorAxis;
        const e = body.eccentricity;
        const period = body.orbitalPeriod;
        
        const M = (2 * Math.PI * time) / period;
        
        let E = M;
        const tolerance = 1e-8;
        let deltaE;
        
        do {
            deltaE = (M + e * Math.sin(E) - E) / (1 - e * Math.cos(E));
            E += deltaE;
        } while (Math.abs(deltaE) > tolerance);
        
        const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
        
        const r = (a * (1 - e * e)) / (1 + e * Math.cos(v));
        
        const x = r * Math.cos(v);
        const z = r * Math.sin(v);
        
        const inclination = body.axisTilt || 0;
        const y = z * Math.sin(inclination * Math.PI / 180);
        const adjustedZ = z * Math.cos(inclination * Math.PI / 180);
        
        return {
            x: x,
            y: y,
            z: adjustedZ
        };
    }

    update(deltaTime) {
        const timeStep = deltaTime * TIME_STEP;
        const currentTime = (this.currentTime || 0) + timeStep;
        this.currentTime = currentTime;
        
        for (const [name, body] of this.bodies) {
            if (name === 'sun') continue;
            
            const centralBody = this.bodies.get('sun');
            const newPosition = this.calculateEllipticalOrbit(body, centralBody, currentTime);
            
            body.position = newPosition;
            
            if (body.rotationPeriod) {
                body.rotation += (2 * Math.PI * timeStep) / body.rotationPeriod;
            }
        }
    }

    initializeBody(bodyData, centralBody = null) {
        const body = {
            ...bodyData,
            position: { x: 0, y: 0, z: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            acceleration: { x: 0, y: 0, z: 0 },
            rotation: 0
        };

        if (centralBody) {
            const initialPosition = this.calculateEllipticalOrbit(body, centralBody, 0);
            body.position = initialPosition;

            const speed = this.calculateOrbitalVelocity(centralBody.mass, bodyData.semiMajorAxis);
            body.velocity = {
                x: -speed * Math.sin(0),
                y: 0,
                z: speed * Math.cos(0)
            };
        }

        this.bodies.set(bodyData.name, body);
        return body;
    }

    getState() {
        const state = {};
        for (const [name, body] of this.bodies) {
            state[name] = {
                position: { ...body.position },
                rotation: body.rotation,
                radius: body.radius
            };
        }
        return state;
    }
} 