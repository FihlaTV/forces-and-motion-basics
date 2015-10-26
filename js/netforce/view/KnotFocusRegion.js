// Copyright 2002-2013, University of Colorado Boulder

/**
 * An invisible, rectangular view element that tracks the left and right focus regions in the Net Force screen.  This
 * file is necessary to define accessible content for the grouping of knots along the rope in the tug of war game.
 * The knots are treated as groups so that the user can 'enter' and 'exit' them in a 'move mode' for accessible drag
 * and drop behavior.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * Constructor.
   *
   * @param {NetForceModel} netForceModel
   * @param {PullerToolboxNode} toolboxNode - toolbox object containing all of the pullers
   * @param {number} ropeHeightOffset
   * @param {string} type - string which defines whether this is the left/right region, one of {'left || 'right'}
   * @constructor
   */
  function KnotFocusRegion( netForceModel, toolboxNode, ropeHeightOffset, type ) {

    Rectangle.call( this,
      toolboxNode.rectX,
      toolboxNode.rectY - ropeHeightOffset,
      toolboxNode.rectWidth,
      toolboxNode.rectHeight + ropeHeightOffset
    );
    var thisRegion = this;
    this.netForceModel = netForceModel;

    // @public - id used to quickly find this element among peers in the DOM
    this.accessibleId = type === 'left' ? 'leftFocusRegion' : 'rightFocusRegion';

    // define accessible peer content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        /*
         We want this to look like the following in the Parallel DOM:
         <div tabIndex="-1" id="leftFocusRegion"></div>
         */
        var domElement = document.createElement( 'div' );
        domElement.tabIndex = '-1';
        domElement.id = thisRegion.accessibleId;

        // exit the group on 'escape'
        domElement.addEventListener( 'keydown', function( event ) {
          // we want exit event bubbling - event fired in children should notify parent.
          // only on escape key
          if ( event.keyCode === 27 ) {
            // exit the group of knots
            thisRegion.exitGroup( domElement );

            // reset focus to the puller tool box.
            document.getElementById( toolboxNode.accessibleId ).focus();
          }
        } );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    };
  }

  return inherit( Rectangle, KnotFocusRegion, {
    /**
     * Group behavior for accessibility.  On 'enter' or 'spacebar' enter the group by setting all child indices
     * to 0 and set focus to the first child.
     *
     * @param {domElement} parent
     */
    enterGroup: function( parent ) {
      var thisNode = this;

      // get the puller being dragged
      var draggedPuller = null;
      thisNode.netForceModel.pullers.forEach( function( puller ) {
        if ( puller.dragging ) {
          draggedPuller = puller;
        }
      } );
      assert && assert( draggedPuller, 'The dragged puller must be defined.' );

      // add listeners to the children that apply the correct behavior for looping through children.
      _.each( parent.children, function( child ) {
          // add the child to the tab order.
          child.tabIndex = '0';

          // Add event listeners to children for   key navigation.
          child.addEventListener( 'keydown', function( event ) {
            // prevent default - we are testing only using arrow keys for this navigation
            event.preventDefault();
          } );
        }
      );

      // set focus to the child, that is the closest open knot to cart.
      var closestOpenKnotToCart = thisNode.netForceModel.getClosestOpenKnotFromCart( draggedPuller );
      document.getElementById( closestOpenKnotToCart.acessibleKnotId ).focus();
    },

    /**
     * Exit the group.  This is called on 'escape' key.
     *
     * @param {domElement} parent
     */
    exitGroup: function( parent ) {
      // only on 'escape'
      // set focus back to the parent
      parent.focus();

      // make sure that first element is the new aria-activedescendant
      parent.setAttribute( 'aria-activedescendant', parent.firstChild.id );

      // pull all children out of the tab order
      for ( var i = 0; i < parent.children.length; i++ ) {
        parent.children[ i ].tabIndex = '-1';
      }
    }
  } );
} );