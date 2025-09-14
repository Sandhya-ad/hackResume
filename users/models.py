from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    country = models.CharField(max_length=100, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    # included in AbstractUser: first_name, last_name, and email 