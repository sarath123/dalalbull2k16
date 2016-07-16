var port = io('http://localhost:8000/portfolio');
port.emit('hi',{'user_id' : user_id});
port.on('details',function(data){
	if(user_id==JSON.parse(data.values)[5]){
      $('#h_net_worth').html("₹"+JSON.parse(data.values)[1]);
      $('#h_cash_bal').html("₹"+JSON.parse(data.values)[0]);
      $('#h_cash_balmob').html("₹"+JSON.parse(data.values)[0]);
      $('#h_cash_avail').html("₹"+((JSON.parse(data.values)[0])-(JSON.parse(data.values)[2])));
      $('#h_cash_availmob').html("₹"+((JSON.parse(data.values)[0])-(JSON.parse(data.values)[2])));
      $('#h_rank').html("#"+JSON.parse(data.values)[4]);
      $('#h_total').html('<br>'+JSON.parse(data.values)[3]);
      $('#h_totalmob').html('<br>'+JSON.parse(data.values)[3]);
     }
});
