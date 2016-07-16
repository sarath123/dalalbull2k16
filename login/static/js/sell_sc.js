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
     $("#submitModal").niceScroll({autohidemode: false});

  function tableUpdater(data){
    for (var i = 0; i < data.length; i++) {
      var dat = data[i];
      if (dat[2] == "Buy") {
        var t = dat[0]+dat[2];  

      } else{
        var t = dat[0]+"Short";
      }
      
      var id = document.getElementById(t);
      var ltp = $(id).find('td:nth-child(4)').html();
      if (parseFloat(ltp) < parseFloat(dat[1])) {
          $(id).find('td:nth-child(4)').html(dat[1]);
          $(id).find('td:nth-child(4)').addClass("inc");
      } else if(parseFloat(ltp) > parseFloat(dat[1])){
          $(id).find('td:nth-child(4)').html(dat[1]);
          $(id).find('td:nth-child(4)').addClass("dec");
          }
      var profit,profit_per,clrclass;
      var old_val,old_quantity;
      old_quantity = parseInt(dat[3]);
      old_val = parseFloat(dat[4]);
      if(dat[2]=="Buy"){
           profit=dat[1]-(old_val/old_quantity);
      }else{
          profit=(old_val/old_quantity)-dat[1];
      }
      
      prof_per=parseFloat((profit/(old_val/old_quantity))*100).toFixed(2);
      var chng = $(id).find('td:nth-child(5)').html();
      
      if (parseFloat(chng) < parseFloat(prof_per)) {
          $(id).find('td:nth-child(5)').html(prof_per);
          $(id).find('td:nth-child(5)').addClass("inc");

          if (prof_per > 0 && $(id).find('td:nth-child(5)').hasClass('dwntrend') ) {
              $(id).find('td:nth-child(5)').removeClass('dwntrend').addClass('uptrend');
          }else if (chng ==0 && prof_per > 0) {
              $(id).find('td:nth-child(5)').addClass('uptrend');
          }

          if (prof_per == 0 && $(id).find('td:nth-child(5)').hasClass('uptrend dwntrend') ) {
              $(id).find('td:nth-child(5)').removeClass('uptrend dwntrend');
          }
      } else if(parseFloat(chng) > parseFloat(prof_per)){
          $(id).find('td:nth-child(5)').html(prof_per);
          $(id).find('td:nth-child(5)').addClass("dec");

          if (prof_per < 0 && $(id).find('td:nth-child(5)').hasClass('uptrend') ) {
              $(id).find('td:nth-child(5)').removeClass('uptrend').addClass('dwntrend');
          }else if (chng ==0 && prof_per < 0) {
              $(id).find('td:nth-child(5)').addClass('dwntrend');
          }
          if (prof_per == 0 && $(id).find('td:nth-child(5)').hasClass('uptrend dwntrend') ) {
              $(id).find('td:nth-child(5)').removeClass('uptrend dwntrend');
          }
        }
      setTimeout(function(){
          $("table tbody").find('td:nth-child(4)').removeClass("inc dec");
          $("table tbody").find('td:nth-child(5)').removeClass("inc dec");
          },2000);
        
        }
  }
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

      function caller(){
          $.ajax({url: "../sell_trend",
                  type: "POST",
                  dataType: "json",
                  data:{"symbols": symbols,"csrfmiddlewaretoken" : getCookie('csrftoken'),},
                  success: tableUpdater,
                  timeout: 10000,
                  error: function(error){

                     console.log(error);
              }
          });
            setTimeout(caller,60000);    
         }               
      caller();       

      function sold(data){
        var msg = data[0];
        var tableData = data[1];
        symbols = data[2];
        //console.log(data);
        //$("#soldBanner").html(msg).show();
  var finalButton = document.getElementById("finishedBut");              
              $("#transresult").html(msg);
	      $("#processContent").hide();
	      $("#processContent2").show();
    	      $("#modfooter2").show();
              finalButton.onclick=function(){
                $("#processContent2").hide();
                $("#modfooter2").hide();
                $('#submitModal').closeModal();
                $('#transresult').html("");
               // $("#dishyum").show();
               // $("#modfooter1").show();
                window.location="";
                };
      }
$("#processContent").hide();       //NEW 
$("#processContent2").hide();     //NEW 
$("#modfooter2").hide();          //NEW 

  $(document).on('click','form > .button',function(){  
   
    //$("#soldBanner").show();
    //console.log(symbols);
    var id = $(this).prop('id');
    //console.log(id);
    var data = $('#'+id).closest('form').serialize();
    //console.log(getCookie('csrftoken'));
    //$("#sellList").empty();
    //$("#sellDiv").hide();
    $('#submitModal').openModal({
      dismissible: false
    });
  var processingBut=document.getElementById("processingBut");
  var submitModal=document.getElementById("dishyum");
  var subModalHtmlafter = document.getElementById("processContent");
  var subModal = document.getElementById("submitModal");
  //var subModalHtmlbefore = submitModal.innerHTML;
  processingBut.onclick=function(){
    var high = $(subModal).height();
    high = high + 'px';
    //window.alert(high);
    //submitModal.hide();
    $("#dishyum").hide();
 
  $("#modfooter1").hide();
  $("#processContent").show();
  subModalHtmlafter.style.height = high;
  setTimeout(function(){
    $.ajax({url: "../submit_sell",
          type: "POST",
          dataType: "json",
          data: data+"&csrfmiddlewaretoken="+getCookie('csrftoken'),
          success: sold,
          error: function(error){
                  console.log(error);
                         },
           });
   
   // $("#processContent").hide();
   // $("#processContent2").show();
   // $("#modfooter2").show();
  },2000);
};
          
   });

  });
