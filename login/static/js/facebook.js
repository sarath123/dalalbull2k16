statusready=false;

 window.fbAsyncInit = function() {
  FB.init({
    appId      : '802031603226333',
    cookie     : true,  
                        
    xfbml      : true,  
    version    : 'v2.2' 
  });
  statusready=true;

};
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
function start(){
 FB.getLoginStatus(function(response){
  if(response.status==='connected'){
   login();
    $('body').fadeOut();
  }
 });
}
function isLoggedin(){
    FB.getLoginStatus(function(response){
    if(response.status==='connected')
     {
       //console
     }
    else{
      window.alert("You are not logged in to Facebook.Please Login To Continue");
      window.location="../"
  }},true);
}

function logout(){
  FB.getLoginStatus(handleSessionResponse);
}
function handleSessionResponse(response){
  if(response.status==='connected'){
      FB.logout();
      window.location="../";
  }
}
function login(){
 var flag=0;
// FB.api('/me/feed', 'post', {message: "I'm Playing Dalalbull,the stock market simulation game of Excel !!! Visit http://dalalbull.excelmec.org to start playing !!!" });
//}, {scope: 'publish_actions'}); 
 FB.api('/me',function(response){
 var csrf=getCookie('csrftoken');
 $.post("../login",{
		username:response.id,
		firstname:response.first_name,
		lastname:response.last_name,
		email:response.email,
		csrfmiddlewaretoken:csrf
		},function(data,status){if(status==='success')
                                  window.location="../dashboard";					
					});
 });
}
// using jQuery
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
function FBlogin(){
 FB.login(function(response){
 if(response.status==='connected'){
  // Note: The call will only work if you accept the permission request
//  FB.api('/me/feed', 'post', {message: "Im playing Dalalbull,the stock market simulation game of Excel !!! Visit http://dalalbull.excelmec.org to start playing!!!"
//});
  login();
}
   },{scope: 'public_profile,email'});
  }
