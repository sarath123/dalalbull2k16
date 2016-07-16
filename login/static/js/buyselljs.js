var ismob=false;
var currP=0,price;
var typet="",symbol="";
var qty = 0;  
var misc =[];
var companyValid=false;
var qtyValid=false;
var typeValid=false;
var pendingValid=true;
if(window.screen.availWidth < 768)
  ismob=true;
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

    $('select').material_select();  
//end of init.js components
  
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal({
      dismissible: false
    });

  //var company = $(".companyName");
  var company1=document.getElementById("companyName1");
  var company=document.getElementById("companyName");
  if(company){
   company.onchange=function(){
   	 var symboltemp="Company Name : " + company.value; 
	   Materialize.toast(symboltemp, 4000) ;
    if($("#companyName").val()!="none"){
      symbol = $("#companyName").val();
      $.ajax({
        url: "../currPrice",
        type: "POST",
        dataType: "json",
        data: {"comp": $("#companyName").val(),"csrfmiddlewaretoken" : getCookie('csrftoken')},
        success: dispCurr,
        error: function(error){
          console.log(error);
        }
      });
      companyValid=true;
    }else{
      $("#curr_Price").html("--");

    }

  };}
  if(company1){
  company1.onchange=function(){

    $("#cheruth").removeClass("s12");
    $("#cheruth").addClass("s6");
    $("#cheruth2").removeClass("hide");
    $("#marginparent").hide();
    $('#company_name').html(company1.value);
    if($("#companyName1").val()!="none"){
      symbol = $("#companyName1").val();
      $.ajax({
        url: "../currPrice",
        type: "POST",
        dataType: "json",
        data: {"comp": $("#companyName1").val(),"csrfmiddlewaretoken" : getCookie('csrftoken')},
        success: dispCurr,
        error: function(error){
          console.log(error);
        }
      });
      companyValid=true;
    }else{
      $("#curr_Price").html("--");
    }

	 };}//("change", );
    
var Quanselect=document.getElementById("Quantity");
  if(Quanselect){
  Quanselect.onfocusout=function(){
    price = $("#last_name").val();
    if(($.isNumeric($("#Quantity").val()) && symbol != "none")){
      //$("#expLoader").show();
      
      qty = $("#Quantity").val();
      typet = $("#b_ss").val();
      qtyValid=true;
      approxCalc(symbol,price,currP,typet,qty,misc);
    }else if($("#companyName").val() == "none"){
      //Materialize.toast("Select a Company",4000);
      //$("#expValues").html("Select a Company"); 
    }else{
      //Materialize.toast("Enter Valid Data",4000);
      //$("#expValues").html("Enter Valid Data");
    }

  };}
var Quanselect1=document.getElementById("Quantity1");
  if(Quanselect1){
  Quanselect1.onfocusout=function(){
    price = $("#last_name1").val();
    if(($.isNumeric($("#Quantity1").val()) && symbol != "none")){
      //$("#expLoader").show();
      
      qty = $("#Quantity1").val();
      typet = $("#b_ss1").val();
      qtyValid=true;
      approxCalc(symbol,price,currP,typet,qty,misc);
    }else if($("#companyName1").val() == "none"){
      Materialize.toast("Select a Company",4000);
      //$("#expValues").html("Select a Company"); 
    }else{
      Materialize.toast("Enter Valid Data",4000);
      //$("#expValues").html("Enter Valid Data");
    }

 };}

  var Typeselect=document.getElementById("b_ss");
  if(Typeselect){
    Typeselect.onchange=function(){
          price = $("#last_name").val();
    if(($.isNumeric($("#Quantity").val()) && symbol != "none")){
      
      qty = $("#Quantity").val();
      typet = $("#b_ss").val();
      typeValid=true;
      approxCalc(symbol,price,currP,typet,qty,misc);
    }else if($("#companyName").val() == "none"){
      Materialize.toast("Select a Company",4000);
      //$("#expValues").html("Select a Company"); 
    }

    }
  }
  var pending=document.getElementById("last_name");
  if(pending){
      pending.onfocusout=function(){

    price = $("#last_name").val();
    if((($.isNumeric($("#Quantity").val()) && symbol != "none")&& $.isNumeric(price)) ||(($.isNumeric($("#Quantity").val()) && symbol != "none")&& $("#last_name").val()=="")){
      
      qty = $("#Quantity").val();
      typet = $("#b_ss").val();
      approxCalc(symbol,price,currP,typet,qty,misc);
    }else if($("#companyName").val() == "none"){
      
      //$("#expValues").html("Select a Company"); 
    }else{
      //$("#expValues").html("Enter Valid Data");
    }
  };
}
  var Typeselect1=document.getElementById("b_ss1");
  if(Typeselect1){
    Typeselect1.onchange=function(){
          price = $("#last_name1").val();
    if(($.isNumeric($("#Quantity1").val()) && symbol != "none")){
      
      qty = $("#Quantity1").val();
      typet = $("#b_ss1").val();
      typeValid=true;
      approxCalc(symbol,price,currP,typet,qty,misc);
    }else if($("#companyName1").val() == "none"){
      Materialize.toast("Select a Company",4000);
      //$("#expValues").html("Select a Company"); 
    }

    }
  }
  var pending1=document.getElementById("last_name1");
  if(pending1){
      pending1.onfocusout=function(){

    price = $("#last_name1").val();
    if((($.isNumeric($("#Quantity1").val()) && symbol != "none")&& $.isNumeric(price)) ||(($.isNumeric($("#Quantity1").val()) && symbol != "none")&& $("#last_name1").val()=="")){
      
      qty = $("#Quantity1").val();
      typet = $("#b_ss1").val();
      approxCalc(symbol,price,currP,typet,qty,misc);
    }else if($("#companyName1").val() == "none"){
      
      //$("#expValues").html("Select a Company"); 
    }else{
      //$("#expValues").html("Enter Valid Data");
    }
  };
}
$("#processContent").hide();        
$("#processContent2").hide();      
$("#modfooter2").hide();           



  }); // end of document ready

