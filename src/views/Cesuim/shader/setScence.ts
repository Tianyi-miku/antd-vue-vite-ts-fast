import * as Cesium from "cesium";

let postProcessStage
export function removeStage(_viewer: Cesium.Viewer, _name?: string) {
  if (postProcessStage) {
    _viewer.scene.postProcessStages.remove(postProcessStage)
  }
}

//雨天特效
export function setRain(_viewer: Cesium.Viewer, _name?: string) {

  if (_viewer) {
    var fs = "uniform sampler2D colorTexture;\n\
  varying vec2 v_textureCoordinates;\n\
  \n\
  float hash(float x){\n\
  return fract(sin(x*23.3)*13.13);\n\
  }\n\
  \n\
  void main(){\n\
      float time = czm_frameNumber / 60.0;\n\
      vec2 resolution = czm_viewport.zw;\n\
      vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
      vec3 c=vec3(.6,.7,.8);\n\
      float a=-.4;\n\
      float si=sin(a),co=cos(a);\n\
      uv*=mat2(co,-si,si,co);\n\
      uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
      float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
      float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
      c*=v*b;\n\
      gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c, 1), 0.2);\n\
  }\n\
  ";
    postProcessStage = _viewer.scene.postProcessStages.add(new Cesium.PostProcessStage(
      {
        name: _name || 'rain',
        fragmentShader: fs
      }));
  }

}


//雪天特效
export function setSnow(_viewer: Cesium.Viewer, _name?: string) {

  if (_viewer) {
    var fs = "uniform sampler2D colorTexture;\n\
      varying vec2 v_textureCoordinates;\n\
      \n\
      float snow(vec2 uv,float scale){\n\
          float time = czm_frameNumber / 60.0;\n\
          float w=smoothstep(1.,0.,-uv.y*(scale/10.));\n\
          if(w<.1)return 0.;\n\
          uv+=time/scale;\n\
          uv.y+=time*2./scale;\n\
          uv.x+=sin(uv.y+time*.5)/scale;\n\
          uv*=scale;\n\
          vec2 s=floor(uv),f=fract(uv),p;\n\
          float k=3.,d;\n\
          p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;\n\
          d=length(p);\n\
          k=min(d,k);\n\
          k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
          return k*w;\n\
      }\n\
      \n\
      void main(){\n\
          vec2 resolution = czm_viewport.zw;\n\
          vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
          vec3 finalColor=vec3(0);\n\
          float c = 0.0;\n\
          c+=snow(uv,30.)*.0;\n\
          c+=snow(uv,20.)*.0;\n\
          c+=snow(uv,15.)*.0;\n\
          c+=snow(uv,10.);\n\
          c+=snow(uv,8.);\n\
          c+=snow(uv,6.);\n\
          c+=snow(uv,5.);\n\
          finalColor=(vec3(c));\n\
          gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3);\n\
          \n\
      }\n\
      ";
    postProcessStage = _viewer.scene.postProcessStages.add(new Cesium.PostProcessStage({
      name: _name || 'snow',
      fragmentShader: fs
    }));
  }
}
