# Generated by Django 5.2 on 2025-05-08 09:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_remove_sesion_notas_sesion_actividades_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='sesion',
            name='evaluacion',
            field=models.TextField(blank=True, null=True),
        ),
    ]
