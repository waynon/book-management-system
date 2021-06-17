from django.db import models


class User(models.Model):
    username = models.CharField(max_length=32)
    password = models.CharField(max_length=32)

    def __str__(self):
        return self.username


class Book(models.Model):
    name = models.CharField(max_length=64)
    price = models.FloatField()
