from django.core.serializers.json import DjangoJSONEncoder
from django.views.decorators.csrf import ensure_csrf_cookie,csrf_exempt
from django.views.decorators.cache import never_cache 
from django.http import HttpResponse,HttpResponseForbidden
from django.shortcuts import redirect,render_to_response
from dalalbull import settings
from pytz import timezone
import urllib2
import json
import datetime
import re
from .models import User
from django.template import RequestContext, loader
from .models import User,Portfolio,Stock_data,Transaction,History,Pending,Old_Stock_data
#======Index Page======#
@ensure_csrf_cookie
def index(request):
    context=RequestContext(request)
    template=loader.get_template('login/index.html')
    request.session['login']=1
    return HttpResponse(template.render(context))

#======Login======#
@ensure_csrf_cookie
def login(request):
    context=RequestContext(request)
    if(('login' in request.session) and request.session['login']==1):
        u = User(user_id=request.POST['username'], first_name=request.POST['firstname'], last_name=request.POST['lastname'], email=request.POST['email'],)
        u.save()
        try:
            p = Portfolio.objects.get(user_id=request.POST['username'])
        except Portfolio.DoesNotExist :
            p = Portfolio(user_id=request.POST['username'],net_worth=1000000.00,cash_bal=1000000.00)
            p.save()
        request.session['username'] = request.POST['username']
        request.session['dashboard']=1
        return HttpResponse('success')
    return  redirect('index')

#======Dashboard======#
@ensure_csrf_cookie
@never_cache
def dashboard(request):
    context=RequestContext(request)
    if(('dashboard' in request.session) and request.session['dashboard']==1):
        request.session['faq']=1
        request.session['buy']=1
        request.session['sell']=1
        request.session['history']=1
        request.session['pending']=1
        request.session['stockinfo']=1
        request.session['aboutus']=1
        username='None'
        net_worth = 0
        cash_bal = 0
        cash_avail = 0
        rank = 0
        total_no = 0
        margin=0
        transactions=0
        stockholdings=False
        nifty=0
        change=0
        try:
            username=User.objects.get(user_id=request.session['username']).first_name+" "+User.objects.get(user_id=request.session['username']).last_name
            portfolio = Portfolio.objects.get(user_id=request.session['username'])
            net_worth = portfolio.net_worth
            cash_bal = float(portfolio.cash_bal)
            if((portfolio.cash_bal-portfolio.margin)>0):
                cash_avail = float(cash_bal) - float(portfolio.margin)
            margin = portfolio.margin
            rank = getRank(portfolio.user_id)
            total_no = len(User.objects.all())
            transactions=portfolio.no_trans
        except Portfolio.DoesNotExist:
            print("User DoesNotExist")
        try:
            stock=Stock_data.objects.get(symbol='CNX NIFTY')
            nifty = stock.current_price
            change = stock.change
        except Stock_data.DoesNotExist:
            print("No Such Stock")
        p=Portfolio.objects.all().order_by('-net_worth')
        l=[]
        for s in p:
            u=User.objects.get(user_id=s.user_id)
            user={'user_id':s.user_id,'name': u.first_name+" "+u.last_name,'net_worth': s.net_worth}        
            l.append(user)

        if(len(Transaction.objects.filter(user_id=request.session['username']))!=0):
            stockholdings=True
        template=loader.get_template('dashboard/index.html')
        return render_to_response('dashboard/index.html',{'user_id': request.session['username'],'username' : username,'net_worth': float(net_worth),'leaderboard' : l,'rank': rank,'total_no' : total_no,'margin': float(margin),'transactions': transactions,'nifty': nifty,'change':float(change),'cash_bal':float(cash_bal),'cash_avail': float(cash_avail),'stockexist' : stockholdings,'stockholdings':getStockholdings(request.session['username']),'topGainers' : getTopGainers(),'topLosers' : getTopLosers(),'mostActiveVol' : getMostActiveVolume,'mostActiveVal' : getMostActiveValue(),})
    return  redirect('index')
    
    
#======FAQ======#
@ensure_csrf_cookie
def faq(request):                            
    if(('faq' in request.session) and request.session['faq']==1):
        username=User.objects.get(user_id=request.session['username']).first_name
        #request.session['faq']=0
        context=RequestContext(request)
        template=loader.get_template('faq/faq.html')
        return render_to_response('faq/faq.html',{'username': request.session['username'],'name' : username,})
    return  HttpResponseForbidden("Access Denied")

@ensure_csrf_cookie
def aboutus(request):                            
    if(('aboutus' in request.session) and request.session['aboutus']==1):
        username=User.objects.get(user_id=request.session['username']).first_name
        #request.session['faq']=0
        context=RequestContext(request)
        template=loader.get_template('faq/template.html')
        return render_to_response('faq/template.html',{'username': request.session['username'],'name' : username,})
    return  HttpResponseForbidden("Access Denied")
