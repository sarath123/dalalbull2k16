from django.contrib import admin

# Register your models here.

from .models import Stock_data
from .models import Old_Stock_data
from .models import User
from .models import Portfolio
from .models import Pending
from .models import History
from .models import Transaction

admin.site.register(Stock_data)
admin.site.register(User)
admin.site.register(Old_Stock_data)
admin.site.register(Portfolio)
admin.site.register(Pending)
admin.site.register(History)
admin.site.register(Transaction)
