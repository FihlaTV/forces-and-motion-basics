// Copyright 2013-2015, University of Colorado Boulder

/**
 * 
 * 
 * @author Sam Reid
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var SliderKnob = require( 'FORCES_AND_MOTION_BASICS/common/view/SliderKnob' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var forcesAndMotionBasics = require( 'FORCES_AND_MOTION_BASICS/forcesAndMotionBasics' );

  /**
   * Constructor.
   * 
   * @param {MotionModel} model
   * @param {Property<Boolean>} disableLeftProperty
   * @param {Property<Boolean>} disableRightProperty
   * @param {Object} range - the range of values for the slider
   * @param {Object} [options]
   * @constructor
   */
  function AppliedForceSlider( model, disableLeftProperty, disableRightProperty, range, options ) {
    
    var thisSlider = this;
    this.range = range;
    HSlider.call( this, model.appliedForceProperty, range, _.extend( { 
      trackSize: new Dimension2( 300, 6 ),
      snapValue: 0,
      majorTickLength: 30,
      minorTickLength: 22,
      tickLabelSpacing: 3,
      thumbNode: new SliderKnob()
    }, options ) );

    // when the left is disabled, disable that section of the range
    disableLeftProperty.link( function( disableLeft ) {
      thisSlider.enabledRange = disableLeft ? { min: 0, max: range.max } : range;
    } );

    // when the right is disabled, disable that section of the range
    disableRightProperty.link( function( disableRight ) {
      thisSlider.enabledRange = disableRight ? { min: range.min, max: 0 } : range;
    } );

    // add normal ticks
    this.addNormalTicks();
  }

  forcesAndMotionBasics.register( 'AppliedForceSlider', AppliedForceSlider );

  return inherit( HSlider, AppliedForceSlider, {

    //Add ticks at regular intervals in 8 divisions
    addNormalTicks: function() {

      var thisSlider = this;
      var range = thisSlider.range;

      var initialTickValue = range.min;

      //Constants and functions for creating the ticks
      var numDivisions = 10; //e.g. divide the ruler into 1/8ths
      var numTicks = numDivisions + 1; //ticks on the end
      var delta = ( range.max - range.min ) / numDivisions;

      var isMajor = function( tickIndex ) { return tickIndex % 5 === 0; };

      //Generate each of the ticks and add to the parent
      _.range( numTicks ).forEach( function( i ) {

        var location = initialTickValue + i * delta;
        if( isMajor( i ) ) {
          var label = new Text( location, { font: new PhetFont( 16 ) } );
          thisSlider.addMajorTick( location, label );
        }
        else {
          thisSlider.addMinorTick( location );
        }
      } );
    }
  } );
} );
