export default function circleShader(options: any) {
  if (options && options.get) {
    if (options && options.get) {
      return "uniform sampler2D colorTexture;\n\
                uniform sampler2D depthTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform vec4 u_scanCenterEC;\n\
                uniform vec3 u_scanPlaneNormalEC;\n\
                uniform float u_radius;\n\
                uniform vec4 u_scanColor;\n\
                \n\
                vec4 toEye(in vec2 uv, in float depth){\n\
                  vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
                  vec4 posInCamera = czm_inverseProjection * vec4(xy, depth, 1.0);\n\
                  posInCamera =posInCamera / posInCamera.w;\n\
                  return posInCamera;\n\
                }\n\
                \n\
                vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\n\
                    vec3 v01 = point - planeOrigin;\n\
                    float d = dot(planeNormal, v01) ;\n\
                    return (point - planeNormal * d);\n\
                }\n\
                \n\
                float getDepth(in vec4 depth){\n\
                    float z_window = czm_unpackDepth(depth);\n\
                    z_window = czm_reverseLogDepth(z_window);\n\
                    float n_range = czm_depthRange.near;\n\
                    float f_range = czm_depthRange.far;\n\
                    return (2.0 * z_window - n_range - f_range) / (f_range - n_range);\n\
                }\n\
                \n\
                void main(){\n\
                    gl_FragColor = texture2D(colorTexture, v_textureCoordinates);\n\
                    float depth = getDepth(texture2D(depthTexture, v_textureCoordinates));\n\
                    vec4 viewPos = toEye(v_textureCoordinates, depth);\n\
                    vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n\
                    float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
                    if(dis < u_radius){\n\
                      float f = 1.0 - abs(u_radius - dis) / u_radius;\n\
                      f = pow(f, float("+ options.border + "));\n\
                      gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n\
                    }\n\
                  }\n\
                  ";
    }
  }
}  