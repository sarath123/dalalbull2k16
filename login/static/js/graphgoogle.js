$(document).ready(function(){
var url='http://localhost:8000/stockinfo';
company="";
if(window.screen.availWidth >= 768){
  google.setOnLoadCallback(function(){drawChart();});
      var chart=null;
      var options=null;
      var data2=null;
      function drawChart() {
        data2 = google.visualization.arrayToDataTable([
          ['timeofday', 'Current Price'],
          [[9,00,00],  100],
        ]);

        options = {
          title: 'Company Index',
          curveType: 'function',
          colors: ['orange'],
	  lineWidth: 3,
          legend: { position: 'bottom' },
           'vAxis': {'title': 'Stock Index',
                    'minValue': 200, 
                    'maxValue': 300},
          'hAxis': {'title': 'Time',
 'minValue': [9,00,00], 
 'maxValue': [16,00,00]},
          animation: {duration: 1000,
        easing: 'out',
    startup:true
      },
        };

        chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        
        var flag=0;
        google.visualization.events.addListener(chart, 'ready', function () {
          if(!flag){

            $('#curve_chart').hide();
            $('#curve_chart').fadeIn(1000);
            flag++;
          }
      });
        chart.draw(data2, options);
        var socket = io(url);
        var now =new Date();
        socket.on('connection',function(){
        });

        var company='ACC';
        var lasttime=0;
        updatecard(company);
        data2 = google.visualization.arrayToDataTable([
          ['timeofday', 'Current Price'],
          [[9,00,00],  100],
        ]);
        socket.emit('hi',{'company' : company });
        socket.on('graph_values', function(data){
          var graph=JSON.parse(data.values);
          for(var i=0;i<graph.length;i++){
            if(lasttime==0){
              data2.removeRow(0);
            }
            if(getseconds(graph[i][0][0],graph[i][0][1],graph[i][0][2])>lasttime) {
              var row=[];
              row.push(graph[i][0]);
              row.push(parseInt(graph[i][1]));
             // if(company==data.company)
	    	  data2.addRow(row);
              lasttime=getseconds(graph[i][0][0],graph[i][0][1],graph[i][0][2]);
            } 
          }
          var temp = new Date();
          if(temp.getDate()!=now.getDate())
            lasttime=0;
         now=temp;
         chart.draw(data2,options);  
        });

        $('.company').on('click',function(){
        company=$(this).html();
        lasttime=0;
        updatecard(company);
        data2 = google.visualization.arrayToDataTable([
          ['timeofday', 'Current Price'],
          [[9,00,00],  100],
        ]);
        socket.emit('hi',{'company' : company });
        socket.on('graph_values', function(data){
          var graph=JSON.parse(data.values);
          for(var i=0;i<graph.length;i++){
            if(lasttime==0){
              data2.removeRow(0);
            }
            if(getseconds(graph[i][0][0],graph[i][0][1],graph[i][0][2])>lasttime) {
              var row=[];
              row.push(graph[i][0]);
              row.push(parseInt(graph[i][1]));
             // if(company==data.company)
              	data2.addRow(row);
              lasttime=getseconds(graph[i][0][0],graph[i][0][1],graph[i][0][2]);
            } 
          }
          var temp = new Date();
          if(temp.getDate()!=now.getDate())
            lasttime=0;
         now=temp;
         chart.draw(data2,options);  
        });

    });

      }
    }
  else{
        var company='ACC';
        updatecard(company);
        $('.company').on('click',function(){
        company=$(this).html();
        updatecard(company);
      });
  }
});
function getseconds(hh,mm,ss){
  return((hh*60*60)+(mm*60)+ss);
}
function updatecard(data){

      $.ajax({
        url: "../companydetails",
        type: "POST",
        dataType: "json",
        data: {"company": data,"csrfmiddlewaretoken" : getCookie('csrftoken')},
        success: dispdata,
        error: function(error){
          console.log(error);
        }
      });

}
function dispdata(data){
	carddata=data;
	$('#company_name').html(carddata.company);
	$('#current_price').html(carddata.current_price);
	$('#high').html(carddata.high);
	$('#low').html(carddata.low);
	$('#open').html(carddata.open);
	$('#change').html(carddata.change);
	$('#change_per').html(carddata.change_per);
	$('#qty').html(carddata.trade_Qty);
	$('#trdval').html(carddata.trade_Value);
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
