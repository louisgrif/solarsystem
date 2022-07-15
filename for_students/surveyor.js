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
import { MeshToonMaterial } from "../libs/CS559-Three/build/three.module.js";

export class Surveyor extends GrObject {
  /**
   *
   * @param {GrWorld} world
   */
  constructor(world, targets=null) {
    let group = new T.Group();
    super("Surveyor", group);

    this.world = world;
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128 );
    this.cubecam = new T.CubeCamera(1.05, 1000, cubeRenderTarget);

    let bodyBackTop = new T.Mesh(
      new T.CylinderBufferGeometry(0.3,0.3,1.2,8,1,false,0,Math.PI),
      new T.MeshStandardMaterial({roughness: 0.9, metalness: 0.7, color: "white"})
    )
    let bodyBackBottom = new T.Mesh(
      new T.CylinderBufferGeometry(0.3,0.3,1.2,8,1,false,Math.PI,Math.PI),
      new T.MeshStandardMaterial({roughness: 0.9, metalness: 0.7, color: "orange"})
    )
    let bodyFrontTop = new T.Mesh(
      new T.CylinderBufferGeometry(0.1,0.3,0.6,8,1,false,0,Math.PI),
      new T.MeshStandardMaterial({roughness: 0.9, metalness: 0.7, color: "black"})
    )
    let bodyFrontBottom = new T.Mesh(
      new T.CylinderBufferGeometry(0.1,0.3,0.6,8,1,false,Math.PI,Math.PI),
      new T.MeshStandardMaterial({roughness: 0.9, metalness: 0.7, color: "white"})
    )
    bodyFrontTop.translateY(0.9);bodyFrontBottom.translateY(0.9);

    let tail1 = new T.Mesh(
      new T.BoxBufferGeometry(0.3,1.2, 0.1),
      new T.MeshStandardMaterial({roughness: 0.9, metalness: 0.7, color: "white"})
    )
    let tail2 = tail1.clone(); let tail3 = tail1.clone();
    tail2.rotateY(Math.PI * 2/3);tail3.rotateY(Math.PI * 4/3);
    tail1.translateX(0.445);tail2.translateX(0.445);tail3.translateX(0.445);
    this.sculptureGeom = new T.SphereBufferGeometry(3, 20, 10);
    this.sculptureMaterial = new T.MeshStandardMaterial({
      roughness: 0.9,
      metalness: .2,
      envMap: this.cubecam.renderTarget.texture,
    });
    this.sculpture = new T.Group();
    this.sculpture.add(bodyBackTop,bodyBackBottom,bodyFrontTop,bodyFrontBottom, tail1, tail2, tail3);
    this.sculpture.rotateZ(Math.PI / 2);
    group.add(this.cubecam);
    group.add(this.sculpture);
    
    this.sculpture.position.set(18, 0, 0);
    this.sState = 0; this.targets = targets; this.curTar = null; this.curTimer = 0;

    this.ridePoint = new T.Object3D();
    this.ridePoint.translateY(0.5);
    this.objects[0].add(this.ridePoint);
    this.rideable = this.ridePoint;
  }

  stepWorld(delta, timeOfDay) {
    this.cubecam.update(this.world.renderer, this.world.scene);
    //rising
    if(this.sState === 0) {
      this.sculpture.position.y += (delta / 1000);
      if(this.sculpture.position.y > 3) {this.sState = 1;this.sculpture.position.y = 3;}
    }
    //aquire target
    else if(this.sState === 1) {
      this.curTar = this.targets[Math.floor(Math.random() * this.targets.length)];
      this.sState = 2;
    }
    //move to intercept
    else if(this.sState === 2) {
      this.sculpture.lookAt(new T.Vector3(this.curTar.sculpture.position.x, 3, this.curTar.sculpture.position.z));
      this.sculpture.translateZ(delta / 30);
      this.sculpture.rotateZ(Math.PI / 2);this.sculpture.rotateX(Math.PI / 2);
      if(Math.abs(this.sculpture.position.x - this.curTar.sculpture.position.x) < 0.1
      && Math.abs(this.sculpture.position.z - this.curTar.sculpture.position.z) < 0.1) this.sState = 3;
    }
    //track and descend
    else if(this.sState === 3) {
      this.sculpture.position.x = this.curTar.sculpture.position.x;
      this.sculpture.position.z = this.curTar.sculpture.position.z;
      this.sculpture.position.y -= delta / 1000;
      if(this.sculpture.position.y < this.curTar.getRadius() + 0.3) {this.sState = 4; this.sculpture.position.y = this.curTar.getRadius() + 0.3;}
    }
    //track
    else {
      this.sculpture.position.x = this.curTar.sculpture.position.x;
      this.sculpture.position.z = this.curTar.sculpture.position.z;
      this.curTimer += delta;
      if(this.curTimer > 7000) {this.curTimer = 0; this.sState=0;}
    }
  }
}
