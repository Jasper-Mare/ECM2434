# Generated by Django 5.0.2 on 2024-02-19 12:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('userDB', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='user',
            old_name='accessLevel',
            new_name='access_level',
        ),
    ]
