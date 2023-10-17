from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    currency = models.CharField(max_length=5,blank=True)

class Data(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="data")
    name = models.CharField(max_length=100)
    amount = models.IntegerField()

    def __str__(self):
        return f"{self.user} {self.name}: {self.amount}"