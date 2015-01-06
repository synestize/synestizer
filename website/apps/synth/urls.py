from django.conf.urls import patterns, url
from .views import SynthDetailView, SynthListView, PatchDetailView

urlpatterns = patterns('',
                       #url(r'^synths/$', SynthListView.as_view(), name='synth_list'),
                       #url(r'^(?P<pk>\d+)/$', SynthDetailView.as_view(), name='synth_detail'),
                       #url(r'^patches/$', PatchListView.as_view(), name='patch_list'),
                       url(r'^patch/(?P<pk>\d+)/$', PatchDetailView.as_view(), name='patch_detail'),
                       )
