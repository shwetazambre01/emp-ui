import React, { useEffect, useState } from 'react'
import EmployeeService from '../services/EmployeeService'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from '@mui/material'
import EmployeeForm from './EmployeeForm'

const EmployeeList = ({ onSnackbarOpen }) => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editEmpId, setEditEmpId] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const result = await EmployeeService.getAllEmployees()
      if (Array.isArray(result.data)) {
        setEmployees(result.data)
      } else {
        setEmployees([])
        setError('No employee data available.')
      }
    } catch (err) {
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const deleteEmployee = async empId => {
    try {
      await EmployeeService.deleteEmployee(empId)
      loadEmployees()
      onSnackbarOpen('Employee deleted successfully.', 'success')
    } catch (err) {
      console.error('Failed to delete employee:', err)
      onSnackbarOpen('Failed to delete employee.', 'error')
    }
  }

  const confirmDeleteEmployee = empId => {
    setEmployeeToDelete(empId)
    setConfirmDeleteOpen(true)
  }

  const handleCloseConfirmDialog = () => {
    setConfirmDeleteOpen(false)
    setEmployeeToDelete(null)
  }

  const handleConfirmDelete = async () => {
    if (employeeToDelete) {
      await deleteEmployee(employeeToDelete)
    }
    handleCloseConfirmDialog()
  }

  const handleOpenModal = empId => {
    setEditEmpId(empId)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setEditEmpId(null)
    setModalOpen(false)
  }

  return (
    <>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        margin={2}>
        <Typography variant='h4' align='start' gutterBottom>
          Employee List
        </Typography>
        <Button
          variant='contained'
          color='primary'
          onClick={() => handleOpenModal(null)}
          style={{
            marginBottom: '16px',
            marginLeft: '16px',
          }}>
          Add Employee
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        style={{ maxHeight: 'calc(100vh - 200px)', width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>DOB</TableCell>

              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  <Typography color='error'>{error}</Typography>
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  <Typography>No employees found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              employees.map(employee => (
                <TableRow key={employee.empId}>
                  <TableCell>{employee.empId}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.phoneNumber}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    {new Date(employee.dateOfBirth).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant='contained'
                      color='secondary'
                      onClick={() => handleOpenModal(employee.empId)} // Open modal for editing
                    >
                      Edit
                    </Button>
                    <Button
                      variant='contained'
                      color='error'
                      onClick={() => confirmDeleteEmployee(employee.empId)}
                      style={{ marginLeft: '8px' }}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <EmployeeForm
        empId={editEmpId}
        onSuccess={loadEmployees}
        open={modalOpen}
        handleClose={handleCloseModal}
        onSnackbarOpen={onSnackbarOpen}
      />
      <Dialog open={confirmDeleteOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this employee?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color='primary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default EmployeeList
