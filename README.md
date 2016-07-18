Reference links are provided in links.txt and python requirements are available in requirements.txt

Basic Requirements:
	
	1.Python v2.7
	2.pip - Python Package Manager
	3.virtualenv
	4.Rabbitmq server (for celery)
	5.nodejs (Optional) 

Setup Procedure :
	
	1.Create virtual environment for python using the command 'virtualenv venv' in the root directory of the project i.e : Dalalbull

	2.Activate the virtual env using the command 'source venv/bin/activate'

	3.Install python requirements using the command 'pip install -r requirements.txt' (Ensure requirements.txt is present)

	4.Run  sudo apt-get install rabbitmq-server to install Rabbitmq. Then configure rabbitmq as said in this link

	http://docs.celeryproject.org/en/latest/getting-started/brokers/rabbitmq.html

	use admin as username
	use dalalbull as password
	don't add vhost
	use / as vhost for set_permissions

	5.Create MySQL database 'dalalbull'

	6.Open Dalalbull/dalalbull/dalalbull/settings.py and edit the database settings.

	7.Navigate to Dalalbull/dalalbull/ run command 'python manage.py migrate' to sync database

	8.Change url in Dalalbull/dalalbull/login/static/js/graph.js accordingly.		

	9.Change url in Dalalbull/dalalbull/login/static/js/graphgoogle.js accordingly.

	10.Change url in Dalalbull/dalalbull/login/static/js/leaderboard.js accordingly.	

	11.Change url in Dalalbull/dalalbull/login/static/js/portfolio.js accordingly.

	12.Change url in Dalalbull/dalalbull/login/templates/dashboard/index.html accordingly.

	13.Change url in Dalalbull/dalalbull/login/templates/dashboard/stockinformation.html accordingly.

	14.Edit the templates for sell,buy,dashboard etc. with appropriate messages and also the views.py file in login app to change 
	'cclose:True'  to 'cclose:cclose' in the render_to_response().
	
	15.Please verify the current list of NIFTY50 companies and modify tasks.py accordingly.
	
	16.Run TaskQueue celery(to update the stockdata and networth) using this command
		python manage.py celery -A dalalbull worker --concurrency=1

	   Note that the value of concurrency is important to avoid multiple workers updating the same row at the same time.
	
	17.Run development server using command 'python manage.py runserver' .


Suggested Upgrades :
	
	1.Remove nodejs entirely (used for sockets) and replace with Django Channels API.

										OR

	  Remove nodejs entirely and replace with simple AJAX calls (Not Efficient though).