#======STOCKINFO======#
@csrf_exempt
def stockinfo(request):                            
    if(('stockinfo' in request.session) and request.session['stockinfo']==1):
        username=User.objects.get(user_id=request.session['username']).first_name
        try:
            stocks=Stock_data.objects.all()
            companies=[]
            for c in stocks:
                companies.append(c)
        except Stock_data.DoesNotExist :
            print "error"
        
        context=RequestContext(request)
        template=loader.get_template('dashboard/stockinformation.html')
        return render_to_response('dashboard/stockinformation.html',{'username': request.session['username'],'name' : username,'companies' : companies})
    return  redirect('index')
#======Company Info=====#
@csrf_exempt
def companydetails(request):
    company = request.POST['company']
    graph_data={}
    values=Stock_data.objects.get(symbol=company)
    graph_data['company']=values.symbol
    graph_data['current_price']=values.current_price
    graph_data['high']=values.high
    graph_data['low']=values.low
    graph_data['open']=values.open_price
    graph_data['change']=values.change
    graph_data['change_per']=values.change_per
    graph_data['trade_Qty']=values.trade_Qty
    graph_data['trade_Value']=values.trade_Value
    data=json.dumps(graph_data,cls=DjangoJSONEncoder)
    return HttpResponse(data,content_type="application/json")

#======Buy/Short-Sell======#
@ensure_csrf_cookie
def buy(request):                       
    if(('buy' in request.session) and request.session['buy']==1):
        context=RequestContext(request) 
        cclose=True
        now = datetime.datetime.now()
        if(now.strftime("%A")!='Sunday' and now.strftime("%A")!='Saturday'):
            start_time=datetime.time(hour=9,minute=15,second=00)
            end_time=datetime.time(hour=15,minute=30,second=00)
            now = datetime.datetime.now().time()
            if(start_time<now<end_time):
                cclose=False
        try:
            p = Portfolio.objects.get(user_id=request.session['username'])
        except Portfolio.DoesNotExist :
            print("error")
        try:
            stocks=Stock_data.objects.all()
            companies=[]
            for c in stocks:
                companies.append(c)
        except Stock_data.DoesNotExist :
            print "error"
        return render_to_response('dashboard/buy.html',{'name' : User.objects.get(user_id=request.session['username']).first_name ,'username': request.session['username'],'companies': companies ,'cclose' :True,'time' : datetime.datetime.now(),})
    return redirect('index')

