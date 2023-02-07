import * as Cesium from "cesium";
export let viewer: Cesium.Viewer
export function loadView() {
  viewer = new Cesium.Viewer('cesiumContainer', {
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    vrButton: false,
    infoBox: false, // 默认焦点弹框
    // imageryProvider: custom, // 设置图像提供的程序
  })

  viewer.scene.sun.show = false;
  viewer.scene.moon.show = false;
  viewer.scene.skyAtmosphere.show = false;
  viewer.scene.globe.showGroundAtmosphere = false
  viewer.scene.globe.enableLighting = true
  viewer.scene.fog.enabled = false
  viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检测
  viewer._cesiumWidget._creditContainer.style.display = "none"//取消版权信息
}
