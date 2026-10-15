/* ==========================================================================
   OG DESK - COMMERCIAL INTERACTIONS & 3D AI CHARACTER LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Preloader Logic ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1500); 
        }
    });

    // --- 2. Custom Cursor Logic (Only for Desktop) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    // Check if it's a desktop device with a mouse
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            if(cursorDot && cursorRing) {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
                
                // Slight delay for the ring trailing effect
                setTimeout(() => {
                    cursorRing.style.left = e.clientX + 'px';
                    cursorRing.style.top = e.clientY + 'px';
                }, 50);
            }
        });

        // Hover effects for all interactive elements
        const interactives = document.querySelectorAll('a, button, .bento-box, input, textarea, select');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(cursorRing) {
                    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.8)';
                    cursorRing.style.backgroundColor = 'rgba(0, 240, 255, 0.1)';
                    cursorRing.style.borderColor = '#00f0ff';
                }
            });
            el.addEventListener('mouseleave', () => {
                if(cursorRing) {
                    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorRing.style.backgroundColor = 'transparent';
                    cursorRing.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }
            });
        });
    }

    // --- 3. Scroll Progress Indicator ---
    const scrollProgress = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        if(scrollProgress) scrollProgress.style.width = scrollPercentage + '%';
    });

    // --- 4. Sticky Header ---
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // --- 5. Mobile Menu Toggle (Hamburger) ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Animate Hamburger into 'X'
            const bars = hamburger.querySelectorAll('.bar');
            if (mobileMenu.classList.contains('active')) {
                bars[0].style.transform = 'translateY(9px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-9px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                const bars = hamburger.querySelectorAll('.bar');
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            });
        });
    }

    // --- 6. Scroll Reveal Animations ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // --- 7. Bento Box Hover "Flashlight" Effect ---
    const bentoBoxes = document.querySelectorAll('.bento-box');
    bentoBoxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            box.style.setProperty('--mouse-x', `${x}%`);
            box.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // --- 8. Three.js: Interactive 3D AI Robot / Core ---
    const canvasContainer = document.getElementById('hero-3d-canvas');
    
    // Check if container exists and THREE is loaded
    if (canvasContainer && typeof THREE !== 'undefined') {
        
        // 1. Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 40; // Zoom level

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasContainer.appendChild(renderer.domElement);

        // 2. Add OrbitControls (Allows user to drag & rotate the 3D object)
        let controls;
        if (typeof THREE.OrbitControls !== 'undefined') {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true; // Smooth rotation
            controls.dampingFactor = 0.05;
            controls.enableZoom = false; // Disable scroll-zoom so page scrolling isn't blocked
            controls.autoRotate = true; // Rotates automatically
            controls.autoRotateSpeed = 2.0;
        }

        // 3. Create the 3D AI Character (A Complex Tech Core)
        const coreGroup = new THREE.Group();
        scene.add(coreGroup);

        // Inner Glowing Core (Solid)
        const innerGeo = new THREE.IcosahedronGeometry(6, 1);
        const innerMat = new THREE.MeshPhysicalMaterial({
            color: 0xff0054, // Neon Pink
            metalness: 0.5,
            roughness: 0.2,
            transmission: 0.5, // Glassy
            transparent: true
        });
        const innerCore = new THREE.Mesh(innerGeo, innerMat);
        coreGroup.add(innerCore);

        // Outer Wireframe Shell
        const outerGeo = new THREE.IcosahedronGeometry(9, 2);
        const outerMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff, // Neon Blue
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const outerShell = new THREE.Mesh(outerGeo, outerMat);
        coreGroup.add(outerShell);

        // Orbiting Ring 1
        const ring1Geo = new THREE.TorusGeometry(14, 0.2, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x9d4edd }); // Neon Purple
        const ring1 = new THREE.Mesh(ring1Geo, ringMat);
        ring1.rotation.x = Math.PI / 2;
        coreGroup.add(ring1);

        // Orbiting Ring 2
        const ring2Geo = new THREE.TorusGeometry(12, 0.1, 16, 100);
        const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White
        const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
        ring2.rotation.y = Math.PI / 3;
        coreGroup.add(ring2);

        // 4. Lighting
        const light1 = new THREE.PointLight(0x00f0ff, 3, 100); 
        light1.position.set(20, 20, 20);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xff0054, 3, 100); 
        light2.position.set(-20, -20, 20);
        scene.add(light2);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // 5. Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Animate internal parts independently
            innerCore.rotation.x += 0.01;
            innerCore.rotation.y += 0.01;
            
            outerShell.rotation.x -= 0.005;
            outerShell.rotation.y -= 0.005;

            ring1.rotation.x += 0.02;
            ring1.rotation.y += 0.01;
            
            ring2.rotation.y -= 0.03;
            ring2.rotation.z += 0.01;

            // Breathing effect
            const scale = 1 + Math.sin(elapsedTime * 2) * 0.05;
            coreGroup.scale.set(scale, scale, scale);

            // Update controls if user is dragging
            if (controls) controls.update();

            renderer.render(scene, camera);
        }
        animate();

        // 6. Responsive Window Resize
        window.addEventListener('resize', () => {
            if (canvasContainer.clientWidth > 0) {
                camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            }
        });
    }
});
