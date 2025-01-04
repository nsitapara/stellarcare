import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)
    modified_at = models.DateTimeField(_("modified at"), auto_now=True)

    class Meta:
        db_table = "users"
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return self.email if self.email else self.username


class Address(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.zip_code}"


class CustomField(models.Model):
    FIELD_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
    ]

    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=FIELD_TYPES)
    value_text = models.TextField(blank=True, null=True)
    value_number = models.FloatField(blank=True, null=True)

    def __str__(self):
        return self.name


class SleepStudy(models.Model):
    date = models.DateField()
    ahi = models.FloatField()
    sleep_efficiency = models.FloatField()
    rem_latency = models.FloatField()
    notes = models.TextField(blank=True, null=True)
    file_url = models.URLField(blank=True, null=True)


class Treatment(models.Model):
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)


class CPAPUsage(models.Model):
    date = models.DateField()
    hours_used = models.FloatField()
    events_per_hour = models.FloatField()
    mask_leak = models.FloatField()
    notes = models.TextField(blank=True, null=True)


class Insurance(models.Model):
    provider = models.CharField(max_length=255)
    policy_number = models.CharField(max_length=100)
    group_number = models.CharField(max_length=100)
    primary_holder = models.CharField(max_length=255)
    relationship = models.CharField(max_length=100)
    authorization_status = models.CharField(max_length=50, blank=True, null=True)
    authorization_expiry = models.DateField(blank=True, null=True)


class Visits(models.Model):
    VISITS_TYPES = [
        ("In-Person", "In-Person"),
        ("Telehealth", "Telehealth"),
    ]

    VISITS_STATUSES = [
        ("Scheduled", "Scheduled"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
        ("No-Show", "No-Show"),
    ]

    date = models.DateField()
    time = models.TimeField()
    type = models.CharField(max_length=20, choices=VISITS_TYPES)
    status = models.CharField(max_length=20, choices=VISITS_STATUSES)
    notes = models.TextField(blank=True, null=True)
    zoom_link = models.URLField(blank=True, null=True)


class Patient(models.Model):
    PATIENT_STATUSES = [
        ("Inquiry", "Inquiry"),
        ("Onboarding", "Onboarding"),
        ("Active", "Active"),
        ("Churned", "Churned"),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first = models.CharField(max_length=100)
    middle = models.CharField(max_length=100, blank=True, null=True)
    last = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    status = models.CharField(max_length=20, choices=PATIENT_STATUSES)

    addresses = models.ManyToManyField(Address)
    custom_fields = models.ManyToManyField(CustomField)
    studies = models.ManyToManyField(SleepStudy)
    treatments = models.ManyToManyField(Treatment)
    insurance = models.ManyToManyField(Insurance)
    appointments = models.ManyToManyField(Visits)

    def __str__(self):
        return f"{self.first} {self.last}"
