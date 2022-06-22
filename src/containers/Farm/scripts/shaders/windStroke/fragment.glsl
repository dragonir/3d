uniform float uProgress;

varying vec2 vUv;

void main()
{
    float amplitude = 0.6;
    float fadeAmplitude = 0.1;
    float progress = ((1.0 - uProgress) * (1.0 + amplitude + fadeAmplitude)) - (amplitude + fadeAmplitude) * 0.5;
    float progressAlpha = (1.0 - (abs(progress - vUv.x) - (amplitude * 0.5)) / (fadeAmplitude / 2.0));
    float endsAlpha = min(vUv.x * 20.0, (1.0 - vUv.x) * 20.0);
    float finalAlpha = min(progressAlpha, endsAlpha);
    finalAlpha = min(1.0, finalAlpha) * 0.7;
    gl_FragColor = vec4(1.0, 1.0, 1.0, finalAlpha);
}