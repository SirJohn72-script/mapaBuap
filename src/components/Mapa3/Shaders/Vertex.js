export const Vertex = `
    
    void main(){
        vec4 modelPosition = vec4(position, 1.0);
        gl_Position = modelPosition; 
    }
`
