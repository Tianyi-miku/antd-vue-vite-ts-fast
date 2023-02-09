import * as Cesium from "cesium";
import { transformCartesianToWGS84, transformWGS84ToCartesian } from "./until/trasform";
import _getCircleScanShader from "./shader/circleShader";
import _getRadarScanShader from "./shader/scanCircleShader"

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
  // @ts-ignore
  viewer.cesiumWidget._creditContainer.style.display = "none"//取消版权信息
}




export function addRipple(Iposition: any) {

  const id = Iposition.id
  const cartesian = Iposition.position

  const cartesian3Center = cartesian;
  const cartesian4Center = new Cesium.Cartesian4(
    cartesian3Center.x,
    cartesian3Center.y,
    cartesian3Center.z,
    1
  )
  const position: any = transformCartesianToWGS84(cartesian)
  const cartesian3Center1 = transformWGS84ToCartesian(
    {
      lng: position.lng,
      lat: position.lat,
      alt: position.alt + 500
    }
  )
  const cartesian4Center1 = new Cesium.Cartesian4(
    cartesian3Center1.x,
    cartesian3Center1.y,
    cartesian3Center1.z,
    1
  )

  const _time = new Date().getTime()
  const _delegate = new Cesium.PostProcessStage({
    name: id,
    fragmentShader: _getCircleScanShader({ get: true, border: Iposition.border }) ?? '',
    uniforms: {
      u_scanCenterEC: () => {
        return Cesium.Matrix4.multiplyByVector(
          viewer.camera.viewMatrix,
          cartesian4Center,
          new Cesium.Cartesian4()
        )
      },
      u_scanPlaneNormalEC: () => {
        const temp = Cesium.Matrix4.multiplyByVector(
          viewer.camera.viewMatrix,
          cartesian4Center,
          new Cesium.Cartesian4()
        )
        const temp1 = Cesium.Matrix4.multiplyByVector(
          viewer.camera.viewMatrix,
          cartesian4Center1,
          new Cesium.Cartesian4()
        )
        const _scratchCartesian3Normal = new Cesium.Cartesian3()
        _scratchCartesian3Normal.x = temp1.x - temp.x
        _scratchCartesian3Normal.y = temp1.y - temp.y
        _scratchCartesian3Normal.z = temp1.z - temp.z
        Cesium.Cartesian3.normalize(
          _scratchCartesian3Normal,
          _scratchCartesian3Normal
        )
        return _scratchCartesian3Normal
      },
      u_radius: () => {
        if (Iposition.circleMode == 'CircleScan') {
          return (
            (Iposition.radius * ((new Date().getTime() - _time) % Iposition.duration)) /
            Iposition.duration
          )
        } else {
          return Iposition.radius
        }
      },
      u_scanColor: Iposition.color,
    }
  })

  viewer.scene.postProcessStages.add(_delegate)

  return _delegate;
}


export function addscan(options: any) {
  if (options && options.position) {

    const id = options.id
    const cartesian = options.position
    const duration = options.duration
    const border = options.border
    const width = options.width ?? 10
    const radius = options.radius
    const color = options.color

    const cartesian3Center = cartesian
    const cartesian4Center = new Cesium.Cartesian4(
      cartesian3Center.x,
      cartesian3Center.y,
      cartesian3Center.z,
      1
    )
    const position: any = transformCartesianToWGS84(cartesian)
    const cartesian3Center1 = transformWGS84ToCartesian(
      {
        lng: position.lng,
        lat: position.lat,
        alt: position.alt + 500
      }
    )
    const cartesian4Center1 = new Cesium.Cartesian4(
      cartesian3Center1.x,
      cartesian3Center1.y,
      cartesian3Center1.z,
      1
    )

    const cartesian3Center2 = transformWGS84ToCartesian(
      {
        lng: position.lng + 0.001,
        lat: position.lat,
        alt: position.alt
      }
    )
    const cartesian4Center2 = new Cesium.Cartesian4(
      cartesian3Center2.x,
      cartesian3Center2.y,
      cartesian3Center2.z,
      1
    )
    const _time = new Date().getTime()
    const _RotateQ = new Cesium.Quaternion()
    const _RotateM = new Cesium.Matrix3()
    const _scratchCartesian4Center = new Cesium.Cartesian4()
    const _scratchCartesian4Center1 = new Cesium.Cartesian4()
    const _scratchCartesian4Center2 = new Cesium.Cartesian4()
    const _scratchCartesian3Normal = new Cesium.Cartesian3()
    const _scratchCartesian3Normal1 = new Cesium.Cartesian3()
    const _delegate = new Cesium.PostProcessStage({
      name: id,
      fragmentShader: _getRadarScanShader({ border: border, width: width, get: true }) ?? '',
      uniforms: {
        u_scanCenterEC: function () {
          return Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center,
            _scratchCartesian4Center
          )
        },
        u_scanPlaneNormalEC: function () {
          const temp = Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center,
            _scratchCartesian4Center
          )
          const temp1 = Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center1,
            _scratchCartesian4Center1
          )
          _scratchCartesian3Normal.x = temp1.x - temp.x
          _scratchCartesian3Normal.y = temp1.y - temp.y
          _scratchCartesian3Normal.z = temp1.z - temp.z
          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          )
          return _scratchCartesian3Normal
        },

        u_scanLineNormalEC: function () {
          const temp = Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center,
            _scratchCartesian4Center
          )
          const temp1 = Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center1,
            _scratchCartesian4Center1
          )
          const temp2 = Cesium.Matrix4.multiplyByVector(
            viewer.camera.viewMatrix,
            cartesian4Center2,
            _scratchCartesian4Center2
          )

          _scratchCartesian3Normal.x = temp1.x - temp.x
          _scratchCartesian3Normal.y = temp1.y - temp.y
          _scratchCartesian3Normal.z = temp1.z - temp.z

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          )

          _scratchCartesian3Normal1.x = temp2.x - temp.x
          _scratchCartesian3Normal1.y = temp2.y - temp.y
          _scratchCartesian3Normal1.z = temp2.z - temp.z

          const tempTime =
            ((new Date().getTime() - _time) % duration) / duration
          Cesium.Quaternion.fromAxisAngle(
            _scratchCartesian3Normal,
            tempTime * Cesium.Math.PI * 2,
            _RotateQ
          )
          Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM)
          Cesium.Matrix3.multiplyByVector(
            _RotateM,
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          )
          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          )
          return _scratchCartesian3Normal1
        },
        u_radius: radius,
        u_scanColor: color
      }
    })

    viewer.scene.postProcessStages.add(_delegate)

    return _delegate;
  }
}





