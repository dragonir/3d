uniform float time;
uniform float progress;
uniform float inside;

attribute vec3 centroId;
attribute vec3 axis;
attribute float offset;

varying vec3 eye;
varying vec3 vNormal;
varying vec3 vReflect;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
  return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);
}

float easeInOutQuint(float t){
  return t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (--t) * t * t * t * t;
}
float easeOutQuint(float t){
  return 1. + (--t) * t * t * t * t;
}
float easeOut(float t){
  return  t * t * t;
}


void main() {



  vec3 newposition = position;


  float vTemp =  1. - (centroId.z*1.4 + 1.)/2.;

  float tProgress = max(0.0, (progress - vTemp*0.5) /0.5);

  vec3 newnormal = rotate(normal,axis,tProgress*(3. + offset*10.));
  vNormal = newnormal;

  newposition = rotate(newposition - centroId,axis,(1. - vTemp)*tProgress*(3. + offset*10.)) + centroId;
  newposition += newposition + (1.5 - vTemp)*centroId*(tProgress)*(3. + vTemp*7. + offset*3.);



  eye = normalize( vec3( modelViewMatrix * vec4( newposition, 1.0 ) ) );
  vec4 worldPosition = modelMatrix * vec4( newposition, 1.0 );
  vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * newnormal );
  vec3 I = worldPosition.xyz - cameraPosition;
  vReflect = reflect( I, worldNormal );
  gl_Position = projectionMatrix * modelViewMatrix * vec4( newposition, 1.0 );
}