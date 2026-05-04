import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs"

// initialize kaboom context

export const k = kaboom({
    width: 1300,
    height: 650,
    font: "monospace",
    canvas: document.querySelector("#mycanvas"),
    background: [ 0, 0 , 50, ],
    //background:[sprite("bakery"),],
    global: true
}); 