// 模型移动
export function addModleforLine(lujingdata: any[]) {
  let datasource = new Cesium.CustomDataSource("enetiestestdata");
  viewer.dataSources.add(datasource)
  //添加线
  datasource.entities.add({
    name: "line",
    polyline: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights(lujingdata.flat()),
      material: Cesium.Color.RED,
      width: 1
    }
  })

  let property = new Cesium.SampledPositionProperty();
  let starttime = new Date();
  let stoptime: Date;
  let timestamp = starttime.getTime();

  lujingdata.forEach((pos, index) => {
    let time = new Date(timestamp + index * 5000);
    stoptime = time;
    let position = Cesium.Cartesian3.fromDegrees(pos[0], pos[1], pos[2])
    property.addSample(Cesium.JulianDate.fromDate(time), position);
  })
  property.setInterpolationOptions({
    interpolationDegree: 0.0001,
    interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
  });
  let entitydd: Cesium.Entity
  entitydd = datasource.entities.add({
    availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
      start: Cesium.JulianDate.fromDate(starttime),
      // @ts-ignore
      stop: Cesium.JulianDate.fromDate(new Date(stoptime))
    })]),
    position: property, // 点集
    //朝向
    orientation: new Cesium.VelocityOrientationProperty(property),
    // billboard: {
    //     image: "./yingjiwuzi.png",
    //     scale: 0.5,
    //     pixelOffset: new Cesium.Cartesian2(0, -120),
    //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //     clampToGround: true  //是否贴地
    // },
    label: {
      text: "",
      fillColor: Cesium.Color.RED,
      pixelOffset: new Cesium.Cartesian2(0, -30)
    },
    model: {
      uri: '/model/xiaofangche.gltf',
      scale: 1,
      minimumPixelSize: 70,
      maximumScale: 70
    },
    path: {
      leadTime: 0,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.1,
        color: Cesium.Color.GREEN
      }),
      width: 10
    }
  });
  viewer.clock.onTick.addEventListener((tick) => {
    // @ts-ignore
    entitydd.position.getValue(tick.currentTime);
    //  console.log(entitydd.position.getValue(tick.currentTime));
    //转为经纬度
    // @ts-ignore
    let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(entitydd.position.getValue(tick.currentTime))
    cartographic.longitude = Cesium.Math.toDegrees(cartographic.longitude)
    cartographic.latitude = Cesium.Math.toDegrees(cartographic.latitude)
    // console.log(cartographic);
    // @ts-ignore
    entitydd.label.text = Number(cartographic.longitude).toFixed(4) + "," + Number(cartographic.latitude).toFixed(4);
  })

  viewer.trackedEntity = entitydd;
  viewer.clock.currentTime = Cesium.JulianDate.fromDate(starttime); //修改时间轴的当前时间
  // @ts-ignore
  viewer.clock.stopTime = Cesium.JulianDate.fromDate(new Date(stoptime));
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP,
    viewer.clock.shouldAnimate = true; //开始播放
}
