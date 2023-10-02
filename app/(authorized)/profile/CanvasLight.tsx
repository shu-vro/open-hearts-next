"use client";

import { useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import cloudT from "./cloud.png";

export const canvasClasses = "fixed top-0 left-0 w-full h-full z-[-1]";

function generateClouds(
    zPos = 100,
    fogData = {
        color: 0x000000,
        near: 0.1,
        far: 1000,
    }
) {
    var texture = new THREE.TextureLoader().load(cloudT.src);

    const fog = new THREE.Fog(fogData.color, fogData.near, fogData.far);

    const material = new THREE.ShaderMaterial({
        uniforms: {
            map: { type: "t", value: texture } as THREE.IUniform<any>,
            fogColor: { type: "c", value: fog.color } as THREE.IUniform<any>,
            fogNear: { type: "f", value: fog.near } as THREE.IUniform<any>,
            fogFar: { type: "f", value: fog.far } as THREE.IUniform<any>,
        },
        vertexShader: `
                        varying vec2 vUv;
    
                        void main() {
    
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
                        }`,
        fragmentShader: `
                        uniform sampler2D map;
    
                        uniform vec3 fogColor;
                        uniform float fogNear;
                        uniform float fogFar;
    
                        varying vec2 vUv;
    
                        void main() {
    
                            float depth = gl_FragCoord.z / gl_FragCoord.w;
                            float fogFactor = smoothstep( fogNear, fogFar, depth );
    
                            gl_FragColor = texture2D( map, vUv );
                            gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
                            gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );
    
                        }`,
        depthWrite: false,
        depthTest: false,
        transparent: true,
    });
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            THREE.MathUtils.randFloat(3, 8),
            THREE.MathUtils.randFloat(3, 8)
        ),
        material
    );
    const y = THREE.MathUtils.randFloat(-10, -1);
    const x = THREE.MathUtils.randFloatSpread(100);
    const z = THREE.MathUtils.randFloat(-zPos, 0);
    plane.position.set(x, y, z);
    return plane;
}

export default function CanvasDark() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const {
        palette: { mode },
    } = useTheme();

    useEffect(() => {
        if (!canvas.current) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas.current,
            antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        camera.position.z = 10;
        scene.background = new THREE.Color(0x326696);
        const fogColor = 0x4584b4,
            fogNear = -100,
            fogFar = 3000;
        scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
        let animation: number;

        let clouds = Array(1000)
            .fill("")
            .map(() => {
                return generateClouds(100, {
                    near: fogNear,
                    far: fogFar,
                    color: fogColor,
                });
            });
        clouds.forEach((star) => {
            scene.add(star);
        });
        function animate() {
            animation = requestAnimationFrame(animate);
            renderer.render(scene, camera);
            camera.position.z -= 0.08;
            clouds.forEach((star) => {
                if (star.position.z - camera.position.z > 20) {
                    star.position.z -= 100;
                }
            });
        }
        animate();

        // RESPONSIVE.
        const resizeEvent = () => {
            if (!canvas.current) return;
            camera.aspect = window.innerWidth / window.innerHeight;
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", resizeEvent);
        return () => {
            window.removeEventListener("resize", resizeEvent);
            cancelAnimationFrame(animation);
            renderer.dispose();
        };
    }, [canvas, mode]);

    return (
        <>
            <canvas ref={canvas} className={canvasClasses}></canvas>
        </>
    );
}
