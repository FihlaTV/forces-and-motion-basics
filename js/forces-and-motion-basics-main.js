// Copyright 2013-2020, University of Colorado Boulder

/**
 * Entry point for PhET Interactive Simulation's Forces and Motion: Basics application.
 *
 * @author Sam Reid
 */

import Screen from '../../joist/js/Screen.js';
import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Image from '../../scenery/js/nodes/Image.js';
import Tandem from '../../tandem/js/Tandem.js';
import accelerationIcon from '../images/Acceleration_Icon_png.js';
import frictionIcon from '../images/Friction_Icon_png.js';
import motionIcon from '../images/Motion_Icon_png.js';
import tugIcon from '../images/Tug_Icon_png.js';
import forcesAndMotionBasicsStrings from './forces-and-motion-basics-strings.js';
import MotionScreen from './motion/MotionScreen.js';
import NetForceModel from './netforce/model/NetForceModel.js';
import NetForceScreenView from './netforce/view/NetForceScreenView.js';

const accelerationString = forcesAndMotionBasicsStrings.acceleration;
const forcesAndMotionBasicsTitleString = forcesAndMotionBasicsStrings[ 'forces-and-motion-basics' ].title;
const frictionString = forcesAndMotionBasicsStrings.friction;
const motionString = forcesAndMotionBasicsStrings.motion;
const netForceString = forcesAndMotionBasicsStrings.netForce;

// constants
const tandem = Tandem.ROOT;

const simOptions = {
  credits: {
    leadDesign: 'Ariel Paul, Noah Podolefsky',
    graphicArts: 'Mariah Hermsmeyer, Sharon Siman-Tov',
    softwareDevelopment: 'Jesse Greenberg, Sam Reid',
    team: 'Amy Rouinfar, Trish Loeblein, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ethan Johnson, Elise Morgan, Oliver Orejola, Ben Roberts, ' +
                      'Bryan Yoelin'
  }
};

SimLauncher.launch( function() {

  const netForceScreenTandem = tandem.createTandem( 'netForceScreen' );
  const motionScreenTandem = tandem.createTandem( 'motionScreen' );
  const frictionScreenTandem = tandem.createTandem( 'frictionScreen' );
  const accelerationScreenTandem = tandem.createTandem( 'accelerationScreen' );

  //Provide the screen names as named fields so they can be easily accessed dynamically, for API features
  //And lookups will still work properly even if the screens are reduced with ?screens=...
  const netForceImageNode = new Image( tugIcon, { tandem: netForceScreenTandem.createTandem( 'icon' ) } );
  const netForceScreen = new Screen(
    function() {return new NetForceModel( netForceScreenTandem.createTandem( 'model' ) );},
    function( model ) {return new NetForceScreenView( model, netForceScreenTandem.createTandem( 'view' ) );}, {
      name: netForceString,
      tandem: netForceScreenTandem,
      homeScreenIcon: netForceImageNode
    }
  );

  const motionScreen = new MotionScreen( 'motion', motionScreenTandem, {
    name: motionString,
    homeScreenIcon: new Image( motionIcon, {
      tandem: motionScreenTandem.createTandem( 'icon' )
    } )
  } );

  const frictionScreen = new MotionScreen( 'friction', frictionScreenTandem, {
    name: frictionString,
    homeScreenIcon: new Image( frictionIcon, {
      tandem: frictionScreenTandem.createTandem( 'icon' )
    } )
  } );

  const accelerationScreen = new MotionScreen( 'acceleration', accelerationScreenTandem, {
    name: accelerationString,
    homeScreenIcon: new Image( accelerationIcon, {
      tandem: accelerationScreenTandem.createTandem( 'icon' )
    } )
  } );

  //Create and start the sim
  const sim = new Sim( forcesAndMotionBasicsTitleString, [
      netForceScreen,
      motionScreen,
      frictionScreen,
      accelerationScreen
    ],
    simOptions );
  sim.start();
} );