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

     
  
  $('#Leaders').mixItUp({
                        layout: {
                              display: 'block'
                                }
                                 });

        //$.getScript('js/ticker.js');
     //   $.getScript("https://www.google.com/jsapi?autoload={
       //     'modules':[{
        //      'name':'visualization',
        //      'version':'1',
        //      'packages':['corechart']
        //    }]
        //  }");
       // $.getScript('/js/graphgoogle.js');
        //$.getScript('/js/graph.js');
        var tag = document.createElement("script");
        tag.src = "static/js/ticker.js";
        document.getElementsByTagName("head")[0].appendChild(tag);
        
        //var tag1 = document.createElement("script");
       //tag1.src = "js/graphgoogle.js";
        //document.getElementsByTagName("head")[0].appendChild(tag1);
        // tag1.src = "js/graph.js";
        //document.getElementsByTagName("head")[0].appendChild(tag1);
            if (window.screen.availWidth >= 768) {
                console.log("Not Mobile");
                    $.getScript('https://www.google.com/jsapi', function (data, textStatus) {
                    google.load('visualization', '1.0', { 'packages': ['corechart'], 'callback': function () {
        
                    var tag1 = document.createElement("script");
                    //tag1.src = "js/graphgoogle.js";
                    //document.getElementsByTagName("head")[0].appendChild(tag1);
                    
                    tag1.src = "static/js/graph.js";
                    document.getElementsByTagName("head")[0].appendChild(tag1);
                    google.setOnLoadCallback(show());
       }
      });});
   }
   else{
        
                    var tag3 = document.createElement("script");
                    //tag1.src = "js/graphgoogle.js";
                    //document.getElementsByTagName("head")[0].appendChild(tag1);
                    
                    tag3.src = "static/js/sort.js";
                    document.getElementsByTagName("head")[0].appendChild(tag3);

   }



var tour = new Tour({
  name: "tour",
  steps: [
  {
    element: "",
    title: "Welcome to Dalalbull 2015",
    content: "Click on next to start a guided tour on the basic elements of this page."
  },
  {
    element: "#networth",
    title: "Your net worth",
    content: "Net worth = Cash in hand + value of stocks in hand."
  },
  {
    element: "#margin",
    title: "Margin",
    content: "The borrowed money used to purchase stocks.Margin is connected with short sell."
  },
  
  {
    element: "#topgainers",
    title: "Top Gainers",
    content: "Stocks with most gain(per cent change) today."
  },
  {
    element: "#toplosers",
    title: "Top Losers",
    content: "Stocks with least  gain(per cent change) today."
  },
  {
    element: "#mostActive",
    title: "Most Active(Volume)",
    content: "Stocks whose shares have been traded the most (based on volume) today."
  },
  {
    element: "#mostActiveVal",
    title: "Most Active(Value)",
    content: "Stocks whose shares have been traded the most (based on value) today."
  },
  {
    element: "#tutrest2,#tutrest",
    title: "End",
    content: "You can always rerun this tutorial by selecting the tutorial option from the dropdown."
  }
  ],
  container: "body",
  keyboard: true,
  storage: window.localStorage,//false,//window.localStorage,
  debug: false,
  backdrop: true,
  backdropContainer: 'body',
  backdropPadding: 0,
  redirect: false,
  orphan: true,
  duration: false,
  delay: false, 
  basePath: "", 
  template: "<div class='card popover' style='position:fixed;z-index:1150;'> \
    <div class='arrow'></div> \
    <h3 class='popover-title'></h3>\
    <div class='popover-content'></div> \
    <div class='row'> \
        <div class='col m4 s12'>  \
          <button class='waves-effect waves-light btn' style='width:100%' data-role='prev'>« Prev</button> \
        </div> \
        <div class='col m4 s12'>  \
        <button class='waves-effect waves-light btn' style='width:100%' data-role='end'>End</button> \
        </div> \
        <div class='col m4 s12'>  \
          <button class='waves-effect waves-light btn' style='width:100%' data-role='next'>Next »</button> \
        </div> \
    </div> \
      </div>",
});

tour.init();

tour.start();

$('.sishu').click(function(){
  
    tour.setCurrentStep(0);
    tour.start(true);
  
  });



/*var cookie=getCookie("inconveniance");
if(!cookie)
  alert("Due to certain server issues yesterday,there was a bug in the portfolio details.The issue has been fixed and cash balance has been reset.We apologise for the inconvenience caused");
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
document.cookie="inconveniance=true; expires=Thu, 3 Sep 2015 16:00:00 UTC";*/


  }); // end of document ready
var flag=0;

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

