﻿using Hospital.Application.Abstractions;
using Hospital.Domain.Models;

namespace Hospital.Infrastructure
{
    internal class PatientRepository : IPatientRepository
    {
        private List<Patient> _patients = new();

        public Patient Create(Patient patient)
        {
            _patients.Add(patient);
            return patient;
        }

        public bool Delete(Patient patient)
        {
            return _patients.Remove(patient);
        }

        public List<Patient> GetAll()
        {
            return _patients;
        }

        public List<Patient>? GetByProperty(Func<Patient, bool> patientProperty)
        {
            return _patients.Where(patientProperty).ToList();
        }

        public int GetLastId()
        {
            return _patients.Any() ? _patients.Max(patient => patient.Id) : 0;
        }

        public Patient? Update(Patient patient)
        {
            var existingPatient = _patients.FirstOrDefault(p => p.Id == patient.Id);
            if (existingPatient != null)
            {
                existingPatient.Name = patient.Name;
                existingPatient.Surname = patient.Surname;
                existingPatient.DateOfBirth = patient.DateOfBirth;
                existingPatient.Gender = patient.Gender;
                existingPatient.Address = patient.Address;
                existingPatient.PhoneNumber = patient.PhoneNumber;
                existingPatient.InsuranceNumber = patient.InsuranceNumber;
                existingPatient.AssignedDoctors = patient.AssignedDoctors;
                existingPatient.Illnesses = patient.Illnesses;
            }
            return existingPatient;
        }
    }
}