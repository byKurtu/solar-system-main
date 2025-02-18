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
        this.renderer.setClearColor(0x000000, 1);
        
        this.camera.position.set(0, 150, 400);
        this.camera.lookAt(0, 0, 0);
        
        this.physics = new PhysicsEngine();
        
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 1000;
        
        this.setupScene();
        this.setupLighting();
        this.createCelestialBodies();
        this.setupEventListeners();
        
        this.timeScale = 1;
        this.paused = false;
        this.clock = new THREE.Clock();
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        this.currentDate = new Date();
        this.timeDirection = 1;
        this.setupTimeControls();
        
        this.cameraPresets = {
            overview: { position: new THREE.Vector3(200, 200, 200), target: new THREE.Vector3(0, 0, 0) },
            topDown: { position: new THREE.Vector3(0, 300, 0), target: new THREE.Vector3(0, 0, 0) },
            sideView: { position: new THREE.Vector3(300, 0, 0), target: new THREE.Vector3(0, 0, 0) },
            earthView: { position: new THREE.Vector3(0, 0, 0), target: new THREE.Vector3(0, 0, 0) }
        };
        
        this.setupCameraControls();
        this.animate();
        
        window.solarSystemSimulation = this;
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
    }
    
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        const sunLight = new THREE.PointLight(0xFFFFFF, 2, 1000);
        sunLight.position.set(0, 0, 0);
        sunLight.color.setHSL(0.1, 0.7, 0.95);
        sunLight.intensity = 3;
        this.scene.add(sunLight);
        
        const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5);
        this.scene.add(hemisphereLight);
    }
    
    createCelestialBodies() {
        // Güneş
        const sunGeometry = new THREE.SphereGeometry(20, 64, 64);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
        this.sun = new THREE.Mesh(sunGeometry, sunMaterial);
        this.scene.add(this.sun);
        
        const planetData = {
            mercury: { size: 3, distance: 50, color: 0x808080 },
            venus: { size: 5, distance: 80, color: 0xffd700 },
            earth: { size: 6, distance: 110, color: 0x0077be },
            mars: { size: 4, distance: 140, color: 0xff4500 },
            jupiter: { size: 15, distance: 200, color: 0xffa500 },
            saturn: { size: 12, distance: 250, color: 0xffd700 },
            uranus: { size: 8, distance: 300, color: 0x40e0d0 },
            neptune: { size: 8, distance: 350, color: 0x0000ff }
        };
        
        this.planets = new Map();
        this.planetTrails = new Map();
        
        for (const [name, data] of Object.entries(planetData)) {
            const geometry = new THREE.SphereGeometry(data.size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: data.color,
                shininess: 30
            });
            const planet = new THREE.Mesh(geometry, material);
            
            if (name === 'earth' || name === 'venus') {
                const atmosphereGeometry = new THREE.SphereGeometry(data.size * 1.1, 32, 32);
                const atmosphereMaterial = new THREE.ShaderMaterial({
                    vertexShader: `
                        varying vec3 vNormal;
                        void main() {
                            vNormal = normalize(normalMatrix * normal);
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        varying vec3 vNormal;
                        void main() {
                            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                            gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                        }
                    `,
                    blending: THREE.AdditiveBlending,
                    side: THREE.BackSide,
                    transparent: true
                });
                const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
                planet.add(atmosphere);
            }
            
            if (name === 'saturn') {
                const innerRadius = data.size * 1.2;
                const outerRadius = data.size * 2;
                const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xc7a67d,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const rings = new THREE.Mesh(ringGeometry, ringMaterial);
                rings.rotation.x = Math.PI / 2;
                planet.add(rings);
            }
            
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
            
            const trailGeometry = new THREE.BufferGeometry();
            const trailMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.3
            });
            
            const trailPositions = new Float32Array(300 * 3);
            trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
            
            const trail = new THREE.Line(trailGeometry, trailMaterial);
            this.scene.add(trail);
            
            this.planetTrails.set(name, {
                line: trail,
                positions: [],
                maxPoints: 100
            });
        }
        
        // Ay
        const moonGeometry = new THREE.SphereGeometry(1.5, 32, 32);
        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0xcccccc,
            shininess: 30
        });
        this.moon = new THREE.Mesh(moonGeometry, moonMaterial);
        
        const moonOrbitRadius = 15;
        const moonOrbitGeometry = new THREE.RingGeometry(moonOrbitRadius - 0.1, moonOrbitRadius + 0.1, 64);
        const moonOrbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
        });
        this.moonOrbit = new THREE.Mesh(moonOrbitGeometry, moonOrbitMaterial);
        this.scene.add(this.moonOrbit);
        this.scene.add(this.moon);
        
        this.moonData = {
            angle: 0,
            distance: moonOrbitRadius,
            speed: 13.0
        };
        
        this.createAsteroidBelt();
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
            document.getElementById('pausePlay').textContent = this.paused ? 'Oynat' : 'Durdur';
        });
        
        document.getElementById('resetCamera').addEventListener('click', () => {
            this.camera.position.set(0, 100, 300);
            this.camera.lookAt(0, 0, 0);
            this.controls.reset();
        });
        
        window.addEventListener('click', (event) => {
            event.preventDefault();
            
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            this.raycaster.setFromCamera(this.mouse, this.camera);
            
            const planetObjects = Array.from(this.planets.values()).map(planet => planet.mesh);
            const intersects = this.raycaster.intersectObjects(planetObjects);
            
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                for (const [name, planet] of this.planets) {
                    if (planet.mesh === clickedObject || planet.mesh.children.includes(clickedObject)) {
                        this.showPlanetInfo(name);
                        break;
                    }
                }
            }
        });
    }
    
    setupTimeControls() {
        document.getElementById('rewindTime').addEventListener('click', () => {
            this.timeDirection = -1;
            if (this.paused) {
                this.paused = false;
                document.getElementById('pausePlay').textContent = 'Durdur';
            }
        });
        
        document.getElementById('forwardTime').addEventListener('click', () => {
            this.timeDirection = 1;
            if (this.paused) {
                this.paused = false;
                document.getElementById('pausePlay').textContent = 'Durdur';
            }
        });
        
        const dateInput = document.getElementById('simulationDate');
        dateInput.valueAsDate = this.currentDate;
        
        document.getElementById('goToDate').addEventListener('click', () => {
            const targetDate = new Date(dateInput.value);
            const timeDiff = (targetDate - this.currentDate) / 1000; 
            
            for (const [name, planet] of this.planets) {
                const angleChange = (timeDiff / CELESTIAL_BODIES[name].orbitalPeriod) * 2 * Math.PI;
                planet.angle += angleChange;
            }
            
            this.currentDate = targetDate;
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
    
    showPlanetInfo(planetName) {
        const planetInfoDiv = document.getElementById('planetInfo');
        if (!planetName) {
            planetInfoDiv.style.display = 'none';
            return;
        }

        const planet = CELESTIAL_BODIES[planetName];
        planetInfoDiv.innerHTML = `
            <div class="info-header">
                <h2>${planet.name}</h2>
                <button class="close-btn" onclick="document.getElementById('planetInfo').style.display='none'">×</button>
            </div>
            <p>Kütle: ${(planet.mass / 1e24).toFixed(2)} × 10²⁴ kg</p>
            <p>Yarıçap: ${planet.radius.toFixed(0)} km</p>
            <p>Yörünge Periyodu: ${(planet.orbitalPeriod / EARTH_YEAR).toFixed(2)} Dünya Yılı</p>
            <p>Eksen Eğikliği: ${planet.axisTilt.toFixed(2)}°</p>
            <p>Dönüş Periyodu: ${(planet.rotationPeriod / 86400).toFixed(2)} Dünya Günü</p>
            <button onclick="window.solarSystemSimulation.comparePlanets('${planetName}')">Karşılaştır</button>
        `;
        planetInfoDiv.style.display = 'block';
    }
    
    comparePlanets(selectedPlanet) {
        const existingCompare = document.querySelector('.planet-comparison');
        if (existingCompare) {
            document.body.removeChild(existingCompare);
        }

        const compareDiv = document.createElement('div');
        compareDiv.className = 'planet-comparison modal';
        
        const planets = Object.keys(CELESTIAL_BODIES).filter(name => name !== 'sun');
        const compareWith = planets.filter(name => name !== selectedPlanet);
        
        compareDiv.innerHTML = `
            <div class="modal-content">
                <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; border-bottom: 1px solid #34495e;">
                    <h2 style="margin: 0;">Gezegen Karşılaştırması</h2>
                    <button class="close-btn" style="background: none; border: none; color: white; font-size: 24px; cursor: pointer; padding: 0 5px;">×</button>
                </div>
                <div class="comparison-controls" style="padding: 20px;">
                    <select id="comparePlanetSelect" style="background-color: #2c3e50; color: white; padding: 8px; border-radius: 4px; border: 1px solid #34495e; width: 200px; margin: 10px 0;">
                        ${compareWith.map(name => `<option value="${name}">${CELESTIAL_BODIES[name].name}</option>`).join('')}
                    </select>
                </div>
                <div id="comparisonResult"></div>
            </div>
        `;
        
        document.body.appendChild(compareDiv);
        
        const closeBtn = compareDiv.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(compareDiv);
        });
        
        const select = compareDiv.querySelector('#comparePlanetSelect');
        const updateComparison = () => {
            const selectedPlanetData = CELESTIAL_BODIES[selectedPlanet];
            const comparePlanetData = CELESTIAL_BODIES[select.value];
            
            const comparisonResult = compareDiv.querySelector('#comparisonResult');
            comparisonResult.innerHTML = `
                <div class="comparison-table">
                    <table>
                        <tr>
                            <th>Özellik</th>
                            <th>${selectedPlanetData.name}</th>
                            <th>${comparePlanetData.name}</th>
                        </tr>
                        <tr>
                            <td>Kütle</td>
                            <td>${(selectedPlanetData.mass / 1e24).toFixed(2)} × 10²⁴ kg</td>
                            <td>${(comparePlanetData.mass / 1e24).toFixed(2)} × 10²⁴ kg</td>
                        </tr>
                        <tr>
                            <td>Yarıçap</td>
                            <td>${selectedPlanetData.radius.toFixed(0)} km</td>
                            <td>${comparePlanetData.radius.toFixed(0)} km</td>
                        </tr>
                        <tr>
                            <td>Yörünge Periyodu</td>
                            <td>${(selectedPlanetData.orbitalPeriod / EARTH_YEAR).toFixed(2)} Dünya Yılı</td>
                            <td>${(comparePlanetData.orbitalPeriod / EARTH_YEAR).toFixed(2)} Dünya Yılı</td>
                        </tr>
                        <tr>
                            <td>Eksen Eğikliği</td>
                            <td>${selectedPlanetData.axisTilt.toFixed(2)}°</td>
                            <td>${comparePlanetData.axisTilt.toFixed(2)}°</td>
                        </tr>
                    </table>
                </div>
            `;
        };
        
        select.addEventListener('change', updateComparison);
        updateComparison();
        
        compareDiv.addEventListener('click', (e) => {
            if (e.target === compareDiv) {
                document.body.removeChild(compareDiv);
            }
        });
        
        compareDiv.querySelector('.modal-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (!this.paused) {
            const deltaTime = this.clock.getDelta() * this.timeScale * this.timeDirection;
            this.currentDate = new Date(this.currentDate.getTime() + deltaTime * 1000);
            
            document.getElementById('simulationDate').valueAsDate = this.currentDate;
            
            for (const [name, planet] of this.planets) {
                planet.angle += deltaTime * 0.5 * planet.speed;
                planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
                planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
                planet.mesh.rotation.y += deltaTime;
                
                if (name === 'earth') {
                    this.moonData.angle += deltaTime * 0.5 * this.moonData.speed;
                    
                    this.moonOrbit.position.x = planet.mesh.position.x;
                    this.moonOrbit.position.z = planet.mesh.position.z;
                    
                    const moonX = Math.cos(this.moonData.angle) * this.moonData.distance;
                    const moonZ = Math.sin(this.moonData.angle) * this.moonData.distance;
                    
                    this.moon.position.x = planet.mesh.position.x + moonX;
                    this.moon.position.z = planet.mesh.position.z + moonZ;
                    this.moon.rotation.y += deltaTime;
                }
                
                if (name === 'jupiter' && this.jupiterMoons) {
                    this.jupiterMoons.forEach(moon => {
                        moon.angle += deltaTime * 0.5 * moon.speed;
                        
                        moon.orbit.position.x = planet.mesh.position.x;
                        moon.orbit.position.z = planet.mesh.position.z;
                        
                        const moonX = Math.cos(moon.angle) * moon.distance;
                        const moonZ = Math.sin(moon.angle) * moon.distance;
                        
                        moon.mesh.position.x = planet.mesh.position.x + moonX;
                        moon.mesh.position.z = planet.mesh.position.z + moonZ;
                        moon.mesh.rotation.y += deltaTime;
                    });
                }
                
                const trail = this.planetTrails.get(name);
                if (trail) {
                    trail.positions.push(new THREE.Vector3(
                        planet.mesh.position.x,
                        planet.mesh.position.y,
                        planet.mesh.position.z
                    ));
                    
                    if (trail.positions.length > trail.maxPoints) {
                        trail.positions.shift();
                    }
                    
                    const positions = trail.line.geometry.attributes.position.array;
                    for (let i = 0; i < trail.positions.length; i++) {
                        const pos = trail.positions[i];
                        positions[i * 3] = pos.x;
                        positions[i * 3 + 1] = pos.y;
                        positions[i * 3 + 2] = pos.z;
                    }
                    
                    trail.line.geometry.attributes.position.needsUpdate = true;
                }
            }
            
            this.asteroidBelt.children.forEach(asteroid => {
                asteroid.userData.angle += deltaTime * 0.1 * asteroid.userData.speed;
                asteroid.position.x = Math.cos(asteroid.userData.angle) * asteroid.userData.distance;
                asteroid.position.z = Math.sin(asteroid.userData.angle) * asteroid.userData.distance;
                asteroid.rotation.y += deltaTime;
            });
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    setupCameraControls() {
        const cameraButtons = document.createElement('div');
        cameraButtons.className = 'camera-presets';
        cameraButtons.innerHTML = `
            <button id="overviewCamera">Genel Bakış</button>
            <button id="topDownCamera">Kuş Bakışı</button>
            <button id="sideViewCamera">Yan Bakış</button>
            <button id="earthViewCamera">Dünya Bakışı</button>
        `;
        document.getElementById('controls').appendChild(cameraButtons);
        
        for (const [preset, _] of Object.entries(this.cameraPresets)) {
            document.getElementById(preset + 'Camera').addEventListener('click', () => {
                this.setCameraPreset(preset);
            });
        }
    }
    
    setCameraPreset(preset) {
        const presetData = this.cameraPresets[preset];
        
        if (preset === 'earthView') {
            const earth = this.planets.get('earth');
            if (earth) {
                const offset = new THREE.Vector3(0, 10, 30);
                presetData.position.copy(earth.mesh.position).add(offset);
                presetData.target.copy(earth.mesh.position);
            }
        }
        
        const startPosition = this.camera.position.clone();
        const startTarget = this.controls.target.clone();
        const duration = 1000; 
        const startTime = Date.now();
        
        const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const eased = 1 - Math.pow(1 - progress, 3);
            
            this.camera.position.lerpVectors(startPosition, presetData.position, eased);
            this.controls.target.lerpVectors(startTarget, presetData.target, eased);
            
            if (progress < 1) {
                requestAnimationFrame(animateCamera);
            }
        };
        
        animateCamera();
    }
    
    createAsteroidBelt() {
        const asteroidCount = 2000;
        const asteroidBelt = new THREE.Group();
        
        for (let i = 0; i < asteroidCount; i++) {
            const distance = Math.random() * (180 - 160) + 160;
            const angle = Math.random() * Math.PI * 2;
            const size = Math.random() * 0.3 + 0.1;
            
            const asteroidGeometry = new THREE.SphereGeometry(size, 4, 4);
            const asteroidMaterial = new THREE.MeshPhongMaterial({
                color: 0x8B7355,
                shininess: 0.5
            });
            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
            
            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.z = Math.sin(angle) * distance;
            asteroid.position.y = (Math.random() - 0.5) * 10;
            
            asteroid.userData.angle = angle;
            asteroid.userData.distance = distance;
            asteroid.userData.speed = Math.random() * 0.5 + 0.1;
            
            asteroidBelt.add(asteroid);
        }
        
        this.scene.add(asteroidBelt);
        this.asteroidBelt = asteroidBelt;
    }
}

window.addEventListener('load', () => {
    new SolarSystemSimulation();
});
