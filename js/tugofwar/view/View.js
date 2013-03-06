define( function( require ) {
  "use strict";
  var Strings = require( "i18n!../../../nls/forces-and-motion-basics-strings" );
  var ControlPanel = require( 'tugofwar/view/ControlPanel' );
  var TugOfWarScenery = require( 'tugofwar/view/TugOfWarScenery' );

  function View( $images, model ) {
    var view = this;

    view.getImage = function( name ) {return $images.parent().find( 'img[src^="images/' + name + '"]' )[0];};

    view.model = model;
    view.controlPanel = new ControlPanel( model, view );
    view.scenery = new TugOfWarScenery( model, view );

    view.model.on( 'reset-all', function() {
      view.resetAll();
    } );
  }

  View.prototype = {
    render: function() {
      this.scenery.scene.updateScene();
    },
    updateForces: function() {
      this.scenery.updateForces();
    },
    resetAll: function() {
      this.scenery.hideKnots();
      this.scenery.updateForces();
    }
  };

  window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function( callback ) {
             window.setTimeout( callback, 1000 / 60 );
           };
  })();

  return View;
} );