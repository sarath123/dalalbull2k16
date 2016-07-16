$(document).ready(function(){
  


   $('.button-collapse').sideNav();

  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover:true, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }

  );

$('.dropdown-button2').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: true, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true // Displays dropdown below the button
    }

  );

    $("html").niceScroll();
    $("#slide-out").niceScroll();
    $('select').material_select();  
//end of init.js components
              if (window.screen.availWidth >= 768) {
                    $.getScript('https://www.google.com/jsapi', function (data, textStatus) {
                    google.load('visualization', '1.0', { 'packages': ['corechart'], 'callback': function () {
        
                    var tag1 = document.createElement("script");
                    //tag1.src = "js/graphgoogle.js";
                    //document.getElementsByTagName("head")[0].appendChild(tag1);
                    
                    tag1.src = "static/js/graphgoogle.js";
                    document.getElementsByTagName("head")[0].appendChild(tag1);
                    //google.setOnLoadCallback(show());
       }
      });});
   }
   else{
                    var tag1 = document.createElement("script");
                    //tag1.src = "js/graphgoogle.js";
                    //document.getElementsByTagName("head")[0].appendChild(tag1);
                    
                    tag1.src = "static/js/graphgoogle.js";
                    document.getElementsByTagName("head")[0].appendChild(tag1);
                   // google.setOnLoadCallback(show());
    
   }

  
  }); // end of document ready
function show() {
   // flag++;
  //$('#curve_chart').delay(500).fadeIn('fast',function(){
    //                                                      $('#preloader').fadeOut(500);
      //                                                 });
 // if(flag==1){
    console.log("keri");
  // $('#preloader').delay(500).fadeOut('fast',function(){
    //                                                     $('#curve_chart').css({height:'100%',
      //                                                                            width:'100%'});
                                                         //$('#curve_chart').fadeIn(10000);
       //                                                });
//  }

};

