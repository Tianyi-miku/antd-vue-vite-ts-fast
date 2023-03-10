// 雷达扫描
export default function _getRadarScanShader(options: { get: any; width: string; border: string; }) {
  if (options && options.get) {
    return "uniform sampler2D colorTexture;\n\
                uniform sampler2D depthTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                uniform vec4 u_scanCenterEC;\n\
                uniform vec3 u_scanPlaneNormalEC;\n\
                uniform vec3 u_scanLineNormalEC;\n\
                uniform float u_radius;\n\
                uniform vec4 u_scanColor;\n\
                \n\
                vec4 toEye(in vec2 uv, in float depth){\n\
                vec2 xy = vec2((uv.x * 2.0 - 1.0),(uv.y * 2.0 - 1.0));\n\
                vec4 posInCamera =czm_inverseProjection * vec4(xy, depth, 1.0);\n\
                posInCamera =posInCamera / posInCamera.w;\n\
                return posInCamera;\n\
                }\n\
                \n\
                bool isPointOnLineRight(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){\n\
                vec3 v01 = testPt - ptOnLine;\n\
                normalize(v01);\n\
                vec3 temp = cross(v01, lineNormal);\n\
                float d = dot(temp, u_scanPlaneNormalEC);\n\
                return d > 0.5;\n\
                }\n\
                \n\
                vec3 pointProjectOnPlane(in vec3 planeNormal, in vec3 planeOrigin, in vec3 point){\n\
                vec3 v01 = point -planeOrigin;\n\
                float d = dot(planeNormal, v01) ;\n\
                return (point - planeNormal * d);\n\
                }\n\
                \n\
                float distancePointToLine(in vec3 ptOnLine, in vec3 lineNormal, in vec3 testPt){\n\
                vec3 tempPt = pointProjectOnPlane(lineNormal, ptOnLine, testPt);\n\
                return length(tempPt - ptOnLine);\n\
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
                float depth = getDepth( texture2D(depthTexture, v_textureCoordinates));\n\
                vec4 viewPos = toEye(v_textureCoordinates, depth);\n\
                vec3 prjOnPlane = pointProjectOnPlane(u_scanPlaneNormalEC.xyz, u_scanCenterEC.xyz, viewPos.xyz);\n\
                float dis = length(prjOnPlane.xyz - u_scanCenterEC.xyz);\n\
                float twou_radius = u_radius * 2.0;\n\
                if(dis < u_radius){\n\
                    float f0 = 1.0 -abs(u_radius - dis) / u_radius;\n\
                    f0 = pow(f0, 64.0);\n\
                    vec3 lineEndPt = vec3(u_scanCenterEC.xyz) + u_scanLineNormalEC * u_radius;\n\
                    float f = 0.0;\n\
                    if(isPointOnLineRight(u_scanCenterEC.xyz, u_scanLineNormalEC.xyz, prjOnPlane.xyz)){\n\
                        float dis1= length(prjOnPlane.xyz - lineEndPt);\n\
                        f = abs(twou_radius -dis1) / twou_radius;\n\
                        f = pow(f, float("+ options.width + "));\n\
                    }\n\
                    if(float("+ options.border + ") > 0.0){\n\
                        gl_FragColor = mix(gl_FragColor, u_scanColor, f + f0);\n\
                    } else {\n\
                        gl_FragColor = mix(gl_FragColor, u_scanColor, f);\n\
                    }\n\
                    }\n\
                }\n\
                ";
  }
}