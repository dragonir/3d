uniform sampler2D uAlphaMask;
uniform vec3 uColor;

varying vec2 vUv;

void main()
{
    float alpha = texture2D(uAlphaMask, vUv).r;

    #ifdef INVERT
        alpha = 1.0 - alpha;
    #endif

    gl_FragColor = vec4(uColor, alpha);
}