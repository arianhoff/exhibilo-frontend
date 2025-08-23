import React, { useMemo, useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, Bounds, AdaptiveDpr, Grid, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { GLTFLoader } from "three-stdlib";
import { OBJLoader } from "three-stdlib";
import { STLLoader } from "three-stdlib";
import { DRACOLoader } from "three-stdlib";

/**
 * Exhibilo 3D Viewer — single-file React component ready for Vite.
 *
 * Features
 * - Drag & drop or file picker (.glb/.gltf/.obj/.stl)
 * - Also accepts a URL via ?model=<url>
 * - OrbitControls, auto-frame, grid floor, environment lighting
 * - Dark/light UI, background toggle, wireframe toggle
 * - Mobile friendly with adaptive DPR
 * - ✅ DRACO support for compressed .glb/.gltf
 *
 * Usage
 * <Exhibilo3DViewer />
 *
 * Install deps:
 *   npm i three @react-three/fiber @react-three/drei three-stdlib
 *
 * DRACO decoders:
 *   Opción rápida (CDN): en la constante DRACO_PATH dejá
 *     "https://www.gstatic.com/draco/v1/decoders/"
 *   Opción producción (local): copiá los archivos de
 *     node_modules/three/examples/jsm/libs/draco/* a public/draco/
 */

// 🔧 Cambiá esto a "/draco/" si copiaste los decoders localmente a /public/draco
const DRACO_PATH = "https://www.gstatic.com/draco/v1/decoders/";

function useUrlModelParam() {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const m = u.searchParams.get("model");
      if (m) {
        let dec = m;
        try { dec = decodeURIComponent(m); } catch {}
        setUrl(dec);
      }
    } catch {}
  }, []);
  return url;
}


function useModel(source) {
  // `source` can be a File object or a string URL
  const [object, setObject] = useState(null);
  const [error, setError] = useState(null);
  const [bboxSize, setBboxSize] = useState(1);

  useEffect(() => {
    let revokedUrl = null;
    let cancelled = false;

    async function load() {
      if (!source) {
        setObject(null);
        setError(null);
        return;
      }
      setError(null);
      setObject(null);

      let url = source;
      let name = "";

      if (source instanceof File) {
        url = URL.createObjectURL(source);
        revokedUrl = url;
        name = source.name.toLowerCase();
      } else if (typeof source === "string") {
        name = source.toLowerCase();
      }

      // 🔎 Validar que la URL no devuelve HTML (SPA fallback / 404)
      let absoluteUrl = url;
      if (!(source instanceof File)) {
        absoluteUrl = new URL(url, window.location.origin).href;
        const head = await fetch(absoluteUrl, { method: "HEAD" });
        if (!head.ok) {
          throw new Error(`No se encontró el modelo (${head.status}) en ${absoluteUrl}`);
        }
        const ct = (head.headers.get("content-type") || "").toLowerCase();
        if (ct.includes("text/html")) {
          throw new Error(`La URL devuelve HTML, no un modelo: ${absoluteUrl}`);
        }
      }

      const ext = name.split(".").pop()?.replace(/\?.*$/, "");
      try {
        let obj3d = null;

        if (ext === "glb" || ext === "gltf") {
          const gltfLoader = new GLTFLoader();
          const draco = new DRACOLoader();
          draco.setDecoderPath(DRACO_PATH);
          gltfLoader.setDRACOLoader(draco);
          const gltf = await gltfLoader.loadAsync(absoluteUrl);
          obj3d = gltf.scene || gltf.scenes?.[0];
        } else if (ext === "obj") {
          const obj = await new OBJLoader().loadAsync(absoluteUrl);
          obj3d = obj;
        } else if (ext === "stl") {
          const geom = await new STLLoader().loadAsync(absoluteUrl);
          const mat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.1, roughness: 0.8 });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          obj3d = mesh;
        } else {
          throw new Error("Formato no soportado. Usa .glb, .gltf, .obj o .stl");
        }

        if (!obj3d) throw new Error("No se pudo cargar el modelo");

        // Normalizar tamaño y centrar
        const box = new THREE.Box3().setFromObject(obj3d);
        const size = new THREE.Vector3();
        box.getSize(size);
        const center = new THREE.Vector3();
        box.getCenter(center);
        obj3d.position.sub(center);
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const targetSize = 2.5;
        const scale = targetSize / maxAxis;
        obj3d.scale.setScalar(scale);

        const box2 = new THREE.Box3().setFromObject(obj3d);
        const size2 = new THREE.Vector3();
        box2.getSize(size2);

        if (!cancelled) {
          setBboxSize(Math.max(size2.x, size2.y, size2.z));
          setObject(obj3d);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || String(e));
      } finally {
        if (revokedUrl) URL.revokeObjectURL(revokedUrl);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [source]);

  return { object, error, bboxSize };
}


function Model({ object }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current && object) {
      ref.current.add(object);
    }
    return () => {
      if (ref.current && object) {
        ref.current.remove(object);
      }
    };
  }, [object]);
  return <group ref={ref} />;
}

