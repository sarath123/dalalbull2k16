from channels.staticfiles import StaticFilesConsumer
from channels import route
from login import consumers



channel_routing = [
    # This makes Django serve static files from settings.STATIC_URL, similar
    # to django.views.static.serve. This isn't ideal (not exactly production
    # quality) but it works for a minimal example.
    route('http.request', StaticFilesConsumer()),

    # Wire up websocket channels to our consumers:

    route('websocket.connect',
    	consumers.connect_to_nifty_channel,
    	path = r'^/nifty-channel/'
     	),
	
	route('websocket.disconnect',
		consumers.disconnect_from_nifty_channel,
		path = r'^/nifty-channel/',
     	),




	route('websocket.connect',
    	consumers.connect_to_leaderboard_channel,
    	path = r'^/leaderboard-channel/'
     	),
	
	route('websocket.disconnect',
		consumers.disconnect_from_leaderboard_channel,
		path = r'^/leaderboard-channel/',
     	),






	route('websocket.connect',
    	consumers.connect_to_graph_channel,
    	path = r'^/graph-channel/'
     	),

	route('websocket.receive',
    	consumers.connect_to_graph_channel_company,
    	path = r'^/graph-channel/'
     	),
	
	route('websocket.disconnect',
		consumers.disconnect_from_graph_channel,
		path = r'^/graph-channel/',
     	),




	route('websocket.connect',
    	consumers.connect_to_portfolio_channel,
    	path = r'^/portfolio-channel/'
     	),

	route('websocket.disconnect',
		consumers.disconnect_from_portfolio_channel,
		path = r'^/portfolio-channel/',
     	),


]



