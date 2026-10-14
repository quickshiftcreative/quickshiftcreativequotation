/* ==========================================================================
   OG DESK - COMMERCIAL INTERACTIONS & 3D LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Preloader Logic ---
    // Wait for the window to fully load (including all assets like images & 3D library)
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            // Set a slight timeout to let the progress bar animation finish
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
            }, 2000); 
        }
    });

    // --- 2. Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    
    // Only activate custom cursor if it's a desktop device (pointer: fine)
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            if(cursorDot && cursorRing) {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
                
                // Add a slight delay (50ms) to the ring for a smooth trailing effect
                setTimeout(() => {
                    cursorRing.style.left = e.clientX + 'px';
                    cursorRing.style.top = e.clientY + 'px';
                }, 50);
            }
        });

        // Hover effects for interactive elements (Links, Buttons, Bento Boxes)
        const interactives = document.querySelectorAll('a, button, .bento-box, input, textarea');
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

    // --- 5. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Animate Hamburger into 'X'
            const bars = hamburger.querySelectorAll('.bar');
            if (mobileMenu.classList.contains('active')) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });

        // Close menu when clicking any mobile link
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

    // --- 6. Scroll Reveal Animations (Intersection Observer) ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of element is visible
        rootMargin: "0px 0px -50px 0px"
    };
    
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Unobserve to animate only once
            }
        });
    }, revealOptions);
    
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // --- 7. Bento Box Hover "Flashlight" Effect ---
    // Tracks mouse position inside the bento box and updates CSS variables
    const bentoBoxes = document.querySelectorAll('.bento-box');
    bentoBoxes.forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            // Calculate mouse position relative to the box in percentages
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            // Pass values to CSS for the radial gradient glow
            box.style.setProperty('--mouse-x', `${x}%`);
            box.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // --- 8. Three.js: Premium Liquid Glass 3D Sphere ---
    const canvasContainer = document.getElementById('hero-3d-canvas');
    if (canvasContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        // Alpha: true ensures background is transparent
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio); // Crisp rendering on high-DPI (Retina) screens
        canvasContainer.appendChild(renderer.domElement);

        // Icosahedron gives a complex, faceted, tech-agency look
        const geometry = new THREE.IcosahedronGeometry(11, 2); 
        
        // Physical Material gives the 'Glassmorphism' 3D effect
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.1,
            transmission: 0.95, // Glass effect
            thickness: 1.5,
            transparent: true,
            wireframe: true // Makes it look like a glowing digital blueprint
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Neon Lighting setup to reflect our brand colors
        const light1 = new THREE.PointLight(0x00f0ff, 3, 100); // Neon Blue
        light1.position.set(20, 20, 20);
        scene.add(light1);

        const light2 = new THREE.PointLight(0x9d4edd, 3, 100); // Neon Purple
        light2.position.set(-20, -20, 20);
        scene.add(light2);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);

        camera.position.z = 32;

        // Mouse Parallax Effect Variables
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

            // Parallax tracking (smoothly follow cursor)
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
            mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
            
            // Continuous baseline rotation
            mesh.rotation.z += 0.002;
            mesh.rotation.y += 0.004;

            // Liquid breathing (scaling up and down smoothly)
            const scale = 1 + Math.sin(elapsedTime * 1.2) * 0.04;
            mesh.scale.set(scale, scale, scale);

            renderer.render(scene, camera);
        }
        animate();

        // Responsive handling if browser window resizes
        window.addEventListener('resize', () => {
            camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        });
    }
});
