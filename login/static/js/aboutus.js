
$(document).ready(function(){
  
    $('.button-collapse').sideNav();

  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }

  );

    $("html").niceScroll();
    $("#slide-out").niceScroll();
    $('select').material_select();  


 //alert("POI");
    
});//end of keypress fn


/** Used Only For Touch Devices **/
( function( window ) {

  // for touch devices: add class cs-hover to the figures when touching the items
  if( Modernizr.touch ) {

    // classie.js https://github.com/desandro/classie/blob/master/classie.js
    // class helper functions from bonzo https://github.com/ded/bonzo

    function classReg( className ) {
      return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
    }

    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    var hasClass, addClass, removeClass;

    if ( 'classList' in document.documentElement ) {
      hasClass = function( elem, c ) {
        return elem.classList.contains( c );
      };
      addClass = function( elem, c ) {
        elem.classList.add( c );
      };
      removeClass = function( elem, c ) {
        elem.classList.remove( c );
      };
    }
    else {
      hasClass = function( elem, c ) {
        return classReg( c ).test( elem.className );
      };
      addClass = function( elem, c ) {
        if ( !hasClass( elem, c ) ) {
            elem.className = elem.className + ' ' + c;
        }
      };
      removeClass = function( elem, c ) {
        elem.className = elem.className.replace( classReg( c ), ' ' );
      };
    }

    function toggleClass( elem, c ) {
      var fn = hasClass( elem, c ) ? removeClass : addClass;
      fn( elem, c );
    }

    var classie = {
      // full names
      hasClass: hasClass,
      addClass: addClass,
      removeClass: removeClass,
      toggleClass: toggleClass,
      // short names
      has: hasClass,
      add: addClass,
      remove: removeClass,
      toggle: toggleClass
    };

    // transport
    if ( typeof define === 'function' && define.amd ) {
      // AMD
      define( classie );
    } else {
      // browser global
      window.classie = classie;
    }

    [].slice.call( document.querySelectorAll( '.team-grid__member' ) ).forEach( function( el, i ) {
      el.querySelector( '.member__info' ).addEventListener( 'touchstart', function(e) {
        e.stopPropagation();
      }, false );
      el.addEventListener( 'touchstart', function(e) {
        classie.toggle( this, 'cs-hover' );
      }, false );
    } );

  }

})( window );

