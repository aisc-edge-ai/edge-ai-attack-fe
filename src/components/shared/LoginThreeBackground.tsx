import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function LoginThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<{
    cctv: HTMLDivElement | null;
    car: HTMLDivElement | null;
    ai: HTMLDivElement | null;
  }>({
    cctv: null,
    car: null,
    ai: null,
  });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.04);

    let width = container.clientWidth;
    let height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 2, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // 이전에 있던 캔버스 제거
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x0088ff, 2, 50);
    blueLight.position.set(5, 5, 5);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0x8800ff, 2, 50);
    purpleLight.position.set(-5, -5, 5);
    scene.add(purpleLight);

    function createCyberMaterial(colorHex: number, emissiveHex = 0x000000) {
      return new THREE.MeshPhysicalMaterial({
        color: colorHex,
        emissive: emissiveHex,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.8,
        clearcoat: 1.0,
      });
    }

    function createWireMaterial(colorHex: number) {
      return new THREE.MeshBasicMaterial({
        color: colorHex,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
    }

    function createHoloMesh(geometry: THREE.BufferGeometry, matColor: number, wireColor: number, emissive = 0x000000) {
      const group = new THREE.Group();
      const solid = new THREE.Mesh(geometry, createCyberMaterial(matColor, emissive));
      const wire = new THREE.Mesh(geometry, createWireMaterial(wireColor));
      wire.scale.set(1.01, 1.01, 1.01);
      group.add(solid);
      group.add(wire);
      return group;
    }

    function createCCTV() {
      const group = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(1.2, 0.8, 2);
      const body = createHoloMesh(bodyGeo, 0x112233, 0x00ffff);
      group.add(body);

      const lensGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
      lensGeo.rotateX(Math.PI / 2);
      const lens = createHoloMesh(lensGeo, 0x000000, 0x00ffff, 0x00ffff);
      lens.position.z = 1;
      group.add(lens);

      const coreGeo = new THREE.SphereGeometry(0.2, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.z = 1.1;
      group.add(core);

      const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 1);
      const arm = createHoloMesh(armGeo, 0x112233, 0x00ffff);
      arm.position.y = 0.8;
      group.add(arm);

      return group;
    }

    function createAutoCar() {
      const group = new THREE.Group();
      const baseGeo = new THREE.BoxGeometry(2.5, 0.5, 5);
      const base = createHoloMesh(baseGeo, 0x112233, 0x4488ff);
      group.add(base);

      const cabinGeo = new THREE.BoxGeometry(1.8, 0.8, 2.5);
      const cabin = createHoloMesh(cabinGeo, 0x051020, 0x4488ff);
      cabin.position.set(0, 0.65, -0.5);
      group.add(cabin);

      const lidarGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
      const lidar = createHoloMesh(lidarGeo, 0x000000, 0x00ff00, 0x00ff00);
      lidar.position.set(0, 1.2, -0.5);
      lidar.name = 'lidar';
      group.add(lidar);

      const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.2, 16);
      wheelGeo.rotateZ(Math.PI / 2);
      const positions = [
        [-1.3, -0.2, 1.5], [1.3, -0.2, 1.5],
        [-1.3, -0.2, -1.5], [1.3, -0.2, -1.5]
      ];
      positions.forEach(pos => {
        const wheel = createHoloMesh(wheelGeo, 0x051020, 0x4488ff);
        wheel.position.set(pos[0], pos[1], pos[2]);
        group.add(wheel);
      });

      return group;
    }

    function createAICore() {
      const group = new THREE.Group();
      const coreGeo = new THREE.IcosahedronGeometry(0.8, 1);
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x8800ff,
        emissive: 0x8800ff,
        emissiveIntensity: 0.8,
        wireframe: true
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      group.add(core);

      const ring1Geo = new THREE.TorusGeometry(1.5, 0.05, 16, 50);
      const ring1 = createHoloMesh(ring1Geo, 0x112233, 0xaa44ff);
      ring1.name = 'ring1';
      group.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(2.0, 0.02, 16, 50);
      const ring2 = createHoloMesh(ring2Geo, 0x112233, 0x44aaff);
      ring2.rotation.x = Math.PI / 2;
      ring2.name = 'ring2';
      group.add(ring2);

      return group;
    }

    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const objCCTV = createCCTV();
    objCCTV.scale.set(1.6, 1.6, 1.6);
    objCCTV.position.set(-3.5, 0.5, 0);
    objectsGroup.add(objCCTV);

    const objCar = createAutoCar();
    objCar.scale.set(1.6, 1.6, 1.6);
    objCar.position.set(2, -4, 2);
    objCar.rotation.y = -Math.PI / 6;
    objectsGroup.add(objCar);

    const objAI = createAICore();
    objAI.scale.set(1.6, 1.6, 1.6);
    objAI.position.set(3.5, 3, -4);
    objectsGroup.add(objAI);

    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 400;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.5
    });
    const particlesMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouseX = (event.clientX - windowHalfX) * 0.002;
        mouseY = (event.clientY - windowHalfY) * 0.002;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const vector = new THREE.Vector3();
    const updateLabels = () => {
        const canvasBounds = container.getBoundingClientRect();

        const updateSingleLabel = (object: THREE.Object3D, labelElement: HTMLDivElement | null, offsetY = 0) => {
            if (!labelElement) return;

            vector.setFromMatrixPosition(object.matrixWorld);
            vector.y += offsetY;
            vector.project(camera);

            if (vector.z > 1) {
                labelElement.style.opacity = '0';
                return;
            }

            const x = (vector.x * 0.5 + 0.5) * canvasBounds.width;
            const y = (-(vector.y * 0.5) + 0.5) * canvasBounds.height;

            labelElement.style.transform = `translate(${x}px, ${y}px)`;
            labelElement.style.opacity = '0.9';
        };

        updateSingleLabel(objCCTV, labelsRef.current.cctv, 1.5);
        updateSingleLabel(objCar, labelsRef.current.car, 1.5);
        updateSingleLabel(objAI, labelsRef.current.ai, 2.5);
    };

    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        objCCTV.position.y = 0.5 + Math.sin(time * 1.2) * 0.3;
        objCar.position.y = -4 + Math.sin(time * 0.8) * 0.2;
        objAI.position.y = 3 + Math.sin(time * 1.5) * 0.4;

        objCCTV.rotation.y = Math.sin(time * 0.5) * 0.6;
        
        const lidar = objCar.getObjectByName("lidar");
        if(lidar) lidar.rotation.y += 0.1;

        const ring1 = objAI.getObjectByName("ring1");
        const ring2 = objAI.getObjectByName("ring2");
        if(ring1) { ring1.rotation.y += 0.01; ring1.rotation.z += 0.02; }
        if(ring2) { ring2.rotation.x += 0.015; ring2.rotation.y += 0.01; }
        if (objAI.children[0]) {
           objAI.children[0].rotation.y -= 0.005;
        }

        particlesMesh.rotation.y = time * 0.05;
        particlesMesh.position.y = (time * 0.5) % 10 - 5;

        targetX = mouseX * 2;
        targetY = mouseY * 2;
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY + 2 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        updateLabels();
    };
    animate();

    const handleResize = () => {
        width = container.clientWidth;
        height = container.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        cancelAnimationFrame(animationFrameId);
        document.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (container && renderer.domElement) {
           try {
              container.removeChild(renderer.domElement);
           } catch {
             // Ignore
           }
        }
        renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#030712] pointer-events-none">
      {/* 백그라운드 그리드 효과 */}
      <div 
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}
      />
      
      {/* 캔버스 컨테이너 (위에서 pointer-events-none 설정했지만 캔버스는 이벤트 받을 수 있게 조정 가능) */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-auto cursor-crosshair" />

      {/* 그라데이션 오버레이 (텍스트 가독성) */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10 pointer-events-none" />

      {/* 3D 객체 라벨스 (position absolute로 추적됨) */}
      <style dangerouslySetInnerHTML={{__html: `
        .cyber-label {
            position: absolute;
            top: 0; left: 0;
            transform-origin: top left;
            pointer-events: none;
            transition: opacity 0.2s ease-out;
            text-shadow: 0 0 5px rgba(6, 182, 212, 0.8);
            z-index: 10;
        }
      `}} />
      <div ref={el => { labelsRef.current.cctv = el; }} className="cyber-label opacity-0" id="label-cctv">
          <div className="border-t-2 border-l-2 border-cyan-400 p-1 pl-2 text-[10px] font-mono text-cyan-300 bg-gray-900/40 backdrop-blur-sm tracking-widest min-w-max">
              [NODE_01: SURVEILLANCE]
          </div>
      </div>
      <div ref={el => { labelsRef.current.car = el; }} className="cyber-label opacity-0" id="label-car">
          <div className="border-t-2 border-l-2 border-blue-400 p-1 pl-2 text-[10px] font-mono text-blue-300 bg-gray-900/40 backdrop-blur-sm tracking-widest min-w-max">
              [NODE_02: AUTONOMOUS]
          </div>
      </div>
      <div ref={el => { labelsRef.current.ai = el; }} className="cyber-label opacity-0" id="label-ai">
          <div className="border-t-2 border-l-2 border-purple-400 p-1 pl-2 text-[10px] font-mono text-purple-300 bg-gray-900/40 backdrop-blur-sm tracking-widest min-w-max">
              [NODE_03: AI_CORE]
          </div>
      </div>
    </div>
  );
}
