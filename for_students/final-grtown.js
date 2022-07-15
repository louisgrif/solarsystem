/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */
 import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";

import { Sun } from "./sun.js";
import { Planet } from "./planet.js";
import { Surveyor } from "./surveyor.js";

/**m
 * The Graphics Town Main -
 * This builds up the world and makes it go...
 */

// make the world
let world = new GrWorld({
    width: 800,
    height: 600,
    groundplane: false, // make the ground plane big enough for a world of stuff
    lights: [new T.AmbientLight( 0x404040 )]
});

// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment
const skyLoad = new T.CubeTextureLoader();
    const skyTex = skyLoad.load([
    "./images/skyright.png",
    "./images/skyleft.png",
    "./images/skytop.png",
    "./images/skybottom.png",
    "./images/skyfront.png",
    "./images/skyback.png",
  ]);
world.scene.background = skyTex;

let sun = new Sun(world);
let mercury = new Planet(world, "Mercury", 0.3, 5, "./images/mercury.jpg", sun, 1408,0,false);
let venus = new Planet(world, "Venus", 0.4, 10, "./images/venus.jpg", sun, 5832,0.05,false);
let earth = new Planet(world, "Earth", 0.4, 15, "./images/earth.jpg", sun, 24,-0.41,false);
let moon = new Planet(world, "Moon", 0.2, 1.3, "./images/moon.jpg", earth, 708,-0.03,false);
let mars = new Planet(world, "Mars", 0.3, 20, "./images/mars.jpg", sun, 25,-0.44,false);
let jupiter = new Planet(world, "Jupiter", 1.0, 27, "./images/jupiter.jpg", sun, 10,-0.05,false);
let saturn = new Planet(world, "Saturn", 0.8, 34, "./images/saturn.jpg", sun, 11,-0.47,true);
let uranus = new Planet(world, "Uranus", 0.5, 40, "./images/uranus.jpg", sun, 17,1.43,false);
let neptune = new Planet(world, "Neptune", 0.6, 47, "./images/neptune.jpg", sun, 16,-0.49,false);
let pluto = new Planet(world, "Pluto", 0.2, 53, "./images/pluto.jpg", sun, 154,0.2,false);

world.add(sun);world.add(mercury);world.add(venus);world.add(earth);world.add(moon);world.add(mars);
world.add(jupiter);world.add(saturn);world.add(uranus);world.add(neptune);world.add(pluto);

let surveyor = new Surveyor(world, [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto]);
world.add(surveyor);

// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
//highlight("SimpleHouse-5");
//highlight("Helicopter-0");
//highlight("Track Car");
//highlight("MorphTest");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
