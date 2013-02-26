define( function ( require ) {
  "use strict";
  var Strings = require( "i18n!../../nls/forces-and-motion-basics-strings" );
  var Shape = require( 'SCENERY/Shape' );
  var LayerType = require( 'SCENERY/layers/LayerType' );
  var Scene = require( 'SCENERY/Scene' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var red = "red";
  var blue = "blue";

  function View( $images ) {

    function getImage( name ) {
      var selector = 'img[src^="images/' + name + '"]';
      return $images.parent().find( selector )[0];
    }

    this.scene = new Scene( $( "#scene" ), {width: 200, height: 200} );

    this.scene.addChild( new Image( getImage( 'grass' ), {x: 13, y: 368} ) );

    function arrowFunction( tailX, tailY, tipX, tipY, tailWidth, headWidth, headHeight ) {
      var arrowShape = new Shape();
      if ( tipX == tailX && tipY == tailY ) {
        return arrowShape;
      }
      var vector = new Vector2( tipX - tailX, tipY - tailY );
      var xHatUnit = vector.normalized();
      var yHatUnit = xHatUnit.rotated( Math.PI / 2 );
      var length = vector.magnitude();

      //Set up a coordinate frame that goes from the tail of the arrow to the tip.
      function getPoint( xHat, yHat ) {
        var x = xHatUnit.x * xHat + yHatUnit.x * yHat + tailX;
        var y = xHatUnit.y * xHat + yHatUnit.y * yHat + tailY;
        return new Vector2( x, y );
      }

      if ( headHeight > length / 2 ) {
        headHeight = length / 2;
      }

      var tailLength = length - headHeight;
      var points = [
        getPoint( 0, tailWidth / 2 ),
        getPoint( tailLength, tailWidth / 2 ),
        getPoint( tailLength, headWidth / 2 ),
        getPoint( length, 0 ),
        getPoint( tailLength, -headWidth / 2 ),
        getPoint( tailLength, -tailWidth / 2 ),
        getPoint( 0, -tailWidth / 2 )
      ];

      arrowShape.moveTo( points[0].x, points[0].y );
      var tail = _.tail( points );
      _.each( tail, function ( element ) { arrowShape.lineTo( element.x, element.y ) } );
      arrowShape.close();

      return arrowShape;
    }

    this.leftArrow = new Path( {shape: new Shape(), fill: '#ff0000', stroke: '#000000', lineWidth: 1} );
    this.rightArrow = new Path( {shape: new Shape(), fill: '#ff0000', stroke: '#000000', lineWidth: 1} );
    this.scene.addChild( this.leftArrow );
    this.scene.addChild( this.rightArrow );

    var ropeNode = new Image( getImage( 'rope' ), {x: 51, y: 263 } );

    var blueKnots = [10.0, 90.0, 170.0, 250.0];
    var ropeImageWidth = 880;//TODO: How to dynamically get width of rope image?  When I do ropeImage.width, I get different values based on browser/scale.
    var redKnots = _.map( blueKnots, function ( v ) {return ropeImageWidth - v;} );
    var knots = [];
    var knotWidth = 30;
    for ( var i = 0; i < blueKnots.length; i++ ) {
      var knot = new Path( {shape: Shape.rect( blueKnots[i] + ropeNode.x - knotWidth / 2 + 1, ropeNode.y - 4, knotWidth, knotWidth ), stroke: '#FFFF00', lineWidth: 4, visible: false} );
      this.scene.addChild( knot );
      knot.type = blue;
      knots.push( knot );
    }
    for ( var i = 0; i < redKnots.length; i++ ) {
      var knot = new Path( {shape: Shape.rect( redKnots[i] + ropeNode.x - knotWidth / 2 + 1, ropeNode.y - 4, knotWidth, knotWidth ), stroke: '#FFFF00', lineWidth: 4, visible: false} );
      this.scene.addChild( knot );
      knot.type = red;
      knots.push( knot );
    }

    this.scene.addChild( ropeNode );
    this.cartNode = new Image( getImage( 'cart' ), {x: 399, y: 221} );
    this.scene.addChild( this.cartNode );

    var goButtonImage = new Image( getImage( 'go_up' ), {x: 420, y: 386, cursor: 'pointer'} );
    goButtonImage.addInputListener(
        {
          over: function ( event ) {
            goButtonImage.image = getImage( 'go_hover' );
            goButtonImage.invalidateSelf( new Bounds2( 0, 0, goButtonImage.image.width, goButtonImage.image.height ) );
          },
          out: function ( event ) {
            goButtonImage.image = getImage( 'go_up' );
            goButtonImage.invalidateSelf( new Bounds2( 0, 0, goButtonImage.image.width, goButtonImage.image.height ) );
          },
          down: function ( event ) {
            goButtonImage.image = getImage( 'go_pressed' );
            goButtonImage.invalidateSelf( new Bounds2( 0, 0, goButtonImage.image.width, goButtonImage.image.height ) );
          },
          up: function ( event ) {
            goButtonImage.image = getImage( 'go_hover' );
            goButtonImage.invalidateSelf( new Bounds2( 0, 0, goButtonImage.image.width, goButtonImage.image.height ) );
          }
        } );
    var goButtonText = new Text( Strings.go, {fontSize: '40px', backend: 'svg'} );
    goButtonText.x = goButtonImage.width / 2 - goButtonText.width / 2 - 5;
    goButtonText.y = goButtonImage.height / 2 + 7;
    goButtonImage.addChild( goButtonText );
    this.scene.addChild( goButtonImage );

    var blueImageNames = [
      {image: 'pull_figure_small_BLUE_0', x: 260, y: 498 },
      {image: 'pull_figure_small_BLUE_0', x: 198, y: 499 },
      {image: 'pull_figure_BLUE_0', x: 132, y: 446 },
      {image: 'pull_figure_lrg_BLUE_0', x: 34, y: 420  }
    ];
    var redImageNames = [
      {image: 'pull_figure_small_RED_0', x: 624, y: 500 },
      {image: 'pull_figure_small_RED_0', x: 684, y: 500 },
      {image: 'pull_figure_RED_0', x: 756, y: 446 },
      {image: 'pull_figure_lrg_RED_0', x: 838, y: 407  }
    ];
    var view = this;

    function getClosestKnot( pullerNode ) {
      var filtered = _.filter( knots, function ( knot ) {return knot.type == pullerNode.type;} );
      filtered = _.filter( filtered, function ( knot ) {return knot.puller === undefined;} );
      return _.min( filtered, function ( knot ) {
        var dx2 = Math.pow( pullerNode.centerX - knot.centerX, 2 );
        var dy2 = Math.pow( pullerNode.centerY - knot.centerY, 2 );
        return Math.sqrt( dx2 + dy2 );
      } );
    }

    function highlightClosestKnot( pullerNode ) {
      _.each( knots, function ( knot ) {knot.visible = false} );
      var closestKnot = getClosestKnot( pullerNode );

      //TODO: why is this sometimes undefined
      if ( closestKnot === undefined ) {
        console.log( "closest knot undefined" );
      }
      if ( closestKnot !== undefined ) {
        closestKnot.visible = true;
      }
    }

    function updateForces() {
      var leftForce = 0;
      var rightForce = 0;
      //Sum left forces and right forces
      for ( var i = 0; i < knots.length; i++ ) {
        var obj = knots[i];
        leftForce += obj.puller === undefined ? 0 : obj.type == blue ? -100 : 0;
        rightForce += obj.puller === undefined ? 0 : obj.type == red ? 100 : 0;
      }
      var x = view.cartNode.centerX;
      view.leftArrow.shape = arrowFunction( x, 100, x + leftForce, 100, 10, 40, 20 );
      view.rightArrow.shape = arrowFunction( x, 100, x + rightForce, 100, 10, 40, 20 );
    }

    function addImages( imageNames, type ) {
      for ( var i = 0; i < imageNames.length; i++ ) {
        var image = getImage( imageNames[i].image );
        var imageNode = new Image( image, {x: imageNames[i].x, y: imageNames[i].y, fontSize: 42, cursor: 'pointer'} );
        imageNode.addInputListener( new SimpleDragHandler(
            {
              allowTouchSnag: true,
              start: function ( finger, trail, event ) {//TODO: remove first 2 args
                var pullerNode = event.trail.lastNode();
                if ( pullerNode.knot ) {
                  delete pullerNode.knot.puller;
                }
                delete pullerNode.knot;
              },
              drag: function ( finger, trail, event ) {//TODO: remove first 2 args
                var pullerNode = event.trail.lastNode();
                highlightClosestKnot( pullerNode );
              },
              end: function ( event ) {
                _.each( knots, function ( knot ) {knot.visible = false} );
                var pullerNode = event.trail.lastNode();
                var closestKnot = getClosestKnot( pullerNode );
                closestKnot.puller = pullerNode;
                pullerNode.knot = closestKnot;
                if ( type == red ) {
                  pullerNode.x = closestKnot.centerX;
                  pullerNode.y = closestKnot.centerY - pullerNode.height + 100;
                }
                else {
                  pullerNode.x = closestKnot.centerX - pullerNode.width;
                  pullerNode.y = closestKnot.centerY - pullerNode.height + 100;
                }
                updateForces();
              }
            } ) );
        imageNode.type = type;
        view.scene.addChild( imageNode );
      }
    }

    addImages.call( this, blueImageNames, blue );
    addImages.call( this, redImageNames, red );

    this.scene.initializeFullscreenEvents(); // sets up listeners on the document with preventDefault(), and forwards those events to our scene
    this.scene.resizeOnWindowResize(); // the scene gets resized to the full screen size

    //Fit to the window and render the initial scene
    $( window ).resize( function () { view.resize(); } );
    this.resize();

    //http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // place the rAF *before* the render() to assure as close to
    // 60fps with the setTimeout fallback.
    (function animloop() {
      requestAnimFrame( animloop );
      view.render();
    })();
  }

  View.prototype.resize = function () {
    var width = $( window ).width();
    var height = $( window ).height();

    var scale = Math.min( width / 981, height / 644 );

    this.scene.resize( width, height );
    this.scene.setScale( scale );

    var skyHeight = (376) * scale;
    var groundHeight = height - skyHeight;

    //Clear raphael layers and rebuild
    $( "#background" ).empty();

    //Show the sky
    var paper = Raphael( document.getElementById( "background" ), width - 5, height - 5 );
    var sky = paper.rect( 0, 0, width - 5, height - groundHeight );
    sky.attr( 'fill', '90-#cfecfc-#02ace4' );
    sky.attr( 'stroke', '#fff' );

    //Show the ground
    var ground = paper.rect( 0, height - groundHeight, width, groundHeight );
    ground.attr( 'fill', '#c59a5b' );
    ground.attr( 'stroke', '#fff' );

    this.render();
  };

  View.prototype.render = function () {
    this.scene.updateScene();
  };

  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function ( callback ) {
             window.setTimeout( callback, 1000 / 60 );
           };
  })();

  return View;
} );