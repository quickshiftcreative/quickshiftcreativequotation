/* ==========================================================================
   OG DESK - COMMERCIAL INTERACTIONS & 3D LOGIC (MOBILE OPTIMIZED)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Preloader Logic ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 2000); 
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

        const interactives = document.querySelectorAll('a, button, .bento-box, input, textarea, select');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if(cursorRing) {
                    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorRing.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    cursorRing.style.borderColor = 'transparent';
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

    // --- 8. Three.js: Premium Liquid Glass 3D Sphere (For Desktop/Tablet only) ---
    const canvasContainer = document.getElementById('hero-3d-canvas');
    // We only render 3D on wider screens to save mobile battery & performance
    if (canvasContainer && typeof THREE !== 'undefined' && window.innerWidth > 768) {
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        canvasContainer.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(11, 2); 
        
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.1,
            transmission: 0.95, 
            thickness: 1.5,
            transparent: true,
            wireframe: true 
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const light1 = new THREE.PointLight(0x00f0ff, 3, 100); 
        light1.position.set(20, 20, 20);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x9d4edd, 3, 100); 
        light2.position.set(-20, -20, 20);
        scene.add(light2);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        camera.position.z = 32;

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
            mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
            
            mesh.rotation.z += 0.002;
            mesh.rotation.y += 0.004;

            const scale = 1 + Math.sin(elapsedTime * 1.2) * 0.04;
            mesh.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            if (canvasContainer.clientWidth > 0) {
                camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            }
        });
    }
});
