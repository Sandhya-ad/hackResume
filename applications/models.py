from django.db import models

# job application model
class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("applied", "Applied"),
        ("interview", "Interview"),
        ("offer", "Offer"),
        ("rejected", "Rejected"),
    ]

    company_name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    date_applied = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="applied")
    notes = models.TextField(blank=True)
    follow_up_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.company_name} - {self.position}"
