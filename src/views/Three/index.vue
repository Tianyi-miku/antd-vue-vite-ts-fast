<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="content" ref="theree" id="container">
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator'

let scene: any
let camera: any
let render: any
let controls: any
let cubeTexture: any
onMounted(async () => {
  init()
  initImg()
})

const initImg = () => {
  const genCubeUrls = function (prefix, postfix) {
    return [
      prefix + 'px' + postfix, prefix + 'nx' + postfix,
      prefix + 'py' + postfix, prefix + 'ny' + postfix,
      prefix + 'pz' + postfix, prefix + 'nz' + postfix
    ]
  }
  const urls = genCubeUrls('/img/pisa/', '.png')
  new THREE.CubeTextureLoader().load(urls, (CubeTexture1: { encoding: any; }) => {
    cubeTexture = CubeTexture1
    scene.background = CubeTexture1
    scene.background = CubeTexture1
    CubeTexture1.encoding = THREE.sRGBEncoding

    const lightProbe = new THREE.LightProbe()
    lightProbe.intensity = 0.1
    scene.add(lightProbe)
    lightProbe.copy(LightProbeGenerator.fromCubeTexture(CubeTexture1))
    addUde()
  })
}

const addUde = () => {
  const geometry = new THREE.SphereGeometry(20, 20, 20)
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0,
    envMap: cubeTexture,
    envMapIntensity: 0.1
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.material.envMapIntensity = 0.9
  scene.add(cube)
  animate()
}

const animate = () => {
  controls.update()
  render.render(scene, camera)
  window.requestAnimationFrame(animate)
}

const init = () => {
  const content: HTMLElement = document.getElementById('container') as HTMLElement
  const width = content.clientWidth
  const height = content.clientHeight
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000)
  render = new THREE.WebGLRenderer()
  render.setPixelRatio(window.devicePixelRatio) // 设置设备像素比。通常用于避免HiDPI设备上绘图模糊
  render.setSize(width, height) // 设置THREE场景大小为整个页面
  content.appendChild(render.domElement) // 添加场景到DOM中

  render.outputEncoding = THREE.sRGBEncoding
  camera.position.set(100, 0, 0) // 摄像头摆放位置
  // 鼠标控件
  controls = new OrbitControls(camera, render.domElement) // 创建控件对象
}

</script>
<style lang="less" scoped>
.content {
  height: 100%;
  width: 100%;
}
</style>
