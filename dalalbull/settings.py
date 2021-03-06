"""
Django settings for dalalbull project.

Generated by 'django-admin startproject' using Django 1.8.2.

For more information on this file, see
https://docs.djangoproject.com/en/1.8/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.8/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'c31j8&u68$67gto@rk-!wb%tg=hisyv88l%54asz0bw*zn(jt!'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'login',
    'djcelery',
    'kombu.transport.django',
    'channels'
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
)

ROOT_URLCONF = 'dalalbull.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'dalalbull.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'dalalbull',
        'USER': 'username' ,
        'PASSWORD': 'password',
        #'HOST': '',                      # Empty for localhost through domain sockets or           '127.0.0.1' for localhost through TCP.
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Asia/Kolkata'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = '/static/'

## Broker settings.
BROKER_URL = 'amqp://admin:dalalbull@localhost:5672//'

# List of modules to import when celery starts.
CELERY_IMPORTS = ('login.tasks', )

## Using the database to store task state and results.
CELERY_RESULT_BACKEND = 'db+sqlite:///results.db'

CELERY_ANNOTATIONS = {'tasks.tq': {'rate_limit': '10/s'},
                    'tasks.dq': {'rate_limit': '10/s'},
                    'task.broadcastNiftyData': {'rate_limit': '1/s'}
                    }

from datetime import timedelta


CELERYBEAT_SCHEDULE = {
    'net-every-20-seconds': {
            'task': 'login.tasks.net',
            'schedule': timedelta(seconds=20),
            'args': ()
     },
    'dq-every-3-seconds': {
            'task': 'login.tasks.dq',
            'schedule': timedelta(seconds=3),
            'args': ()
     },
    'tq-every-2-seconds': {
            'task': 'login.tasks.tq',
            'schedule': timedelta(seconds=2), ##2
            'args': ()
     },
     'broadcastNiftyData-every-2-seconds': {
            'task': 'login.tasks.broadcastNiftyData',
            'schedule': timedelta(seconds=2),
            'args': ()
     },
     'broadcastLeaderboardData-every-5-seconds': {
            'task': 'login.tasks.broadcastLeaderboardData',
            'schedule': timedelta(seconds=5),
            'args': ()
     },
     'broadcastGraphData-every-5-seconds': {
            'task': 'login.tasks.broadcastGraphData',
            'schedule': timedelta(seconds=5),
            'args': ()
     },
     'broadcastPortfolioData-every-2-seconds': {
            'task': 'login.tasks.broadcastPortfolioData',
            'schedule': timedelta(seconds=2),
            'args': ()
     },
}










# ================  CHANNELS SETTINGS ================ #


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "asgi_redis.RedisChannelLayer",
        "CONFIG": {
            "hosts": [os.environ.get('REDIS_URL', 'redis://localhost:6379')],
        },
        "ROUTING": "login.routing.channel_routing",
    },
}


# ==================================================== #

'''

CELERYBEAT_SCHEDULE = {
    'net-every-20second': {
            'task': 'login.tasks.net',
            'schedule': timedelta(seconds=20),
            'args': ()
     },
    'dq-every-5second': {
            'task': 'login.tasks.dq',
            'schedule': timedelta(seconds=300),
            'args': ()
     },
        'tq-every-second': {
            'task': 'login.tasks.tq',
            'schedule': timedelta(seconds=1),
            'args': ()
     },
}
'''
