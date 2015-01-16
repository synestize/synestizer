from django.views.generic import DetailView
from django.shortcuts import get_object_or_404
from .models import Patch


class PatchDetailView(DetailView):
    model = Patch

    def get_object(self):
        return get_object_or_404(Patch, pk=1)
