// window.alert("Today is the last day of Dalalbull 2015.We thank everyone who participated.See you at #Excel !!!  ");
 //console.log("graph");
      var url='http://localhost:8000/chat';
     $('#Leaders').mixItUp('sort', 'data-myorder:asc');
     document.getElementById('harryscloak').click();
     setTimeout(medalArrange,1000);
google.setOnLoadCallback(drawChart);
      var chart=null;
      var options=null;
      var data2=null;
      function drawChart() {
        data2 = google.visualization.arrayToDataTable([
          ['timeofday', 'Index'],
          [[9,00,00],  8000],
        ]);

        options = {
          title: 'Nifty Index',
          curveType: 'function',
	  colors: ['red'],
	  lineWidth: 3,
          legend: { position: 'bottom' },
           'vAxis': {'title': 'Stock Index',
                    'minValue': 7800, 
                    'maxValue': 8200},
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
        var lasttime=0;
        var now =new Date();
        socket.on('connection',function(){
        });
        socket.emit('hi',{'company' : "CNX NIFTY"});
        socket.on('graph_values', function(data){
          var graph=JSON.parse(data.values);
          for(var i=0;i<graph.length;i++){
            if(lasttime==0){
              data2.removeRow(0);
            }
            //console.log(graph[0][0][0]);
            if(getseconds(graph[i][0][0],graph[i][0][1],graph[i][0][2])>lasttime) {
              var row=[];
              row.push(graph[i][0]);
              row.push(parseInt(graph[i][1]));
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

      }

function getseconds(hh,mm,ss){
  return((hh*60*60)+(mm*60)+ss);
}
function medalArrange(){
    var i=1;
    var core = document.getElementById('Leaders');
    var j=0;
    while(core.getElementsByTagName("img")[i]){ 
       var temp = core.getElementsByTagName("img")[i];
       if(temp.getAttribute("id")){     //wont work if profile img has an id
          j++;
          if(temp.getAttribute("id") != ("g_medal"+j) ){
          //console.log(core.getElementsByTagName("img")[i].getAttribute("id"));
          temp.src="static/images/medal"+j+".svg";
          temp.id="g_medal"+j;
          //console.log(core.getElementsByTagName("img")[i].getAttribute("id"));
          }
       }
       i++;
    }
  }