#======Submit-Buy======#
@ensure_csrf_cookie
def submit_buy(request):
    quantity_invalid=False
    msg=""
    cash_bal=0
    margin=0
    data=request.POST
    if(len(data)!=0):
        qnty_test = data['quantity']
        if(not is_number(qnty_test)):
            quantity_invalid=True
        else:
            qnty_test=int(float(data['quantity']))
            if(qnty_test <= 0):
                quantity_invalid=True
        if(not quantity_invalid):
            company=data['company'] 
            if(company != "none" and company !="" ):
                quantity=qnty_test
                if (is_number(data['pending'])):
                    pending_price=float(data['pending'])
                else :
                    pending_price=""
                if (data['b_ss'] == 'Buy' or data['b_ss'] == 'Short Sell'):
                    b_ss=data['b_ss']
                else:
                    b_ss = ""   
                try :
                    stocks=Stock_data.objects.get(symbol=company)                   
                    portfolio = Portfolio.objects.get(user_id=request.session['username'])
                    old_cash_bal = float(portfolio.cash_bal)
                    current_price=float(stocks.current_price)
                    no_trans = portfolio.no_trans
                    if(no_trans+1<=100):
                            brokerage=((0.5/100)*current_price)*float(quantity) 
                    elif(no_trans+1<=1000):                     
                            brokerage=((1/100)*current_price)*float(quantity)
                    else :                      
                            brokerage=((1.5/100)*current_price)*float(quantity)
                    if(quantity_invalid or b_ss=="" or company=='CNX NIFTY'):
                        msg= "<strong>Invalid Data</strong><br><br>"
                    else :                          
                        if((pending_price!="") and current_price!=pending_price):
                                percentager = 0.05 * current_price
                                t=current_price-percentager
                                l=current_price+percentager
                                q=False
                                if(pending_price > current_price or pending_price <= t ):
                                    q=True
                                r=False
                                if(pending_price < current_price or pending_price >= l ):
                                    r=True

                                if(not is_number(pending_price) or pending_price<0):
                                    msg= "<strong>Invalid Data</strong><br><br>"                                                            
                                else:
                                    if(b_ss=='Buy' and q):
                                    	msg= "<strong>Pending Price for Buying should be less than and maximum of 5% below Current Price</strong><br><br>"
                                    else:
                                    	if(b_ss=="Short Sell" and r):
                                        	msg= "<strong>Pending Price for Short Selling should be greater than and maximum of 5% above Current Price</strong><br><br>"
                                    	else:
                                        	p=Pending(user_id=request.session['username'],symbol=company,buy_ss=b_ss,quantity=quantity,value=pending_price,time=datetime.datetime.now().time())
                                        	p.save()
                                        	msg= "<strong>You have made a Pending Order to "+b_ss+" "+str(quantity)+" shares of '"+company+"' at a Desired Price of'"+'&#8377;'+str(pending_price)+"</strong><br><br>"
                        else:
                            if(((old_cash_bal-float(portfolio.margin)-brokerage)<=0) or ((old_cash_bal-float(portfolio.margin)-brokerage)< current_price*float(quantity) and b_ss=="Buy") or (((old_cash_bal-float(portfolio.margin)-brokerage) < (current_price*float(quantity)/2)) and b_ss=="Short Sell")):
                                msg= "<strong>You do not have enough Cash Balance for this transaction</strong><br><br>"
                                return HttpResponse(msg);
                            else:
                                if(((old_cash_bal-float(portfolio.margin)-brokerage)<=0) or ((old_cash_bal-float(portfolio.margin)-brokerage)< current_price*float(quantity) and b_ss=="Buy") or (((old_cash_bal-float(portfolio.margin)-brokerage) < (current_price*float(quantity)/2)) and b_ss=="Short Sell")):
                                    msg= "<strong>You do not have enough Cash Balance for this transaction</strong><br><br>"
                                    return HttpResponse(msg)
                                try:
                                    t=Transaction.objects.get(user_id=request.session['username'],symbol=company,buy_ss=b_ss)
                                    old_quantity=float(t.quantity)
                                    old_val=float(t.value)
                                    new_val=old_val+(float(quantity)*current_price)
                                    new_quantity=old_quantity+float(quantity)
                                    t.quantity=new_quantity
                                    t.value=new_val
                                    t.buy_ss=b_ss
                                    if(b_ss=="Buy"):
                                        cash_bal=old_cash_bal-(float(quantity)*current_price)
                                        margin = float(portfolio.margin)
                                    else:
                                        cash_bal = old_cash_bal
                                        margin = float(portfolio.margin)+(float(quantity)*current_price)/2
                                    cash_bal -= brokerage
                                    no_trans+=1
                                    portfolio.cash_bal=cash_bal
                                    portfolio.margin=margin
                                    portfolio.no_trans=no_trans
                                    portfolio.save()
                                    kp=0
                                    while (kp<25):
                                    	portfolio2 = Portfolio.objects.get(user_id=request.session['username'])
                                    	if (portfolio2.cash_bal!=portfolio.cash_bal):
                                    		portfolio.save()
                                    	else:
                                    		break
                                    	kp=kp+1
                                    t.save()
                                except Transaction.DoesNotExist:
                                    new_val=float(quantity)*current_price
                                    t=Transaction(user_id=request.session['username'],symbol=company,buy_ss=b_ss,quantity=quantity,value=new_val)
                                    if(b_ss=="Buy"):
                                        cash_bal=old_cash_bal-(float(quantity)*current_price)
                                        margin = float(portfolio.margin)
                                    else:
                                        cash_bal = old_cash_bal
                                        margin = float(portfolio.margin)+(float(quantity)*current_price)/2
                                    cash_bal -= brokerage
                                    no_trans+=1
                                    portfolio.cash_bal=cash_bal
                                    portfolio.margin=margin
                                    portfolio.no_trans=no_trans
                                    portfolio.save()
                                    kp=0
                                    while (kp<25):
                                        portfolio2 = Portfolio.objects.get(user_id=request.session['username'])
                                        if (portfolio2.cash_bal!=portfolio.cash_bal):
                                            portfolio.save()
                                        else:
                                            break
                                        kp=kp+1
                                    t.save()
                                history=History(user_id=request.session['username'],time=datetime.datetime.now().time(),symbol=company,buy_ss=b_ss,quantity=quantity,price=stocks.current_price)
                                history.save()
                                if(b_ss=="Buy"):
                                    msg+= "<strong>You have successfully bought "+str(quantity)+" shares of '"+company+"' at " +'&#8377;' +str(stocks.current_price) +"  per share<br>Your Cash Balance is &#8377;"+str(portfolio.cash_bal)+"</strong>"
                                elif(b_ss=="Short Sell"):
                                    msg="<strong>You have successfully short sold "+str(quantity)+" shares of '"+company+"' at '" +'&#8377;'+str(stocks.current_price)+" per share</strong>"
                                msg = msg + "<strong><br>You have paid "+ '&#8377;'+str(brokerage)+" as brokerage for the transaction<br><br></strong>"

                except Stock_data.DoesNotExist:
                    msg= "<strong>Requested Company '"+str(company)+"' is not listed</strong><br><br>"
            else:   
                msg = "<strong>Invalid Data</strong><br><br>"
        else:
            msg= "<strong>Invalid Data</strong><br><br>"                    
    else:       
        msg= "<strong>Please enter valid data in the necessary fields</strong><br><br>"
    print msg
    return HttpResponse(msg);


