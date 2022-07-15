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
import { Vector3 } from "../libs/CS559-Three/build/three.module.js";

export class Planet extends GrObject {
  /**
   *
   * @param {GrWorld} world
   */
  constructor(world, name, radius=2, xOffset=5, tPath="../examples/mercury.jpg", orbiting=null, day=1, axis=0, rings=false) {
    let group = new T.Group();
    super(name, group);

    this.world = world;
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128 );
    this.cubecam = new T.CubeCamera(radius*1.05, 1000, cubeRenderTarget);
    this.sculptureGeom = new T.SphereBufferGeometry(radius, 20, 10);
    let mTexture = new T.TextureLoader().load(tPath);
    this.sculptureMaterial = new T.MeshStandardMaterial({
      map: mTexture,
      roughness: 0.9,
      metalness: .2,
      // @ts-ignore   // envMap has the wrong type
      envMap: this.cubecam.renderTarget.texture,
    });
    this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
    this.sculpture.rotateX(axis);
    group.add(this.cubecam);
    group.add(this.sculpture);
    if(rings) {
      let ringMaterial= new T.MeshStandardMaterial({
        map: new T.TextureLoader().load("./images/rings.png"),
        roughness: 0.9,
        metalness: .2,
      });
      ringMaterial.side=T.DoubleSide;
      this.ringSc = new T.Mesh(new T.RingBufferGeometry(radius+0.3, radius+1.3,15,1), ringMaterial);
      this.ringSc.rotateX(-Math.PI/2);
      this.ringSc.rotateX(axis);
      group.add(this.ringSc);}
    this.rings = rings;this.orbiting = orbiting; this.xOffset = xOffset; this.axis = axis;
    this.newDelta = Math.random() * 10000; this.radius = radius; this.day = day;
  }

  getPosition() {
    return this.sculpture.position;
  }

  getRadius() {
    return this.radius;
  }

  stepWorld(delta, timeOfDay) {
    let orbPos = this.orbiting.getPosition();
    this.newDelta += delta / 100 / this.xOffset;
    this.cubecam.update(this.world.renderer, this.world.scene);
    if(this.orbiting !== null && this.xOffset !== 0) {
      this.sculpture.position.x = orbPos.x + this.xOffset * Math.cos(this.newDelta * -1);
      this.sculpture.position.z = orbPos.z + this.xOffset * Math.sin(this.newDelta * -1);
      if(this.rings) {this.ringSc.position.x=this.sculpture.position.x;this.ringSc.position.z=this.sculpture.position.z;}
    }
    this.sculpture.rotateOnAxis(new T.Vector3(0, 1, 0), 2 / this.day);
  }
}
