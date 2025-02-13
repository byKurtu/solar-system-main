class SolarSystemSimulation {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('solarSystem'),
            antialias: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        this.physics = new PhysicsEngine();
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        this.setupScene();
        this.setupLighting();
        this.createCelestialBodies();
        this.setupEventListeners();
        
        this.timeScale = 1;
        this.paused = false;
        this.clock = new THREE.Clock();
        
        this.animate();
    }
    
    setupScene() {
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.1 });
        const starField = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(starField);
        
        this.camera.position.set(0, 100, 300);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.PointLight(0xFFFFFF, 2, 1000);
        sunLight.position.set(0, 0, 0);
        this.scene.add(sunLight);
    }
    
    createCelestialBodies() {
        const sunGeometry = new THREE.SphereGeometry(20, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 1
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
        
        this.physics.initializeBody(CELESTIAL_BODIES.sun);
        
        this.planets = new Map();
        
        const planetData = {
            mercury: { size: 3, distance: 50, color: 0x8c8c8c },
            venus: { size: 5, distance: 80, color: 0xffd700 },
            earth: { size: 6, distance: 110, color: 0x0099ff },
            mars: { size: 4, distance: 140, color: 0xff4400 },
            jupiter: { size: 15, distance: 200, color: 0xffaa88 },
            saturn: { size: 12, distance: 250, color: 0xffcc99 },
            uranus: { size: 8, distance: 300, color: 0x99ffff },
            neptune: { size: 8, distance: 350, color: 0x3366ff }
        };
        
        for (const [name, data] of Object.entries(planetData)) {
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: data.color,
                shininess: 30
            });
            const planet = new THREE.Mesh(geometry, material);
            
            const orbitGeometry = new THREE.RingGeometry(data.distance - 0.1, data.distance + 0.1, 128);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0x444444,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.3
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            this.scene.add(orbit);
            
            const angle = Math.random() * Math.PI * 2;
            planet.position.x = Math.cos(angle) * data.distance;
            planet.position.z = Math.sin(angle) * data.distance;
            
            this.scene.add(planet);
            this.planets.set(name, {
                mesh: planet,
                distance: data.distance,
                angle: angle,
                speed: 1 / Math.sqrt(data.distance)
            });
        }
        
        this.camera.position.set(200, 200, 200);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        document.getElementById('timeScale').addEventListener('input', (e) => {
            this.timeScale = parseFloat(e.target.value);
        });
        
        document.getElementById('pausePlay').addEventListener('click', () => {
            this.paused = !this.paused;
            document.getElementById('pausePlay').textContent = this.paused ? 'Play' : 'Pause';
        });
        
        document.getElementById('resetCamera').addEventListener('click', () => {
            this.camera.position.set(0, 100, 300);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        });
    }
    
    updatePlanetInfo() {
        const state = this.physics.getState();
        let info = '';
        
        for (const [name, data] of Object.entries(state)) {
            if (name === 'sun') continue;
            const distance = Math.sqrt(
                data.position.x * data.position.x +
                data.position.y * data.position.y +
                data.position.z * data.position.z
            ) * SCALE_FACTOR / AU;
            
            info += `${name}: ${distance.toFixed(2)} AU<br>`;
        }
        
        document.getElementById('planetInfo').innerHTML = info;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.paused) {
            const deltaTime = this.clock.getDelta() * this.timeScale;
            
            for (const [name, planet] of this.planets) {
                planet.angle += deltaTime * 0.5 * planet.speed;
                planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
                planet.mesh.rotation.y += deltaTime;
            }
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

window.addEventListener('load', () => {
    new SolarSystemSimulation();
});
