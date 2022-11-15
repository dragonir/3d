#define NUM_OCTAVES 5
#define M_PI 3.1415926535897932384626433832795
uniform vec4 resolution;
varying vec3 vNormal;
uniform sampler2D perlinnoise;
uniform sampler2D sparknoise;
uniform sampler2D waterturbulence;
uniform sampler2D noiseTex;
uniform float time;
uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;
varying vec3 camPos;
varying vec2 vUv;

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
  vec2 ip = floor(p);
  vec2 u = fract(p);
  u = u*u*(3.0-2.0*u);

  float res = mix(
    mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
    mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
  return res*res;
}

float fbm(vec2 x) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100);
  // 旋转以减少轴向偏置
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < NUM_OCTAVES; ++i) {
    v += a * noise(x);
    x = rot * x * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

  float setOpacity(float r, float g, float b, float tonethreshold) {
  float tone = (r + g + b) / 3.0;
  float alpha = 1.0;
  if(tone<tonethreshold) {
    alpha = 0.0;
  }
  return alpha;
}

vec3 rgbcol(vec3 col) {
  return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
  vec2 delta = UV - Center;
  float radius = length(delta) * 2. * RadialScale;
  float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
  return vec2(radius, angle);
}

void main() {
  vec2 olduv = gl_FragCoord.xy/resolution.xy ;
  vec2 uv = vUv ;
  vec2 imguv = uv;
  float scale = 1.;
  olduv *= 0.5 + time;
  olduv.y = olduv.y ;
  vec2 p = olduv*scale;
  float noise = fbm( p  )*0.04;
  vec4 txt = texture2D(perlinnoise, olduv);
  float gradient = dot(normalize( -camPos ), normalize( vNormal ));
  float pct = distance(vUv,vec2(0.5));

  vec3 rgbcolor0 = rgbcol(color0);
  vec3 rgbcolor1 = rgbcol(color1);
  vec3 rgbcolor2 = rgbcol(color2);
  vec3 rgbcolor3 = rgbcol(color3);
  vec3 rgbcolor4 = rgbcol(color4);
  vec3 rgbcolor5 = rgbcol(color5);

  // 设置纯色背景
  float y = smoothstep(0.16,0.525,pct);
  vec3 backcolor = mix(rgbcolor0, rgbcolor5, y);

  gl_FragColor = vec4(backcolor,1.);

  // 设置极坐标
  vec2 center = vec2(0.5);
  vec2 cor = UnityPolarCoordinates(vUv, center, 1., 1.);
  vec2 newvUv = vUv - 0.5;
  vec3 noisetexvUv = texture2D(perlinnoise,mod(rotate(newvUv*0.15 + vec2(sin(time*0.005),cos(time*0.005)),time),1.)).rgb;

  // 设置纹理
  vec2 newUv = vec2(cor.x + time,cor.x+cor.y);
  vec3 noisetex = texture2D(perlinnoise,mod(newUv,1.)).rgb;
  vec3 noisetex2 = texture2D(sparknoise,mod(newUv,1.)).rgb;
  vec3 noisetex3 = texture2D(waterturbulence,mod(newUv,1.)).rgb;

  // 设置纹理色调
  float tone0 =  1. - smoothstep(0.3,0.6,noisetex.r);
  float tone1 =  smoothstep(0.3,0.6,noisetex2.r);
  float tone2 =  smoothstep(0.3,0.6,noisetex3.r);

  // 设置每个色调的不透明度
  float opacity0 = setOpacity(tone0,tone0,tone0,.29);
  float opacity1 = setOpacity(tone1,tone1,tone1,.49);
  float opacity2 = setOpacity(tone2,tone2,tone2,.69);

  // 建立圆形噪声
  float gradienttone = 1. - smoothstep(0.196,0.532,pct);
  vec4 circularnoise = vec4( vec3(gradienttone)*noisetexvUv*1.4, 1.0 );
  float gradopacity = setOpacity(circularnoise.r,circularnoise.g,circularnoise.b,0.19);

  // 设置边缘静态闪光
  vec2 uv2 = uv;
  float iTime = time*0.004;
  uv.y += iTime / 10.0;
  uv.x -= (sin(iTime/10.0)/2.0);
  uv2.x += iTime / 14.0;
  uv2.x += (sin(iTime/10.0)/9.0);
  float result = 0.0;
  result += texture2D(noiseTex, mod(uv*0.5,1.) * 0.6 + vec2(iTime*-0.003)).r;
  result *= texture2D(noiseTex, mod(uv2*0.5,1.) * 0.9 + vec2(iTime*+0.002)).b;
  result = pow(result, 4.0);

  // 设置最终渲染
  if(opacity2>0.0){
    gl_FragColor = vec4(rgbcolor4,0.)*vec4(opacity2);
  } else if(opacity1>0.0){
    gl_FragColor = vec4(rgbcolor2,0.)*vec4(opacity1);
  } else if(opacity0>0.0){
    gl_FragColor = vec4(rgbcolor1,0.)*vec4(opacity0);
  }
  gl_FragColor += vec4(108.0)*result*(y*0.02);
  gl_FragColor *= vec4(gradopacity);
}