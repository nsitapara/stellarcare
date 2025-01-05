import random

from django.core.management.base import BaseCommand
from faker import Faker

from api.models import (
    Address,
    CustomFieldDefinition,
    Insurance,
    Patient,
    PatientCustomField,
    SleepStudy,
    Treatment,
    Visit,
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

        # Generate Custom Field Definitions
        field_definitions = []
        field_configs = [
            {
                "name": "Height",
                "type": "number",
                "description": "Patient's height in centimeters",
                "is_required": True,
                "display_order": 1,
            },
            {
                "name": "Weight",
                "type": "number",
                "description": "Patient's weight in kilograms",
                "is_required": True,
                "display_order": 2,
            },
            {
                "name": "Blood Pressure",
                "type": "text",
                "description": "Patient's blood pressure reading",
                "is_required": False,
                "display_order": 3,
            },
            {
                "name": "Heart Rate",
                "type": "number",
                "description": "Patient's heart rate in BPM",
                "is_required": False,
                "display_order": 4,
            },
            {
                "name": "Temperature",
                "type": "number",
                "description": "Patient's temperature in Celsius",
                "is_required": False,
                "display_order": 5,
            },
        ]

        for config in field_configs:
            field, created = CustomFieldDefinition.objects.get_or_create(
                name=config["name"],
                defaults={
                    "type": config["type"],
                    "description": config["description"],
                    "is_required": config["is_required"],
                    "display_order": config["display_order"],
                    "is_active": True,
                },
            )
            field_definitions.append(field)

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
        treatment_names = [
            "Sleep Apnea Therapy",
            "CPAP Treatment",
            "BiPAP Treatment",
            "Sleep Position Therapy",
            "Weight Management",
            "Oral Appliance Therapy",
            "Lifestyle Modification",
            "Sleep Hygiene Education",
            "Cognitive Behavioral Therapy",
            "Melatonin Supplement",
            "Positional Therapy",
            "Oxygen Therapy",
            "Dental Device",
            "Exercise Program",
            "Relaxation Techniques",
        ]
        for _ in range(15):
            treatment = Treatment.objects.create(
                name=random.choice(treatment_names),
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
                Visit.objects.create(
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

        # Generate Patients with Custom Field Values
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

            # Add custom field values
            for field_def in field_definitions:
                if field_def.is_required or random.choice([True, False]):
                    if field_def.type == "number":
                        value = random.uniform(50, 200)
                        PatientCustomField.objects.create(
                            patient=patient,
                            field_definition=field_def,
                            value_number=value,
                        )
                    else:
                        value = fake.text(max_nb_chars=50)
                        PatientCustomField.objects.create(
                            patient=patient,
                            field_definition=field_def,
                            value_text=value,
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
