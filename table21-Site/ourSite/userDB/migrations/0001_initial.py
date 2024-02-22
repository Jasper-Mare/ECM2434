# Generated by Django 5.0.2 on 2024-02-19 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=20)),
                ('password_hash', models.CharField(max_length=32)),
                ('accessLevel', models.CharField(max_length=11)),
                ('recovery_email', models.CharField(max_length=128)),
                ('score', models.IntegerField()),
            ],
        ),
    ]