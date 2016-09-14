from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^login$', views.login, name='login'),
	url(r'^dashboard$', views.dashboard, name='dashboard'),
	url(r'^faq$', views.faq, name='faq'),	
	url(r'^buy$', views.buy, name='buy'),
	url(r'^sell$', views.sell, name='sell'),	
	url(r'^pending$', views.pending, name='pending'),	
	url(r'^cancels$', views.cancels, name='cancels'),	
	url(r'^submit_buy$', views.submit_buy, name='submit'),
	url(r'^submit_sell$', views.submit_sell, name='submit'),				
	url(r'^currPrice$', views.currPrice, name='currentPrice'),		
	#url(r'^leaderboard$', views.leaderboard, name='leaderboard'),		
	url(r'^sell_trend$', views.sell_trend, name='sell_trend'),				
	url(r'^history$', views.history, name='history'),				
	#url(r'^nifty$', views.nifty, name='nifty'),		
	#url(r'^graph$', views.graph, name='graph'),		
	#url(r'^portfolio$', views.portfolio, name='portfolio'),		
	url(r'^unified$', views.unified, name='unified'),		
	url(r'^stockinfo$', views.stockinfo, name='stockinfo'),		
	url(r'^companydetails$', views.companydetails, name='companydetails'),		
	url(r'^aboutus$', views.aboutus, name='aboutus'),	


	url(r'^channels$', views.testChannels, name='aboutus'),	
]
