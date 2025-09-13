from django.db import models

# Create your models here.
class Application(models.Model):
    position_title = models.CharField(max_length=200)  # 占位，等队友的真模型也行
    def __str__(self): return self.position_title

class Note(models.Model):
    TYPE = [
        ("NOTE","Note"),
        ("EMAIL_IN","Email (from company)"),
        ("EMAIL_OUT","Email (to company)"),
        ("CALL","Phone call"),
        ("MEETING","Meeting"),
        ("INTERVIEW","Interview invite"),
        ("OFFER","Offer"),
        ("REJECT","Reject"),
    ]
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name="notes")
    type = models.CharField(max_length=20, choices=TYPE, default="NOTE")
    content = models.TextField(blank=True)
    occurred_at = models.DateTimeField(auto_now_add=True)  # 自动时间戳

    class Meta:
        ordering = ["-occurred_at"]

    def __str__(self):
        return f"{self.type}: {self.content[:30]}"