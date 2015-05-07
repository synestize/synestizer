"""
Django settings for project project.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
import sys

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
PROJECT_ROOT = os.path.realpath(os.path.dirname(__file__))

sys.path.insert(0, os.path.join(BASE_DIR, "apps"))


ALLOWED_HOSTS = ['*',]

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'gunicorn',
    'sslserver',
    'djangobower',
    'sekizai',
    'compressor',
    'django_extensions',
    'tastypie',
    'synth'
    )

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    )

ROOT_URLCONF = 'project.urls'

WSGI_APPLICATION = 'project.wsgi.application'


# Internationalization
# https://docs.djangoproject.com/en/dev/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'static')
STATIC_URL = '/static/'


STATICFILES_DIRS = (
    ("sound", os.path.join(BASE_DIR, "static/sound")),
    ("img", os.path.join(BASE_DIR, "static/img")),
    ("css", os.path.join(BASE_DIR, "static/css")),
    ("fonts", os.path.join(BASE_DIR, "static/fonts")),
    ("js", os.path.join(BASE_DIR, "static/js")),
    ("webcomponents", os.path.join(BASE_DIR, "static/webcomponents"))
    )

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'djangobower.finders.BowerFinder',
    'compressor.finders.CompressorFinder',
    )

TEMPLATE_DIRS = [os.path.join(BASE_DIR, 'templates')]


TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.debug',
    'django.core.context_processors.i18n',
    'django.core.context_processors.media',
    'django.core.context_processors.static',
    'django.core.context_processors.tz',
    'django.contrib.messages.context_processors.messages',
    'sekizai.context_processors.sekizai'
    )


# Bower components
BOWER_COMPONENTS_ROOT = os.path.join(BASE_DIR, 'static')
BOWER_INSTALLED_APPS = (
    'backbone',
    'underscore',
    'polymer',
    'zurb/bower-foundation#5.5.0',
    'pubsub.js#0.1.0',
    'd3#3.5.2',
)


# Compress
'''
COMPRESS_PRECOMPILERS = (
    #('text/less', 'lessc {infile} {outfile}'),
    ('text/typescript', 'tsc {infile} --out {outfile} '),
    )
'''

# Tastypie
API_VERSION = 'v1'
TASTYPIE_ALLOW_MISSING_SLASH = True


# Load local_settings
try:
    from local_settings import *
except ImportError:
    pass
