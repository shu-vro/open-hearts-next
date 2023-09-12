"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import WebGL from "three/examples/jsm/capabilities/WebGL.js";
import { cloudGeometry, cloudMaterial } from "../(after-login)/profile/Cloud";

export default function Page() {
    const canvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvas.current) return;
        if (WebGL.isWebGL2Available() === false) {
            document.body.appendChild(WebGL.getWebGL2ErrorMessage());
        }

        if (!canvas.current) return;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas.current,
            antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(
            canvas.current.clientWidth,
            canvas.current.clientHeight
        );

        const scene = new THREE.Scene();
        scene.background = new THREE.Color().setHex(0x000000);

        const camera = new THREE.PerspectiveCamera(
            45,
            canvas.current.clientWidth / canvas.current.clientHeight,
            0.1,
            2000
        );
        camera.position.z = 10;

        new OrbitControls(camera, renderer.domElement);

        const group = new THREE.Group();

        const cloud1 = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud1.position.x = -10;
        cloud1.position.y = -5;
        const cloud2 = new THREE.Mesh(cloudGeometry, cloudMaterial);
        const cloud3 = new THREE.Mesh(cloudGeometry, cloudMaterial);
        const cloud4 = new THREE.Mesh(cloudGeometry, cloudMaterial);

        group.add(cloud1, cloud2, cloud3, cloud4);

        scene.add(group);

        // const parameters = {
        //     threshold: 0.25,
        //     opacity: 0.25,
        //     range: 0.1,
        //     steps: 100,
        // };

        // function update() {
        //     cloudMaterial.uniforms.threshold.value = parameters.threshold;
        //     cloudMaterial.uniforms.opacity.value = parameters.opacity;
        //     cloudMaterial.uniforms.range.value = parameters.range;
        //     cloudMaterial.uniforms.steps.value = parameters.steps;
        // }

        // const gui = new GUI();
        // gui.add(parameters, "threshold", 0, 1, 0.01).onChange(update);
        // gui.add(parameters, "opacity", 0, 1, 0.01).onChange(update);
        // gui.add(parameters, "range", 0, 1, 0.01).onChange(update);
        // gui.add(parameters, "steps", 0, 200, 1).onChange(update);

        window.addEventListener("resize", onWindowResize);

        function onWindowResize() {
            if (!canvas.current) return;
            camera.aspect = window.innerWidth / canvas.current.clientHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, canvas.current.clientHeight);
        }

        function animate() {
            requestAnimationFrame(animate);

            cloud1.material.uniforms.cameraPos.value.copy(camera.position);
            cloud2.material.uniforms.cameraPos.value.copy(camera.position);
            cloud3.material.uniforms.cameraPos.value.copy(camera.position);

            // cloud.material.uniforms.frame.value++;

            renderer.render(scene, camera);
        }

        animate();
    }, [canvas]);

    return <canvas ref={canvas} className="w-full h-full"></canvas>;
}
