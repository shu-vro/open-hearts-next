"use client";

import { useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import * as three from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import cloud from "./Cloud";

function generateStars(zPos = 100) {
    const sphere = new three.Mesh(
        new three.SphereGeometry(0.05, 32, 32),
        new three.MeshStandardMaterial({
            color: 0xffffff,
        })
    );
    const z = three.MathUtils.randFloat(-zPos, 0);
    const [x, y] = Array(2)
        .fill("")
        .map(() => three.MathUtils.randFloatSpread(100));
    sphere.position.set(x, y, z);
    return sphere;
}

export default function Canvas3D() {
    const canvas = useRef<HTMLCanvasElement>(null);
    const {
        palette: { mode },
    } = useTheme();

    useEffect(() => {
        if (!canvas.current) return;
        const scene = new three.Scene();
        const camera = new three.PerspectiveCamera(
            45,
            canvas.current.clientWidth / canvas.current.clientHeight,
            0.1,
            2000
        );

        const renderer = new three.WebGLRenderer({
            canvas: canvas.current,
            antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(
            canvas.current.clientWidth,
            canvas.current.clientHeight
        );

        camera.position.z = 10;
        let animation: number;
        let stats = new Stats();
        document.body.appendChild(stats.dom);

        if (mode === "dark") {
            scene.background = new three.Color(0, 0, 0);
            let stars = Array(1000)
                .fill("")
                .map(() => {
                    return generateStars();
                });
            stars.forEach((star) => {
                scene.add(star);
            });
            let dirLight = new three.DirectionalLight(0xffffff, 2);
            dirLight.position.set(0, 1, 1).normalize();
            scene.add(dirLight);
            function animate() {
                animation = requestAnimationFrame(animate);
                stats.update();
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
        } else {
            scene.background = new three.Color().setHex(0x74d0f5);
            let box = new three.Mesh(
                new three.BoxGeometry(1, 1, 1),
                new three.MeshBasicMaterial({ color: 0x00ffff })
            );
            scene.add(cloud);
            function animate() {
                animation = requestAnimationFrame(animate);
                stats.update();
                cloud.material.uniforms.cameraPos.value.copy(camera.position);
                renderer.render(scene, camera);
                // camera.position.z -= 0.05;
            }
            animate();
        }
        // RESPONSIVE.
        const resizeEvent = () => {
            if (!canvas.current) return;
            camera.aspect = window.innerWidth / canvas.current.clientHeight;
            renderer.setSize(window.innerWidth, canvas.current.clientHeight);
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", resizeEvent);
        return () => {
            window.removeEventListener("resize", resizeEvent);
            cancelAnimationFrame(animation);
        };
    }, [canvas, mode]);

    return (
        <>
            <canvas
                ref={canvas}
                className="absolute top-0 left-0 w-full h-full"
            ></canvas>
        </>
    );
}
