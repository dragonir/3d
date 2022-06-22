#define MATCAP

uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;

varying vec3 vViewPosition;

#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

uniform vec3 uFloorColor;
uniform float uFloorOrientationOffset;
uniform float uFloorOrientationMultiplier;
uniform float uFloorDistanceLimit;

uniform vec3 uPointColor;
uniform float uPointOrientationOffset;
uniform float uPointOrientationMultiplier;
uniform float uPointDistanceLimit;
uniform vec3 uPointPosition;

varying vec3 vWorldNormal;
varying vec3 vModelPosition;

float blendAdd(float base, float blend) {
	return min(base+blend,1.0);
}

vec3 blendAdd(vec3 base, vec3 blend) {
	return min(base+blend,vec3(1.0));
}

#ifdef USE_WIND
	varying float vWindStrength;
#endif

void main() {

	#include <clipping_planes_fragment>

	vec4 diffuseColor = vec4( diffuse, opacity );

	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>

	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks

	#ifdef USE_MATCAP

		vec4 matcapColor = texture2D( matcap, uv );
		matcapColor = matcapTexelToLinear( matcapColor );

	#else

		vec4 matcapColor = vec4( 1.0 );

	#endif

	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

	/**
	 * Flags
	 */
	#ifdef USE_WIND
		outgoingLight = outgoingLight + vWindStrength * 0.15;
	#endif

	/**
	 * Floor bounce
	 */
	// Distance
	float floorDistanceStrength = (1.0 - vModelPosition.y / uFloorDistanceLimit);
	floorDistanceStrength = clamp(floorDistanceStrength, 0.0, 1.0);
	floorDistanceStrength = pow(floorDistanceStrength, 3.0);
	
	// Orientation
	float floorOrientationStrength = dot(vWorldNormal, vec3(0.0, - 1.0, 0.0));
	floorOrientationStrength += uFloorOrientationOffset;
	floorOrientationStrength *= uFloorOrientationMultiplier;
	floorOrientationStrength = clamp(floorOrientationStrength, 0.0, 1.0);
	floorOrientationStrength = pow(floorOrientationStrength, 3.0);

	// Final
	float floorFinal = floorDistanceStrength * floorOrientationStrength;
	outgoingLight = mix(outgoingLight, uFloorColor, floorFinal);
	
	/**
	 * Point bounce
	 */
	// Distance
	vec3 pointDeltaVector = vModelPosition.xyz - uPointPosition;
	float pointDistanceStrength = length(pointDeltaVector) / uPointDistanceLimit;
	pointDistanceStrength = 1.0 - clamp(pointDistanceStrength, 0.0, 1.0);
	pointDistanceStrength = pow(pointDistanceStrength, 3.0);
	
	// Orientation
	float pointOrientationStrength = dot(vWorldNormal, - normalize(pointDeltaVector));
	pointOrientationStrength += uPointOrientationOffset;
	pointOrientationStrength *= uPointOrientationMultiplier;
	pointOrientationStrength = clamp(pointOrientationStrength, 0.0, 1.0);
	pointOrientationStrength = pow(pointOrientationStrength, 3.0);

	// Final
	float pointFinal = pointDistanceStrength * pointOrientationStrength;
	vec3 pointColor = mix(vec3(0.0), uPointColor, pointFinal * 5.0);
	outgoingLight = blendAdd(outgoingLight, pointColor);
	
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}