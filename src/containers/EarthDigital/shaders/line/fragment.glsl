uniform float actionRatio;
uniform float lineLength;
uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;

#include <common>
#include <color_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {
	#include <clipping_planes_fragment>

  float halfDash = dashSize * 0.5;
  float currPos = (lineLength + dashSize) * actionRatio;
  float d = (vLineDistance + halfDash) - currPos;
  if (abs(d) > halfDash ) discard;

  float grad = ((vLineDistance + halfDash) - (currPos - halfDash)) / halfDash;
	vec3 outgoingLight = vec3( 0.0 );
  vec4 diffuseColor = vec4( diffuse, grad );

	#include <logdepthbuf_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <output_fragment>
	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}