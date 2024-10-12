import React, { useEffect, useState } from 'react'
import EmployeeService from '../services/EmployeeService'
import {
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'

const EmployeeForm = ({
  empId,
  onSuccess,
  open,
  handleClose,
  onSnackbarOpen,
}) => {
  const [employee, setEmployee] = useState({
    name: '',
    age: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    qualification: '',
    position: '',
  })

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (empId) {
        const result = await EmployeeService.getEmployeeById(empId)
        const data = result.data
        if (data.dateOfBirth) {
          data.dateOfBirth = data.dateOfBirth.split('T')[0] // Get YYYY-MM-DD format
        }

        setEmployee(data)
      }
    }

    fetchEmployeeData()
  }, [empId])

  const handleChange = e => {
    setEmployee({ ...employee, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      if (empId) {
        await EmployeeService.updateEmployee(empId, employee)
        onSnackbarOpen('Employee updated successfully.', 'success')
      } else {
        await EmployeeService.createEmployee(employee)
        onSnackbarOpen('Employee created successfully.', 'success')
      }
      onSuccess() // Call the success function to refresh the list
      handleClose() // Close the modal after submission
    } catch (error) {
      console.error('Failed to save employee:', error)
      onSnackbarOpen('Failed to save employee.', 'error')
    }
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{empId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
      <DialogContent>
        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            name='name'
            label='Name'
            variant='outlined'
            value={employee.name}
            onChange={handleChange}
            required
            fullWidth
            margin='normal'
          />
          <TextField
            name='age'
            label='Age'
            variant='outlined'
            type='number'
            value={employee.age}
            onChange={handleChange}
            required
            fullWidth
            margin='normal'
          />
          <TextField
            name='email'
            label='Email'
            variant='outlined'
            type='email'
            value={employee.email}
            onChange={handleChange}
            required
            fullWidth
            margin='normal'
          />
          <TextField
            name='phoneNumber'
            label='Phone Number'
            variant='outlined'
            value={employee.phoneNumber}
            onChange={handleChange}
            required
            fullWidth
            margin='normal'
          />
          <TextField
            name='dateOfBirth'
            label='Date of Birth'
            variant='outlined'
            type='date'
            value={employee.dateOfBirth}
            onChange={handleChange}
            required
            fullWidth
            margin='normal'
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            name='qualification'
            label='Qualification'
            variant='outlined'
            value={employee.qualification}
            onChange={handleChange}
            required
            fullWidth
            margin='normal'
          />
          <TextField
            name='position'
            label='Position'
            variant='outlined'
            value={employee.position}
            onChange={handleChange}
            required
            fullWidth
            margin='normal'
          />
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant='contained' color='primary' type='submit'>
              Save
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeForm
