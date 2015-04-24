# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import jsonfield.fields
import django.utils.timezone
import uuidfield.fields


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='ColorMode',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', uuidfield.fields.UUIDField(unique=True, max_length=32, editable=False, blank=True)),
                ('publish', models.DateTimeField(default=django.utils.timezone.now, verbose_name='publish')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(unique=True, max_length=100, verbose_name='name')),
                ('slug', models.SlugField(unique=True, verbose_name='slug')),
                ('settings', jsonfield.fields.JSONField(null=True, blank=True)),
            ],
            options={
                'verbose_name': 'color mode',
                'verbose_name_plural': 'color modes',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Patch',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', uuidfield.fields.UUIDField(unique=True, max_length=32, editable=False, blank=True)),
                ('publish', models.DateTimeField(default=django.utils.timezone.now, verbose_name='publish')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('data', jsonfield.fields.JSONField()),
                ('color_mode', models.ForeignKey(to='synth.ColorMode', null=True)),
            ],
            options={
                'verbose_name': 'patch',
                'verbose_name_plural': 'patches',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Synth',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('uuid', uuidfield.fields.UUIDField(unique=True, max_length=32, editable=False, blank=True)),
                ('publish', models.DateTimeField(default=django.utils.timezone.now, verbose_name='publish')),
                ('created', models.DateTimeField(auto_now_add=True, verbose_name='created')),
                ('modified', models.DateTimeField(auto_now=True, verbose_name='modified')),
                ('name', models.CharField(unique=True, max_length=100, verbose_name='name')),
                ('slug', models.SlugField(unique=True, verbose_name='slug')),
                ('settings', jsonfield.fields.JSONField(null=True, blank=True)),
            ],
            options={
                'verbose_name': 'synth',
                'verbose_name_plural': 'synths',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='patch',
            name='synth',
            field=models.ManyToManyField(to='synth.Synth', null=True),
            preserve_default=True,
        ),
    ]
