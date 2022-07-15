/*jshint esversion: 6 */
// @ts-check

/*
 * Graphics Town Example Objects
 *
 * Houses: Shiny Sculpture - the simplest possible dynamic environment map
 *
 * this works, but seems to generate a lot of WebGL warnings - not sure what to do
 * about that
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

export class Skybox extends GrObject {
  /**
   *
   * @param {GrWorld} world
   */
  constructor(world) {
    let group = new T.Group();
    super("Skybox", group);

    this.world = world;
    const skyLoad = new T.CubeTextureLoader();
    const skyTex = skyLoad.load([
    "./images/skyleft.png",
    "./images/skyright.png",
    "./images/skytop.png",
    "./images/skybottom.png",
    "./images/skyfront.png",
    "./images/skyback.png",
  ]);
  }

  stepWorld(delta, timeOfDay) {

  }
}
