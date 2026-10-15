/* ==========================================================================
   OG DESK - COMMERCIAL INTERACTIONS & MINIMAL 3D CHARACTER LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Preloader Logic ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1000); 
        }
    });

    // --- 2. Custom Cursor Logic (Only for Desktop) ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            if(cursorDot && cursorRing) {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
                
                setTimeout(() => {
                    cursorRing.style.left = e.clientX + 'px';
                    cursorRing.style.top = e.clientY + 'px';
                }, 50);
            }
        });

        const interactives = document.querySelectorAll('a, button, .bento-box, input, textarea, select, #hero-3d-canvas');
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
    const revealOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    reveals.forEach(reveal => { revealOnScroll.observe(reveal); });

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

    // --- 8. Three.js: MINIMAL INTERACTIVE CHARACTER (STRICT MOUSE TRACKING) ---
    const canvasContainer = document.getElementById('hero-3d-canvas');
    
    if (canvasContainer && typeof THREE !== 'undefined') {
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 35; 

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        canvasContainer.appendChild(renderer.domElement);

        // --- Create a Minimal Abstract Character (Glass Bot) ---
        const botGroup = new THREE.Group();
        scene.add(botGroup);

        // Head (Glassy Capsule)
        const headGeo = new THREE.CapsuleGeometry(5, 4, 4, 16);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9, // Very glassy
            thickness: 0.5,
            transparent: true,
            opacity: 1
        });
        const head = new THREE.Mesh(headGeo, glassMat);
        botGroup.add(head);

        // Eyes Group (These will look at the mouse)
        const eyesGroup = new THREE.Group();
        eyesGroup.position.set(0, 1, 4.8); 
        botGroup.add(eyesGroup);

        // Glowing Left Eye
        const eyeGeo = new THREE.SphereGeometry(0.8, 16, 16);
        const neonBlueMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const leftEye = new THREE.Mesh(eyeGeo, neonBlueMat);
        leftEye.position.set(-1.8, 0, 0);
        eyesGroup.add(leftEye);

        // Glowing Right Eye
        const neonPinkMat = new THREE.MeshBasicMaterial({ color: 0xff0054 });
        const rightEye = new THREE.Mesh(eyeGeo, neonPinkMat);
        rightEye.position.set(1.8, 0, 0);
        eyesGroup.add(rightEye);

        // Floating Headphones/Antennas
        const antennaGeo = new THREE.TorusGeometry(6, 0.3, 16, 100);
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.2 });
        const headphones = new THREE.Mesh(antennaGeo, darkMat);
        headphones.rotation.x = Math.PI / 2;
        botGroup.add(headphones);

        // Floating Base Ring
        const ringGeo = new THREE.TorusGeometry(8, 0.1, 16, 100);
        const neonPurpleMat = new THREE.MeshBasicMaterial({ color: 0x9d4edd });
        const baseRing = new THREE.Mesh(ringGeo, neonPurpleMat);
        baseRing.position.y = -6;
        baseRing.rotation.x = Math.PI / 2;
        botGroup.add(baseRing);

        // Lighting
        const light1 = new THREE.PointLight(0x00f0ff, 2, 100); 
        light1.position.set(20, 20, 20);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xff0054, 2, 100); 
        light2.position.set(-20, -20, 20);
        scene.add(light2);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // === STRICT MOUSE TRACKING LOGIC (NO AUTO ROTATE) ===
        let targetRotationX = 0;
        let targetRotationY = 0;

        // Calculate center of the screen
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX - windowHalfX) / windowHalfX;
            const mouseY = (e.clientY - windowHalfY) / windowHalfY;

            // Map mouse position to rotation angles
            targetRotationY = mouseX * (Math.PI / 2); // Looks left/right
            targetRotationX = mouseY * (Math.PI / 4); // Looks up/down
        });

        // Track Touch (For Mobile)
        window.addEventListener('touchmove', (e) => {
            const touchX = (e.touches[0].clientX - windowHalfX) / windowHalfX;
            const touchY = (e.touches[0].clientY - windowHalfY) / windowHalfY;
            targetRotationY = touchX * (Math.PI / 2);
            targetRotationX = touchY * (Math.PI / 4);
        }, { passive: true });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Smoothly interpolate current rotation towards target rotation
            botGroup.rotation.y += (targetRotationY - botGroup.rotation.y) * 0.05;
            botGroup.rotation.x += (targetRotationX - botGroup.rotation.x) * 0.05;

            // Subtle floating effect (bobbing up and down)
            botGroup.position.y = Math.sin(elapsedTime * 2) * 1.5;
            
            // Spin the base ring slowly for visual flair
            baseRing.rotation.z += 0.01;

            renderer.render(scene, camera);
        }
        animate();

        // Responsive Window Resize
        window.addEventListener('resize', () => {
            if (canvasContainer.clientWidth > 0) {
                camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            }
        });
    }
});
