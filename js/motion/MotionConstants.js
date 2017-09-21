// Copyright 2013-2017, University of Colorado Boulder

/**
 * Constants just used for the motion screens
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var forcesAndMotionBasics = require( 'FORCES_AND_MOTION_BASICS/forcesAndMotionBasics' );

  var MotionConstants = {

    // The scale mapping between model units (meters) and stage coordinates, How much to translate model
    // coordinates into view pixels for translating the background ground
    POSITION_SCALE: 10,

    //Coefficient of friction (Friction is unitless and not bounded between 0 and 1)
    MAX_FRICTION: 0.5,

    //Maximum speed in meters/second before the pusher falls down
    MAX_SPEED: 40
  };

  forcesAndMotionBasics.register( 'MotionConstants', MotionConstants );

  return MotionConstants;
} );
