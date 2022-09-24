import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { RGBELoader } from "./RGBELoader.js";
import { GLTFLoader } from "./GLTFLoader.js";
import { DRACOLoader } from "./DRACOLoader.js";
import { Reflector } from "./Reflector.js";


// 创建场景
let scene = new THREE.Scene();
// 创建相机
let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    3000
);
camera.position.set(318, 162, 204);
// 创建渲染器
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 创建辅助坐标轴
// let axes = new THREE.AxesHelper(5);
// scene.add(axes);
// 添加控制器
let control = new OrbitControls(camera, renderer.domElement);

// 创建rgbe加载器
let hdrLoader = new RGBELoader();
hdrLoader.load("../scene/sky12.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
});

// 添加机器人
// 设置解压缩的加载器
let dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/gltf/");
dracoLoader.setDecoderConfig({ type: "js" });
let gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.load("./scene/moon2.glb", (gltf) => {
    console.log(gltf);
    scene.add(gltf.scene);
});
// 添加直线光
// 平行光1
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(400, 200, 300);
scene.add(directionalLight);
// 平行光2
var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight2.position.set(-400, -200, -300);
scene.add(directionalLight2);
//环境光
var ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// 添加光阵
let video = document.createElement("video");
video.src = "../scene/zp2.mp4";
video.loop = true;
video.muted = true;
video.play();
let videoTexture = new THREE.VideoTexture(video);
const videoGeoPlane = new THREE.PlaneBufferGeometry(8, 4.5);
const videoMaterial = new THREE.MeshBasicMaterial({
    map: videoTexture,
    transparent: true,
    side: THREE.DoubleSide,
    alphaMap: videoTexture,
});
const videoMesh = new THREE.Mesh(videoGeoPlane, videoMaterial);
videoMesh.position.set(0, -20, 0);
videoMesh.rotation.set(-Math.PI / 2, 0, 0);
videoMesh.scale.set(80, 80, 80);
scene.add(videoMesh);

// 添加镜面反射
// let reflectorGeometry = new THREE.PlaneBufferGeometry(100, 100);
// let reflectorPlane = new Reflector(reflectorGeometry, {
//     textureWidth: window.innerWidth,
//     textureHeight: window.innerHeight,
//     color: 0x332222,
// });
// reflectorPlane.rotation.x = -Math.PI / 2;
// scene.add(reflectorPlane);

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
});