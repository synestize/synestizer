from django.contrib import admin

from .models import Synth, ColorMode, Patch


admin.site.register(Synth)
admin.site.register(ColorMode)
admin.site.register(Patch)

