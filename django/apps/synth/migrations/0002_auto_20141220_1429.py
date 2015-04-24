# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('synth', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='patch',
            old_name='data',
            new_name='preset',
        ),
        migrations.RenameField(
            model_name='synth',
            old_name='settings',
            new_name='preset',
        ),
    ]
