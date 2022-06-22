varying vec3 vColor;

void main()
{
    gl_Position = vec4(position, 1.0);

    vColor = color;
}