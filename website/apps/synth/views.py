from django.views.generic import DetailView, ListView
from django.shortcuts import render_to_response
from django.template import RequestContext

from .models import Synth, Patch


class SynthListView(ListView):
    model = Synth
    pass


class SynthDetailView(DetailView):
    model = Synth
    pass


class PatchDetailView(DetailView):
    model = Patch



def index(request):
    return render_to_response('synth/index.html', {}, context_instance=RequestContext(request))

