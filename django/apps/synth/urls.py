from django.conf.urls import patterns, url
from .views import PatchDetailView

urlpatterns = patterns(
    'synth.views',
    url(r'^$', PatchDetailView.as_view(), name='patch_detail'),
    url(r'^patch/(?P<pk>\d+)/$', PatchDetailView.as_view(), name='patch_detail')
)
