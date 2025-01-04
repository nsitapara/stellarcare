import random

from django.core.management.base import BaseCommand
from faker import Faker

from api.models import (
    Address,
    CustomField,
    Insurance,
    Patient,
    SleepStudy,
    Treatments,
    Visits,
)

fake = Faker()


class Command(BaseCommand):
    help = "Generates mock data for the application"

    def handle(self, *args, **kwargs):
        self.stdout.write("Generating mock data...")

        # Generate Addresses
        addresses = []
        for _ in range(20):
            address = Address.objects.create(
                street=fake.street_address(),
                city=fake.city(),
                state=fake.state(),
                zip_code=fake.zipcode(),
            )
            addresses.append(address)

        # Generate Custom Fields
        custom_fields = []
        field_names = [
            "Height",
            "Weight",
            "Blood Pressure",
            "Heart Rate",
            "Temperature",
        ]
        for name in field_names:
            field = CustomField.objects.create(
                name=name,
                type="number" if name in ["Height", "Weight", "Heart Rate"] else "text",
                value_text=fake.text(max_nb_chars=50)
                if name not in ["Height", "Weight", "Heart Rate"]
                else None,
                value_number=random.uniform(50, 200)
                if name in ["Height", "Weight", "Heart Rate"]
                else None,
            )
            custom_fields.append(field)

        # Generate Sleep Studies
        sleep_studies = []
        for _ in range(30):
            study = SleepStudy.objects.create(
                date=fake.date_between(start_date="-1y", end_date="today"),
                ahi=random.uniform(0, 30),
                sleep_efficiency=random.uniform(60, 100),
                rem_latency=random.uniform(60, 180),
                notes=fake.text(),
                file_url=fake.url(),
            )
            sleep_studies.append(study)

        # Generate Treatments
        treatments = []
        treatment_types = ["CPAP", "BiPAP", "Medication", "Therapy"]
        for _ in range(15):
            treatment = Treatments.objects.create(
                name=fake.medical_procedure(),
                type=random.choice(treatment_types),
                dosage=f"{random.randint(1, 20)} mg" if "Medication" else "N/A",
                frequency=f"{random.randint(1, 4)} times per day",
                start_date=fake.date_between(start_date="-1y", end_date="today"),
                end_date=fake.date_between(start_date="today", end_date="+1y")
                if random.choice([True, False])
                else None,
                notes=fake.text(),
            )
            treatments.append(treatment)

        # Generate Insurance Records
        insurances = []
        providers = ["Blue Cross", "Aetna", "UnitedHealth", "Cigna", "Humana"]
        for _ in range(10):
            insurance = Insurance.objects.create(
                provider=random.choice(providers),
                policy_number=fake.bothify(text="??-########"),
                group_number=fake.bothify(text="???-####"),
                primary_holder=fake.name(),
                relationship=random.choice(["Self", "Spouse", "Parent", "Child"]),
                authorization_status=random.choice(
                    ["Approved", "Pending", "Denied", None]
                ),
                authorization_expiry=fake.date_between(
                    start_date="today", end_date="+1y"
                )
                if random.choice([True, False])
                else None,
            )
            insurances.append(insurance)

        # Generate Visits
        visits = []
        for _ in range(40):
            visit_date = fake.date_between(start_date="-6m", end_date="+6m")
            visits.append(
                Visits.objects.create(
                    date=visit_date,
                    time=fake.time(),
                    type=random.choice(["In-Person", "Telehealth"]),
                    status=random.choice(
                        ["Scheduled", "Completed", "Cancelled", "No-Show"]
                    ),
                    notes=fake.text() if random.choice([True, False]) else None,
                    zoom_link=fake.url() if random.choice([True, False]) else None,
                )
            )

        # Generate Patients
        for _ in range(15):
            patient = Patient.objects.create(
                first=fake.first_name(),
                middle=fake.first_name() if random.choice([True, False]) else None,
                last=fake.last_name(),
                date_of_birth=fake.date_of_birth(minimum_age=18, maximum_age=90),
                status=random.choice(["Inquiry", "Onboarding", "Active", "Churned"]),
            )

            # Add random number of addresses
            patient.addresses.add(*random.sample(addresses, random.randint(1, 2)))

            # Add random custom fields
            patient.custom_fields.add(
                *random.sample(custom_fields, random.randint(2, 5))
            )

            # Add random sleep studies
            patient.studies.add(*random.sample(sleep_studies, random.randint(1, 3)))

            # Add random treatments
            patient.treatments.add(*random.sample(treatments, random.randint(1, 3)))

            # Add random insurance
            patient.insurance.add(*random.sample(insurances, random.randint(1, 2)))

            # Add random visits
            patient.appointments.add(*random.sample(visits, random.randint(2, 5)))

        self.stdout.write(self.style.SUCCESS("Successfully generated mock data"))
