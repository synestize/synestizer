import settings
from django.conf.urls import patterns, include
from django.contrib import admin
from tastypie.api import Api
from synth.api import ColorModeResource, SynthResource, PatchResource


admin.autodiscover()

v1_api = Api(api_name=settings.API_VERSION)     # settings.API_VERSION = 'v1'
v1_api.register(ColorModeResource())
v1_api.register(SynthResource())
v1_api.register(PatchResource())

urlpatterns = patterns(
    '',
    (r'^', include('synth.urls')),
    (r'^synth/', include('synth.urls')),
    (r'^api/', include(v1_api.urls)),
    (r'^admin/', include(admin.site.urls)),
)
