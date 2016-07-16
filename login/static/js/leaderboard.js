// window.alert("Dalalbull 2015 has ended.We thank everyone who participated.Results will be announced shortly.See you at Excel !!!  ");
var socket = io.connect('http://localhost:8000');
socket.on('message', function(data){
  if(data.message){
      var leaderboard=JSON.parse(data.message);
      //console.log("leaderboard");
      var lsize=0;
      if(leaderboard.length>5)
      	lsize=5;
      else
      	lsize=leaderboard.length;
      var i=1;
      var buffer=[];
      var out=6;
      for(var i=1;i<=5;i++){
      	var found=0;
      	for(var j=0;j<lsize;j++){
      		if(document.getElementById("h_rank_name"+i).innerHTML==leaderboard[j].name){
      			buffer.push({"old":i,"newr":j+1});
      			found++;
      			break;
      		}
      	}
      	if(found==0){
      		buffer.push({"old":i,"newr":6});
      			out++;
      	}
      }
      //console.log(out);
     for(i=0;i<buffer.length;i++){
	      	document.getElementById('h_net'+buffer[i].old).innerHTML=leaderboard[buffer[i].newr-1].net_worth;
     		document.getElementById("h_rank"+(buffer[i].old)).setAttribute("data-myorder",buffer[i].newr);
     	}
     $('#Leaders').mixItUp('sort','data-myorder:asc');
     document.getElementById('harryscloak').click();
     setTimeout(medalArrange,1000);
     var inc=out-1;
     var buffer1=[];
     for(var i=0;i<lsize;i++){
      	var found=0;
      	for(var j=1;j<=5;j++){
      		if(document.getElementById("h_rank_name"+j).innerHTML==leaderboard[i].name){
      			found++;
      			break;
      		}
      	}
      	if(found==0){
      		buffer1.push(i);
      	}
      }
      //console.log(buffer1);
      for(i=0;i<buffer1.length;i++){
      	var temp;
      	for(var k=1;k<=5;k++){
      		if(document.getElementById('h_rank'+k).getAttribute('data-myorder')==6)
      			temp=k;
      	}
      	document.getElementById('h_rank_name'+temp).innerHTML=leaderboard[buffer1[i]].name;
      	document.getElementById('h_rank'+temp).setAttribute('data-myorder',buffer1[i]+1);
      	document.getElementById('h_net'+temp).innerHTML=leaderboard[buffer1[i]].net_worth;
      	document.getElementById('h_rank'+temp).getElementsByTagName("img")[0].src="https://graph.facebook.com/"+leaderboard[buffer1[i]].user_id+"/picture?redirect=true&height=32&width=32";
  }

     //$('#Leaders').mixItUp('sort','data-myorder:asc');
     //document.getElementById('harryscloak').click();
     /*	else{
     			//console.log("flag=1");
   			   	//console.log("change");			
     			document.getElementById("h_rank_name"+(buffer[i].old)).innerHTML=leaderboard[buffer[i].newr].name;
     			document.getElementById("h_net"+(buffer[i].old)).innerHTML="₹"+leaderboard[buffer[i].newr].net_worth;  				
     			document.getElementById("h_rank"+(buffer[i].old)).getElementsByTagName("img")[0].src="https://graph.facebook.com/"+leaderboard[buffer[i].newr].user_id+"/picture?redirect=true&height=32&width=32";
     	}
     }*/
     //$('#Leaders').mixItUp('sort', 'data-myorder:asc');
     //document.getElementById('harryscloak').click();
     //setTimeout(medalArrange,1000);
  //for(var i=1;i<=5;i++)
   	// console.log(i+" "+document.getElementById("h_rank"+i).getAttribute("data-myorder"));
     }
    if(data.nifty){
      $('#h_nifty').html(JSON.parse(data.nifty)[0]);
      $('#h_chg').html(JSON.parse(data.nifty)[1]);
      $('#h_chg_mob').html(JSON.parse(data.nifty)[1]);
    }
});
function medalArrange(){
    var i=1;
    var core = document.getElementById('Leaders');
    var j=0;
    while(core.getElementsByTagName("img")[i]){ 
       var temp = core.getElementsByTagName("img")[i];
       if(temp.getAttribute("id")){     //wont work if profile img has an id
          j++;
          if(temp.getAttribute("id") != ("g_medal"+j) ){
          temp.src="static/images/medal"+j+".svg";
          temp.id="g_medal"+j;
          }
       }
       i++;
    }
  }