#=======Sell/Short-Cover=====#
@ensure_csrf_cookie
def sell(request):                      
    if(('sell' in request.session) and request.session['sell']==1):
        #request.session['sell']=0
        context=RequestContext(request) 
        cclose=True
        no_stock=False
        transactions=[]
        data={}
        data_array={}
        d=[]
        k=0
        now = datetime.datetime.now()
        if(now.strftime("%A")!='Sunday' and now.strftime("%A")!='Saturday'):
            start_time=datetime.time(hour=9,minute=15,second=00)
            end_time=datetime.time(hour=15,minute=30,second=00)
            now = datetime.datetime.now().time()
            if(start_time<now<end_time):
                cclose=False
        try:
            t = Transaction.objects.filter(user_id=request.session['username'])
            for i in t:
                temp={}
                data={}
                temp['tr']=""
                temp['old_quantity']=float(i.quantity)
                temp['old_value']=float(i.value)
                temp['buy_ss']=i.buy_ss
                temp['symbol']=i.symbol
                if(i.buy_ss=='Buy'):
                    temp['id']='Buy'
                else:
                    temp['id']='Short'
                temp['tr']= temp['tr']+"<tr id="+str(temp['symbol'])+str(temp['id'])+"><td>"+str(temp['symbol'])+"</td><td>"+str(temp['buy_ss'])+"</td><td>"+str(temp['old_quantity'])+"</td><td>"
                try:
                    s=Stock_data.objects.get(symbol=temp['symbol'])
                    temp['tr']+=(str(s.current_price)+'</td>')
                except Stock_data.DoesNotExist:
                    temp['tr']+='Not Listed'
                if(temp['buy_ss']=='Buy'):
                    temp['profit']=float(s.current_price)-(temp['old_value']/temp['old_quantity'])
                else:
                    temp['profit']=(temp['old_value']/temp['old_quantity'])-float(s.current_price)
                temp['prof_per']=(temp['profit']/(temp['old_value']/temp['old_quantity']))*100
                if(temp['prof_per']>0):
                    temp['clrclss']='uptrend'
                elif(temp['prof_per']<0):
                    temp['clrclss']='dwntrend'
                else:
                    temp['clrclss']=''
                temp['tr']+=('<td class='+str(temp['clrclss'])+'>'+str(temp['prof_per'])+'</td>')
                if(temp['buy_ss']=='Buy'):
                    temp['disp']='Sell'
                else:
                    temp['disp']='Short Cover'
                temp['tr'] =temp['tr']+"<td><form id=\"s_sc"+str(k)+"\"name=\"s_sc\" action=\"\" method=\"POST\" style=\"margin-top:0px;\"><input type=\"hidden\" name=\"company\" value=\""+str(temp['symbol'])+"\"><input type=\"number\"  name=\"quantity\" value=\"\" placeholder=\"No of Shares to trade\" title=\"Integer less than or equal to Shares in hand\" style=\"width : 80%;\" class=\"s2 m2 l2 min=\"0\"\"><br><input id=\"pending\" type=\"number\" class=\"pull-right min=\"0\" \" name=\"pending\" placeholder=\"Pending price\" title=\"Leave blank if not making a pending order\" style=\"width : 80%;\" class=\"s12 m12 l2\"><input type=\"hidden\" name=\"tradeType\" value=\""+str(temp['disp'])+"\"><br><br><input id=\"submit_sc"+str(k)+"\" type=\"button\" class=\"button btn btn-orange \" name=\"submit_sc\" value=\""+str(temp['disp'])+"\" style=\"width : 80%;\"></td></form></tr>"
                data['symbol']=temp['symbol']
                data['buy_ss']=temp['buy_ss']
                data['old_quantity']=temp['old_quantity']
                data['old_value']=temp['old_value']
                data_array[k]=data
                transactions.append(temp)
                k+=1    
            data_array['size']=k
            symbols=False
            if(len(transactions)>0):
                symbols = True
            else:
                no_stock=True
            d=json.dumps(data_array,cls=DjangoJSONEncoder)
        except Transaction.DoesNotExist:
            no_stock=True 

        return render_to_response('dashboard/sell.html',{'name' : User.objects.get(user_id=request.session['username']).first_name ,'username': request.session['username'],'cclose' : True,'time' : datetime.datetime.now(),'no_stock': no_stock,'trans':transactions,'symbols' : symbols,'data' : d,})
    return redirect('index')


