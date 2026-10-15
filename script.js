/* ==========================================================================
   OG DESK - BUG-FREE MINIMAL 3D CHARACTER LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- Preloader ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 1000); 
        }
    });

    // --- Cursor Logic ---
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

    // --- Scroll Events & Nav ---
    const header = document.querySelector('.glass-header');
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
        const scrollProgress = document.getElementById('scroll-progress');
        if(scrollProgress) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            scrollProgress.style.width = (scrollTop / scrollHeight) * 100 + '%';
        }
    });

    // --- Mobile Menu ---
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
    }

    // --- Reveal Animations ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealOnScroll.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
    reveals.forEach(reveal => revealOnScroll.observe(reveal));

    // --- Bento Glow ---
    document.querySelectorAll('.bento-box').forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            box.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
            box.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        });
    });

    // ===================================================================
    // 8. 100% BUG-FREE MINIMAL 3D BOT (STRICT MOUSE TRACKING)
    // ===================================================================
    const canvasContainer = document.getElementById('hero-3d-canvas');
    
    if (canvasContainer && typeof THREE !== 'undefined') {
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        camera.position.z = 25; // Zoom level

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
        canvasContainer.appendChild(renderer.domElement);

        // --- BOT GROUP ---
        const botGroup = new THREE.Group();
        scene.add(botGroup);

        // 1. Head (Solid Shiny Sphere - SAFE IN ALL THREE.JS VERSIONS)
        const headGeo = new THREE.SphereGeometry(4, 32, 32);
        const glassMat = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100,
            transparent: true,
            opacity: 0.9
        });
        const head = new THREE.Mesh(headGeo, glassMat);
        botGroup.add(head);

        // 2. Neon Eyes Group
        const eyesGroup = new THREE.Group();
        eyesGroup.position.set(0, 0.5, 3.2); // Pushed forward so they stick out of the sphere
        botGroup.add(eyesGroup);

        const eyeGeo = new THREE.SphereGeometry(0.7, 16, 16);
        
        const leftEye = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0x00f0ff })); // Cyan
        leftEye.position.set(-1.5, 0, 0);
        eyesGroup.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeo, new THREE.MeshBasicMaterial({ color: 0xff0054 })); // Pink
        rightEye.position.set(1.5, 0, 0);
        eyesGroup.add(rightEye);

        // 3. Floating Headphones / Ears (Cylinders)
        const earGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
        const darkMat = new THREE.MeshPhongMaterial({ color: 0x222222, shininess: 50 });
        
        const leftEar = new THREE.Mesh(earGeo, darkMat);
        leftEar.rotation.z = Math.PI / 2;
        leftEar.position.set(-4.2, 0, 0);
        botGroup.add(leftEar);

        const rightEar = new THREE.Mesh(earGeo, darkMat);
        rightEar.rotation.z = Math.PI / 2;
        rightEar.position.set(4.2, 0, 0);
        botGroup.add(rightEar);

        // 4. Floating Base Ring
        const ringGeo = new THREE.TorusGeometry(6, 0.1, 16, 100);
        const neonPurpleMat = new THREE.MeshBasicMaterial({ color: 0x9d4edd });
        const baseRing = new THREE.Mesh(ringGeo, neonPurpleMat);
        baseRing.position.y = -5;
        baseRing.rotation.x = Math.PI / 2;
        botGroup.add(baseRing);

        // --- LIGHTING ---
        const light1 = new THREE.PointLight(0x00f0ff, 2, 100); 
        light1.position.set(10, 10, 10);
        scene.add(light1);

        const light2 = new THREE.PointLight(0xff0054, 2, 100); 
        light2.position.set(-10, -10, 10);
        scene.add(light2);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // --- MOUSE TRACKING LOGIC ---
        let targetRotationX = 0;
        let targetRotationY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        window.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX - windowHalfX) / windowHalfX;
            const mouseY = (e.clientY - windowHalfY) / windowHalfY;

            // Limit turning radius
            targetRotationY = mouseX * (Math.PI / 1.5); // Looks left/right
            targetRotationX = mouseY * (Math.PI / 4); // Looks up/down
        });

        window.addEventListener('touchmove', (e) => {
            const touchX = (e.touches[0].clientX - windowHalfX) / windowHalfX;
            const touchY = (e.touches[0].clientY - windowHalfY) / windowHalfY;
            targetRotationY = touchX * (Math.PI / 1.5);
            targetRotationX = touchY * (Math.PI / 4);
        }, { passive: true });

        // --- ANIMATION LOOP ---
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            // Smooth interpolation towards mouse position
            botGroup.rotation.y += (targetRotationY - botGroup.rotation.y) * 0.05;
            botGroup.rotation.x += (targetRotationX - botGroup.rotation.x) * 0.05;

            // Breathing effect
            botGroup.position.y = Math.sin(elapsedTime * 2) * 1;
            
            // Spin ring
            baseRing.rotation.z += 0.01;

            renderer.render(scene, camera);
        }
        animate();

        // --- RESIZE LOGIC ---
        window.addEventListener('resize', () => {
            if (canvasContainer.clientWidth > 0) {
                camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            }
        });
    }
});
