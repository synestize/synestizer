# import settings
from tastypie import fields
from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS
from tastypie.authorization import Authorization
from synth.models import Patch, Synth

import json
from tastypie.serializers import Serializer


class JSONSerializer(Serializer):
    """using the standard json library for better unicode support,
       also note django.utils.simplejson, used in the standard Tastypie serializer,
       is set for depreciation"""

    def to_json(self, data, options=None):
        options = options or {}
        data = self.to_simple(data, options)
        return json.dumps(data)


class SynthResource(ModelResource):
    class Meta:
        queryset = Synth.objects.all()
        resource_name = 'synth/synth'
        excludes = ['publish']
        always_return_data = True
        serializer = JSONSerializer()
        authorization = Authorization()
        api_name = 'v1'  # settings.API_VERSION

        filtering = {
            'name': ALL_WITH_RELATIONS,
        }

    def dehydrate(self, bundle):
        bundle.data['preset'] = json.dumps(bundle.obj.preset)

        return bundle


class ColorModeResource(ModelResource):
    class Meta:
        queryset = Synth.objects.all()
        resource_name = 'synth/color_mode'
        excludes = ['publish']
        always_return_data = True
        serializer = JSONSerializer()
        authorization = Authorization()
        api_name = 'v1'  # settings.API_VERSION


class PatchResource(ModelResource):
    synth = fields.ManyToManyField(SynthResource, 'synth', full=True)
    color_mode = fields.ForeignKey(ColorModeResource, 'color_mode', full=True)

    class Meta:
        queryset = Patch.objects.all()
        resource_name = 'synth/patch'
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post', 'put', 'delete']
        always_return_data = True
        serializer = JSONSerializer()
        authorization = Authorization()
        api_name = 'v1'  #settings.API_VERSION


    def dehydrate(self, bundle):
        bundle.data['preset'] = json.dumps(bundle.obj.preset)

        return bundle
