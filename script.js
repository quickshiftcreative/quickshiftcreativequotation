// 1. Custom Cursor
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    if(cursor && follower){
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top = e.clientY + 'px';
        }, 50);
    }
});

// Cursor Hover Effects
const hoverElements = document.querySelectorAll('a, .bento-item, button, input, select, textarea');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        if(cursor) {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = 'rgba(255,255,255,0.1)';
        }
    });
    el.addEventListener('mouseleave', () => {
        if(cursor) {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'transparent';
        }
    });
});

// 2. THREE.JS Abstract Premium Sphere (For Home Page Only)
const canvasContainer = document.getElementById('canvas-container');

if (canvasContainer && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvasContainer.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(12, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const pointLight = new THREE.PointLight(0x00f0ff, 2, 100);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x9d4edd, 2, 100);
    pointLight2.position.set(-20, -20, -20);
    scene.add(pointLight2);

    camera.position.z = 40;

    let mouseX = 0; let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.x += 0.002;
        sphere.rotation.y += 0.003;
        sphere.position.x += (mouseX * 3 - sphere.position.x) * 0.05;
        sphere.position.y += (mouseY * 3 - sphere.position.y) * 0.05;
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        sphere.scale.set(scale, scale, scale);
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
    });
}
