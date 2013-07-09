// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RectangleButton = require( 'SUN/RectangleButton' );
  var Font = require( 'SCENERY/util/Font' );

  function ReturnButton( model, options ) {
    var returnButton = this;
    Node.call( this );

    var button = new RectangleButton( new Text( 'Return', {font: new Font( { weight: 'bold', size: 16 } )} ), model.returnCart.bind( model ), {rectangleFill: '#ffd438'} );
    this.addChild( button );
    this.mutate( options );

    //TODO: When peers automatically are added and removed on visibility changed, use model.link( 'started', this, 'visible' ); 
//    model.link( 'started', this, 'visible' );
    model.startedProperty.link( function( started ) { returnButton.children = started ? [button] : []; } );
  }

  inherit( Node, ReturnButton );

  return ReturnButton;
} );
