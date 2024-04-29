﻿using Hospital.Application.Abstractions;
using Hospital.Application.Departments.Commands;
using Hospital.Application.Doctors.Commands;
using Hospital.Application.Illnesses.Commands;
using Hospital.Application.Illnesses.Queries;
using Hospital.Application.MedicalRecords.Commands;
using Hospital.Application.Patients.Commands;
using Hospital.Domain.Models;
using Hospital.Domain.Models.Utility;
using Hospital.Infrastructure;
using Hospital.Infrastructure.Repository;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var diContainer = new ServiceCollection()
    .AddDbContext<HospitalManagementDbContext>(options => 
            options.UseSqlServer("Server=ARTIFICIALBEAUT\\SQL_AMDARIS;Database=Hospital;Trusted_Connection=True;TrustServerCertificate=True;"))
    .AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(RegisterNewHospitalDepartment).Assembly))
    .AddScoped<IRepository<Patient>, PatientRepository>()
    .AddScoped<IRepository<Doctor>, DoctorRepository>()
    .AddScoped<IRepository<RegularMedicalRecord>, RegularMedicalRecordRepository>()
    .AddScoped<IRepository<DiagnosisMedicalRecord>, DiagnosisMedicalRecordRepository>()
    .AddScoped<IRepository<Department>, DepartmentRepository>()
    .AddScoped<IRepository<Illness>, IllnessRepository>()
    .AddScoped<IRepository<Treatment>, TreatmentRepository>()
    .BuildServiceProvider();

var mediator = diContainer.GetRequiredService<IMediator>();

//var command = new RegisterNewHospitalDepartment("Heart diseases");
//var result = await mediator.Send(command);

//var command = new ChangeDepartmentClassification(1, "Respiratory diseases");
//await mediator.Send(command);

//var command = new RegisterExistingIllness("Flu", IllnessSeverity.MEDIUM);
//await mediator.Send(command);
//command = new RegisterExistingIllness("Pneumonia", IllnessSeverity.HIGH);
//await mediator.Send(command);
//command = new RegisterExistingIllness("Arrhythmia", IllnessSeverity.LOW);
//await mediator.Send(command);

//var command = new EmployNewDoctor("Stanley", "Cooper", "Los Pollos Hermanos, Albukerke", "069245123", 1,
//    new TimeSpan(9, 0, 0), new TimeSpan(19, 0, 0), new List<int>() { 1, 2, 6, 7 });
//await mediator.Send(command);

//var command = new UpdateDoctorPersonalInfo(2, "Mike", "Denver", "175 Aroyo Vista, Albukerke", "068745123", 1,
//    new TimeSpan(10, 0, 0), new TimeSpan(19, 0, 0), new List<int>() { 1, 2, 6, 7 });
//await mediator.Send(command);

//var command = new RegisterNewPatient("Chris", "Bale", 27, "M", "256 Beverly Hills, Los Angleles", 
//    "078945623", "AB17845289");
//await mediator.Send(command);

//var command = new UpdatePatientAssignedDoctors(4, new List<int>() { 2, 3 });
//await mediator.Send(command);

//var command = new UpdateDoctorAssignedPatients(3, new List<int>() { });
//await mediator.Send(command);

//var command = new AddNewDiagnosisMedicalRecord(5, 3, "Patient is a ill", 3, "Valocordin", 5);
//await mediator.Send(command);

//var command1 = new AddNewRegularMedicalRecord(5, 3, "Regular examination");
//await mediator.Send(command1);

//var command2 = new AddNewRegularMedicalRecord(4, 2, "Another regular examination");
//await mediator.Send(command2);

//var command = new AdjustTreatmentDetailsWithinDiagnosisMedicalRecord(2, 3, "Valocordin", 3);
//await mediator.Send(command);