#======Submit-Sell======#
@ensure_csrf_cookie
def submit_sell(request):
    msg=""
    transactions=[]
    data=request.POST
    data_array={}
    d=[]
    dat={}
    quantity_invalid=False
    pp_invalid = False
    retDat=[]
    k=0
    print(str(data['quantity']))
    if(len(data)!=0):
        qnty_test = data['quantity']
        if(not is_number(qnty_test)):
            quantity_invalid=True
        else:
            qnty_test=int(data['quantity'])
            if(qnty_test < 0):
                quantity_invalid=True
        if(not quantity_invalid):
            company=data['company']
            quantity=float(data['quantity'])
            pending_price=data['pending']
            s_sc=data['tradeType']
            if(not is_number(pending_price)):
                pp_invalid=True
            else:
                pending_price=int(data['pending'])
                if(pending_price < 0):
                    pp_invalid=True
            if(s_sc=="Sell"):
                b_ss="Buy"
            else:
                b_ss="Short Sell"

            try:
                s = Stock_data.objects.get(symbol=company)
                current_price=float(s.current_price)
                try:
                    t = Transaction.objects.get(user_id=request.session['username'],symbol=company,buy_ss=b_ss)
                    old_quantity=float(t.quantity)          
                    if(quantity_invalid):
                        msg = "<strong>Invalid Data</strong><br><br>"
                    elif(pending_price!="" and current_price!=pending_price):
                        if(pp_invalid):
                            msg = "<strong>Invalid Data</strong><br><br>"
                        elif (s_sc=="Short Cover" and pending_price>current_price):
                            msg = "<strong>Pending Price for Short Covering should be less than Current Price</strong><br><br>"
                        elif (s_sc=="Sell" and pending_price<current_price):
                            msg = "<strong>Pending Price for Selling should be greater than Current Price</strong><br><br>"
                        else:
                            p=Pending(user_id=request.session['username'],symbol=company,quantity=quantity,value=pending_price,buy_ss=s_sc)
                            p.save()
                            msg = "<strong>You have made a pending order to "+str(s_sc)+" "+str(quantity)+" shares of "+str(company)+" at a desired price of"+'&#8377;'+str(pending_price)+"</strong><br><br>"
                    elif(quantity>old_quantity):
                        msg = "<strong>You do not own enough number of shares of the requested Company for this transaction</strong><br><br>"
                    else:
                        old_val=float(t.value)
                        new_quantity=old_quantity-quantity
                        old_total=(old_val/old_quantity)*quantity
                        new_val=old_val-old_total
                        if(new_quantity==0):
                            del_t = Transaction.objects.get(user_id=request.session['username'],symbol=company,buy_ss=b_ss)
                            del_t.delete()
                        else:
                            upd_t=Transaction.objects.get(user_id=request.session['username'],symbol=company,buy_ss=b_ss)
                            upd_t.quantity=new_quantity
                            upd_t.value=new_val
                            upd_t.save()
                        
                        pf= Portfolio.objects.get(user_id=request.session['username'])
                        margin=float(pf.margin)
                        if(s_sc=="Short Cover"):
                            sc_profit=old_total-(quantity*current_price)
                            cash_bal=float(pf.cash_bal)+sc_profit
                            margin=(margin-(old_val/2))+(new_val/2)
                        elif(s_sc=="Sell"):
                            cash_bal=float(pf.cash_bal)+(quantity*current_price)
                        
                        no_trans=pf.no_trans+1; 
                        if(no_trans<=100):
                            brokerage=((0.5/100)*current_price)*quantity;
                        elif(no_trans<=1000):
                            brokerage=((1/100)*current_price)*quantity;
                        else:
                            brokerage=((1.5/100)*current_price)*quantity;
                        cash_bal=cash_bal-brokerage
                        pf.cash_bal=cash_bal
                        pf.margin=margin
                        pf.no_trans=no_trans
                        pf.save()
                        kp=0
                        while (kp<25):
                            portfolio2 = Portfolio.objects.get(user_id=request.session['username'])
                            if (portfolio2.cash_bal!=pf.cash_bal):
                                pf.save()
                            else:
                               break
                            kp=kp+1
                        now = datetime.datetime.now().time                      
                        h=History(user_id=request.session['username'],time=now,symbol=company,buy_ss=s_sc,quantity=quantity,price=s.current_price)
                        h.save()
                        try:
                            pend=Pending.objects.get(user_id=request.session['username'],symbol=company,buy_ss=s_sc)
                            if(new_quantity == 0):
                                pend.delete()
                            elif(pend.quantity>new_quantity):
                                pend.quantity=new_quantity
                                pend.save()
                        except Pending.DoesNotExist:
                            print("error in Pending")
                        if(s_sc=="Sell"):
                            msg = "<strong>You have successfully sold "+str(quantity)+" shares of "+str(company)+"at"+'&#8377;'+str(s.current_price)+" per share<strong>"
                        else:
                            msg = "<strong>You have successfully short covered "+str(quantity)+" shares of '"+str(company)+" at "+'&#8377;'+str(s.current_price)+" per share"
                except Transaction.DoesNotExist:
                    msg="error"             
            except Stock_data.DoesNotExist:
                msg = "<strong>Requested Company '"+str(company)+"' is not listed</strong><br><br>";
        else:
            msg = "<strong>Please enter valid data</strong><br><br>"                
                        
    try:
        trow=""
        t = Transaction.objects.filter(user_id=request.session['username'])
        table = "<div class='table-responsive'><table class='table table-striped'><thead><tr><th>Company</th><th>Type of Trade</th><th>Shares in Hand</th>      <th>Current Price ("+'&#8377;'+")</th><th>Gain % per Share</th><th>Trade <span style=\"font-size:12px;\">(Use Pending Price to make a Pending Order)</span></th></tr></thead><tbody>"
                    
        for i in t:
            temp={}
            temp['old_quantity']=float(i.quantity)
            temp['old_value']=float(i.value)
            temp['buy_ss']=i.buy_ss
            temp['symbol']=i.symbol
            if(i.buy_ss=='Buy'):
                temp['id']='Buy'
            else:
                temp['id']='Short'
            temp['tr'] = '<tr id='+temp['symbol']+temp['id']+'><td>'+temp['symbol']+'</td><td>'+temp['buy_ss']+'</td><td>'+str(temp['old_quantity'])+'</td><td>'
            try:
                s=Stock_data.objects.get(symbol=temp['symbol'])
                temp['tr']+=(str(s.current_price)+'</td>')
            except Stock_data.DoesNotExist:
                temp['tr']+='Not Listed'
            if(temp['buy_ss']=='Buy'):
                temp['profit']=float(s.current_price)-(temp['old_value']/temp['old_quantity'])
            else:
                temp['profit']=(temp['old_value']/temp['old_quantity'])-float(s.current_price)
            temp['prof_per']=(temp['profit']/(temp['old_value']/temp['old_quantity']))*100
            if(temp['prof_per']>0):
                temp['clrclss']='uptrend'
            elif(temp['prof_per']<0):
                temp['clrclss']='dwntrend'
            else:
                temp['clrclss']=''
            temp['tr']+=('<td class='+temp['clrclss']+'>'+str(temp['prof_per'])+'</td>')
            if(temp['buy_ss']=='Buy'):
                temp['disp']='Sell'
            else:
                temp['disp']='Short Cover'
            temp['tr'] = temp['tr']+"<td><form id=\"s_sc"+str(k)+"\"name=\"s_sc\" action=\"\" method=\"POST\" style=\"margin-top:0px;\"><input type=\"hidden\" name=\"company\" value=\""+temp['symbol']+"\"><input type=\"text\"  name=\"quantity\" value=\"\" placeholder=\"No+ of Shares to trade\" title=\"Interger less than or equal to Shares in hand+\" style=\"width:48%;float:left;\"><input id=\"pending\" type=\"text\" class=\"pull-right\" name=\"pending\" placeholder=\"Pending price\" title=\"Leave blank if not making a pending order+\"style=\"width:48%;float:left;\"><input type=\"hidden\" name=\"tradeType\" value=\""+temp['disp']+"\"><br><br><input id=\"submit_sc\""+str(k)+"\" type=\"button\" class=\"waves-effect waves-light btn yellow sellbutton\" name=\"submit_sc\" value=\""+temp['disp']+"\"></td></form></tr>"
            trow = trow+temp['tr']
            print trow
            dat['symbol']=temp['symbol']
            dat['buy_ss']=temp['buy_ss']
            dat['old_quantiy']=temp['old_quantity']
            dat['old_value']=temp['old_value']
            transactions.append(temp)
            data_array[k]=dat
            k+=1
            
        data_array['size']=k
        trow= trow+"</tbody></table></div>"
        table=table+trow
        if(not len(t)>0):
            table="<center><h4 class='dark'>You have no Stock Holdings to sell</h4></center>"   
        retDat.append(msg)
        retDat.append(table)
        retDat.append(data_array)
        print table
        d=json.dumps(retDat,cls=DjangoJSONEncoder)
    except Transaction.DoesNotExist:
        print d
    
    
    return HttpResponse(d,content_type="application/json")

