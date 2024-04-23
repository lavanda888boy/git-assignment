﻿using Hospital.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Hospital.Infrastructure
{
    public class HospitalManagementDbContext : DbContext
    {
        private string _dbConnectionString = "Server=ARTIFICIALBEAUT\\SQL_AMDARIS;Database=Hospital;Trusted_Connection=True;TrustServerCertificate=True;";

        public DbSet<Patient> Patients { get; set; } = default!;
        public DbSet<Doctor> Doctors { get; set; } = default!;
        public DbSet<Department> Departments { get; set; } = default!;
        public DbSet<DoctorSchedule> DoctorSchedules { get; set; } = default!;
        public DbSet<RegularMedicalRecord> RegularRecords { get; set; } = default!;
        public DbSet<DiagnosisMedicalRecord> DiagnosisRecords { get; set; } = default!;
        public DbSet<Illness> Illnesses { get; set; } = default!;
        public DbSet<Treatment> Treatments { get; set; } = default!;

        public HospitalManagementDbContext() { }

        public HospitalManagementDbContext(DbContextOptions options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured())
            {
                optionsBuilder.UseSqlServer(_dbConnectionString)
                          .LogTo(Console.WriteLine, new[] { DbLoggerCategory.Database.Command.Name }, LogLevel.Information);
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Doctor>()
                        .HasOne(d => d.Department)
                        .WithMany()
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<DoctorsPatients>()
                        .HasKey(dp => new { dp.DoctorId, dp.PatientId });

            modelBuilder.Entity<DoctorsPatients>()
                        .HasOne(dp => dp.Doctor)
                        .WithMany(d => d.DoctorsPatients)
                        .HasForeignKey(dp => dp.DoctorId);

            modelBuilder.Entity<DoctorsPatients>()
                        .HasOne(dp => dp.Patient)
                        .WithMany(d => d.DoctorsPatients)
                        .HasForeignKey(dp => dp.PatientId);

            modelBuilder.Entity<Doctor>()
                        .HasOne(d => d.WorkingHours)
                        .WithOne(wh => wh.Doctor)
                        .HasForeignKey<DoctorSchedule>(wh => wh.Id)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<DoctorSchedule>()
                        .HasOne(wh => wh.Doctor)
                        .WithOne(d => d.WorkingHours)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<RegularMedicalRecord>()
                        .HasOne(r => r.ResponsibleDoctor)
                        .WithMany()
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<RegularMedicalRecord>()
                        .HasOne(r => r.ExaminedPatient)
                        .WithMany()
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<DiagnosisMedicalRecord>()
                        .HasOne(r => r.ResponsibleDoctor)
                        .WithMany()
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<DiagnosisMedicalRecord>()
                        .HasOne(r => r.ExaminedPatient)
                        .WithMany()
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<DiagnosisMedicalRecord>()
                        .HasOne(r => r.ProposedTreatment)
                        .WithOne()
                        .HasForeignKey<Treatment>(t => t.Id)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<DiagnosisMedicalRecord>()
                        .HasOne(r => r.DiagnosedIllness)
                        .WithMany()
                        .HasForeignKey(r => r.DiagnosedIllnessId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

            modelBuilder.Entity<DoctorSchedule>()
                        .HasOne(wh => wh.WeekDay)
                        .WithMany()
                        .HasForeignKey(wh => wh.WeekDayId)
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();
        }
    }
}