uniform float time;
uniform float progress;
uniform float inside;
uniform vec3 surfaceColor;
uniform vec3 insideColor;
uniform samplerCube tCube;

varying vec2 vUv;
varying vec2 vUv1;
varying vec3 eye;
varying vec3 vNormal;
varying vec3 vReflect;


void main ()	{
	vec3 r = reflect(eye, vNormal);
	float m = 2. * sqrt(pow(r.x, 2.) + pow(r.y, 2.) + pow(r.z + 1., 2.));
	vec2 vN = r.xy / m + .5;
	vec4 reflectedColor = textureCube(tCube, vec3(-vReflect.x, vReflect.yz));

	vec3 light = normalize(vec3(12.,10.,10.));
	vec3 light1 = normalize(vec3(-12.,-10.,-10.));
	float l = clamp(dot(light, vNormal),0.5,1.);
	l += clamp(dot(light1, vNormal),0.5,1.)/2.;

	if (inside>0.5) {
		gl_FragColor = vec4(l,l,l,1.)*vec4(surfaceColor,1.);
	} else {
		gl_FragColor = reflectedColor*vec4(insideColor,1.);
	}
}