#=======Sell-Trend Giver===#
def sell_trend(request):
    l={}
    l=request.POST
    d2=[]
    k=0
    while(k < int(l['symbols[size]'])):
        d1=[]
        try:
            sym='symbols['+str(k)+'][symbol]'
            buy='symbols['+str(k)+'][buy_ss]'
            oldq='symbols['+str(k)+'][old_quantity]'
            oldv='symbols['+str(k)+'][old_value]'           
            c=Stock_data.objects.get(symbol=l[sym]).current_price
            d1.append(l[sym])
            d1.append(c)
            d1.append(l[buy])
            d1.append(l[oldq])
            d1.append(l[oldv])
            d2.append(d1)
            print c
            k+=1
        except Stock_data.DoesNotExist:
            x=3
    s=json.dumps(d2,cls=DjangoJSONEncoder)
    return HttpResponse(s,content_type="application/json")

#=======Cancel Pending Orders=====#
@ensure_csrf_cookie
def pending(request):                       
    if(('pending' in request.session) and request.session['pending']==1):
        #request.session['sell']=0
        context=RequestContext(request) 
        cclose=True
        no_stock=False
        k=0
        now = datetime.datetime.now()
        if(now.strftime("%A")!='Sunday' and now.strftime("%A")!='Saturday'):
            start_time=datetime.time(hour=9,minute=15,second=00)
            end_time=datetime.time(hour=15,minute=30,second=00)
            now = datetime.datetime.now().time()
            if(start_time<now<end_time):
                cclose=False
        try:
            t = Pending.objects.filter(user_id=request.session['username'])
            row=[]
            for i in t:
                temp={}
                temp['quantity']=float(i.quantity)
                temp['value']=float(i.value)
                temp['type']=i.buy_ss
                temp['symbol']=i.symbol
                try:
                    s=Stock_data.objects.get(symbol=temp['symbol'])
                    temp['current_price']=(str(s.current_price))
                except Stock_data.DoesNotExist:
                    temp['current_price']='Not Listed'
                temp['number']=k
                temp['id']=i.id
                row.append(temp)
                k+=1    
            if(len(t)>0):
                symbols = True
            else:
                no_stock=True
        except Pending.DoesNotExist:
            no_stock=True 

        return render_to_response('dashboard/pending.html',{'name' : User.objects.get(user_id=request.session['username']).first_name ,'username': request.session['username'],'cclose' : cclose,'time' : datetime.datetime.now(),'no_pending': True,'pending':row,})
    return redirect('index')