function LoaderOverlay() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="rounded-xl px-4 py-2 text-sm bg-black/70 text-white shadow-lg">
        Cargando… {Math.round(progress)}%
      </div>
    </Html>
  );
}

export default function Exhibilo3DViewer() {
  const urlParam = useUrlModelParam();
  const [file, setFile] = useState(null);
  const [bg, setBg] = useState("#0c0c0c");
  const [wire, setWire] = useState(false);
  const [source, setSource] = useState(null);

  useEffect(() => {
    // Priority: file > ?model url
    if (file) setSource(file);
    else if (urlParam) setSource(urlParam);
    else setSource(null);
  }, [file, urlParam]);

  const { object, error, bboxSize } = useModel(source);

  // Wireframe toggle (only affects MeshStandardMaterial descendants)
  useEffect(() => {
    if (!object) return;
    object.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = wire));
        } else {
          child.material.wireframe = wire;
        }
      }
    });
  }, [object, wire]);

  const onDrop = (ev) => {
    ev.preventDefault();
    const f = ev.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const onPick = (ev) => {
    const f = ev.target.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div
      className="w-full h-[75vh] relative select-none"
      style={{ background: bg }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <Canvas shadows camera={{ position: [3, 2, 5], fov: 45 }} dpr={[1, 2]}> 
        <Suspense fallback={<LoaderOverlay />}> 
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1.1} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          {/* auto-fit bounds based on bbox */}
          <Bounds fit clip observe margin={1.2}>
            {object && <Model object={object} />}
          </Bounds>
          <Grid infiniteGrid fadeDistance={40} sectionThickness={1} cellThickness={0.5} position={[0, - (bboxSize * 0.55), 0]} />
          <Environment preset="warehouse" />
          <OrbitControls makeDefault enableDamping dampingFactor={0.05} />
          <AdaptiveDpr pixelated />
        </Suspense>
      </Canvas>

      {/* UI overlay */}
      <div className="absolute left-3 top-3 flex items-center gap-2 text-[12px] md:text-[13px]">
        <label className="inline-flex items-center gap-2 bg-white/90 hover:bg-white rounded-lg px-3 py-2 shadow cursor-pointer">
          <input type="file" accept=".glb,.gltf,.obj,.stl" className="hidden" onChange={onPick} />
          <span role="img" aria-label="upload">📁</span> Cargar modelo
        </label>
        <button onClick={() => setWire((w) => !w)} className="bg-white/90 hover:bg-white rounded-lg px-3 py-2 shadow">
          {wire ? "Wireframe: ON" : "Wireframe: OFF"}
        </button>
        <button onClick={() => setBg((b) => (b === "#0c0c0c" ? "#f5f5f7" : "#0c0c0c"))} className="bg-white/90 hover:bg-white rounded-lg px-3 py-2 shadow">
          Fondo {bg === "#0c0c0c" ? "claro" : "oscuro"}
        </button>
      </div>

      {!object && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/90 max-w-sm px-6">
            <div className="text-3xl mb-2">🧩</div>
            <div className="font-medium mb-1">Arrastrá tu modelo 3D aquí</div>
            <div className="text-sm opacity-80">Formatos: .glb, .gltf, .obj, .stl<br/>O pasá una URL con ?model=https://...</div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute left-3 bottom-3 max-w-lg bg-red-600 text-white rounded-lg px-3 py-2 shadow">
          Error: {String(error)}
        </div>
      )}
    </div>
  );
}