/*
* simple diffuse lighting shader
* constant direction
* constant base material color
* light color is just white
* two-sided lighting
*/


// @@Snippet:simple_lighting
varying vec3 v_normal;

// note that this is in VIEW COORDINATES
const vec3 baseColor = vec3(1.,1.,.5);

void main()
{
    // brighten the base color
    gl_FragColor = vec4(baseColor,1);
}
// @@Snippet:end