#=======Cancels========#
@csrf_exempt
def cancels(request):
    iddel=request.POST['iddel']
    company=request.POST['company']
    quantity=request.POST['quantity']
    username=request.session['username']
    price=request.POST['price']
    trdtype=request.POST['type']
    msg=""
    if(iddel!="" and company !="" and quantity !="" and price !="" and trdtype !=""):
        try:
            p=Pending.objects.get(user_id=username,id=iddel,symbol=company,buy_ss=trdtype,quantity=quantity,value=price)
            msg="<strong>Specified pending order has been cancelled </strong>"
            p.delete()
        except Pending.DoesNotExist:
            msg="Error Cancelling"
    else:
        msg="Invalid Data"
    d=json.dumps(msg,cls=DjangoJSONEncoder)
    return HttpResponse(d,content_type="application/json")
#=======Leaderboard========#
@csrf_exempt
def leaderboard(request):
    p=Portfolio.objects.all().order_by('-net_worth')
    i=1
    l=[]
    for t in p:
        u=User.objects.get(user_id=t.user_id)
        user={'user_id':t.user_id,'name': u.first_name + " "+ u.last_name,'net_worth': float(t.net_worth)}      
        l.append(user);
        i+=1
    data=json.dumps(l,cls=DjangoJSONEncoder)        
    return HttpResponse(data,content_type="application/json")

#=======History========#
def history(request):
    notrans=False
    hf = []
    if(('history' in request.session) and request.session['history']==1):
        username=request.session['username']
        hist=History.objects.filter(user_id=username)
        if(len(hist)==0):
            notrans=True
        else:
            k=1
            for i in hist :
                h = {}
                h['ordnum']=k
                h['values']=i
                h['total']=float(i.quantity) * float(i.price) 
                k+=1
                hf.append(h)
        return render_to_response('dashboard/history.html',{'name': User.objects.get(user_id=username).first_name,'username': username,'notrans' : True,'history' : hf,})
    return redirect('index')
#======To Get Nifty Current Price======#

