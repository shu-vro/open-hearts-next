"use client";

import { useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function generateStars(zPos = 100) {
    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 32, 32),
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
        })
    );
    const z = THREE.MathUtils.randFloat(-zPos, 0);
    const [x, y] = Array(2)
        .fill("")
        .map(() => THREE.MathUtils.randFloatSpread(100));
    sphere.position.set(x, y, z);
    return sphere;
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
        let animation: number;

        scene.background = new THREE.Color(0, 0, 0);
        let stars = Array(1000)
            .fill("")
            .map(() => {
                return generateStars();
            });
        stars.forEach((star) => {
            scene.add(star);
        });
        let dirLight = new THREE.DirectionalLight(0xffffff, 2);
        dirLight.position.set(0, 1, 1).normalize();
        scene.add(dirLight);
        function animate() {
            animation = requestAnimationFrame(animate);
            renderer.render(scene, camera);
            camera.position.z -= 0.5;
            camera.rotateZ(0.003);
            stars.forEach((star) => {
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
            <canvas
                ref={canvas}
                className="fixed top-0 left-0 w-full h-full"
            ></canvas>
        </>
    );
}
