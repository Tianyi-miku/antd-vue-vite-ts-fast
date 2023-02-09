import * as Cesium from "cesium";
export function transformCartesianToWGS84(cartesian: any) {
  if (cartesian) {
    var ellipsoid = Cesium.Ellipsoid.WGS84
    var cartographic = ellipsoid.cartesianToCartographic(cartesian)
    return {
      lng: Cesium.Math.toDegrees(cartographic.longitude),
      lat: Cesium.Math.toDegrees(cartographic.latitude),
      alt: cartographic.height
    }
  }
}

//坐标转换 84转笛卡尔
export function transformWGS84ToCartesian(position: any, alt?: any,) {
  return position
    ? Cesium.Cartesian3.fromDegrees(
      position.lng || position.lon,
      position.lat,
      position.alt = alt || position.alt,
      Cesium.Ellipsoid.WGS84
    )
    : Cesium.Cartesian3.ZERO
}