@csrf_exempt
def nifty(request):

    data=[] 
    dat=[]
    try:
        nifty=Stock_data.objects.get(symbol='CNX NIFTY')
        data.append(nifty.current_price)
        data.append(nifty.change)
        dat=json.dumps(data,cls=DjangoJSONEncoder)
    except Stock_data.DoesNotExist:
        print("No Such Stock")
    return HttpResponse(dat,content_type="application/json")
@csrf_exempt    
def portfolio(request):
    data=[]
    dat=[]
    try:
        user=Portfolio.objects.get(user_id=request.POST['user_id'])
        total_no=len(User.objects.all())
        data.append(user.cash_bal)
        data.append(user.net_worth)
        data.append(user.margin)
        data.append(total_no)
        data.append(getRank(request.POST['user_id']))
        data.append(user.user_id)
        dat=json.dumps(data,cls=DjangoJSONEncoder)
    except Portfolio.DoesNotExist:
        print("User Not Found")
    return HttpResponse(dat,content_type="application/json")

@csrf_exempt
def unified(request):
    data={}
    dat=[]
    try:
        u=User.objects.get(email=request.POST['email'])
        user=Portfolio.objects.get(user_id=u.user_id)
        total_no=len(User.objects.all())
        data['cash_bal']=user.cash_bal
        data['net_worth']=user.net_worth
        data['margin']=user.margin
        data['total_no']=total_no
        data['rank']=getRank(user.user_id)
        data['fbuser_id']=user.user_id
        dat=json.dumps(data,cls=DjangoJSONEncoder)
    except Portfolio.DoesNotExist:
        print("User Not Found")
    return HttpResponse(dat,content_type="application/json")

#======To Get Current Price======#
def currPrice(request):
    username=request.session['username']

    msg=""
    data=[] 
    comp =request.POST['comp']
    curr_price=Stock_data.objects.get(symbol=comp).current_price
    cash_bal=Portfolio.objects.get(user_id=username).cash_bal
    margin=Portfolio.objects.get(user_id=username).margin
    no_trans=Portfolio.objects.get(user_id=username).no_trans
    data.append(curr_price)
    data.append(cash_bal)
    data.append(margin)
    data.append(no_trans)
    dat=json.dumps(data,cls=DjangoJSONEncoder)
    return HttpResponse(dat,content_type="application/json")
#======Graph======#
@csrf_exempt
def graph(request):
    company = request.POST['company']
    graph_values=Old_Stock_data.objects.filter(symbol=company).order_by('time')
    graph_data=[]
    for i in graph_values:
        temp=[]
        timez=timezone(settings.TIME_ZONE)
        time=i.time.astimezone(timez)
        print time
        temp.append([time.hour,time.minute,time.second])
        temp.append(i.current_price)
        graph_data.append(temp)
    data=json.dumps(graph_data,cls=DjangoJSONEncoder)
    return HttpResponse(data,content_type="application/json")
    
    
#==========Utility Functions========#
def getStockholdings(user_id):
    stockholdings=[]
    transactions=Transaction.objects.filter(user_id=user_id)
    for i in transactions:
        stock={}
        stock['company']=i.symbol
        stock['number']=i.quantity
        stock['type']=i.buy_ss
        stock['purchase']=(float(i.value))/(float(i.quantity))
        stock['current']=float(Stock_data.objects.get(symbol=i.symbol).current_price)
        stockholdings.append(stock)
    return stockholdings

def getTopGainers():
    gainers=[]
    t=Stock_data.objects.all().order_by('-change_per')
    k=0
    for i in t:
        if(k<5):
            if(i.symbol!='CNX NIFTY'):
                gainers.append(i)
                k+=1
        else:
            break
    return gainers
def getTopLosers():
    losers=[]
    t=Stock_data.objects.all().order_by('change_per')
    k=0
    for i in t:
        if(k<5):
            if(i.symbol!='CNX NIFTY'):
                losers.append(i)
                k+=1
        else:
            break
    return losers
def getMostActiveVolume():
    active=[]
    t=Stock_data.objects.all().order_by('-trade_Qty')
    k=0
    for i in t:
        if(k<5):
            if(i.symbol!='CNX NIFTY'):
                active.append(i)
                k+=1
        else:
            break
    return active
def getMostActiveValue():
    active=[]
    t=Stock_data.objects.all().order_by('-trade_Value')
    k=0
    for i in t:
        if(k<5):
            if(i.symbol!='CNX NIFTY'):
                active.append(i)
                k+=1
        else:
            break
    return active
def getRank(user_id):
    p=Portfolio.objects.all().order_by('-net_worth')
    i=1
    for t in p:
        if(t.user_id==user_id):
            return i
        i+=1
    return 0
#=======Number=======#
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False        
