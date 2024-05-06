﻿using Hospital.Application.Doctors.Responses;
using Hospital.Application.Illnesses.Responses;
using Hospital.Application.Patients.Responses;
using Hospital.Application.Treatments.Responses;
using Hospital.Domain.Models;

namespace Hospital.Application.MedicalRecords.Responses
{
    public class DiagnosisMedicalRecordDto
    {
        public int Id { get; init; }
        public required PatientRecordDto ExaminedPatient { get; init; }
        public required DoctorRecordDto ResponsibleDoctor { get; init; }
        public required DateTimeOffset DateOfExamination { get; init; }
        public required string ExaminationNotes { get; init; }
        public required IllnessRecordDto DiagnosedIllness { get; init; }
        public required TreatmentRecordDto ProposedTreatment { get; init; }
    }
}
