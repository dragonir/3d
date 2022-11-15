varying vec3 vNormal;
varying vec3 camPos;
varying vec2 vUv;

void main() {
  vNormal = normal;
  vUv = uv;
  camPos = cameraPosition;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}