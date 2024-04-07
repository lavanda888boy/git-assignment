﻿using Hospital.Application.Abstractions;
using Hospital.Domain.Models;

namespace Hospital.Infrastructure.Repository
{
    internal class DepartmentRepository : IRepository<Department>
    {
        private List<Department> _departments = new();

        public Department Create(Department department)
        {
            _departments.Add(department);
            return department;
        }

        public bool Delete(int departmentId)
        {
            var departmentToRemove = GetById(departmentId);
            if (departmentToRemove is null)
            {
                return false;
            }

            _departments.Remove(departmentToRemove);
            return true;
        }

        public List<Department> GetAll()
        {
            return _departments;
        }

        public Department GetById(int id)
        {
            return _departments.First(d => d.Id == id);
        }

        public List<Department> SearchByProperty(Func<Department, bool> departmentPredicate)
        {
            return _departments.Where(departmentPredicate).ToList();
        }

        public int GetLastId()
        {
            return _departments.Any() ? _departments.Max(department => department.Id) : 0;
        }

        public bool Update(Department department)
        {
            var existingDepartment = GetById(department.Id);
            if (existingDepartment != null)
            {
                int index = _departments.IndexOf(existingDepartment);
                _departments[index] = department;
                return true;
            }
            return false;
        }
    }
}
