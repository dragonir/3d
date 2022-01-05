/**
 * 预览模型
 */
import * as THREE from 'three'
const vertexShader = `
		varying vec3 vPosition;
		varying vec2 vUv;
		void main() { 
			vUv = uv; 
			vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
			gl_Position = projectionMatrix * mvPosition;
		}
		`;
const getMesh = (fragmentShader) => {
    console.log(window.iChannel0)
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.ShaderMaterial({
        uniforms: {
            iTime: {
                value: 0
            },
            iResolution: {
                value: new THREE.Vector2(1900, 1900)
            },
            iChannel0: {
                value: window.iChannel0
            },
        },
        side: 2,
        depthWrite: false,
        transparent: true,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    return plane;
}
export default {
    effect1() {
        const fragmentShader = `
		uniform float iTime;
		const float PI = 3.14159265359;
        float random(float p){
            return fract(sin(p) * 10000.0);
        } 
        float noise(vec2 p){
            float t = iTime / 2000.0;
            if(t > 1.0) t -= floor(t);
            return random(p.x * 14. + p.y * sin(t) * 0.5);
        }
        vec2 sw(vec2 p){
            return vec2(floor(p.x), floor(p.y));
        }
        vec2 se(vec2 p){
            return vec2(ceil(p.x), floor(p.y));
        }
        vec2 nw(vec2 p){
            return vec2(floor(p.x), ceil(p.y));
        }
        vec2 ne(vec2 p){
            return vec2(ceil(p.x), ceil(p.y));
        }
        float smoothNoise(vec2 p){
            vec2 inter = smoothstep(0.0, 1.0, fract(p));
            float s = mix(noise(sw(p)), noise(se(p)), inter.x);
            float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
            return mix(s, n, inter.y);
        }
        mat2 rotate (in float theta){
            float c = cos(theta);
            float s = sin(theta);
            return mat2(c, -s, s, c);
        }
        float circ(vec2 p){
            float r = length(p);
            r = log(sqrt(r));
            return abs(mod(4.0 * r, PI * 2.0) - PI) * 3.0 + 0.2;
        }
        float fbm(in vec2 p){
            float z = 2.0;
            float rz = 0.0;
            vec2 bp = p;
            for(float i = 1.0; i < 6.0; i++){
                rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;
                z *= 2.0;
                p *= 2.0;
            }
            return rz;
        }
        float distanceTo(vec2 src, vec2 dst) {
			float dx = src.x - dst.x;
			float dy = src.y - dst.y;
			float dv = dx * dx + dy * dy;
			return sqrt(dv);
		}
		varying vec2 vUv; 
		uniform vec2 iResolution; 
		void main() { 
            float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y)) * 2.0; 
            vec2 p = vUv - 0.5;
            p.x *= iResolution.x / iResolution.y;
            p *= 8.0;
            float rz = fbm(p);
            p /= exp(mod(iTime * 2.0, PI));
            rz *= pow(abs(0.1 - circ(p)), 0.9);
            vec3 col = vec3(0.2, 0.1, 0.643); 
			gl_FragColor = vec4(col / rz,  1.0 - pow(len, 3.0))  ;
		}
		`;
        return getMesh(fragmentShader);
    },
    effect2() {
        const fragmentShader = `
		const float PI = 3.14159265359; 
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        float distanceTo(vec2 src, vec2 dst) {
			float dx = src.x - dst.x;
			float dy = src.y - dst.y;
			float dv = dx * dx + dy * dy;
			return sqrt(dv);
		}
        vec3 hsb2rgb( in vec3 c ){
            vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                                     6.0)-3.0)-1.0,
                             0.0,
                             1.0 );
            rgb = rgb*rgb*(3.0-2.0*rgb);
            return c.z * mix( vec3(1.0), rgb, c.y);
        }
        vec2 rotate2D (vec2 _st, float _angle) {
            _st =  mat2(cos(_angle),-sin(_angle),
                        sin(_angle),cos(_angle)) * _st;
            return _st;
        }
		void main() {  
            float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y)) * 2.0; 
            vec2 p = (vUv-0.5) * 4.0;
            vec3 color = hsb2rgb(vec3(fract(iTime*.1),1.,1.));
            float r = length(p);
            float w = .3;
            p = rotate2D(p,(r*PI*6.-iTime*2.));
            color *= smoothstep(-w,.0,p.x)*smoothstep(w,.0,p.x);
            color *= abs(1./(sin(pow(r,2.)*2.-iTime*1.3)*6.))*.4;
			gl_FragColor = vec4(color,  pow(1.0 - len, 2.0))  ;
		}
		`;
        return getMesh(fragmentShader);
    },
    effect3() {
        const fragmentShader = `
		const float PI = 3.14159265359; 
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        vec3 firePalette(float i){
            float T = 1400. + 1300.*i; // Temperature range (in Kelvin).
            vec3 L = vec3(7.4, 5.6, 4.4); // Red, green, blue wavelengths (in hundreds of nanometers).
            L = pow(L,vec3(5)) * (exp(1.43876719683e5/(T*L)) - 1.);
            return 1. - exp(-5e8/L); // Exposure level. Set to "50." For "70," change the "5" to a "7," etc.
        } 
        vec3 hash33(vec3 p){ 
            float n = sin(dot(p, vec3(7, 157, 113)));    
            return fract(vec3(2097152, 262144, 32768)*n); 
        }
        float voronoi(vec3 p){
            vec3 b, r, g = floor(p);
            p = fract(p); // "p -= g;" works on some GPUs, but not all, for some annoying reason.
            float d = 1.;  
            for(int j = -1; j <= 1; j++) {
                for(int i = -1; i <= 1; i++) {
                    b = vec3(i, j, -1);
                    r = b - p + hash33(g+b);
                    d = min(d, dot(r,r));
                    b.z = 0.0;
                    r = b - p + hash33(g+b);
                    d = min(d, dot(r,r));
                    b.z = 1.;
                    r = b - p + hash33(g+b);
                    d = min(d, dot(r,r));
                }
            }
            return d; // Range: [0, 1]
        }
        float noiseLayers(in vec3 p) {
            vec3 t = vec3(0., 0., p.z + iTime*1.5);
            const int iter = 5; // Just five layers is enough.
            float tot = 0., sum = 0., amp = 1.; // Total, sum, amplitude.
            for (int i = 0; i < iter; i++) {
                tot += voronoi(p + t) * amp; // Add the layer to the total.
                p *= 2.; // Position multiplied by two.
                t *= 1.5; // Time multiplied by less than two.
                sum += amp; // Sum of amplitudes.
                amp *= .5; // Decrease successive layer amplitude, as normal.
            }
            return tot/sum; // Range: [0, 1].
        }
        float distanceTo(vec2 src, vec2 dst) {
			float dx = src.x - dst.x;
			float dy = src.y - dst.y;
			float dv = dx * dx + dy * dy;
			return sqrt(dv);
		}
		void main() { 
            float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y)) * 2.0;  
            vec2 uv = (vUv-0.5) * 2.0;
            uv += vec2(sin(iTime*.5)*.25, cos(iTime*.5)*.125);
            vec3 rd = normalize(vec3(uv.x, uv.y, 3.1415926535898/8.));
            float cs = cos(iTime*.25), si = sin(iTime*.25); 
            rd.xy = rd.xy*mat2(cs, -si, si, cs);  
            float c = noiseLayers(rd*2.);
            c = max(c + dot(hash33(rd)*2. - 1., vec3(.015)), 0.);
            c *= sqrt(c)*1.5; // Contrast.
            vec3 col = firePalette(c); // Palettization.
            col = mix(col, col.zyx*.15 + c*.85, min(pow(dot(rd.xy, rd.xy)*1.2, 1.5), 1.)); // Color dispersion.
            col = pow(col, vec3(1.25)); // Tweaking the contrast a little.
			gl_FragColor = vec4(sqrt(clamp(col, 0., 1.)),  1.0 - pow(len, 2.0));
		}
		`;
        return getMesh(fragmentShader);
    },
    effect4() {
        const fragmentShader = `
        uniform float ratio;
        float PI2 = 6.28318530718;
        float PI = 3.1416;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        float vorocloud(vec2 p){
            float f = 0.0;
            vec2 pp = cos(vec2(p.x * 14.0, (16.0 * p.y + cos(floor(p.x * 30.0)) + iTime * PI2)) );
            p = cos(p * 12.1 + pp * 10.0 + 0.5 * cos(pp.x * 10.0));
            vec2 pts[4];
            pts[0] = vec2(0.5, 0.6);
            pts[1] = vec2(-0.4, 0.4);
            pts[2] = vec2(0.2, -0.7);
            pts[3] = vec2(-0.3, -0.4);
            float d = 5.0;
            for(int i = 0; i < 4; i++){
                  pts[i].x += 0.03 * cos(float(i)) + p.x;
                  pts[i].y += 0.03 * sin(float(i)) + p.y;
                d = min(d, distance(pts[i], pp));
            }
            f = 2.0 * pow(1.0 - 0.3 * d, 13.0);
            f = min(f, 1.0);
            return f;
        }
        vec4 scene(vec2 UV){
            float x = UV.x;
            float y = UV.y;
            vec2 p = vec2(x, y) - vec2(0.5);
            vec4 col = vec4(0.0);
            col.g += 0.02;
            float v = vorocloud(p);
            v = 0.2 * floor(v * 5.0);
            col.r += 0.1 * v;
            col.g += 0.6 * v;
            col.b += 0.5 * pow(v, 5.0);
            v = vorocloud(p * 2.0);
            v = 0.2 * floor(v * 5.0);
            col.r += 0.1 * v;
            col.g += 0.2 * v;
            col.b += 0.01 * pow(v, 5.0);
            col.a = 1.0;
            return col;
        }
        float distanceTo(vec2 src, vec2 dst) {
			float dx = src.x - dst.x;
			float dy = src.y - dst.y;
			float dv = dx * dx + dy * dy;
			return sqrt(dv);
		}
		void main() { 
            float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y)) * 2.0; 
			gl_FragColor = scene(vUv);
		}
		`;
        return getMesh(fragmentShader);
    },
    effect5() {
        const fragmentShader = `
        uniform float ratio;
        float M_PI = 3.1415926;
        float M_TWO_PI = 6.28318530718;
        vec3 iMouse = vec3(0.0, 0.0 ,0.0 );
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        float rand(vec2 n) {
            return fract(sin(dot(n, vec2(12.9898,12.1414))) * 83758.5453);
        }
        float noise(vec2 n) {
            const vec2 d = vec2(0.0, 1.0);
            vec2 b = floor(n);
            vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
            return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
        }
        vec3 ramp(float t) {
            return t <= .5 ? vec3( 1. - t * 1.4, .2, 1.05 ) / t : vec3( .3 * (1. - t) * 2., .2, 1.05 ) / t;
        }
        vec2 polarMap(vec2 uv, float shift, float inner) {
            uv = vec2(0.5) - uv;
            float px = 1.0 - fract(atan(uv.y, uv.x) / 6.28 + 0.25) + shift;
            float py = (sqrt(uv.x * uv.x + uv.y * uv.y) * (1.0 + inner * 2.0) - inner) * 2.0;
            return vec2(px, py);
        }
        float fire(vec2 n) {
            return noise(n) + noise(n * 2.1) * .6 + noise(n * 5.4) * .42;
        }
        float shade(vec2 uv, float t) {
            uv.x += uv.y < .5 ? 23.0 + t * .035 : -11.0 + t * .03;    
            uv.y = abs(uv.y - .5);
            uv.x *= 35.0;
            float q = fire(uv - t * .013) / 2.0;
            vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
            return pow((r.y + r.y) * max(.0, uv.y) + .1, 4.0);
        }
        vec3 color(float grad) {
            float m2 = iMouse.z < 0.0001 ? 1.15 : iMouse.y * 3.0 / iResolution.y;
            grad =sqrt( grad);
            vec3 color = vec3(1.0 / (pow(vec3(0.5, 0.0, .1) + 2.61, vec3(2.0))));
            vec3 color2 = color;
            color = ramp(grad);
            color /= (m2 + max(vec3(0), color));
            return color;
        }
        float distanceTo(vec2 src, vec2 dst) {
			float dx = src.x - dst.x;
			float dy = src.y - dst.y;
			float dv = dx * dx + dy * dy;
			return sqrt(dv);
		}
		void main() { 
            float m1 = iMouse.z < 0.0001 ? 3.6 : iMouse.x * 5.0 / iResolution.x;
            float t = iTime;
            vec2 uv = vUv;
            float ff = 1.0 - uv.y;
            uv.x -= (iResolution.x / iResolution.y - 1.0) / 2.0;
            vec2 uv2 = uv;
            uv2.y = 1.0 - uv2.y;
            uv = polarMap(uv, 1.3, m1);
            uv2 = polarMap(uv2, 1.9, m1);
            vec3 c1 = color(shade(uv, t)) * ff;
            vec3 c2 = color(shade(uv2, t)) * (1.0 - ff);
			gl_FragColor = vec4(c1 + c2, 1.0);;
		}
		`;
        return getMesh(fragmentShader);
    },
    effect6() {
        const fragmentShader = `
        uniform float ratio;
        float PI = 3.1415926;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
		void main() { 
            vec2 p = (vUv - 0.5) * 2.0;
            float tau = PI * 2.0;
            float a = atan(p.x,p.y);
            float r = length(p)*0.75;
            vec2 uv = vec2(a/tau,r);
            //get the color
            float xCol = (uv.x - (iTime / 3.0)) * 3.0;
            xCol = mod(xCol, 3.0);
            vec3 horColour = vec3(0.25, 0.25, 0.25);
            if (xCol < 1.0) {
                horColour.r += 1.0 - xCol;
                horColour.g += xCol;
            }
            else if (xCol < 2.0) {
                xCol -= 1.0;
                horColour.g += 1.0 - xCol;
                horColour.b += xCol;
            }
            else {
                xCol -= 2.0;
                horColour.b += 1.0 - xCol;
                horColour.r += xCol;
            }
            // draw color beam
            uv = (2.0 * uv) - 1.0;
            float beamWidth = (0.7+0.5*cos(uv.x*10.0*tau*0.15*clamp(floor(5.0 + 10.0*cos(iTime)), 0.0, 10.0))) * abs(1.0 / (30.0 * uv.y));
            vec3 horBeam = vec3(beamWidth); 
			gl_FragColor = vec4((( horBeam) * horColour), 1.0);
		}
		`;
        return getMesh(fragmentShader);
    },
    effect7() {
        const fragmentShader = `
        uniform float ratio;
        float PI = 3.1415926;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        vec2 rotate(vec2 p, float rad) {
            mat2 m = mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
            return m * p;
        }
        vec2 translate(vec2 p, vec2 diff) {
            return p - diff;
        }
        vec2 scale(vec2 p, float r) {
            return p*r;
        }
        float circle(float pre, vec2 p, float r1, float r2, float power) {
            float leng = length(p);
            float d = min(abs(leng-r1), abs(leng-r2));
            if (r1<leng && leng<r2) pre /= exp(d)/r2;
            float res = power / d;
            return clamp(pre + res, 0.0, 1.0);
        }
        float rectangle(float pre, vec2 p, vec2 half1, vec2 half2, float power) {
            p = abs(p);
            if ((half1.x<p.x || half1.y<p.y) && (p.x<half2.x && p.y<half2.y)) {
                pre = max(0.01, pre);
            }
            float dx1 = (p.y < half1.y) ? abs(half1.x-p.x) : length(p-half1);
            float dx2 = (p.y < half2.y) ? abs(half2.x-p.x) : length(p-half2);
            float dy1 = (p.x < half1.x) ? abs(half1.y-p.y) : length(p-half1);
            float dy2 = (p.x < half2.x) ? abs(half2.y-p.y) : length(p-half2);
            float d = min(min(dx1, dx2), min(dy1, dy2));
            float res = power / d;
            return clamp(pre + res, 0.0, 1.0);
        }
        float radiation(float pre, vec2 p, float r1, float r2, int num, float power) {
            float angle = 2.0*PI/float(num);
            float d = 1e10;
            for(int i=0; i<360; i++) {
                if (i>=num) break;
                float _d = (r1<p.y && p.y<r2) ? 
                    abs(p.x) : 
                    min(length(p-vec2(0.0, r1)), length(p-vec2(0.0, r2)));
                d = min(d, _d);
                p = rotate(p, angle);
            }
            float res = power / d;
            return clamp(pre + res, 0.0, 1.0);
        }
        vec3 calc(vec2 p) {
            float dst = 0.0;
            p = scale(p, sin(PI*iTime/1.0)*0.02+1.1);
            {
                vec2 q = p;
                q = rotate(q, iTime * PI / 6.0);
                dst = circle(dst, q, 0.85, 0.9, 0.006);
                dst = radiation(dst, q, 0.87, 0.88, 36, 0.0008);
            }
            {
                vec2 q = p;
                q = rotate(q, iTime * PI / 6.0);
                const int n = 6;
                float angle = PI / float(n);
                q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
                for(int i=0; i<n; i++) {
                    dst = rectangle(dst, q, vec2(0.85/sqrt(2.0)), vec2(0.85/sqrt(2.0)), 0.0015);
                    q = rotate(q, angle);
                }
            }
            {
                vec2 q = p;
                q = rotate(q, iTime * PI / 6.0);
                const int n = 12;
                q = rotate(q, 2.0*PI/float(n)/2.0);
                float angle = 2.0*PI / float(n);
                for(int i=0; i<n; i++) {
                    dst = circle(dst, q-vec2(0.0, 0.875), 0.001, 0.05, 0.004);
                    dst = circle(dst, q-vec2(0.0, 0.875), 0.001, 0.001, 0.008);
                    q = rotate(q, angle);
                }
            }
            {
                vec2 q = p;
                dst = circle(dst, q, 0.5, 0.55, 0.002);
            }
            {
                vec2 q = p;
                q = rotate(q, -iTime * PI / 6.0);
                const int n = 3;
                float angle = PI / float(n);
                q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
                for(int i=0; i<n; i++) {
                    dst = rectangle(dst, q, vec2(0.36, 0.36), vec2(0.36, 0.36), 0.0015);
                    q = rotate(q, angle);
                }
            }
            {
                vec2 q = p;
                q = rotate(q, -iTime * PI / 6.0);
                const int n = 12;
                q = rotate(q, 2.0*PI/float(n)/2.0);
                float angle = 2.0*PI / float(n);
                for(int i=0; i<n; i++) {
                    dst = circle(dst, q-vec2(0.0, 0.53), 0.001, 0.035, 0.004);
                    dst = circle(dst, q-vec2(0.0, 0.53), 0.001, 0.001, 0.001);
                    q = rotate(q, angle);
                }
            }
            {
                vec2 q = p;
                q = rotate(q, iTime * PI / 6.0);
                dst = radiation(dst, q, 0.25, 0.3, 12, 0.005);
            }
            {
                vec2 q = p;
                q = scale(q, sin(PI*iTime/1.0)*0.04+1.1);
                q = rotate(q, -iTime * PI / 6.0);
                for(float i=0.0; i<6.0; i++) {
                    float r = 0.13-i*0.01;
                    q = translate(q, vec2(0.1, 0.0));
                    dst = circle(dst, q, r, r, 0.002);
                    q = translate(q, -vec2(0.1, 0.0));
                    q = rotate(q, -iTime * PI / 12.0);
                }
                dst = circle(dst, q, 0.04, 0.04, 0.004);
            }
            return pow(dst, 2.5) * vec3(1.0, 0.95, 0.8);
        }
		void main() { 
            vec2 uv = (vUv - 0.5) * 2.0;
			gl_FragColor = vec4(calc(uv), 1.0);;
		}
		`;
        return getMesh(fragmentShader);
    },
    effect8() {
        const fragmentShader = `
        #define SMOOTH(r,R) (1.0-smoothstep(R-1.0,R+1.0, r))
        #define RANGE(a,b,x) ( step(a,x)*(1.0-step(b,x)) )
        #define RS(a,b,x) ( smoothstep(a-1.0,a+1.0,x)*(1.0-smoothstep(b-1.0,b+1.0,x)) )
        #define M_PI 3.1415926535897932384626433832795
        #define blue1 vec3(0.74,0.95,1.00)
        #define blue2 vec3(0.87,0.98,1.00)
        #define blue3 vec3(0.35,0.76,0.83)
        #define blue4 vec3(0.953,0.969,0.89)
        #define red   vec3(1.00,0.38,0.227)
        #define MOV(a,b,c,d,t) (vec2(a*cos(t)+b*cos(0.1*(t)), c*sin(t)+d*cos(0.1*(t))))
        uniform float ratio;
        float PI = 3.1415926;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        float movingLine(vec2 uv, vec2 center, float radius)
        {
            //angle of the line
            float theta0 = 90.0 * iTime;
            vec2 d = uv - center;
            float r = sqrt( dot( d, d ) );
            if(r<radius)
            {
                //compute the distance to the line theta=theta0
                vec2 p = radius*vec2(cos(theta0*M_PI/180.0),
                                    -sin(theta0*M_PI/180.0));
                float l = length( d - p*clamp( dot(d,p)/dot(p,p), 0.0, 1.0) );
                d = normalize(d);
                //compute gradient based on angle difference to theta0
                float theta = mod(180.0*atan(d.y,d.x)/M_PI+theta0,360.0);
                float gradient = clamp(1.0-theta/90.0,0.0,1.0);
                return SMOOTH(l,1.0)+0.5*gradient;
            }
            else return 0.0;
        }
        float circle(vec2 uv, vec2 center, float radius, float width)
        {
            float r = length(uv - center);
            return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
        }
        float circle2(vec2 uv, vec2 center, float radius, float width, float opening)
        {
            vec2 d = uv - center;
            float r = sqrt( dot( d, d ) );
            d = normalize(d);
            if( abs(d.y) > opening )
                return SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius);
            else
                return 0.0;
        }
        float circle3(vec2 uv, vec2 center, float radius, float width)
        {
            vec2 d = uv - center;
            float r = sqrt( dot( d, d ) );
            d = normalize(d);
            float theta = 180.0*(atan(d.y,d.x)/M_PI);
            return smoothstep(2.0, 2.1, abs(mod(theta+2.0,45.0)-2.0)) *
                mix( 0.5, 1.0, step(45.0, abs(mod(theta, 180.0)-90.0)) ) *
                (SMOOTH(r-width/2.0,radius)-SMOOTH(r+width/2.0,radius));
        }
        float triangles(vec2 uv, vec2 center, float radius)
        {
            vec2 d = uv - center;
            return RS(-8.0, 0.0, d.x-radius) * (1.0-smoothstep( 7.0+d.x-radius,9.0+d.x-radius, abs(d.y)))
                + RS( 0.0, 8.0, d.x+radius) * (1.0-smoothstep( 7.0-d.x-radius,9.0-d.x-radius, abs(d.y)))
                + RS(-8.0, 0.0, d.y-radius) * (1.0-smoothstep( 7.0+d.y-radius,9.0+d.y-radius, abs(d.x)))
                + RS( 0.0, 8.0, d.y+radius) * (1.0-smoothstep( 7.0-d.y-radius,9.0-d.y-radius, abs(d.x)));
        }
        float _cross(vec2 uv, vec2 center, float radius)
        {
            vec2 d = uv - center;
            int x = int(d.x);
            int y = int(d.y);
            float r = sqrt( dot( d, d ) );
            if( (r<radius) && ( (x==y) || (x==-y) ) )
                return 1.0;
            else return 0.0;
        }
        float dots(vec2 uv, vec2 center, float radius)
        {
            vec2 d = uv - center;
            float r = sqrt( dot( d, d ) );
            if( r <= 2.5 )
                return 1.0;
            if( ( r<= radius) && ( (abs(d.y+0.5)<=1.0) && ( mod(d.x+1.0, 50.0) < 2.0 ) ) )
                return 1.0;
            else if ( (abs(d.y+0.5)<=1.0) && ( r >= 50.0 ) && ( r < 115.0 ) )
                return 0.5;
            else
                return 0.0;
        }
        float bip1(vec2 uv, vec2 center)
        {
            return SMOOTH(length(uv - center),3.0);
        }
        float bip2(vec2 uv, vec2 center)
        {
            float r = length(uv - center);
            float R = 8.0+mod(87.0*iTime, 80.0);
            return (0.5-0.5*cos(30.0*iTime)) * SMOOTH(r,5.0)
                + SMOOTH(6.0,r)-SMOOTH(8.0,r)
                + smoothstep(max(8.0,R-20.0),R,r)-SMOOTH(R,r);
        }
		void main() { 
            vec2 _uv = vec2(vUv.x * iResolution.x, vUv.y * iResolution.y);
            vec3 finalColor;
            vec2 uv = _uv;
            //center of the image
            vec2 c = vec2(iResolution.x / 2.0, iResolution.y / 2.0);
            finalColor = vec3( 0.3*_cross(uv, c, 240.0) );
            finalColor += ( circle(uv, c, 100.0, 1.0)
                        + circle(uv, c, 165.0, 1.0) ) * blue1;
            finalColor += (circle(uv, c, 240.0, 2.0) );//+ dots(uv,c,240.0)) * blue4;
            finalColor += circle3(uv, c, 313.0, 4.0) * blue1;
            finalColor += triangles(uv, c, 315.0 + 30.0*sin(iTime)) * blue2;
            finalColor += movingLine(uv, c, 240.0) * blue3;
            finalColor += circle(uv, c, 10.0, 1.0) * blue3;
            finalColor += 0.7 * circle2(uv, c, 262.0, 1.0, 0.5+0.2*cos(iTime)) * blue3;
            if( length(uv-c) < 240.0 )
            {
                //animate some bips with random movements
                vec2 p = 130.0*MOV(1.3,1.0,1.0,1.4,3.0+0.1*iTime);
                finalColor += bip1(uv, c+p) * vec3(1,1,1);
                p = 130.0*MOV(0.9,-1.1,1.7,0.8,-2.0+sin(0.1*iTime)+0.15*iTime);
                finalColor += bip1(uv, c+p) * vec3(1,1,1);
                p = 50.0*MOV(1.54,1.7,1.37,1.8,sin(0.1*iTime+7.0)+0.2*iTime);
                finalColor += bip2(uv,c+p) * red;
            }
			gl_FragColor = vec4( finalColor, 1.0 );
		}
		`;
        return getMesh(fragmentShader);
    },
    effect9() {
        const fragmentShader = `
        uniform float ratio;
        float PI = 3.1415926;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        const float cloudscale = 1.1;
        const float speed = 0.03;
        const float clouddark = 0.5;
        const float cloudlight = 0.3;
        const float cloudcover = 0.2;
        const float cloudalpha = 8.0;
        const float skytint = 0.5;
        const vec3 skycolour1 = vec3(0.2, 0.4, 0.6);
        const vec3 skycolour2 = vec3(0.4, 0.7, 1.0);
        const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
        vec2 hash( vec2 p ) {
            p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
        }
        float noise( in vec2 p ) {
            const float K1 = 0.366025404; // (sqrt(3)-1)/2;
            const float K2 = 0.211324865; // (3-sqrt(3))/6;
            vec2 i = floor(p + (p.x+p.y)*K1);	
            vec2 a = p - i + (i.x+i.y)*K2;
            vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
            vec2 b = a - o + K2;
            vec2 c = a - 1.0 + 2.0*K2;
            vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
            vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
            return dot(n, vec3(70.0));	
        }
        float fbm(vec2 n) {
            float total = 0.0, amplitude = 0.1;
            for (int i = 0; i < 7; i++) {
                total += noise(n) * amplitude;
                n = m * n;
                amplitude *= 0.4;
            }
            return total;
        }
		void main() { 
            vec2 p = (vUv - 0.5) * 2.0;
            vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);    
            float time = iTime * speed;
            float q = fbm(uv * cloudscale * 0.5);
            //ridged noise shape
            float r = 0.0;
            uv *= cloudscale;
            uv -= q - time;
            float weight = 0.8;
            for (int i=0; i<8; i++){
                r += abs(weight*noise( uv ));
                uv = m*uv + time;
                weight *= 0.7;
            }
            //noise shape
            float f = 0.0;
            uv = p*vec2(iResolution.x/iResolution.y,1.0);
            uv *= cloudscale;
            uv -= q - time;
            weight = 0.7;
            for (int i=0; i<8; i++){
                f += weight*noise( uv );
                uv = m*uv + time;
                weight *= 0.6;
            }
            f *= r + f;
            //noise colour
            float c = 0.0;
            time = iTime * speed * 2.0;
            uv = p*vec2(iResolution.x/iResolution.y,1.0);
            uv *= cloudscale*2.0;
            uv -= q - time;
            weight = 0.4;
            for (int i=0; i<7; i++){
                c += weight*noise( uv );
                uv = m*uv + time;
                weight *= 0.6;
            }
            //noise ridge colour
            float c1 = 0.0;
            time = iTime * speed * 3.0;
            uv = p*vec2(iResolution.x/iResolution.y,1.0);
            uv *= cloudscale*3.0;
            uv -= q - time;
            weight = 0.4;
            for (int i=0; i<7; i++){
                c1 += abs(weight*noise( uv ));
                uv = m*uv + time;
                weight *= 0.6;
            }
            c += c1;
            vec3 skycolour = mix(skycolour2, skycolour1, p.y);
            vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
            f = cloudcover + cloudalpha*f*r;
            vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
			gl_FragColor = vec4( result, 1.0 );
		}
		`;
        return getMesh(fragmentShader);
    },
    effect10() {
        const fragmentShader = `
        uniform float ratio;
        float PI = 3.1415926;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        struct Gear
        {
            float t;			// Time
            float gearR;		// Gear radius
            float teethH;		// Teeth height
            float teethR;		// Teeth "roundness"
            float teethCount;	// Teeth count
            float diskR;		// Inner or outer border radius
            vec3 color;			// Color
        };
        float GearFunction(vec2 uv, Gear g)
        {
            float r = length(uv);
            float a = atan(uv.y, uv.x);
            // Gear polar function:
            //  A sine squashed by a logistic function gives a convincing
            //  gear shape!
            float p = g.gearR-0.5*g.teethH + 
                    g.teethH/(1.0+exp(g.teethR*sin(g.t + g.teethCount*a)));
            float gear = r - p;
            float disk = r - g.diskR;
            return g.gearR > g.diskR ? max(-disk, gear) : max(disk, -gear);
        }
        float GearDe(vec2 uv, Gear g)
        {
            // IQ's f/|Grad(f)| distance estimator:
            float f = GearFunction(uv, g);
            vec2 eps = vec2(0.0001, 0);
            vec2 grad = vec2(
                GearFunction(uv + eps.xy, g) - GearFunction(uv - eps.xy, g),
                GearFunction(uv + eps.yx, g) - GearFunction(uv - eps.yx, g)) / (2.0*eps.x);
            return (f)/length(grad);
        }
        float GearShadow(vec2 uv, Gear g)
        {
            float r = length(uv+vec2(0.1));
            float de = r - g.diskR + 0.0*(g.diskR - g.gearR);
            float eps = 0.4*g.diskR;
            return smoothstep(eps, 0., abs(de));
        }
        void DrawGear(inout vec3 color, vec2 uv, Gear g, float eps)
        {
            float d = smoothstep(eps, -eps, GearDe(uv, g));
            float s = 1.0 - 0.7*GearShadow(uv, g);
            color = mix(s*color, g.color, d);
        }
		void main() { 
            float t = 0.5*iTime;
            vec2 uv = (vUv - 0.5) * 2.0;
            float eps = 2.0/iResolution.y;
            // Scene parameters;
            vec3 base = vec3(0.95, 0.7, 0.2);
            const float count = 8.0;
            Gear outer = Gear(0.0, 0.8, 0.08, 4.0, 32.0, 0.9, base);
            Gear inner = Gear(0.0, 0.4, 0.08, 4.0, 16.0, 0.3, base);
            // Draw inner gears back to front:
            vec3 color = vec3(0.0);
            for(float i=0.0; i<count; i++)
            {
                t += 2.0*PI/count;
                inner.t = 16.0*t;
                inner.color = base*(0.35 + 0.6*i/(count-1.0));
                DrawGear(color, uv+0.4*vec2(cos(t),sin(t)), inner, eps);
            }
            // Draw outer gear:
            DrawGear(color, uv, outer, eps);
			gl_FragColor = vec4(color,1.0);
		}
		`;
        return getMesh(fragmentShader);
    },
    effect11() {
        const fragmentShader = `
        #define TAU 6.28318530718
        #define MAX_ITER 5
        precision highp float;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        void main(void) {
            float time = iTime * .5+23.0;
            // uv should be the 0-1 uv of texture...
            vec2 uv = vUv;
        #ifdef SHOW_TILING
            vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
        #else
            vec2 p = mod(uv*TAU, TAU)-250.0;
        #endif
            vec2 i = vec2(p);
            float c = 1.0;
            float inten = .005;
            for (int n = 0; n < MAX_ITER; n++) 
            {
                float t = time * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
            }
            c /= float(MAX_ITER);
            c = 1.17-pow(c, 1.4);
            vec3 colour = vec3(pow(abs(c), 8.0));
            colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
            #ifdef SHOW_TILING
            // Flash tile borders...
            vec2 pixel = 2.0 / iResolution.xy;
            uv *= 2.0;
            float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
            vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
            uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
            colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
            #endif
            gl_FragColor = vec4(colour, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect12() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        float snoise(vec3 uv, float res)
        {
            const vec3 s = vec3(1e0, 1e2, 1e3);
            uv *= res;
            vec3 uv0 = floor(mod(uv, res))*s;
            vec3 uv1 = floor(mod(uv+vec3(1.), res))*s;
            vec3 f = fract(uv); f = f*f*(3.0-2.0*f);
            vec4 v = vec4(uv0.x+uv0.y+uv0.z, uv1.x+uv0.y+uv0.z,
                        uv0.x+uv1.y+uv0.z, uv1.x+uv1.y+uv0.z);
            vec4 r = fract(sin(v*1e-1)*1e3);
            float r0 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
            r = fract(sin((v + uv1.z - uv0.z)*1e-1)*1e3);
            float r1 = mix(mix(r.x, r.y, f.x), mix(r.z, r.w, f.x), f.y);
            return mix(r0, r1, f.z)*2.-1.;
        }
        void main(void) {
            vec2 p = (vUv - 0.5) * 2.0;
            p.x *= iResolution.x/iResolution.y;
            float color = 3.0 - (3.*length(2.*p));
            vec3 coord = vec3(atan(p.x,p.y)/6.2832+.5, length(p)*.4, .5);
            for(int i = 1; i <= 7; i++)
            {
                float power = pow(2.0, float(i));
                color += (1.5 / power) * snoise(coord + vec3(0.,-iTime*.05, iTime*.01), power*16.);
            }
            gl_FragColor = vec4( color, pow(max(color,0.),2.)*0.4, pow(max(color,0.),3.)*0.15 , 1.0);
            // gl_FragColor = vec4(colour, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect13() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        void main(void) {
            vec2 uv = (vUv - 0.5) * 2.0;
            float t = iTime * .1 + ((.25 + .05 * sin(iTime * .1))/(length(uv.xy) + .07)) * 2.2;
            float si = sin(t);
            float co = cos(t);
            mat2 ma = mat2(co, si, -si, co);
            float v1, v2, v3;
            v1 = v2 = v3 = 0.0;
            float s = 0.0;
            for (int i = 0; i < 90; i++)
            {
                vec3 p = s * vec3(uv, 0.0);
                p.xy *= ma;
                p += vec3(.22, .3, s - 1.5 - sin(iTime * .13) * .1);
                for (int i = 0; i < 8; i++)	p = abs(p) / dot(p,p) - 0.659;
                v1 += dot(p,p) * .0015 * (1.8 + sin(length(uv.xy * 13.0) + .5  - iTime * .2));
                v2 += dot(p,p) * .0013 * (1.5 + sin(length(uv.xy * 14.5) + 1.2 - iTime * .3));
                v3 += length(p.xy*10.) * .0003;
                s  += .035;
            }
            float len = length(uv);
            v1 *= smoothstep(.7, .0, len);
            v2 *= smoothstep(.5, .0, len);
            v3 *= smoothstep(.9, .0, len);
            vec3 col = vec3( v3 * (1.5 + sin(iTime * .2) * .4),
                            (v1 + v3) * .3,
                            v2) + smoothstep(0.2, .0, len) * .85 + smoothstep(.0, .6, v3) * .3;
                            gl_FragColor=vec4(min(pow(abs(col), vec3(1.2)), 1.0), 1.0);
            // gl_FragColor = vec4(colour, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect14() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        float plasma(vec2 p, float iso, float fade)
        {
            float c = 0.0;
            for (float i=1.0; i<10.0; ++i) {
                float f1 = i / 0.6;
                float f2 = i / 0.3;
                float f3 = i / 0.7;
                float f4 = i / 0.5;
                float s1 = i / 2.0;
                float s2 = i / 4.0;
                float s3 = i / 3.0;
                c += sin(p.x * f1 + iTime) * s1 + sin(p.y * f2 + 0.5 * iTime) * s2 + sin(p.x * f3 + p.y * f4 - 1.5 * iTime) * s3;
            }
            //c = mod(clamp(c, -1.0, 1.0), 0.5) * 2.0;
            c = mod(c, 16.0) * 0.5 - 7.0;
            if (c < iso) {
                return 0.0;
            }
            else {
                if (c > 0.5) c = 1.0 - c;
                c *= 2.0;
                return c * fade;
            }
        }
        void main(void) {
            vec2 pos = (vUv - 0.5) * 2.0;
            float c = 0.0;
            for (float i=0.0; i<27.0; ++i)
            {
                float patazoom = mod(0.5 * iTime, 1.0);
                float zoom = 1.0 + i - patazoom;
                vec2 trans = vec2(sin(iTime * 0.3) * 0.5, sin(iTime * 0.4) * 0.2);
                c = plasma(pos * zoom + trans, 0.0, 2.0 / (1.0 + i - patazoom));
                if (c> 0.001) break;
            }
            gl_FragColor = vec4(c * pos.x, c * pos.y, c * abs(pos.x + pos.y), 0.5) * 2.0;
            // gl_FragColor = vec4(colour, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect15() {
        const fragmentShader = `
        precision highp float;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        float random (in vec2 p) { 
            vec3 p3  = fract(vec3(p.xyx) * .1031);
            p3 += dot(p3, p3.yzx + 33.33);
            return fract((p3.x + p3.y) * p3.z);
        }
        float noise (in vec2 _st) {
            vec2 i = floor(_st);
            vec2 f = fract(_st);
            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3. - 2.0 * f);
            return mix(a, b, u.x) + 
                    (c - a)* u.y * (1. - u.x) + 
                    (d - b) * u.x * u.y;
        }
        float light(in vec2 pos,in float size,in float radius,in float inner_fade,in float outer_fade){
            float len = length(pos/size);
            return pow(clamp((1.0 - pow( clamp(len-radius,0.0,1.0) , 1.0/inner_fade)),0.0,1.0),1.0/outer_fade);
        }
        float flare(in float angle,in float alpha,in float time){
            float t = time;
            float n = noise(vec2(t+0.5+abs(angle)+pow(alpha,0.6),t-abs(angle)+pow(alpha+0.1,0.6))*7.0);
           //	n = 1.0;
            float split = (15.0+sin(t*2.0+n*4.0+angle*20.0+alpha*1.0*n)*(.3+.5+alpha*.6*n));
            float rotate = sin(angle*20.0 + sin(angle*15.0+alpha*4.0+t*30.0+n*5.0+alpha*4.0))*(.5 + alpha*1.5);
            float g = pow((2.0+sin(split+n*1.5*alpha+rotate)*1.4)*n*4.0,n*(1.5-0.8*alpha));
            g *= alpha * alpha * alpha * .5;
            g += alpha*.7 + g * g * g;
            return g;
        }
        #define SIZE 2.8
        #define RADIUS 0.07
        #define INNER_FADE .8
        #define OUTER_FADE 0.02
        #define SPEED .1
        #define BORDER 0.21
        void main(void) {
            vec2 uv = (vUv - 0.5) * 2.0;
            float f = .0;
            float f2 = .0;
            float t = iTime * SPEED;
            float alpha = light(uv,SIZE,RADIUS,INNER_FADE,OUTER_FADE);
            float angle = atan(uv.x,uv.y);
            float n = noise(vec2(uv.x*20.+iTime,uv.y*20.+iTime));
            float l = length(uv);
            if(l < BORDER){
                t *= .8;
                alpha = (1. - pow(((BORDER - l)/BORDER),0.22)*0.7);
                alpha = clamp(alpha-light(uv,0.2,0.0,1.3,.7)*.55,.0,1.);
                f = flare(angle*1.0,alpha,-t*.5+alpha);
                f2 = flare(angle*1.0,alpha*1.2,((-t+alpha*.5+0.38134)));
            }else if(alpha < 0.001){
                f = alpha;
            }else{
                f = flare(angle,alpha,t)*1.3;
            }
            gl_FragColor = vec4(vec3(f*(1.0+sin(angle-t*4.)*.3)+f2*f2*f2,f*alpha+f2*f2*2.0,f*alpha*0.5+f2*(1.0+sin(angle+t*4.)*.3)),1.0);
            // gl_FragColor = vec4(colour, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect16() {
        const fragmentShader = `
        precision highp float;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
vec3 rY(vec3 p, float a) {
    vec3 q = p;
    float c = cos(a);
    float s = sin(a);
    q.x = c * p.x + s * p.z;
    q.z = -s * p.x + c * p.z;
    return q;
}
// returns a pair of values for the distances along the ray at which there are sphere intersections, or 0 if none
vec2 sphereIntersectionDistances(vec3 rayOrigin, vec3 rayDirection, vec3 sphereOrigin, float sphereRadius) {
    vec3 toCenter = sphereOrigin - rayOrigin;
    float toCenterAlongRay = dot(toCenter, rayDirection);
    float perpendicularDistanceSquared = dot(toCenter, toCenter) - toCenterAlongRay * toCenterAlongRay;
    float radiusSquared = sphereRadius * sphereRadius;
    if (perpendicularDistanceSquared > radiusSquared) { // ray doesn’t touch the sphere
        return vec2(0.);
    }
    float insideSphereAlongRay = sqrt(radiusSquared - perpendicularDistanceSquared); // half the length of the portion of the ray inside the sphere
    float intersection1 = toCenterAlongRay - insideSphereAlongRay;
    float intersection2 = toCenterAlongRay + insideSphereAlongRay;
    if (intersection1 > intersection2) {
        float t = intersection1;
        intersection1 = intersection2;
        intersection2 = t;
    }
    if (intersection1 < 0.) { // first intersection is before the start of the ray
        if (intersection2 < 0.) { // ditto second, though that… shouldn’t happen?
            return vec2(0.);
        } else {
            intersection1 = intersection2;
            intersection2 = 0.;
        }
    }
    return vec2(intersection1, intersection2);
}
// -----------------
// 3d noise by iq, from https://www.shadertoy.com/view/Xsl3Dl
// The MIT License
// Copyright © 2013 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
vec3 hash( vec3 p )
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));
	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
float noise( in vec3 p )
{
    vec3 i = floor( p );
    vec3 f = fract( p );
	vec3 u = f*f*(3.0-2.0*f);
    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}
// hash functions by David Hoskins, from https://www.shadertoy.com/view/4djSRW
// Creative Commons Attribution-ShareAlike 4.0 International Public License
float hash11(float p)
{
    p = fract(p * .1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}
vec3 hash31(float p)
{
   vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
   p3 += dot(p3, p3.yzx + 33.33);
   return fract((p3.xxy + p3.yzz) * p3.zyx); 
}
// -----------------
float octavedNoise(vec3 position) {
    vec3 samplePosition = position * 2.;
    float noiseAmount = noise(samplePosition + iTime * vec3(0.0,0.2,0.0));
    samplePosition *= 1.99;
    noiseAmount += noise(samplePosition + iTime * vec3(0.05,-0.37,0.02)) * 0.51;
    noiseAmount /= 1.51;
    return noiseAmount;
}
float density(vec3 position) {
    float baseValue = 1.0 - pow(max(0.0, length(position)), 2.0);
    float noiseAmount = octavedNoise(position);
    return max(0.,min(1.,baseValue - max(0.,noiseAmount * 1.5)));
}
vec4 innerLightPositionAndIntensity() {
    float scaledTime = iTime * 6.1;
    float hashInput = floor(scaledTime) * 0.1;
    if (hash11(hashInput) < 0.8) return vec4(0.); // mask out most of the flashes
    vec3 hash = hash31(hashInput);
    float theta = hash.x * 6.283;
    float z = hash.y * 2. - 1.;
    float sinPhi = sin(acos(z));
    vec3 position = vec3(sinPhi * cos(theta), sinPhi * sin(theta), z) * (0.6 + hash.z * 0.2);
    float intensity = sin(fract(scaledTime) * 3.142);
    return vec4(position, intensity);
}
// marching logic adapted from Ryan Brucks's article here: https://shaderbits.com/blog/creating-a-volumetric-ray-tracer
vec4 march(vec3 origin, vec3 direction) {
    const int mainSteps = 30;
    const int shadowSteps = 10;
    const vec3 toLight = normalize(vec3(1.0,1.0,0.));
    const float mainDensityScale = 4.;
    const float shadowingThreshold = 0.001;
    const float shadowDensityScale = 3.;
    vec3 light = vec3(0.);
    float transmittance = 1.;
    vec3 samplePosition = origin;
    const float mainStepLength = 2. / float(mainSteps); // why does lowering this below 2 change the appearance?
    const float shadowStepLength = 1. / float(shadowSteps);
    const vec3 scaledShadowDensity = shadowDensityScale * shadowStepLength / vec3(0.8,0.7,1.0);
    const float shadowConstant = -log(shadowingThreshold) / scaledShadowDensity.z;
    const vec3 mainLightColor = vec3(0.6,0.8,1.);
    const vec3 innerLightColor = vec3(0.7,0.4,1.) * 4.;
    vec3 mainStepAmount = direction * mainStepLength;
    vec3 shadowStepAmount = toLight * shadowStepLength;
    vec4 innerLight = innerLightPositionAndIntensity();
    for(int i = 0; i < mainSteps; i++) {
        float localDensity = min(1.0, density(samplePosition) * mainDensityScale);
        if (localDensity > 0.001) {
            // - main light (directional)
            vec3 shadowSamplePosition = samplePosition;
            float shadowAccumulation = 0.;
            for(int j = 0; j < shadowSteps; j++) {
                shadowSamplePosition += shadowStepAmount;
                shadowAccumulation += min(1.0, density(shadowSamplePosition) * shadowDensityScale);
                if (shadowAccumulation > shadowConstant || dot(shadowSamplePosition, shadowSamplePosition) > 1.) break;
            }
            vec3 shadowTerm = exp(-shadowAccumulation * scaledShadowDensity);
            float stepDensity = min(1.,localDensity * mainStepLength);
            vec3 absorbedLight = shadowTerm * stepDensity;
            // accumulate directional light
            light += absorbedLight * transmittance * mainLightColor;
            // - inner light (point)
            shadowSamplePosition = samplePosition;
            shadowAccumulation = 0.;
            vec3 toInnerLight = innerLight.xyz - samplePosition;
            vec3 innerLightShadowStepAmount = normalize(toInnerLight) * shadowStepLength;
            for(int j = 0; j < shadowSteps; j++) {
                shadowSamplePosition += innerLightShadowStepAmount;
                shadowAccumulation += min(1.0, density(shadowSamplePosition) * shadowDensityScale);
                // bail out if we’ve accumulated enough or if we’ve gone outside the bounding sphere (squared length of the sample position > 1)
                if (shadowAccumulation > shadowConstant || dot(shadowSamplePosition, shadowSamplePosition) > 1.) break;
            }
            shadowTerm = exp(-shadowAccumulation * scaledShadowDensity);
            stepDensity = min(1.,localDensity * mainStepLength);
            absorbedLight = shadowTerm * stepDensity;
            // inverse-squared fade of the inner point light
            float attenuation = min(1.0, 1.0 / (dot(toInnerLight, toInnerLight) * 2. + 0.0001)) * innerLight.w;
            // accumulate point light
            light += absorbedLight * (transmittance * attenuation) * innerLightColor;
            // -
            transmittance *= (1. - stepDensity);
            if (transmittance < 0.01) {
                break;
            }
        }
        samplePosition += mainStepAmount;
    }
    return vec4(vec3(light), transmittance);
}
        void main(void) {
            vec2 uv = (vUv - 0.5) * 2.0;
            uv.x *= iResolution.x / iResolution.y;
    const vec3 cameraLookAt = vec3(0.0, 0.0, 0.0);
    vec3 cameraPosition = rY(vec3(0.0, 0.1, 1.0) * 2.5, iTime * 0.2);
    vec3 cameraForward = normalize(cameraLookAt - cameraPosition);
    vec3 cameraRight = cross(cameraForward, vec3(0.0, 1.0, 0.0));
    vec3 cameraUp = cross(cameraRight, cameraForward);
	vec3 rayDirection = normalize(uv.x * cameraRight + uv.y * cameraUp + 2.0 * cameraForward);
    // closest and farthest intersections, if any, with the bounding sphere
    vec2 rayDistances = sphereIntersectionDistances(cameraPosition, rayDirection, vec3(0.), 1.);
    vec3 backgroundColor = vec3(0.1) - length(uv) * 0.04; // vignette
    if (rayDistances.x != 0. && rayDistances.y != 0.) {
        vec3 farIntersection = cameraPosition + rayDirection * rayDistances.y;
        vec4 value = march(farIntersection, -rayDirection);
        gl_FragColor = vec4(mix(value.rgb, backgroundColor, value.w), 1.0);
        // containing ball
        /*
        vec3 nearIntersection = cameraPosition + rayDirection * rayDistances.x;
        gl_FragColor += pow(1.0 - abs(dot(rayDirection, nearIntersection)), 8.) * 0.3;
		*/
    } else {
        gl_FragColor = vec4(backgroundColor, 1.0);
    } 
        }
		`;
        return getMesh(fragmentShader);
    },
    effect17() {
        const fragmentShader = `
        precision highp float;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        // Rand value between 0 and 1
        float rand(vec2 p) {
            return fract(sin(dot(p, vec2(12.543,514.123)))*4732.12);
        }
        // Value noise
        float noise(vec2 p) {
            vec2 f = smoothstep(0.0, 1.0, fract(p));
            vec2 i = floor(p);
            float a = rand(i);
            float b = rand(i+vec2(1.0,0.0));
            float c = rand(i+vec2(0.0,1.0));
            float d = rand(i+vec2(1.0,1.0));
            return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }
        // Fractal noise
        float fbm(vec2 p) {
            float a = 0.5;
            float r = 0.0;
            for (int i = 0; i < 8; i++) {
                r += a*noise(p);
                a *= 0.5;
                p *= 2.0;
            }
            return r;
        }
        // Lasers originating from a central point
        float laser(vec2 p, int num) {
            float r = atan(p.x, p.y);
            float sn = sin(r*float(num)+iTime);
            float lzr = 0.5+0.5*sn;
            lzr = lzr*lzr*lzr*lzr*lzr;
            float glow = pow(clamp(sn, 0.0, 1.0),100.0);
            return lzr+glow;
        }
        // Mix of fractal noises to simulate fog
        float clouds(vec2 uv) {
            vec2 t = vec2(0,iTime);
            float c1 = fbm(fbm(uv*3.0)*0.75+uv*3.0+t/3.0);
            float c2 = fbm(fbm(uv*2.0)*0.5+uv*7.0+t/3.0);
            float c3 = fbm(fbm(uv*10.0-t)*0.75+uv*5.0+t/6.0);
            float r = mix(c1, c2, c3*c3);
            return r*r;
        }
        void main(void) {
            vec2 uv = (vUv - 0.4) * 2.0;
            vec2 hs = iResolution.xy/iResolution.y*0.5;
            vec2 uvc = uv-hs;
            float l = (1.0 + 3.0*noise(vec2(15.0-iTime)))
                * laser(vec2(uv.x+0.5, uv.y*(0.5 + 10.0*noise(vec2(iTime/5.0))) + 0.1), 15);
            l += fbm(vec2(2.0*iTime))
                * laser(vec2(hs.x-uvc.x-0.2, uv.y+0.1), 25);
            l += noise(vec2(iTime-73.0))
                * laser(vec2(uvc.x, 1.0-uv.y+0.5), 30);
            float c = clouds(uv);
            vec4 col = vec4(0, 1, 0, 1)*(uv.y*l+uv.y*uv.y)*c;
            gl_FragColor = pow(col, vec4(0.75));
        }
		`;
        return getMesh(fragmentShader);
    },
    effect18() {
        const fragmentShader = `
        precision highp float;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );
        float noise( in vec2 p )
        {
            return sin(p.x)*sin(p.y);
        }
        float fbm4( vec2 p )
        {
            float f = 0.0;
            f += 0.5000*noise( p ); p = m*p*2.02;
            f += 0.2500*noise( p ); p = m*p*2.03;
            f += 0.1250*noise( p ); p = m*p*2.01;
            f += 0.0625*noise( p );
            return f/0.9375;
        }
        float fbm6( vec2 p )
        {
            float f = 0.0;
            f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
            f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
            f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
            f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
            f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
            f += 0.015625*(0.5+0.5*noise( p ));
            return f/0.96875;
        }
        vec2 fbm4_2( vec2 p )
        {
            return vec2(fbm4(p), fbm4(p+vec2(7.8)));
        }
        vec2 fbm6_2( vec2 p )
        {
            return vec2(fbm6(p+vec2(16.8)), fbm6(p+vec2(11.5)));
        }
        //====================================================================
        float func( vec2 q, out vec4 ron )
        {
            q += 0.03*sin( vec2(0.27,0.23)*iTime + length(q)*vec2(4.1,4.3));
            vec2 o = fbm4_2( 0.9*q );
            o += 0.04*sin( vec2(0.12,0.14)*iTime + length(o));
            vec2 n = fbm6_2( 3.0*o );
            ron = vec4( o, n );
            float f = 0.5 + 0.5*fbm4( 1.8*q + 6.0*n );
            return mix( f, f*f*f*3.5, f*abs(n.x) );
        }
        void main(void) {
            vec2 p = (vUv - 0.4) * 2.0;
            float e = 2.0/iResolution.y;
    vec4 on = vec4(0.0);
    float f = func(p, on);
	vec3 col = vec3(0.0);
    col = mix( vec3(0.2,0.1,0.4), vec3(0.3,0.05,0.05), f );
    col = mix( col, vec3(0.9,0.9,0.9), dot(on.zw,on.zw) );
    col = mix( col, vec3(0.4,0.3,0.3), 0.2 + 0.5*on.y*on.y );
    col = mix( col, vec3(0.0,0.2,0.4), 0.5*smoothstep(1.2,1.3,abs(on.z)+abs(on.w)) );
    col = clamp( col*f*2.0, 0.0, 1.0 );
#if 0
    // gpu derivatives - bad quality, but fast
	vec3 nor = normalize( vec3( dFdx(f)*iResolution.x, 6.0, dFdy(f)*iResolution.y ) );
#else    
    // manual derivatives - better quality, but slower
    vec4 kk;
 	vec3 nor = normalize( vec3( func(p+vec2(e,0.0),kk)-f, 
                                2.0*e,
                                func(p+vec2(0.0,e),kk)-f ) );
#endif    
    vec3 lig = normalize( vec3( 0.9, 0.2, -0.4 ) );
    float dif = clamp( 0.3+0.7*dot( nor, lig ), 0.0, 1.0 );
    vec3 lin = vec3(0.70,0.90,0.95)*(nor.y*0.5+0.5) + vec3(0.15,0.10,0.05)*dif;
    col *= 1.2*lin;
	col = 1.0 - col;
	col = 1.1*col*col;
    gl_FragColor = vec4( col, 1.0 ); 
        }
		`;
        return getMesh(fragmentShader);
    },
    effect18() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 iMouse;
		varying vec2 vUv;
        float Hash2d(vec2 uv)
        {
            float f = uv.x + uv.y * 47.0;
            return fract(cos(f*3.333)*100003.9);
        }
        float Hash3d(vec3 uv)
        {
            float f = uv.x + uv.y * 37.0 + uv.z * 521.0;
            return fract(cos(f*3.333)*100003.9);
        }
        float mixP(float f0, float f1, float a)
        {
            return mix(f0, f1, a*a*(3.0-2.0*a));
        }
        const vec2 zeroOne = vec2(0.0, 1.0);
        float noise2d(vec2 uv)
        {
            vec2 fr = fract(uv.xy);
            vec2 fl = floor(uv.xy);
            float h00 = Hash2d(fl);
            float h10 = Hash2d(fl + zeroOne.yx);
            float h01 = Hash2d(fl + zeroOne);
            float h11 = Hash2d(fl + zeroOne.yy);
            return mixP(mixP(h00, h10, fr.x), mixP(h01, h11, fr.x), fr.y);
        }
        float noise(vec3 uv)
        {
            vec3 fr = fract(uv.xyz);
            vec3 fl = floor(uv.xyz);
            float h000 = Hash3d(fl);
            float h100 = Hash3d(fl + zeroOne.yxx);
            float h010 = Hash3d(fl + zeroOne.xyx);
            float h110 = Hash3d(fl + zeroOne.yyx);
            float h001 = Hash3d(fl + zeroOne.xxy);
            float h101 = Hash3d(fl + zeroOne.yxy);
            float h011 = Hash3d(fl + zeroOne.xyy);
            float h111 = Hash3d(fl + zeroOne.yyy);
            return mixP(
                mixP(mixP(h000, h100, fr.x), mixP(h010, h110, fr.x), fr.y),
                mixP(mixP(h001, h101, fr.x), mixP(h011, h111, fr.x), fr.y)
                , fr.z);
        }
        float PI=3.14159265;
        float Density(vec3 p)
        {
            //float ws = 0.06125*0.125;
            //vec3 warp = vec3(noise(p*ws), noise(p*ws + 111.11), noise(p*ws + 7111.11));
            float final = noise(p*0.06125);// + sin(iTime)*0.5-1.95 + warp.x*4.0;
            float other = noise(p*0.06125 + 1234.567);
            other -= 0.5;
            final -= 0.5;
            final = 0.1/(abs(final*final*other));
            final += 0.5;
            return final*0.0001;
        }
        void main(void) {
            vec2 uv = (vUv - 0.4) * 2.0;
            // Camera up vector.
            vec3 camUp=vec3(0,1,0); // vuv
            // Camera lookat.
            vec3 camLookat=vec3(0,0.0,0);	// vrp
            float mx=0.0/iResolution.x*PI*2.0 + iTime * 0.01;
            float my=0.0/iResolution.y*10.0 + sin(iTime * 0.03)*0.2+0.2;//*PI/2.01;
            vec3 camPos=vec3(cos(my)*cos(mx),sin(my),cos(my)*sin(mx))*(200.2); 	// prp
            // Camera setup.
            vec3 camVec=normalize(camLookat - camPos);//vpn
            vec3 sideNorm=normalize(cross(camUp, camVec));	// u
            vec3 upNorm=cross(camVec, sideNorm);//v
            vec3 worldFacing=(camPos + camVec);//vcv
            vec3 worldPix = worldFacing + uv.x * sideNorm * (iResolution.x/iResolution.y) + uv.y * upNorm;//scrCoord
            vec3 relVec = normalize(worldPix - camPos);//scp
            float t = 0.0;
            float inc = 0.02;
            float maxDepth = 70.0;
            vec3 pos = vec3(0,0,0);
            float density = 0.0;
            // ray marching time
            for (int i = 0; i < 37; i++)	// This is the count of how many times the ray actually marches.
            {
                if ((t > maxDepth)) break;
                pos = camPos + relVec * t;
                float temp = Density(pos); 
                inc = 1.9 + temp*0.05;	// add temp because this makes it look extra crazy!
                density += temp * inc;
                t += inc;
            }
            vec3 finalColor = vec3(0.01,0.1,1.0)* density*0.2;
            // output the final color with sqrt for "gamma correction"
            gl_FragColor = vec4(sqrt(clamp(finalColor, 0.0, 1.0)),1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect19() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 iMouse;
		varying vec2 vUv;
        #define PI 3.1415926
        #define NUM 20.
        #define PALETTE vec3(.0, 1.4, 2.)+1.5
        #define COLORED
        #define MIRROR
        //#define ROTATE
        #define ROT_OFST
        #define TRIANGLE_NOISE
        //#define SHOW_TRIANGLE_NOISE_ONLY
        mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}
        float tri(in float x){return abs(fract(x)-.5);}
        vec2 tri2(in vec2 p){return vec2(tri(p.x+tri(p.y*2.)),tri(p.y+tri(p.x*2.)));}
        mat2 m2 = mat2( 0.970,  0.242, -0.242,  0.970 );
        float triangleNoise(in vec2 p)
{
    float z=1.5;
    float z2=1.5;
	float rz = 0.;
    vec2 bp = p;
	for (float i=0.; i<=3.; i++ )
	{
        vec2 dg = tri2(bp*2.)*.8;
        dg *= mm2(iTime*.3);
        p += dg/z2;
        bp *= 1.6;
        z2 *= .6;
		z *= 1.8;
		p *= 1.2;
        p*= m2;
        rz+= (tri(p.x+tri(p.y)))/z;
	}
	return rz;
}
        void main(void) {
            float time = iTime* 1.2;
            float aspect = iResolution.x/iResolution.y;
        float w = 50./sqrt(iResolution.x*aspect+iResolution.y);
            vec2 p = (vUv -0.5) * 2.0 ;
            p.x *= aspect;
            p*= 1.05;
            vec2 bp = p;
            #ifdef ROTATE
            p *= mm2(time*.25);
            #endif
            float lp = length(p);
            float id = floor(lp*NUM+.5)/NUM;
            #ifdef ROT_OFST
            p *= mm2(id*11.);
            #endif
            #ifdef MIRROR
            p.y = abs(p.y); 
            #endif
            //polar coords
            vec2 plr = vec2(lp, atan(p.y, p.x));
            //Draw concentric circles
            float rz = 1.-pow(abs(sin(plr.x*PI*NUM))*1.25/pow(w,0.25),2.5);
            //get the current arc length for a given id
            float enp = plr.y+sin((time+id*5.5))*1.52-1.5;
            rz *= smoothstep(0., 0.05, enp);
            //smooth out both sides of the arcs (and clamp the number)
            rz *= smoothstep(0.,.022*w/plr.x, enp)*step(id,1.);
            #ifndef MIRROR
            rz *= smoothstep(-0.01,.02*w/plr.x,PI-plr.y);
            #endif
            #ifdef TRIANGLE_NOISE
            rz *= (triangleNoise(p/(w*w))*0.9+0.4);
            vec3 col = (sin(PALETTE+id*5.+time)*0.5+0.5)*rz;
            col += smoothstep(.4,1.,rz)*0.15;
            col *= smoothstep(.2,1.,rz)+1.;
            #else
            vec3 col = (sin(PALETTE+id*5.+time)*0.5+0.5)*rz;
            col *= smoothstep(.8,1.15,rz)*.7+.8;
            #endif
            #ifndef COLORED
            col = vec3(dot(col,vec3(.7)));
            #endif
            #ifdef SHOW_TRIANGLE_NOISE_ONLY
            col = vec3(triangleNoise(bp));
            #endif
            gl_FragColor = vec4(col,1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect20() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 iMouse;
		varying vec2 vUv;
		uniform sampler2D iChannel0;
        vec2 rotate(vec2 p, float a)
        {
            return vec2(p.x * cos(a) - p.y * sin(a), p.x * sin(a) + p.y * cos(a));
        }
        // 1D random numbers
        float rand(float n)
        {
            return fract(sin(n) * 43758.5453123);
        }
        // 2D random numbers
        vec2 rand2(in vec2 p)
        {
            return fract(vec2(sin(p.x * 591.32 + p.y * 154.077), cos(p.x * 391.32 + p.y * 49.077)));
        }
        // 1D noise
        float noise1(float p)
        {
            float fl = floor(p);
            float fc = fract(p);
            return mix(rand(fl), rand(fl + 1.0), fc);
        }
        // voronoi distance noise, based on iq's articles
        float voronoi(in vec2 x)
        {
            vec2 p = floor(x);
            vec2 f = fract(x);
            vec2 res = vec2(8.0);
            for(int j = -1; j <= 1; j ++)
            {
                for(int i = -1; i <= 1; i ++)
                {
                    vec2 b = vec2(i, j);
                    vec2 r = vec2(b) - f + rand2(p + b);
                    // chebyshev distance, one of many ways to do this
                    float d = max(abs(r.x), abs(r.y));
                    if(d < res.x)
                    {
                        res.y = res.x;
                        res.x = d;
                    }
                    else if(d < res.y)
                    {
                        res.y = d;
                    }
                }
            }
            return res.y - res.x;
        }
        void main(void) {
            float flicker = noise1(iTime * 2.0) * 0.8 + 0.4;
            vec2 uv = vUv;
            uv = (uv - 0.5) * 3.0;
            vec2 suv = uv;
            uv.x *= iResolution.x / iResolution.y;
            float v = 0.0;
            // that looks highly interesting:
            //v = 1.0 - length(uv) * 1.3;
            // a bit of camera movement
            uv *= 0.6 + sin(iTime * 0.1) * 0.4;
            uv = rotate(uv, sin(iTime * 0.3) * 1.0);
            uv += iTime * 0.4;
            // add some noise octaves
            float a = 0.6, f = 1.0;
            for(int i = 0; i < 3; i ++) // 4 octaves also look nice, its getting a bit slow though
            {	
                float v1 = voronoi(uv * f + 5.0);
                float v2 = 0.0;
                // make the moving electrons-effect for higher octaves
                if(i > 0)
                {
                    // of course everything based on voronoi
                    v2 = voronoi(uv * f * 0.5 + 50.0 + iTime);
                    float va = 0.0, vb = 0.0;
                    va = 1.0 - smoothstep(0.0, 0.1, v1);
                    vb = 1.0 - smoothstep(0.0, 0.08, v2);
                    v += a * pow(va * (0.5 + vb), 2.0);
                }
                // make sharp edges
                v1 = 1.0 - smoothstep(0.0, 0.3, v1);
                // noise is used as intensity map
                v2 = a * (noise1(v1 * 5.5 + 0.1));
                // octave 0's intensity changes a bit
                if(i == 0)
                    v += v2 * flicker;
                else
                    v += v2;
                f *= 3.0;
                a *= 0.7;
            }
            // slight vignetting
            v *= exp(-0.6 * length(suv)) * 1.2;
            // use texture channel0 for color? why not.
            vec3 cexp = texture2D(iChannel0, uv * 0.001).xyz * 3.0 + texture2D(iChannel0, uv * 0.01).xyz;//vec3(1.0, 2.0, 4.0);
            cexp *= 1.4;
            // old blueish color set
            //vec3 cexp = vec3(6.0, 4.0, 2.0);
            vec3 col = vec3(pow(v, cexp.x), pow(v, cexp.y), pow(v, cexp.z)) * 2.0;
            gl_FragColor = vec4(col, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect21() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 iMouse;
		varying vec2 vUv; 
        float hexLength(vec2 v) {
            vec2 a = abs(v);
            return max((2.0/sqrt(3.0))*a.x, (1.0/sqrt(3.0))*a.x + a.y);
        }
        void main(void) {
            vec3 c;
            float l,z=iTime;
            for(int i=0;i<3;i++) {
                vec2 uv,p=vUv;
                uv=p;
                p-=.5;
                p.x*=iResolution.x/iResolution.y;
                z+=.07;
                l=hexLength(p);
                uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z*2.));
                c[i]=.01/hexLength(abs(mod(uv,1.)-.5));
            }
            gl_FragColor=vec4(c/l,iTime); 
        }
		`;
        return getMesh(fragmentShader);
    },
    effect22() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 iMouse;
		varying vec2 vUv;  
        float Circle(vec2 uv, vec2 pos, float r){
            float d = length(uv - pos);
            return r / d;
        }
        float random(vec2 p)
        {
             return fract(sin(dot(vec2(100.,324.), p)) * 22141.);   
        }
        void main(void) {
            // vc - voronoi coords, mc - metaballs coords
            vec2 vc = (vUv - 0.5) * 2.0;
            vec2 mc = vc ;
            vc.x *= iResolution.x/iResolution.y;
            mc.x *= iResolution.x/iResolution.y;
            // voronoi
            vc *= 9.; 
            vec2 i = floor(vc);
            vec2 gv = fract(vc) - .5;
            float minDist = 1.;
            for(float y = -1.; y <= 1.; y++)
            {
                 for(float x = -1.; x <= 1.; x++)
                {
                    vec2 o = vec2(x,y);
                     vec2 rp = vec2(random(i + o.xy), random(i + o.xy));  
                    vec2 p = o + sin(rp * iTime) * .5;
                    float d = length(gv - p);
                    if(d < minDist){
                        minDist = d;
                    }
                }
            }
            vec3 col = vec3(.5,.75,1.5) * minDist;
            // metaballs
            float r = .05;
            float c = Circle(mc, vec2(sin(iTime * 2.) * .4,  cos(iTime * .4) * .4), r);
            c += Circle(mc, vec2(sin(iTime * .5) * .4, cos(iTime * .7) * .4), r);
            c += Circle(mc, vec2(sin(iTime * .7) * .4, cos(iTime * .8) * .4), r);
            c += Circle(mc, vec2(sin(iTime * .2) * .4, cos(iTime * .3) * .4), r);
            c += Circle(mc, vec2(sin(iTime * .3) * .4, cos(iTime * .4) * .4), r);
            c += Circle(mc, vec2(sin(iTime * .6) * .4, cos(iTime) * .4), r);
            c += Circle(mc, vec2(sin(iTime * .5) * .4, cos(iTime * .2) * .4), r);
            // Output to screen
            gl_FragColor = vec4(col,1.0) * c * 1.5;
        }
		`;
        return getMesh(fragmentShader);
    },
    effect23() {
        const fragmentShader = `
		uniform float iTime;
		uniform sampler2D iChannel0;
		uniform vec2 iResolution; 
		varying vec2 iMouse;
		varying vec2 vUv;  
        #define NUM_RAYS 13.
#define VOLUMETRIC_STEPS 19
#define MAX_ITER 35
#define FAR 6.
#define time iTime*1.1
mat2 mm2(in float a){float c = cos(a), s = sin(a);return mat2(c,-s,s,c);}
float noise( in float x ){return texture2D(iChannel0, vec2(x*.01,1.),0.0).x;}
float hash( float n ){return fract(sin(n)*43758.5453);}
float noise(in vec3 p)
{
	vec3 ip = floor(p);
    vec3 fp = fract(p);
	fp = fp*fp*(3.0-2.0*fp);
	vec2 tap = (ip.xy+vec2(37.0,17.0)*ip.z) + fp.xy;
	vec2 rg = texture2D( iChannel0, (tap + 0.5)/256.0, 0.0 ).yx;
	return mix(rg.x, rg.y, fp.z);
}
mat3 m3 = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64 );
//See: https://www.shadertoy.com/view/XdfXRj
float flow(in vec3 p, in float t)
{
	float z=2.;
	float rz = 0.;
	vec3 bp = p;
	for (float i= 1.;i < 5.;i++ )
	{
		p += time*.1;
		rz+= (sin(noise(p+t*0.8)*6.)*0.5+0.5) /z;
		p = mix(bp,p,0.6);
		z *= 2.;
		p *= 2.01;
        p*= m3;
	}
	return rz;	
}
//could be improved
float sins(in float x)
{
 	float rz = 0.;
    float z = 2.;
    for (float i= 0.;i < 3.;i++ )
	{
        rz += abs(fract(x*1.4)-0.5)/z;
        x *= 1.3;
        z *= 1.15;
        x -= time*.65*z;
    }
    return rz;
}
float segm( vec3 p, vec3 a, vec3 b)
{
    vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1. );	
	return length( pa - ba*h )*.5;
}
vec3 path(in float i, in float d)
{
    vec3 en = vec3(0.,0.,1.);
    float sns2 = sins(d+i*0.5)*0.22;
    float sns = sins(d+i*.6)*0.21;
    en.xz *= mm2((hash(i*10.569)-.5)*6.2+sns2);
    en.xy *= mm2((hash(i*4.732)-.5)*6.2+sns);
    return en;
}
vec2 map(vec3 p, float i)
{
	float lp = length(p);
    vec3 bg = vec3(0.);   
    vec3 en = path(i,lp);
    float ins = smoothstep(0.11,.46,lp);
    float outs = .15+smoothstep(.0,.15,abs(lp-1.));
    p *= ins*outs;
    float id = ins*outs;
    float rz = segm(p, bg, en)-0.011;
    return vec2(rz,id);
}
float march(in vec3 ro, in vec3 rd, in float startf, in float maxd, in float j)
{
	float precis = 0.001;
    float h=0.5;
    float d = startf;
    for( int i=0; i<MAX_ITER; i++ )
    {
        if( abs(h)<precis||d>maxd ) break;
        d += h*1.2;
	    float res = map(ro+rd*d, j).x;
        h = res;
    }
	return d;
}
//volumetric marching
vec3 vmarch(in vec3 ro, in vec3 rd, in float j, in vec3 orig)
{   
    vec3 p = ro;
    vec2 r = vec2(0.);
    vec3 sum = vec3(0);
    float w = 0.;
    for( int i=0; i<VOLUMETRIC_STEPS; i++ )
    {
        r = map(p,j);
        p += rd*.03;
        float lp = length(p);
        vec3 col = sin(vec3(1.05,2.5,1.52)*3.94+r.y)*.85+0.4;
        col.rgb *= smoothstep(.0,.015,-r.x);
        col *= smoothstep(0.04,.2,abs(lp-1.1));
        col *= smoothstep(0.1,.34,lp);
        sum += abs(col)*5. * (1.2-noise(lp*2.+j*13.+time*5.)*1.1) / (log(distance(p,orig)-2.)+.75);
    }
    return sum;
}
//returns both collision dists of unit sphere
vec2 iSphere2(in vec3 ro, in vec3 rd)
{
    vec3 oc = ro;
    float b = dot(oc, rd);
    float c = dot(oc,oc) - 1.;
    float h = b*b - c;
    if(h <0.0) return vec2(-1.);
    else return vec2((-b - sqrt(h)), (-b + sqrt(h)));
}
        void main(void) {
            vec2 p = (vUv - 0.5 ) * 2.0;
            p.x*=iResolution.x/iResolution.y;
	vec2 um = vec2(iTime, .0) / iResolution.xy-.5;
	//camera
	vec3 ro = vec3(0.,0.,5.);
    vec3 rd = normalize(vec3(p*.7,-1.5));
    mat2 mx = mm2(time*.4+um.x*6.);
    mat2 my = mm2(time*0.3+um.y*6.); 
    ro.xz *= mx;rd.xz *= mx;
    ro.xy *= my;rd.xy *= my;
    vec3 bro = ro;
    vec3 brd = rd;
    vec3 col = vec3(0.0125,0.,0.025);
    #if 1
    for (float j = 1.;j<NUM_RAYS+1.;j++)
    {
        ro = bro;
        rd = brd;
        mat2 mm = mm2((time*0.1+((j+1.)*5.1))*j*0.25);
        ro.xy *= mm;rd.xy *= mm;
        ro.xz *= mm;rd.xz *= mm;
        float rz = march(ro,rd,2.5,FAR,j);
		if ( rz >= FAR)continue;
    	vec3 pos = ro+rz*rd;
    	col = max(col,vmarch(pos,rd,j, bro));
    }
    #endif
    ro = bro;
    rd = brd;
    vec2 sph = iSphere2(ro,rd);
    if (sph.x > 0.)
    {
        vec3 pos = ro+rd*sph.x;
        vec3 pos2 = ro+rd*sph.y;
        vec3 rf = reflect( rd, pos );
        vec3 rf2 = reflect( rd, pos2 );
        float nz = (-log(abs(flow(rf*1.2,time)-.01)));
        float nz2 = (-log(abs(flow(rf2*1.2,-time)-.01)));
        col += (0.1*nz*nz* vec3(0.12,0.12,.5) + 0.05*nz2*nz2*vec3(0.55,0.2,.55))*0.8;
    }
	gl_FragColor = vec4(col*1.3, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect24() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution;  
		varying vec2 vUv;  
        void main(void) {
            vec2 p = (vUv - 0.5 ) * 2.0;
            // vec2 p = (2.0*fragCoord-iResolution.xy)/min(iResolution.y,iResolution.x);
            // background color
            vec3 bcol = vec3(1.0,0.8,0.7-0.07*p.y)*(1.0-0.25*length(p));
            // animate
            float tt = mod(iTime,1.5)/1.5;
            float ss = pow(tt,.2)*0.5 + 0.5;
            ss = 1.0 + ss*0.5*sin(tt*6.2831*3.0 + p.y*0.5)*exp(-tt*4.0);
            p *= vec2(0.5,1.5) + ss*vec2(0.5,-0.5);
            // shape
        #if 0
            p *= 0.8;
            p.y = -0.1 - p.y*1.2 + abs(p.x)*(1.0-abs(p.x));
            float r = length(p);
            float d = 0.5;
        #else
            p.y -= 0.25;
            float a = atan(p.x,p.y)/3.141593;
            float r = length(p);
            float h = abs(a);
            float d = (13.0*h - 22.0*h*h + 10.0*h*h*h)/(6.0-5.0*h);
        #endif
            // color
            float s = 0.75 + 0.75*p.x;
            s *= 1.0-0.4*r;
            s = 0.3 + 0.7*s;
            s *= 0.5+0.5*pow( 1.0-clamp(r/d, 0.0, 1.0 ), 0.1 );
            vec3 hcol = vec3(1.0,0.4*r,0.3)*s;
            vec3 col = mix( bcol, hcol, smoothstep( -0.01, 0.01, d-r) );
            gl_FragColor = vec4(col,1.0);
	        // gl_FragColor = vec4(col*1.3, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect25() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution;  
        uniform sampler2D iChannel0;
		varying vec2 vUv;  
        #define MIN_HEIGHT 2.0
        #define MAX_HEIGHT 4.5
        #define WIND vec2(0.2, 0.1)
        vec3 sundir = normalize(vec3(1.0,0.75,1.0));
        float noise( in vec3 x )
        {
            vec3 f = fract(x);
            vec3 p = floor(x);
            f = f * f * (3.0 - 2.0 * f);
            p.xz += WIND * iTime;
            vec2 uv = (p.xz + vec2(37.0, 17.0) * p.y) + f.xz;
            vec2 rg = texture2D(iChannel0, (uv + 0.5)/256.0, 0.0).yx;
            return mix(rg.x, rg.y, f.y);
        }
        float fractal_noise(vec3 p)
        {
            float f = 0.0;
            // add animation
            //p = p - vec3(1.0, 1.0, 0.0) * iTime * 0.1;
            p = p * 3.0;
            f += 0.50000 * noise(p); p = 2.0 * p;
            f += 0.25000 * noise(p); p = 2.0 * p;
            f += 0.12500 * noise(p); p = 2.0 * p;
            f += 0.06250 * noise(p); p = 2.0 * p;
            f += 0.03125 * noise(p);
            return f;
        }
        float density(vec3 pos)
        {    
            float den = 3.0 * fractal_noise(pos * 0.3) - 2.0 + (pos.y - MIN_HEIGHT);
            float edge = 1.0 - smoothstep(MIN_HEIGHT, MAX_HEIGHT, pos.y);
            edge *= edge;
            den *= edge;
            den = clamp(den, 0.0, 1.0);
            return den;
        }
        vec3 raymarching(vec3 ro, vec3 rd, float t, vec3 backCol)
        {   
            vec4 sum = vec4(0.0);
            vec3 pos = ro + rd * t;
            for (int i = 0; i < 40; i++) {
                if (sum.a > 0.99 || 
                    pos.y < (MIN_HEIGHT-1.0) || 
                    pos.y > (MAX_HEIGHT+1.0)) break;
                float den = density(pos);
                if (den > 0.01) {
                    float dif = clamp((den - density(pos+0.3*sundir))/0.6, 0.0, 1.0);
                    vec3 lin = vec3(0.65,0.7,0.75)*1.5 + vec3(1.0, 0.6, 0.3)*dif;        
                    vec4 col = vec4( mix( vec3(1.0,0.95,0.8)*1.1, vec3(0.35,0.4,0.45), den), den);
                    col.rgb *= lin;
                    // front to back blending    
                    col.a *= 0.5;
                    col.rgb *= col.a;
                    sum = sum + col*(1.0 - sum.a); 
                }
                t += max(0.05, 0.02 * t);
                pos = ro + rd * t;
            }
            sum = clamp(sum, 0.0, 1.0);
            float h = rd.y;
            sum.rgb = mix(sum.rgb, backCol, exp(-20.*h*h) );
            return mix(backCol, sum.xyz, sum.a);
        }
        float planeIntersect( vec3 ro, vec3 rd, float plane)
        {
            float h = plane - ro.y;
            return h/rd.y;
        }
        mat3 setCamera(vec3 ro, vec3 ta, float cr)
        {
            vec3 cw = normalize(ta-ro);
            vec3 cp = vec3(sin(cr), cos(cr),0.0);
            vec3 cu = normalize( cross(cw,cp) );
            vec3 cv = normalize( cross(cu,cw) );
            return mat3( cu, cv, cw );
        }
        void main(void) {
            vec4 iMouse = vec4(iTime * 3.0, iTime, 0.2, iTime);
            vec2 p = (vUv - 0.5) * 4.0 ;
            vec2 mo = vec2(0.0);
            if (iMouse.z > 0.0) 
            {
                mo += (2.0 * iMouse.xy - iResolution.xy) / iResolution.yy;
            }
            vec3 ro = vec3(0.0, 0.0, -2.0);
            // Rotate the camera
            vec3 target = vec3(ro.x+10., 1.0+mo.y*3.0, ro.z);
            vec2 cossin = vec2(cos(mo.x), sin(mo.x));
            mat3 rot = mat3(cossin.x, 0.0, -cossin.y,
                            0.0, 1.0, 0.0,
                            cossin.y, 0.0, cossin.x);
            target = rot * (target - ro) + ro;
            // Compute the ray
            vec3 rd = setCamera(ro, target, 0.0) * normalize(vec3(p.xy, 1.5));
            float dist = planeIntersect(ro, rd, MIN_HEIGHT);
            float sun = clamp(dot(sundir, rd), 0.0, 1.0);
            vec3 col = mix(vec3(0.78,0.78,0.7), vec3(0.3,0.4,0.5), p.y * 0.5 + 0.5);
            col += 0.5*vec3(1.0,0.5,0.1)*pow(sun, 8.0);
            if (dist > 0.0) {
                col = raymarching(ro, rd, dist, col);
            }
            gl_FragColor = vec4(col, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect26() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        vec3 COLOR1 = vec3(0.0, 0.0, 0.3);
        vec3 COLOR2 = vec3(0.5, 0.0, 0.0);
        float BLOCK_WIDTH = 0.01;
        void main(void) {
            vec2 uv = (vUv - 0.3) * 2.0 ;
            // To create the BG pattern
            vec3 final_color = vec3(1.0);
            vec3 bg_color = vec3(0.0);
            vec3 wave_color = vec3(0.0);
            float c1 = mod(uv.x, 2.0 * BLOCK_WIDTH);
            c1 = step(BLOCK_WIDTH, c1);
            float c2 = mod(uv.y, 2.0 * BLOCK_WIDTH);
            c2 = step(BLOCK_WIDTH, c2);
            bg_color = mix(uv.x * COLOR1, uv.y * COLOR2, c1 * c2);
            // To create the waves
            float wave_width = 0.01;
            uv  = -1.0 + 2.0 * uv;
            uv.y += 0.1;
            for(float i = 0.0; i < 10.0; i++) {
                uv.y += (0.07 * sin(uv.x + i/7.0 + iTime ));
                wave_width = abs(1.0 / (150.0 * uv.y));
                wave_color += vec3(wave_width * 1.9, wave_width, wave_width * 1.5);
            }
            final_color = bg_color + wave_color;
            gl_FragColor = vec4(final_color, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect27() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}
        float map(vec3 p){
            p.xz*= m(iTime*0.4);p.xy*= m(iTime*0.3);
            vec3 q = p*2.+iTime;
            return length(p+vec3(sin(iTime*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
        }
        void main(void) { 
            vec2 p = (vUv - 0.5) * 2.0  ;
            vec3 cl = vec3(0.);
            float d = 2.5;
            for(int i=0; i<=5; i++)	{
                vec3 p = vec3(0,0,5.) + normalize(vec3(p, -1.))*d;
                float rz = map(p);
                float f =  clamp((rz - map(p+.1))*0.5, -.1, 1. );
                vec3 l = vec3(0.1,0.3,.4) + vec3(5., 2.5, 3.)*f;
                cl = cl*l + smoothstep(2.5, .0, rz)*.7*l;
                d += min(rz, 1.);
            }
            gl_FragColor = vec4(cl, 1.);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect28() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        float sdSphere(vec3 pos, float size)
        {
            return length(pos) - size;
        }
        float sdBox(vec3 pos, vec3 size)
        {
            pos = abs(pos) - vec3(size);
            return max(max(pos.x, pos.y), pos.z);
        }
        float sdOctahedron(vec3 p, float s)
        {
            p = abs(p);
            float m = p.x+p.y+p.z-s;
            vec3 q;
                if( 3.0*p.x < m ) q = p.xyz;
            else if( 3.0*p.y < m ) q = p.yzx;
            else if( 3.0*p.z < m ) q = p.zxy;
            else return m*0.57735027;
            float k = clamp(0.5*(q.z-q.y+s),0.0,s); 
            return length(vec3(q.x,q.y-s+k,q.z-k)); 
        }
        float sdPlane(vec3 pos)
        {
            return pos.y;
        }
        mat2 rotate(float a)
        {
            float s = sin(a);
            float c = cos(a);
            return mat2(c, s, -s, c);
        }
        vec3 repeat(vec3 pos, vec3 span)
        {
            return abs(mod(pos, span)) - span * 0.5;
        }
        float getDistance(vec3 pos, vec2 uv)
        {
            vec3 originalPos = pos;
            for(int i = 0; i < 3; i++)
            {
                pos = abs(pos) - 4.5;
                pos.xz *= rotate(1.0);
                pos.yz *= rotate(1.0);
            }
            pos = repeat(pos, vec3(4.0));
            float d0 = abs(originalPos.x) - 0.1;
            float d1 = sdBox(pos, vec3(0.8));
            pos.xy *= rotate(mix(1.0, 2.0, abs(sin(iTime))));
            float size = mix(1.1, 1.3, (abs(uv.y) * abs(uv.x)));
            float d2 = sdSphere(pos, size);
            float dd2 = sdOctahedron(pos, 1.8);
            float ddd2 = mix(d2, dd2, abs(sin(iTime)));
            return max(max(d1, -ddd2), -d0);
        }
        void main(void) { 
            vec2 p = (vUv - 0.5) * 4.5;
            // camera
            vec3 cameraOrigin = vec3(0.0, 0.0, -10.0 + iTime * 4.0);
            vec3 cameraTarget = vec3(cos(iTime) + sin(iTime / 2.0) * 10.0, exp(sin(iTime)) * 2.0, 3.0 + iTime * 4.0);
            vec3 upDirection = vec3(0.0, 1.0, 0.0);
            vec3 cameraDir = normalize(cameraTarget - cameraOrigin);
            vec3 cameraRight = normalize(cross(upDirection, cameraOrigin));
            vec3 cameraUp = cross(cameraDir, cameraRight);
            vec3 rayDirection = normalize(cameraRight * p.x + cameraUp * p.y + cameraDir);
            float depth = 0.0;
            float ac = 0.0;
            vec3 rayPos = vec3(0.0);
            float d = 0.0;
            for(int i = 0; i < 80; i++)
            {
                rayPos = cameraOrigin + rayDirection * depth;
                d = getDistance(rayPos, p);
                if(abs(d) < 0.0001)
                {
                    break;
                }
                ac += exp(-d * mix(5.0, 10.0, abs(sin(iTime))));        
                depth += d;
            }
            vec3 col = vec3(0.0, 0.3, 0.7);
            ac *= 1.2 * (iResolution.x/iResolution.y - abs(p.x)) ;
            vec3 finalCol = col * ac * 0.06;
            gl_FragColor = vec4(finalCol, 1.0);
            gl_FragColor.w = 1.0 - depth * 0.1;
        }
		`;
        return getMesh(fragmentShader);
    },
    effect29() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        #define PASS_COUNT 1
        vec4 iMouse = vec4(.0, 0, 0.2, 0);
float fBrightness = 2.5;
// Number of angular segments
float fSteps = 121.0;
float fParticleSize = 0.015;
float fParticleLength = 0.5 / 60.0;
// Min and Max star position radius. Min must be present to prevent stars too near camera
float fMinDist = 0.8;
float fMaxDist = 5.0;
float fRepeatMin = 1.0;
float fRepeatMax = 2.0;
// fog density
float fDepthFade = 0.8;
float Random(float x)
{
	return fract(sin(x * 123.456) * 23.4567 + sin(x * 345.678) * 45.6789 + sin(x * 456.789) * 56.789);
}
vec3 GetParticleColour( const in vec3 vParticlePos, const in float fParticleSize, const in vec3 vRayDir )
{		
	vec2 vNormDir = normalize(vRayDir.xy);
	float d1 = dot(vParticlePos.xy, vNormDir.xy) / length(vRayDir.xy);
	vec3 vClosest2d = vRayDir * d1;
	vec3 vClampedPos = vParticlePos;
	vClampedPos.z = clamp(vClosest2d.z, vParticlePos.z - fParticleLength, vParticlePos.z + fParticleLength);
	float d = dot(vClampedPos, vRayDir);
	vec3 vClosestPos = vRayDir * d;
	vec3 vDeltaPos = vClampedPos - vClosestPos;	
	float fClosestDist = length(vDeltaPos) / fParticleSize;
	float fShade = 	clamp(1.0 - fClosestDist, 0.0, 1.0);
	fShade = fShade * exp2(-d * fDepthFade) * fBrightness;
	return vec3(fShade);
}
vec3 GetParticlePos( const in vec3 vRayDir, const in float fZPos, const in float fSeed )
{
	float fAngle = atan(vRayDir.x, vRayDir.y);
	float fAngleFraction = fract(fAngle / (3.14 * 2.0));
	float fSegment = floor(fAngleFraction * fSteps + fSeed) + 0.5 - fSeed;
	float fParticleAngle = fSegment / fSteps * (3.14 * 2.0);
	float fSegmentPos = fSegment / fSteps;
	float fRadius = fMinDist + Random(fSegmentPos + fSeed) * (fMaxDist - fMinDist);
	float tunnelZ = vRayDir.z / length(vRayDir.xy / fRadius);
	tunnelZ += fZPos;
	float fRepeat = fRepeatMin + Random(fSegmentPos + 0.1 + fSeed) * (fRepeatMax - fRepeatMin);
	float fParticleZ = (ceil(tunnelZ / fRepeat) - 0.5) * fRepeat - fZPos;
	return vec3( sin(fParticleAngle) * fRadius, cos(fParticleAngle) * fRadius, fParticleZ );
}
vec3 Starfield( const in vec3 vRayDir, const in float fZPos, const in float fSeed )
{	
	vec3 vParticlePos = GetParticlePos(vRayDir, fZPos, fSeed);
	return GetParticleColour(vParticlePos, fParticleSize, vRayDir);	
}
vec3 RotateX( const in vec3 vPos, const in float fAngle )
{
    float s = sin(fAngle);
    float c = cos(fAngle);
    vec3 vResult = vec3( vPos.x, c * vPos.y + s * vPos.z, -s * vPos.y + c * vPos.z);
    return vResult;
}
vec3 RotateY( const in vec3 vPos, const in float fAngle )
{
    float s = sin(fAngle);
    float c = cos(fAngle);
    vec3 vResult = vec3( c * vPos.x + s * vPos.z, vPos.y, -s * vPos.x + c * vPos.z);
    return vResult;
}
vec3 RotateZ( const in vec3 vPos, const in float fAngle )
{
    float s = sin(fAngle);
    float c = cos(fAngle);
    vec3 vResult = vec3( c * vPos.x + s * vPos.y, -s * vPos.x + c * vPos.y, vPos.z);
    return vResult;
}
void mainVR( out vec4 fragColor, in vec2 fragCoord, vec3 vRayOrigin, vec3 vRayDir )
{
/*	vec2 vScreenUV = fragCoord.xy / iResolution.xy;
	vec2 vScreenPos = vScreenUV * 2.0 - 1.0;
	vScreenPos.x *= iResolution.x / iResolution.y;
	vec3 vRayDir = normalize(vec3(vScreenPos, 1.0));
	vec3 vEuler = vec3(0.5 + sin(iTime * 0.2) * 0.125, 0.5 + sin(iTime * 0.1) * 0.125, iTime * 0.1 + sin(iTime * 0.3) * 0.5);
	if(iMouse.z > 0.0)
	{
		vEuler.x = -((iMouse.y / iResolution.y) * 2.0 - 1.0);
		vEuler.y = -((iMouse.x / iResolution.x) * 2.0 - 1.0);
		vEuler.z = 0.0;
	}
	vRayDir = RotateX(vRayDir, vEuler.x);
	vRayDir = RotateY(vRayDir, vEuler.y);
	vRayDir = RotateZ(vRayDir, vEuler.z);
*/	
	float fShade = 0.0;
	float a = 0.2;
	float b = 10.0;
	float c = 1.0;
	float fZPos = 5.0 + iTime * c + sin(iTime * a) * b;
	float fSpeed = c + a * b * cos(a * iTime);
	fParticleLength = 0.25 * fSpeed / 60.0;
	float fSeed = 0.0;
	vec3 vResult = mix(vec3(0.005, 0.0, 0.01), vec3(0.01, 0.005, 0.0), vRayDir.y * 0.5 + 0.5);
	for(int i=0; i<PASS_COUNT; i++)
	{
		vResult += Starfield(vRayDir, fZPos, fSeed);
		fSeed += 1.234;
	}
	fragColor = vec4(sqrt(vResult),1.0);
}
        void main(void) { 
            vec2 vScreenUV = (vUv - 0.5) * 10.0;
	vec2 vScreenPos = vScreenUV * 2.0 - 1.0;
	vScreenPos.x *= iResolution.x / iResolution.y;
	vec3 vRayDir = normalize(vec3(vScreenPos, 1.0));
	vec3 vEuler = vec3(0.5 + sin(iTime * 0.2) * 0.125, 0.5 + sin(iTime * 0.1) * 0.125, iTime * 0.1 + sin(iTime * 0.3) * 0.5);
	if(iMouse.z > 0.0)
	{
		vEuler.x = -((iMouse.y / iResolution.y) * 2.0 - 1.0);
		vEuler.y = -((iMouse.x / iResolution.x) * 2.0 - 1.0);
		vEuler.z = 0.0;
	}
	vRayDir = RotateX(vRayDir, vEuler.x);
	vRayDir = RotateY(vRayDir, vEuler.y);
	vRayDir = RotateZ(vRayDir, vEuler.z);
	float fShade = 0.0;
	float a = 0.2;
	float b = 10.0;
	float c = 1.0;
	float fZPos = 5.0 + iTime * c + sin(iTime * a) * b;
	float fSpeed = c + a * b * cos(a * iTime);
	fParticleLength = 0.25 * fSpeed / 60.0;
	float fSeed = 0.0;
	vec3 vResult = mix(vec3(0.005, 0.0, 0.01), vec3(0.01, 0.005, 0.0), vRayDir.y * 0.5 + 0.5);
	for(int i=0; i<PASS_COUNT; i++)
	{
		vResult += Starfield(vRayDir, fZPos, fSeed);
		fSeed += 1.234;
	}
	gl_FragColor = vec4(sqrt(vResult),1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect30() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        #define USE_LIGHT 0
        mat3 m = mat3( 0.00,  0.80,  0.60,
                    -0.80,  0.36, -0.48,
                    -0.60, -0.48,  0.64);
        float hash(float n)
        {
            return fract(sin(n) * 43758.5453);
        }
        ///
        /// Noise function
        ///
        float noise(in vec3 x)
        {
            vec3 p = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            float n = p.x + p.y * 57.0 + 113.0 * p.z;
            float res = mix(mix(mix(hash(n +   0.0), hash(n +   1.0), f.x),
                                mix(hash(n +  57.0), hash(n +  58.0), f.x), f.y),
                            mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                                mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
            return res;
        }
        ///
        /// Fractal Brownian motion.
        ///
        /// Refer to:
        /// EN: https://thebookofshaders.com/13/
        /// JP: https://thebookofshaders.com/13/?lan=jp
        ///
        float fbm(vec3 p)
        {
            float f;
            f  = 0.5000 * noise(p); p = m * p * 2.02;
            f += 0.2500 * noise(p); p = m * p * 2.03;
            f += 0.1250 * noise(p);
            return f;
        }
        //////////////////////////////////////////////////
        ///
        /// Sphere distance function.
        ///
        /// But this function return inverse value.
        /// Normal dist function is like below.
        /// 
        /// return length(pos) - 0.1;
        ///
        /// Because this function is used for density.
        ///
        float scene(in vec3 pos)
        {
            return 0.1 - length(pos) * 0.05 + fbm(pos * 0.3);
        }
        ///
        /// Get normal of the cloud.
        ///
        vec3 getNormal(in vec3 p)
        {
            const float e = 0.01;
            return normalize(vec3(scene(vec3(p.x + e, p.y, p.z)) - scene(vec3(p.x - e, p.y, p.z)),
                                scene(vec3(p.x, p.y + e, p.z)) - scene(vec3(p.x, p.y - e, p.z)),
                                scene(vec3(p.x, p.y, p.z + e)) - scene(vec3(p.x, p.y, p.z - e))));
        }
        ///
        /// Create a camera pose control matrix.
        ///
        mat3 camera(vec3 ro, vec3 ta)
        {
            vec3 cw = normalize(ta - ro);
            vec3 cp = vec3(0.0, 1.0, 0.0);
            vec3 cu = cross(cw, cp);
            vec3 cv = cross(cu, cw);
            return mat3(cu, cv, cw);
        }
        void main(void) { 
            vec2 uv = (vUv - 0.5) * 3.0;
            vec2 mo = vec2(iTime * 0.1, cos(iTime * 0.25) * 3.0);
            // Camera
            float camDist = 25.0;
            // target
            vec3 ta = vec3(0.0, 1.0, 0.0);
            // Ray origin
            //vec3 ori = vec3(sin(iTime) * camDist, 0, cos(iTime) * camDist);
            vec3 ro = camDist * normalize(vec3(cos(2.75 - 3.0 * mo.x), 0.7 - 1.0 * (mo.y - 1.0), sin(2.75 - 3.0 * mo.x)));
            float targetDepth = 1.3;
            // Camera pose.
            mat3 c = camera(ro, ta);
            vec3 dir = c * normalize(vec3(uv, targetDepth));
            // For raymarching const values.
            const int sampleCount = 64;
            const int sampleLightCount = 6;
            const float eps = 0.01;
            // Raymarching step settings.
            float zMax = 40.0;
            float zstep = zMax / float(sampleCount);
            float zMaxl = 20.0;
            float zstepl = zMaxl / float(sampleLightCount);
            // Easy access to the ray origin
            vec3 p = ro;
            // Transmittance
            float T = 1.0;
            // Substantially transparency parameter.
            float absorption = 100.0;
            // Light Direction
            vec3 sun_direction = normalize(vec3(1.0, 0.0, 0.0));
            // Result of culcration
            vec4 color = vec4(0.0);
            for (int i = 0; i < sampleCount; i++)
            {
                // Using distance function for density.
                // So the function not normal value.
                // Please check it out on the function comment.
                float density = scene(p);
                // The density over 0.0 then start cloud ray marching.
                // Why? because the function will return negative value normally.
                // But if ray is into the cloud, the function will return positive value.
                if (density > 0.0)
                {
                    // Let's start cloud ray marching!
                    // why density sub by sampleCount?
                    // This mean integral for each sampling points.
                    float tmp = density / float(sampleCount);
                    T *= 1.0 - (tmp * absorption);
                    // Return if transmittance under 0.01. 
                    // Because the ray is almost absorbed.
                    if (T <= 0.01)
                    {
                        break;
                    }
                    #if USE_LIGHT == 1
                    // Light scattering
                    // Transmittance for Light
                    float Tl = 1.0;
                    // Start light scattering with raymarching.
                    // Raymarching position for the light.
                    vec3 lp = p;
                    // Iteration of sampling light.
                    for (int j = 0; j < sampleLightCount; j++)
                    {
                        float densityLight = scene(lp);
                        // If densityLight is over 0.0, the ray is stil in the cloud.
                        if (densityLight > 0.0)
                        {
                            float tmpl = densityLight / float(sampleCount);
                            Tl *= 1.0 - (tmpl * absorption);
                        }
                        if (Tl <= 0.01)
                        {
                            break;
                        }
                        // Step to next position.
                        lp += sun_direction * zstepl;
                    }
                    #endif
                    // Add ambient + light scattering color
                    float opaity = 50.0;
                    float k = opaity * tmp * T;
                    vec4 cloudColor = vec4(1.0);
                    vec4 col1 = cloudColor * k;
                    #if USE_LIGHT == 1
                    float opacityl = 30.0;
                    float kl = opacityl * tmp * T * Tl;
                    vec4 lightColor = vec4(1.0, 0.7, 0.9, 1.0);
                    vec4 col2 = lightColor * kl;
                    #else
                    vec4 col2 = vec4(0.0);
                    #endif
                    color += col1 + col2;
                }
                p += dir * zstep;
            }
            vec3 bg = mix(vec3(0.3, 0.1, 0.8), vec3(0.7, 0.7, 1.0), 1.0 - (uv.y + 1.0) * 0.5);
            color.rgb += bg;
            gl_FragColor = color;
        }
		`;
        return getMesh(fragmentShader);
    },
    effect31() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        #define TAU 6.28318530718
        #define TILING_FACTOR 1.0
        #define MAX_ITER 8
        float waterHighlight(vec2 p, float time, float foaminess)
        {
            vec2 i = vec2(p);
            float c = 0.0;
            float foaminess_factor = mix(1.0, 6.0, foaminess);
            float inten = .005 * foaminess_factor;
            for (int n = 0; n < MAX_ITER; n++) 
            {
                float t = time * (1.0 - (3.5 / float(n+1)));
                i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
                c += 1.0/length(vec2(p.x / (sin(i.x+t)),p.y / (cos(i.y+t))));
            }
            c = 0.2 + c / (inten * float(MAX_ITER));
            c = 1.17-pow(c, 1.4);
            c = pow(abs(c), 8.0);
            return c / sqrt(foaminess_factor);
        }
        void main(void) { 
            vec2 uv = vUv;
            float time = iTime * 0.1+23.0;
            // vec2 uv = fragCoord.xy / iResolution.xy;
            vec2 uv_square = vec2(uv.x * iResolution.x / iResolution.y, uv.y);
            float dist_center = pow(2.0*length(uv - 0.5), 2.0);
            float foaminess = smoothstep(0.4, 1.8, dist_center);
            float clearness = 0.1 + 0.9*smoothstep(0.1, 0.5, dist_center);
            vec2 p = mod(uv_square*TAU*TILING_FACTOR, TAU)-250.0;
            float c = waterHighlight(p, time, foaminess);
            vec3 water_color = vec3(0.0, 0.35, 0.5);
            vec3 color = vec3(c);
            color = clamp(color + water_color, 0.0, 1.0);
            color = mix(water_color, color, clearness);
            gl_FragColor = vec4(color, 1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect32() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        float time;
        //-----------------------------------------------------------------------------
        float hash( float n )
        {
            return fract(sin(n)*43758.5453);
        }
        //-----------------------------------------------------------------------------
        float noise( in vec2 x )
        {
            vec2 p = floor(x);
            vec2 f = fract(x);
            f = f*f*(3.0-2.0*f);
            float n = p.x + p.y*57.0;
            float res = mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                            mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y);
            return res;
        }
        //-----------------------------------------------------------------------------
        float SmokeParticle(vec2 loc, vec2 pos, float size, float rnd)
        {
            loc = loc-pos;
            float d = dot(loc, loc)/size;
            // Outside the circle? No influence...
            if (d > 1.0) return 0.0;
            // Rotate the particles...
            float r= time*rnd*1.85;
            float si = sin(r);
            float co = cos(r);
            // Grab the rotated noise decreasing resolution due to Y position.
            // Also used 'rnd' as an additional noise changer.
            d = noise(hash(rnd*828.0)*83.1+mat2(co, si, -si, co)*loc.xy*2./(pos.y*.16)) * pow((1.-d), 3.)*.7;
            return d;
        }
        //-----------------------------------------------------------------------------
        float RockParticle(vec2 loc, vec2 pos, float size, float rnd)
        {
            loc = loc-pos;
            float d = dot(loc, loc)/size;
            // Outside the circle? No influence...
            if (d > 1.0) return 0.0;
            float r= time*1.5 * (rnd);
            float si = sin(r);
            float co = cos(r);
            d = noise((rnd*38.0)*83.1+mat2(co, si, -si, co)*loc*143.0) * pow(1.0-d, 15.25);
            return pow(d, 2.)*5.;
        }
        void main(void) {
            time = (iTime+1.);
            vec2 uv = vUv * 2.0 - 1.1;
            uv.x *= iResolution.x/iResolution.y;
            vec3 col = mix(vec3(.95, 1., 1.0), vec3(.75, .89, 1.0), uv.y+.75);
            // Position...	
            uv = uv + vec2(0.1,1.1);
            // Loop through rock particles...
            for (float i = 0.0; i < 40.0; i+=1.0)
            {
                float t = time*1.3+i*(2.+hash(i*-1239.)*2.0);
                float sm = mod(t, 9.3)*.8;
                float rnd = floor(t / 9.3);
                vec2 pos = vec2(0.0, sm) *.5;
                pos.x += (hash(i*33.0+rnd)-.5)*.2 * sm*2.13;
                // Mechanics... a butchered d = vt + (1/2)at^2    ;)
                pos.y += (.1 - (.075+hash(i*30.0+rnd*36.7)*.15)*(sm*sm)*.8);
                float d = RockParticle(pos, uv, .01*hash(i*1332.23)+.001, (hash(-i*42.13*rnd)-.5)*15.0);
                if (d <= 0.0) continue;
                float c = max(.3+abs(hash(i*11340.0))*.8+(1.0-sm*.5), 0.0);
                col = mix(col, vec3(c,c*.2, 0.0), min(d, 1.));
            }
            // Loop through smoke particles...
            for (float i = 0.0; i < 120.0; i+=1.0)
            {
                // Lots of magic numbers? Yerp....
                float t=  time+i*(2.+hash(i*-1239.)*2.0);
                float sm = mod(t, 8.6) *.5;
                float rnd = floor(t / 8.6);
                vec2 pos = vec2(0.0, sm) *.5;
                pos.x += (hash(i)-.5)*.2 * uv.y*5.13;
                float d = SmokeParticle(pos, uv, .03*hash(i*1332.23+rnd)+.001+sm*0.03, hash(i*rnd*2242.13)-0.5);
                if (d <= 0.0) continue;
                d = d* max((3.0-(hash(i*127.0)*1.5) - sm*.63), 0.0);
                float c = abs(hash(i*4.4));
                // Black/rusty smoke...
                col = mix(col, vec3(c*.3+.05, c*.3, c*.25), min(d, 1.0));
                // Lava gush...
                col = mix(col, vec3(.52, .25, 0.0), max((d-1.05)*8.0, 0.0));
            }
            uv = vUv;
            col *= pow( 45.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y), .08 );
            gl_FragColor = vec4( col, 1.0 );
        }
		`;
        return getMesh(fragmentShader);
    },
    effect33() {
        const fragmentShader = `
		uniform float iTime;
		uniform vec2 iResolution;
		varying vec2 vUv;
        #define POINT_COUNT 8
vec2 points[POINT_COUNT];
const float speed = -0.5;
const float len = 0.25;
const float scale = 0.012;
float intensity = 1.3;
float radius = 0.015;
//https://www.shadertoy.com/view/MlKcDD
//Signed distance to a quadratic bezier
float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C){
    vec2 a = B - A;
    vec2 b = A - 2.0*B + C;
    vec2 c = a * 2.0;
    vec2 d = A - pos;
    float kk = 1.0 / dot(b,b);
    float kx = kk * dot(a,b);
    float ky = kk * (2.0*dot(a,a)+dot(d,b)) / 3.0;
    float kz = kk * dot(d,a);      
    float res = 0.0;
    float p = ky - kx*kx;
    float p3 = p*p*p;
    float q = kx*(2.0*kx*kx - 3.0*ky) + kz;
    float h = q*q + 4.0*p3;
    if(h >= 0.0){ 
        h = sqrt(h);
        vec2 x = (vec2(h, -h) - q) / 2.0;
        vec2 uv = sign(x)*pow(abs(x), vec2(1.0/3.0));
        float t = uv.x + uv.y - kx;
        t = clamp( t, 0.0, 1.0 );
        // 1 root
        vec2 qos = d + (c + b*t)*t;
        res = length(qos);
    }else{
        float z = sqrt(-p);
        float v = acos( q/(p*z*2.0) ) / 3.0;
        float m = cos(v);
        float n = sin(v)*1.732050808;
        vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
        t = clamp( t, 0.0, 1.0 );
        // 3 roots
        vec2 qos = d + (c + b*t.x)*t.x;
        float dis = dot(qos,qos);
        res = dis;
        qos = d + (c + b*t.y)*t.y;
        dis = dot(qos,qos);
        res = min(res,dis);
        qos = d + (c + b*t.z)*t.z;
        dis = dot(qos,qos);
        res = min(res,dis);
        res = sqrt( res );
    }
    return res;
}
//http://mathworld.wolfram.com/HeartCurve.html
vec2 getHeartPosition(float t){
    return vec2(16.0 * sin(t) * sin(t) * sin(t),
                -(13.0 * cos(t) - 5.0 * cos(2.0*t)
                - 2.0 * cos(3.0*t) - cos(4.0*t)));
}
//https://www.shadertoy.com/view/3s3GDn
float getGlow(float dist, float radius, float intensity){
    return pow(radius/dist, intensity);
}
float getSegment(float t, vec2 pos, float offset){
	for(int i = 0; i < POINT_COUNT; i++){
        points[i] = getHeartPosition(offset + float(i)*len + fract(speed * t) * 6.28);
    }
    vec2 c = (points[0] + points[1]) / 2.0;
    vec2 c_prev;
	float dist = 10000.0;
    for(int i = 0; i < POINT_COUNT-1; i++){
        //https://tinyurl.com/y2htbwkm
        c_prev = c;
        c = (points[i] + points[i+1]) / 2.0;
        dist = min(dist, sdBezier(pos, scale * c_prev, scale * points[i], scale * c));
    }
    return max(0.0, dist);
}
        void main(void) {
            vec2 uv = vUv;
    float widthHeightRatio = iResolution.x/iResolution.y;
    vec2 centre = vec2(0.5, 0.5);
    vec2 pos = centre - uv;
    pos.y /= widthHeightRatio;
    //Shift upwards to centre heart
    pos.y += 0.03;
    float t = iTime;
    //Get first segment
    float dist = getSegment(t, pos, 0.0);
    float glow = getGlow(dist, radius, intensity);
    vec3 col = vec3(0.0);
    //White core
    col += 10.0*vec3(smoothstep(0.006, 0.003, dist));
    //Pink glow
    col += glow * vec3(1.0,0.05,0.3);
    //Get second segment
    dist = getSegment(t, pos, 3.4);
    glow = getGlow(dist, radius, intensity);
    //White core
    col += 10.0*vec3(smoothstep(0.006, 0.003, dist));
    //Blue glow
    col += glow * vec3(0.1,0.4,1.0);
    //Tone mapping
    col = 1.0 - exp(-col);
    //Gamma
    col = pow(col, vec3(0.4545));
    //Output to screen
    gl_FragColor = vec4(col,1.0);
        }
		`;
        return getMesh(fragmentShader);
    },
    effect34() {
        const fragmentShader = `
		uniform float iTime; 
		uniform vec2 iResolution; 
		varying vec2 vUv;  
        float hash(float x)
{
	return fract(21654.6512 * sin(385.51 * x));
}
float hash(vec2 p)
{
	return fract(21654.65155 * sin(35.51 * p.x + 45.51 * p.y));
}
float lhash(float x, float y)
{
	float h = 0.0;
	for(int i = 0;i < 5;i++)
	{
		h += (fract(21654.65155 * float(i) * sin(35.51 * x + 45.51 * float(i) * y * (5.0 / float(i))))* 2.0 - 1.0) / 10.0;
	}
	return h / 5.0 + 0.02;
	return (fract(21654.65155 * sin(35.51 * x + 45.51 * y))* 2.0 - 1.0) / 20.0;
}
float noise(vec2 p)
{
	vec2 fl = floor(p);
	vec2 fr = fract(p);
	fr.x = smoothstep(0.0,1.0,fr.x);
	fr.y = smoothstep(0.0,1.0,fr.y);
	float a = mix(hash(fl + vec2(0.0,0.0)), hash(fl + vec2(1.0,0.0)),fr.x);
	float b = mix(hash(fl + vec2(0.0,1.0)), hash(fl + vec2(1.0,1.0)),fr.x);
	return mix(a,b,fr.y);
}
//Fractal Brownian Motion 
float fbm(vec2 p)
{
	float v = 0.0, f = 1.0, a = 0.5;
	for(int i = 0;i < 5; i++)
	{
		v += noise(p * f) * a;
		f *= 2.0;
		a *= 0.5;
	}
	return v;
}
        void main(void) {
            float time = iTime*1.;
            vec2 uv = (vUv - 0.5) * 2.0;
            uv = uv*2.0 -1.0;
            uv.x *= iResolution.x / iResolution.y;	
            float p = fbm(vec2(noise(uv+time/2.5),noise(uv*2.+cos(time/2.)/2.)));
            //uncomment for more plasma/lighting/plastic effect..
            //p = (1. - abs(p * 2.0 - 1.0))*.8;
            vec3 col = pow(vec3(p),vec3(0.3))-0.4;
            col = mix( col, vec3(1.0), 1.0-smoothstep(0.0,0.2,pow(1.0 / 2.0,0.5) - uv.y/40.0) );
            float s = smoothstep(.35,.6,col.x);
            float s2 = smoothstep(.47,.6,col.x);
            float s3 = smoothstep(.51,.6,col.x);
            //multiply by the inverse to get the "smoky" effect, first attempt
            col*=vec3(1.3,.1,0.1)*s; //add red
            col+=vec3(0.3,0.4,.1)*s2; //add orange
            col+=vec3(1.,4.,.1)*s3; //add yellow
            //made it more bright
            col*=1.5;
            gl_FragColor = vec4(col,col.r*.3);
            gl_FragColor.rgb += 0.05;
        }
		`;
        return getMesh(fragmentShader);
    },
    effect35() {
        const fragmentShader = `
		uniform float iTime; 
		varying vec2 vUv;  
        vec3 hsb2rgb(in vec3 c)
        {
            vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                    6.0)-3.0)-1.0,
            0.0,
            1.0 );
            rgb = rgb*rgb*(3.0-2.0*rgb);
            return c.z * mix( vec3(1.0), rgb, c.y);
        }
        void main(void) {
            // float time = iTime*1.;
            vec2 uv = (vUv - 0.5) * 4.0;
            float r = length(uv) * 0.9;
            vec3 color = hsb2rgb(vec3(0.24, 0.7, 0.4));
            float a = pow(r, 2.0);
            float b = sin(r * 0.8 - 1.6);
            float c = sin(r - 0.010);
            float s = sin(a - iTime * 3.0 + b) * c;
            color *= abs(1.0 / (s * 10.8)) - 0.01;
            gl_FragColor = vec4(color, 1.);
        }
		`;
        return getMesh(fragmentShader);
    },
}