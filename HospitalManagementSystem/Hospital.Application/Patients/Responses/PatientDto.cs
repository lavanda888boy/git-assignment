﻿using Hospital.Domain.Models;

namespace Hospital.Application.Patients.Responses
{
    internal class PatientDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Surname { get; set; }
        public required int Age { get; set; }
        public required string Gender { get; set; }
        public required string Address { get; set; }
        public string? PhoneNumber { get; set; }
        public string? InsuranceNumber { get; set; }
        public required ICollection<Doctor> AssignedDoctors { get; set; }
        public ICollection<Illness>? Illnesses { get; set; }

        public static PatientDto FromPatient(Patient patient)
        {
            return new PatientDto()
            {
                Id = patient.Id,
                Name = patient.Name,
                Surname = patient.Surname,
                Age = patient.Age,
                Gender = patient.Gender,
                Address = patient.Address,
                PhoneNumber = patient.PhoneNumber,
                InsuranceNumber = patient.InsuranceNumber,
                AssignedDoctors = patient.AssignedDoctors,
                Illnesses = patient.Illnesses,
            };
        }
    }
}
