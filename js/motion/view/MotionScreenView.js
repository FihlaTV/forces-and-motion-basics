// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main scenery view for the Motion, Friction and Acceleration screens.
 */
define( function( require ) {
  'use strict';

  // modules
  var AccelerometerNode = require( 'FORCES_AND_MOTION_BASICS/motion/view/AccelerometerNode' );
  var AppliedForceSlider = require( 'FORCES_AND_MOTION_BASICS/motion/view/AppliedForceSlider' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var FineCoarseSpinner = require( 'SCENERY_PHET/FineCoarseSpinner' );
  var forcesAndMotionBasics = require( 'FORCES_AND_MOTION_BASICS/forcesAndMotionBasics' );
  var ForcesAndMotionBasicsLayoutBounds = require( 'FORCES_AND_MOTION_BASICS/common/view/ForcesAndMotionBasicsLayoutBounds' );
  var ForcesAndMotionBasicsQueryParameters = require( 'FORCES_AND_MOTION_BASICS/common/ForcesAndMotionBasicsQueryParameters' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemNode = require( 'FORCES_AND_MOTION_BASICS/motion/view/ItemNode' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var MotionControlPanel = require( 'FORCES_AND_MOTION_BASICS/motion/view/MotionControlPanel' );
  var MovingBackgroundNode = require( 'FORCES_AND_MOTION_BASICS/motion/view/MovingBackgroundNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var Property = require( 'AXON/Property' );
  var PusherNode = require( 'FORCES_AND_MOTION_BASICS/motion/view/PusherNode' );
  var Range = require( 'DOT/Range' );
  var ReadoutArrow = require( 'FORCES_AND_MOTION_BASICS/common/view/ReadoutArrow' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SpeedometerNode = require( 'FORCES_AND_MOTION_BASICS/motion/view/SpeedometerNode' );
  var StepForwardButton = require( 'SCENERY_PHET/buttons/StepForwardButton' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var sumOfForcesString = require( 'string!FORCES_AND_MOTION_BASICS/sumOfForces' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var WaterBucketNode = require( 'FORCES_AND_MOTION_BASICS/motion/view/WaterBucketNode' );

  // constants
  var PLAY_PAUSE_BUFFER = 10; // separation between step and reset all button, usedful for i18n

  // images
  var skateboardImage = require( 'image!FORCES_AND_MOTION_BASICS/skateboard.png' );

  // strings
  var accelerationString = require( 'string!FORCES_AND_MOTION_BASICS/acceleration' );
  var appliedForceString = require( 'string!FORCES_AND_MOTION_BASICS/appliedForce' );
  var frictionForceString = require( 'string!FORCES_AND_MOTION_BASICS/frictionForce' );
  var pattern0Name1ValueUnitsAccelerationString = require( 'string!FORCES_AND_MOTION_BASICS/pattern.0name.1valueUnitsAcceleration' );
  var pattern0ValueUnitsNewtonsString = require( 'string!FORCES_AND_MOTION_BASICS/pattern.0valueUnitsNewtons' );
  var sumOfForcesEqualsZeroString = require( 'string!FORCES_AND_MOTION_BASICS/sumOfForcesEqualsZero' );

  /**
   * Constructor for the MotionScreenView
   *
   * @param {MotionModel} model model for the entire screen
   * @param {Tandem} tandem
   * @constructor
   */
  function MotionScreenView( model, tandem ) {

    //Constants and fields
    this.model = model;

    //Call super constructor
    ScreenView.call( this, {
      layoutBounds: ForcesAndMotionBasicsLayoutBounds,
      tandem: tandem
    } );

    //Variables for this constructor, for convenience
    var self = this;
    var width = this.layoutBounds.width;
    var height = this.layoutBounds.height;

    //Constants
    var skyHeight = 362;
    var groundHeight = height - skyHeight;

    //Create the static background
    var skyGradient = new LinearGradient( 0, 0, 0, skyHeight ).addColorStop( 0, '#02ace4' ).addColorStop( 1, '#cfecfc' );
    this.sky = new Rectangle( -width, -skyHeight, width * 3, skyHeight * 2, { fill: skyGradient, pickable: false } );

    this.groundNode = new Rectangle( -width, skyHeight, width * 3, groundHeight * 3, {
      fill: '#c59a5b',
      pickable: false
    } );
    this.addChild( this.sky );
    this.addChild( this.groundNode );

    //Create the dynamic (moving) background
    this.addChild( new MovingBackgroundNode( model, this.layoutBounds.width / 2, tandem.createTandem( 'movingBackgroundNode' ) ).mutate( { layerSplit: true } ) );

    // The pusher should be behind the skateboard
    this.addChild( new PusherNode( model, this.layoutBounds.width, tandem.createTandem( 'pusherNode' ) ) );

    // Add the skateboard if on the 'motion' screen
    if ( model.skateboard ) {
      this.addChild( new Image( skateboardImage, {
        centerX: width / 2, y: 315 + 12,
        pickable: false,
        tandem: tandem.createTandem( 'skateboardImageNode' )
      } ) );
    }

    //Add toolbox backgrounds for the objects
    var boxHeight = 180;
    var showItemToolboxes = ForcesAndMotionBasicsQueryParameters.showItemToolboxes;
    var fill = showItemToolboxes ? '#e7e8e9' : null;
    var stroke = showItemToolboxes ? '#000000' : null;
    var leftItemToolboxNode = new Rectangle( 10, height - boxHeight - 10, 300, boxHeight, 10, 10, {
      fill: fill,
      stroke: stroke,
      lineWidth: 1,
      tandem: tandem.createTandem( 'leftItemToolboxNode' )
    } );
    var rightItemToolboxNode = new Rectangle( width - 10 - 300, height - boxHeight - 10, 300, boxHeight, 10, 10, {
      fill: fill,
      stroke: stroke,
      lineWidth: 1,
      tandem: tandem.createTandem( 'rightItemToolboxNode' )
    } );

    //Create the slider
    var disableText = function( node ) { return function( length ) {node.fill = length === 0 ? 'gray' : 'black';}; };

    var maxTextWidth = ( rightItemToolboxNode.left - leftItemToolboxNode.right ) - 10;
    var appliedForceSliderTextNode = new Text( appliedForceString, {
      font: new PhetFont( 22 ),
      centerX: width / 2,
      y: 430,
      maxWidth: maxTextWidth,
      tandem: tandem.createTandem( 'appliedForceSliderTextNode' )
    } );
    var appliedForceSlider = new AppliedForceSlider( model, new Range( -500, 500 ),
      tandem.createTandem( 'appliedForceSlider' ), {
        centerX: width / 2 + 1,
        y: 555
      } );

    this.addChild( appliedForceSliderTextNode );
    this.addChild( appliedForceSlider );

    // The range for the spinner will change depending on whether the stack has exceeded maximum speed. This will
    // most often be in cases where there is no friction, because the speed will remain at maximum values and we
    // do not want to allow additional applied force at that time
    var spinnerRange = new Range( -500, 500 );

    // Do not allow the user to apply a force that would take the object beyond its maximum velocity
    Property.lazyMultilink( [ model.appliedForceProperty, model.speedClassificationProperty, model.stackSizeProperty ], function( appliedForce, speedClassification, stackSize ) {

      var enableRightButtons = ( stackSize > 0 && ( speedClassification !== 'RIGHT_SPEED_EXCEEDED' ) );
      spinnerRange.max = enableRightButtons ? 500 : 0;

      var enableLeftButtons = ( stackSize > 0 && ( speedClassification !== 'LEFT_SPEED_EXCEEDED' ) );
      spinnerRange.min = enableLeftButtons ? -500 : 0;
    } );

    var appliedForceSpinner = new FineCoarseSpinner( model.appliedForceProperty, {
      numberDisplayOptions: {
        font: new PhetFont( 22 ),
        valuePattern: pattern0ValueUnitsNewtonsString,

        align: 'center',
        xMargin: 20,
        yMargin: 4,
        numberMaxWidth: maxTextWidth / 3
      },

      range: spinnerRange,

      deltaFine: 1,
      deltaCoarse: 50,

      spacing: 6,
      centerBottom: new Vector2( width / 2, appliedForceSlider.top - 12 ),

      tandem: tandem.createTandem( 'appliedForceSpinner' )
    } );

    this.addChild( appliedForceSpinner );

    // force cannot be applied when there is nothing on the stack
    model.stackSizeProperty.link( function( size ) {
      appliedForceSpinner.enabled = size > 0;
    } );

    model.stack.lengthProperty.link( disableText( appliedForceSliderTextNode ) );
    model.stack.lengthProperty.link( function( length ) { appliedForceSlider.enabled = length > 0; } );

    //Create the speedometer.  Specify the location after construction so we can set the 'top'
    var speedometerNode = new SpeedometerNode( model.speedProperty, model.showSpeedProperty, model.showValuesProperty,
      tandem.createTandem( 'speedometerNode' ), {
        x: 300,
        top: 8
      } );

    this.addChild( speedometerNode );

    //Create and add the control panel
    var controlPanel = new MotionControlPanel( model, tandem.createTandem( 'controlPanel' ) );
    this.addChild( controlPanel );

    // create the play, pause, and step buttons
    var playPauseButton = new PlayPauseButton( model.playProperty, {
      radius: 18,
      tandem: tandem.createTandem( 'playPauseButton' )
    } );
    var stepForwardButton = new StepForwardButton( {
      isPlayingProperty: model.playProperty,
      listener: function() { model.manualStep(); },
      radius: 18,
      tandem: tandem.createTandem( 'stepForwardButton' )
    } );

    // Make the Play/Pause button bigger when it is showing the pause button, see #298
    var pauseSizeIncreaseFactor = 1.28;
    model.playProperty.lazyLink( function( isPlaying ) {
      playPauseButton.scale( isPlaying ? ( 1 / pauseSizeIncreaseFactor ) : pauseSizeIncreaseFactor );
    } );

    // play, step, and reset buttons in an HBox aligned left bottom under the control panel
    var playPauseVerticalOffset = 35;
    var playPauseStepHBox = new HBox( {
      children: [ playPauseButton, stepForwardButton ],
      spacing: PLAY_PAUSE_BUFFER,
      resize: false,
      leftCenter: controlPanel.leftBottom.plusXY( 0, playPauseVerticalOffset )
    } );
    this.addChild( playPauseStepHBox );

    //Reset all button goes beneath the control panel.  Not a closure variable since API access is required.
    //TODO: Is that OK? or should we invest dynamic search/lookups to keep as closure var?
    this.resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      radius: 23,
      rightCenter: controlPanel.rightBottom.plusXY( 0, playPauseVerticalOffset ),
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    this.addChild( this.resetAllButton );

    // i18n - if the play control buttons are too close to reset all, they should be separated
    if ( playPauseStepHBox.right > this.resetAllButton.left - PLAY_PAUSE_BUFFER ) {
      playPauseStepHBox.leftCenter = controlPanel.leftBottom.plusXY( -2 * PLAY_PAUSE_BUFFER, playPauseVerticalOffset );
    }

    //Add the accelerometer, if on the final screen
    if ( model.accelerometer ) {

      var accelerometerNode = new AccelerometerNode( model.accelerationProperty, tandem.createTandem( 'accelerometerNode' ) );

      // build up the string label for the acceleration
      var labelString = StringUtils.format( pattern0Name1ValueUnitsAccelerationString, accelerationString, model.accelerationProperty.value );
      var labelText = new RichText( labelString, {
        font: new PhetFont( 18 ),
        supScale: 0.60,
        supYOffset: 2,
        maxWidth: accelerometerNode.width * 3 / 2
      } );

      // create the tick labels
      var tickLabel = function( label, tick, tandemID ) {
        return new Text( label, {
          pickable: false,
          font: new PhetFont( 16 ),
          centerX: tick.centerX,
          top: tick.bottom + 27,
          tandem: tandem.createTandem( 'tickLabelTextNode' + tandemID )
        } );
      };
      var tickLabels = new Node( {
        tandem: tandem.createTandem( 'tickLabels' ),
        children: [
          tickLabel( '-20', accelerometerNode.ticks[ 0 ], 'Negative20' ),
          tickLabel( '0', accelerometerNode.ticks[ 2 ], 'Zero' ),
          tickLabel( '20', accelerometerNode.ticks[ 4 ], 'Positive20' )
        ]
      } );

      // put it all together in a VBox
      var accelerometerWithTickLabels = new Node( {
        tandem: tandem.createTandem( 'accelerometerWithTickLabels' ),
        children: [ labelText, accelerometerNode, tickLabels ],
        pickable: false,
        centerX: 300,
        y: 170
      } );
      labelText.bottom = accelerometerNode.top;
      tickLabels.top = accelerometerNode.bottom;
      model.showAccelerationProperty.linkAttribute( accelerometerWithTickLabels, 'visible' );

      this.addChild( accelerometerWithTickLabels );

      // whenever showValues and accleration changes, update the label text
      var initialLabelWidth = labelText.width;
      Property.multilink( [ model.showValuesProperty, model.accelerationProperty ], function( showValues, acceleration ) {
        if ( showValues ) {
          var accelerationValue = Util.toFixed( acceleration, 2 );
          labelText.setText( StringUtils.format( pattern0Name1ValueUnitsAccelerationString, accelerationString, accelerationValue ) );

          // Make sure that the acceleration readout does not shift as the value changes by compensating for the change
          // in width.
          labelText.centerX = accelerometerNode.centerX + ( labelText.width - initialLabelWidth ) / 2 - 10;
        }
        else {
          labelText.setText( accelerationString );
          labelText.centerX = accelerometerNode.centerX;
        }
      } );
    }

    // Map the items to their correct toolbox, one of left or right, corresponding to the side of the screen that
    // toolbox is sitting on.
    var getItemSide = function( item ) {
      // the fridge and the crates both go in hte left toolbox
      if ( item.name === 'fridge' || item.name === 'crate1' || item.name === 'crate2' ) {
        return 'left';
      }
      else {
        return 'right';
      }
    };

    //Iterate over the items in the model and create and add nodes for each one
    var leftItemLayer = new Node( { tandem: tandem.createTandem( 'leftItemLayer' ) } );
    var rightItemLayer = new Node( { tandem: tandem.createTandem( 'rightItemLayer' ) } );
    this.itemNodes = [];
    for ( var i = 0; i < model.items.length; i++ ) {
      var item = model.items[ i ];
      var itemSide = getItemSide( item );
      var toolboxNode = itemSide === 'left' ? leftItemToolboxNode : rightItemToolboxNode;
      var itemLayer = itemSide === 'left' ? leftItemLayer : rightItemLayer;
      var Constructor = item.bucket ? WaterBucketNode : ItemNode;
      var itemNode = new Constructor( model, self, item,
        item.image,
        item.sittingImage || item.image,
        item.holdingImage || item.image,
        model.showMassesProperty,
        toolboxNode,
        tandem.createTandem( item.name ) );
      this.itemNodes.push( itemNode );

      //Provide a reference from the item model to its view so that view dimensions can be looked up easily
      item.view = itemNode;
      itemLayer.addChild( itemNode );
    }

    leftItemToolboxNode.addChild( leftItemLayer );
    rightItemToolboxNode.addChild( rightItemLayer );

    //Add the force arrows & associated readouts in front of the items
    var arrowScale = 0.3;

    //Round the forces so that the sum is correct in the display, see https://github.com/phetsims/forces-and-motion-basics/issues/72 and  https://github.com/phetsims/forces-and-motion-basics/issues/74
    var roundedAppliedForceProperty = new DerivedProperty(
      [ model.appliedForceProperty ],
      function( appliedForce ) {
        return Util.roundSymmetric( appliedForce );
      } );
    var roundedFrictionForceProperty = new DerivedProperty(
      [ model.frictionForceProperty ],
      function( frictionForce ) {
        return Util.roundSymmetric( frictionForce );
      } );

    //Only update the sum force arrow after both friction and applied force changed, so we don't get partial updates, see https://github.com/phetsims/forces-and-motion-basics/issues/83
    var roundedSumProperty = new NumberProperty( roundedAppliedForceProperty.get() + roundedFrictionForceProperty.get(), {
      tandem: tandem.createTandem( 'roundedSumProperty' ),
      units: 'newtons'
    } );

    model.stepEmitter.addListener( function() {
      roundedSumProperty.set( roundedAppliedForceProperty.get() + roundedFrictionForceProperty.get() );
    } );

    this.sumArrow = new ReadoutArrow( sumOfForcesString, '#96c83c', this.layoutBounds.width / 2, 225, roundedSumProperty, model.showValuesProperty,
      tandem.createTandem( 'sumArrow' ), {
        labelPosition: 'top',
        arrowScale: arrowScale
      } );
    this.sumOfForcesText = new Text( sumOfForcesEqualsZeroString, {
      pickable: false,
      font: new PhetFont( { size: 16, weight: 'bold' } ),
      centerX: width / 2,
      y: 195,
      maxWidth: 125,
      tandem: tandem.createTandem( 'sumOfForcesTextNode' )
    } );

    //If the (rounded) sum of forces arrow is zero, then show the text "Sum of Forces = 0", see #76
    new DerivedProperty( [ model.showSumOfForcesProperty, roundedSumProperty ],
      function( showSumOfForces, sumOfForces ) {
        return showSumOfForces && sumOfForces === 0;
      } ).linkAttribute( self.sumOfForcesText, 'visible' );
    this.appliedForceArrow = new ReadoutArrow( appliedForceString, '#e66e23', this.layoutBounds.width / 2, 280, roundedAppliedForceProperty, model.showValuesProperty,
      tandem.createTandem( 'appliedForceArrow' ), {
        labelPosition: 'side',
        arrowScale: arrowScale
      } );
    this.frictionArrow = new ReadoutArrow( frictionForceString, 'red', this.layoutBounds.width / 2, 280, roundedFrictionForceProperty, model.showValuesProperty,
      tandem.createTandem( 'frictionArrow' ), {
        labelPosition: 'side',
        arrowScale: arrowScale
      } );

    // toolboxes and their children should be in front of all above items
    // contain the toolboxes in a parent node so that we can easily change the z-order of each toolbox.  This way
    // items of the right toolbox will not be layered in front of items of left toolbox items
    var toolboxContainer = new Node( { tandem: tandem.createTandem( 'toolboxContainer' ) } );
    toolboxContainer.addChild( leftItemToolboxNode );
    toolboxContainer.addChild( rightItemToolboxNode );
    this.addChild( toolboxContainer );

    // add the force arrows, which should be in front of all items and pusher
    this.addChild( this.sumArrow );
    this.addChild( this.appliedForceArrow );
    this.addChild( this.frictionArrow );
    this.addChild( this.sumOfForcesText );

    //Whichever arrow is smaller should be in front (in z-ordering)
    var frictionLargerProperty = new DerivedProperty( [ roundedAppliedForceProperty, roundedFrictionForceProperty ],
      function( roundedAppliedForce, roundedFrictionForce ) {
        return Math.abs( roundedFrictionForce ) > Math.abs( roundedAppliedForce );
      } );
    frictionLargerProperty.link( function( frictionLarger ) {
      var node = frictionLarger ? self.appliedForceArrow : self.frictionArrow;
      node.moveToFront();
    } );

    //On the motion screens, when the 'Friction' label overlaps the force vector it should be displaced vertically
    Property.multilink( [ model.appliedForceProperty, model.frictionForceProperty ], function( appliedForce, frictionForce ) {
      var sameDirection = ( appliedForce < 0 && frictionForce < 0 ) || ( appliedForce > 0 && frictionForce > 0 );
      self.frictionArrow.overlapsOther = sameDirection;
      self.frictionArrow.labelPosition = sameDirection ? 'bottom' : 'side';

      // the applied force arrow must be updated directly since its label position doesn't change
      self.appliedForceArrow.overlapsOther = sameDirection;
      self.appliedForceArrow.update();
    } );

    model.showForceProperty.linkAttribute( this.appliedForceArrow, 'visible' );
    model.showForceProperty.linkAttribute( this.frictionArrow, 'visible' );
    model.showSumOfForcesProperty.linkAttribute( this.sumArrow, 'visible' );

    //After the view is constructed, move one of the blocks to the top of the stack.
    model.viewInitialized( this );
  }

  forcesAndMotionBasics.register( 'MotionScreenView', MotionScreenView );

  return inherit( ScreenView, MotionScreenView, {

    //Get the height of the objects in the stack (doesn't include skateboard)
    get stackHeight() {
      var sum = 0;
      for ( var i = 0; i < this.model.stack.length; i++ ) {
        sum = sum + this.model.stack.get( i ).view.height;
      }
      return sum;
    },

    //Find the top of the stack, so that a new object can be placed on top
    get topOfStack() {
      var n = this.model.skateboard ? 334 : 360;
      return n - this.stackHeight;
    },

    //Get the size of an item's image.  Dependent on the current scale of the image.
    getSize: function( item ) {
      // get the current scale for the element and apply it to the image
      var scaledWidth = item.view.sittingImage.width * item.getCurrentScale();
      return { width: scaledWidth, height: item.view.height };
    }
  } );
} );