function dispCurr(data){      
  dat = data[0];
  currP = dat;
  misc = data;      
  setTimeout(function(){
    if ($.isNumeric(dat)) {
      dat = "₹"+dat;
    }else{
      dat = "Invalid Data";
      }
      $("#curr_Price").html(dat);
    },200);
    
  if(ismob){     
  typet = $("#b_ss").val();
  qty = $("#Quantity").val();
  price = $("#last_name").val();
  Materialize.toast("Price: "+currP, 4000) ;
  }
  else
  {
    typet=$("#b_ss1").val();
    qty=$("#Quantity1").val();
    price=$("#last_name1").val();
  }
  approxCalc(symbol,price,currP,typet,qty,data);
}
  function approxCalc (company,pending,curr,typeofT,quant,misc) {
    var no_trans = misc[3];
    var msg = "";
    var brokerage,test;
    if ($.isNumeric(pending) && pending > 0) {
      trdprice = pending;
      test = false;
      var temp = " (Pending)";
    }else{
      trdprice = curr;
      test = true;
      var temp = "";
    }

    var chkVal,chk = true ;
    if ((typeofT === "Buy" || typeofT === "Short Sell")&&(($.isNumeric(trdprice)) && quant !=0 )) {
      if (quant.toString().indexOf(".") != -1) {
        chkVal = quant.toString().substring(quant.toString().indexOf("."),quant.toString().length);
        if (chkVal > 0) {
          chk = false;
        }
      }
      if ($.isNumeric(quant) && $.isNumeric(curr) &&( quant > 0 && trdprice >0 ) && chk) {
        
        $('#company_name').html(company);
        $('#curr_Price').html("₹"+trdprice);
        $('#no_of_shares').html(quant);
        $('#type').html(typeofT+temp);

        if(no_trans+1<=100)
          {
            brokerage=((0.5/100)*trdprice)*quant;
          } 
          else if(no_trans+1<=1000)
          {
            brokerage=((1.0/100)*trdprice)*quant;
          }
          else
          {
            brokerage=((1.5/100)*trdprice)*quant;
          }

          brokerage = brokerage.toFixed(2);
          var totValue = (trdprice*quant);
          var cashInHand = (misc[1] - misc[2]).toFixed(2);
          var percentager = parseFloat(0.05 * curr);
          var margin = 0;
          $('#total').html("₹"+totValue.toFixed(2));
          $('#brokerage').html("₹"+brokerage);
          //disp +="<tr><th>Total Value: </th><td>â‚¹ " + totValue.toFixed(2) +"</td></tr><tr><th>Brokerage : </th><td>â‚¹ " + brokerage +"</td></tr>";
        if (typeofT === "Buy") {
          $('#cash').html("₹"+cashInHand);
          //disp += "<tr><th>Cash Available: </th><td>â‚¹ " + cashInHand + "</td></tr><tr><th>Message: </th><td>";
        }else if(typeofT ==="Short Sell"){
          margin = (totValue/2).toFixed(2);
          $('#margin').html(margin);
          $('#marginparent').show();
          $('#cash').html("₹"+cashInHand);
          //disp +="<tr><th>Margin :</th><td>â‚¹ "+ margin +"</td></tr><tr><th>Cash Available: </th><td>â‚¹ " + cashInHand + "</td></tr><tr><th>Message: </th><td>";          
        }
        var currpercenteradd = parseFloat(curr) + parseFloat(percentager);
        var currpercenterdiff = curr - percentager;
        
        //if(typeofT === "Buy" && (parseFloat(pending) > parseFloat(curr) || parseFloat(pending) < parseFloat(currpercenterdiff))){
        if(typeofT === "Buy" ){
          if (parseFloat(pending) > parseFloat(curr)) {
            Materialize.toast("Transaction Not Possible",4000);
            Materialize.toast("Pending Price Invalid. Refer Help",4000);
            //msg = "<h5 class='dark'>Transaction not possible</h5><br> Pending price should be less than and maximum of 5% below Current Price</br>";
          }else if (parseFloat(pending) < parseFloat(currpercenterdiff)) {
            Materialize.toast("Transaction Not Possible",4000);
            Materialize.toast("Pending Price Invalid. Refer Help",4000);
            //msg = "<h5 class='dark'>Transaction not possible</h5> Pending price should be less than and maximum of 5% below Current Price";
          }else if((cashInHand-brokerage)<=0 || (cashInHand-brokerage)<(totValue) && typeofT=="Buy"){
            Materialize.toast("Transaction Not Possible",4000);
            Materialize.toast("Insufficient Funds",4000);            
            //msg = "<h5 class='dark'>Transaction not possible</h5>";
          }else{
            Materialize.toast("Transaction Possible",4000);
            //msg = "<h5 class='dark'>Transaction possible</h5>";
          }
        
        }else if(typeofT === "Short Sell"){
          if (parseFloat(pending) < parseFloat(curr)) {
            Materialize.toast("Transaction Not Possible",4000);
            Materialize.toast("Pending Price Invalid. Refer Help",4000);
            //msg = "<h5 class='dark'>Transaction not possible</h5> Pending price should be greater than and maximum of 5% above Current Price";
          }else if ( parseFloat(pending) > currpercenteradd) {
            Materialize.toast("Transaction Not Possible",4000);
            Materialize.toast("Pending Price Invalid. Refer Help",4000);
            //console.log("2nd" + parseFloat(pending) +" "+ parseFloat(currpercenteradd) +" "+ percentager);
            //msg = "<h5 class='dark'>Transaction not possible</h5> Pending price should be greater than and maximum of 5% above Current Price";
          }else if( ((cashInHand-brokerage<(totValue)/2) && typeofT=="Short Sell")){
            Materialize.toast("Transaction Not Possible",4000);
            Materialize.toast("Insufficient Funds",4000);            
            //msg = "<h5 class='dark'>Transaction not possible</h5>";
          }else{
            Materialize.toast("Transaction Possible",4000);
            //console.log("here");
            //console.log("2nd" + parseFloat(pending) +" "+ parseFloat(currpercenteradd) +" "+ percentager)
            //msg = "<h5 class='dark'>Transaction possible</h5></td></tr>";
          }
        }
        //msg+="</table></div>";      
        //disp += msg;
        //Materialize.toast(msg,4000);
      }else{
        //disp ="Invalid/Incomplete Data"
        //Materialize.toast(disp,4000);
      }
    }else{

      //disp = "Invalid/Incomplete Data"
      //Materialize.toast(disp,4000);
    }
    //$("#expValues").html(disp);     
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
var processingBut=document.getElementById("processingBut");
var submitModal=document.getElementById("dishyum");
var subModalHtmlafter = document.getElementById("processContent");
var subModal = document.getElementById("submitModal");
//var subModalHtmlbefore = submitModal.innerHTML;
var finalButton = document.getElementById("finishedBut");
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
      var company;
      var quantity;
      var bss;
      var pending;
      if(ismob){
      company=$("#companyName").val();
      quantity=$("#Quantity").val();
      bss=$("#b_ss").val();
      pending=$("#last_name").val();
      }
      else{
        company=$("#companyName1").val();
        quantity=$("#Quantity1").val();
        bss=$("#b_ss1").val();
        pending=$("#last_name1").val();
      }
      var csrf=getCookie('csrftoken');

      function resetform(){
        $('#companyName').html('none');
        $('#companyName1').html('none');
        //$('#curr_Price').html("--");
        $('#Quantity').val('');
        $('#Quantity1').val('');
        $('#b_ss').val('none');
        $('#b_ss1').val('none');
        $('#last_name').val('');
        $('#last_name1').val('');
    $("#cheruth").removeClass("s6");
    $("#cheruth").addClass("s12");
    $("#cheruth2").addClass("hide");

      }

      function transaction(data){
        resetform();
        $("#transresult").html(data);
    $("#processContent").hide();
    $("#processContent2").show();
    $("#modfooter2").show();

      }
      //console.log(vals)
      $.ajax({url: "../submit_buy",
            type: "POST",
            data:{
            'company' : company,
            'quantity' : quantity,
            'b_ss' : bss,
            'pending' : pending,
            'csrfmiddlewaretoken' : csrf,
            },
            success: transaction,
            error: function(error){
                        console.log(error);
                     }
              });
    
//    $("#processContent").hide();
  //  $("#processContent2").show();
   // $("#modfooter2").show();
  },2000);
};
finalButton.onclick=function(){
  $("#processContent2").hide();
    $("#modfooter2").hide();
    $('#submitModal').closeModal();
    $('#transresult').html("");
     //$("#dishyum").show();
       $("#modfooter1").hide();
       window.location="../buy"

};
