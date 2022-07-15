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
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";

export class Sun extends GrObject {
  /**
   *
   * @param {GrWorld} world
   */
  constructor(world, radius=2) {
    let group = new T.Group();
    super("Sun", group);

    this.shaderMat = shaderMaterial("./10-04.vs", "./10-04-01.fs", {
      
    });

    this.world = world;
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128 );
    this.cubecam = new T.CubeCamera(radius*1.05, 1000, cubeRenderTarget);
    this.sculptureGeom = new T.SphereBufferGeometry(radius, 20, 10);
    this.sculpture = new T.Mesh(this.sculptureGeom, this.shaderMat);
    group.add(new T.PointLight("white", 1.0, 40, 0.7));
    group.add(this.cubecam);
    group.add(this.sculpture);
  }

  getPosition() {
    return this.sculpture.position;
  }

  stepWorld(delta, timeOfDay) {
    this.cubecam.update(this.world.renderer, this.world.scene);
  }
}
