$(document).ready(function(){
  
    $('.button-collapse').sideNav();

	$('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: false // Displays dropdown below the button
    }

  );

    $("html").niceScroll();
    $("#slide-out").niceScroll();
    $('select').material_select();  

     
  
  $('#Leaders').mixItUp({
                        layout: {
                              display: 'block'
                                }
                                 });

        var tag = document.createElement("script");
        tag.src = "js/ticker.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
        if (window.screen.availWidth >= 768) {
                  console.log("Not Mobile");
                    $.getScript('https://www.google.com/jsapi', function (data, textStatus) {
                    google.load('visualization', '1.0', { 'packages': ['corechart'], 'callback': function () {
        
                    var tag1 = document.createElement("script");
                    
                    tag1.src = "js/graph.js";
                    document.getElementsByTagName("head")[0].appendChild(tag1);
                    //google.setOnLoadCallback(show());
       }
      });});
   }




         //google.setOnLoadCallback(show());
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


//$($test).load(function() {
//      alert("window load occurred!");
//});

$(document).keypress(function(e) {
    if(e.which == 13) {

    //$('#Leaders').mixItUp();
    document.getElementById("harryscloak").click();


  setTimeout(function(){
  medalArrange();
}, 700);
    
  function medalArrange(){
    var i=1;
    var core = document.getElementById('Leaders');
    var j=0;
    while(core.getElementsByTagName("img")[i]){ 
       var temp = core.getElementsByTagName("img")[i];
       if(temp.getAttribute("id")){     //wont work if profile img has an id
          j++;
          if(temp.getAttribute("id") != ("g_medal"+j) ){
          console.log(core.getElementsByTagName("img")[i].getAttribute("id"));
          temp.src="static/images/medal"+j+".svg";
          temp.id="g_medal"+j;
          console.log(core.getElementsByTagName("img")[i].getAttribute("id"));
          }
       }
       i++;
    }
  };



 alert("POI");
      
    }//end of keyboard check
});//end of keypress fn
