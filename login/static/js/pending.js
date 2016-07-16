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
    $("#submitModal").niceScroll();

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
      function sold(data){
        var msg = data;
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
                $("#dishyum").show();
                $("#modfooter1").show();
                window.location="";
                };
      }
$("#processContent").hide();       
$("#processContent2").hide();     
$("#modfooter2").hide();           

  $(document).on('click','form > .button',function(){  
   
    var id = $(this).prop('id');
    var data = $('#'+id).closest('form').serialize();
    $('#submitModal').openModal({
      dismissible: false
    });
  var processingBut=document.getElementById("processingBut");
  var submitModal=document.getElementById("dishyum");
  var subModalHtmlafter = document.getElementById("processContent");
  var subModal = document.getElementById("submitModal");
  processingBut.onclick=function(){
    var high = $(subModal).height();
    high = high + 'px';
    $("#dishyum").hide();
 
  $("#modfooter1").hide();
  $("#processContent").show();
  subModalHtmlafter.style.height = high;
  setTimeout(function(){
    $.ajax({url: "../cancels",
          type: "POST",
          dataType: "json",
          data: data+"&csrfmiddlewaretoken="+getCookie('csrftoken'),
          success: sold,
          error: function(error){
                  console.log(error);
                         },
           });
   
//    $("#processContent").hide();
 //   $("#processContent2").show();
   // $("#modfooter2").show();
  },2000);
};
          
   });

  });
