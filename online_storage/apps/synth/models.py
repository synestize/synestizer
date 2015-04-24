from django.db import models
from django.utils.translation import ugettext as _
from django.utils.timezone import now
from uuidfield import UUIDField
from jsonfield import JSONField


class Base(models.Model):
    uuid = UUIDField(auto=True)
    publish = models.DateTimeField(_('publish'), default=now)
    created = models.DateTimeField(_('created'), auto_now_add=True)
    modified = models.DateTimeField(_('modified'), auto_now=True)

    class Meta:
        abstract = True
        ordering = ('-publish',)
        get_latest_by = 'publish'


"""
synth = Synth.objects.get(pk=1)
synth = Synth.objects.filter(settings__frequency__lte=8000)
settings = synth.settings.filter(key='frequency')
"""


class Synth(Base):
    """Synth model."""
    name = models.CharField(_('name'), unique=True, max_length=100)
    slug = models.SlugField(_('slug'), unique=True)

    preset = JSONField(blank=True, null=True)

    def __unicode__(self):
        return u'%s' % self.name

    class Meta:
        verbose_name = _('synth')
        verbose_name_plural = _('synths')


class ColorMode(Base):
    """Color settings model."""
    name = models.CharField(_('name'), unique=True, max_length=100)
    slug = models.SlugField(_('slug'), unique=True)

    settings = JSONField(blank=True, null=True)

    def __unicode__(self):
        return u'%s' % self.name

    class Meta:
        verbose_name = _('color mode')
        verbose_name_plural = _('color modes')


class Patch(Base):
    """Patch model."""
    synth = models.ManyToManyField(Synth, null=True)
    color_mode = models.ForeignKey(ColorMode, null=True)
    preset = JSONField()

    class Meta:
        verbose_name = _('patch')
        verbose_name_plural = _('patches')

    def __unicode__(self):
        return u'%s' % self.uuid

    def get_api_url(self):
        return '/api/synth/patch/%s/' % self.pk

'''
    @models.permalink
    def get_absolute_url(self):
        return 'post_detail', (), {'slug': self.slug}


    def get_previous_post(self):
        return self.get_previous_by_publish(status__gte=2)

    def get_next_post(self):
        return self.get_next_by_publish(status__gte=2)
'''
