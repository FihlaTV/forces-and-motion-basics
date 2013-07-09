// Copyright 2002-2013, University of Colorado Boulder

define( function( require ) {
  'use strict';

  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Strings = require( 'Strings' );

  function FlagNode( model, centerX, top ) {
    var flagNode = this;
    this.model = model;
    Node.call( this );

    var text = new Text( model.cart.x < 0 ? 'Blue Wins!' : 'Red Wins!', {fontSize: '32px', fill: 'white'} );
    this.path = new Path( {fill: model.cart.x < 0 ? 'blue' : 'red', stroke: 'black', lineWidth: 2, centerX: 0, centerY: 0} );
    this.addChild( this.path );
    this.addChild( text );

    //Do it once, to remove as a listener since flag node gets recreated when another game won
    model.once( 'reset-all', function() {flagNode.detach();} );
    model.once( 'cart-returned', function() {flagNode.detach();} );

    model.timeProperty.link( this.updateFlagShape.bind( this ) );
    text.centerX = this.path.centerX;
    text.centerY = this.path.centerY;
    this.centerX = centerX;
    this.top = top;
  }

  return inherit( Node, FlagNode, {
    updateFlagShape: function() {
      var shape = new Shape();
      var maxX = 220;
      var maxY = 75;
      var dy = ( 7 * Math.sin( this.model.time * 6 ) );
      var dx = ( 2 * Math.sin( this.model.time * 5 ) ) + 10;
      shape.moveTo( 0, 0 );
      shape.cubicCurveTo( maxX / 3 + dx, 25 + dy, 2 * maxX / 3 + dx, -25 - dy, maxX + dx, dy / 2 );
      shape.lineTo( maxX + dx, maxY + dy / 2 );
      shape.cubicCurveTo( 2 * maxX / 3 + dx, -25 + maxY - dy, maxX / 3 + dx, 25 + maxY + dy, 0, maxY );
      shape.lineTo( 0, 0 );
      shape.close();
      this.path.shape = shape;
    }} );
} );