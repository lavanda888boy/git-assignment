import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  useTheme,
} from "@mui/material";
import usePageTitle from "../hooks/PageTitleHook";
import CreateActionButton from "../components/shared/CreateActionButton";
import PatientFormDialog from "../components/patients/PatientFormDialog";
import PatientService from "../api/services/PatientService";
import { Patient } from "../models/Patient";
import { AxiosError } from "axios";
import { UserRoleContext } from "../context/UserRoleContext";
import ActionMenu from "../components/shared/ActionMenu";

function Patients() {
  usePageTitle("Patients");

  const theme = useTheme();
  const userRoleContextProps = useContext(UserRoleContext);
  const navigate = useNavigate();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    patient: Patient
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await PatientService.getAllPatients(
          currentPage,
          pageSize
        );
        setPatients(response.items);
        setTotalItems(response.totalItems);
      } catch (error) {
        const err = error as AxiosError;
        if (err.response && err.response.status === 401) {
          userRoleContextProps?.setUserRole("");
          navigate("/");
        }
      }
    };

    fetchPatients();
  }, [currentPage]);

  const handleCreateFormOpen = () => {
    setCreateFormOpen(true);
  };

  const handleCreateFormClose = () => {
    setCreateFormOpen(false);
  };

  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prevPatients) => [newPatient, ...prevPatients]);
  };

  const handleDeletePatient = async () => {
    try {
      if (selectedPatient) {
        await PatientService.deletePatient(selectedPatient.id);
        setPatients((prevPatients) =>
          prevPatients.filter((p) => p.id !== selectedPatient.id)
        );
      }
    } catch (error) {
      const err = error as AxiosError;
      if (err.response && err.response.status === 401) {
        userRoleContextProps?.setUserRole("");
        navigate("/");
      }
      console.log(err.message);
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setCurrentPage(newPage);
  };

  return (
    <Container
      sx={{
        position: "absolute",
        width: "72%",
        height: "auto",
        zIndex: 1,
        padding: "1.5% 2% 3% 2%",
        marginTop: "8%",
        marginLeft: "8%",
        borderRadius: "5px",
        backgroundColor: "white",
      }}
    >
      <CreateActionButton
        entityName="Patient"
        clickAction={handleCreateFormOpen}
      />
      <TableContainer
        component={Paper}
        sx={{
          mt: 3,
          borderColor: theme.palette.primary.light,
          borderStyle: "solid",
          borderWidth: "5px",
          borderRadius: "5px",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Surname</TableCell>
              <TableCell align="center">Age</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Phone number</TableCell>
              <TableCell align="center">Insurance</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell align="center">{patient.name}</TableCell>
                <TableCell align="center">{patient.surname}</TableCell>
                <TableCell align="center">{patient.age}</TableCell>
                <TableCell align="center">{patient.gender}</TableCell>
                <TableCell align="center">{patient.phoneNumber}</TableCell>
                <TableCell align="center">{patient.insuranceNumber}</TableCell>
                <TableCell align="center">
                  <ActionMenu
                    rowId={patient.id}
                    anchorEl={anchorEl}
                    handleMenuClick={(event) => handleMenuClick(event, patient)}
                    handleMenuClose={handleMenuClose}
                    onEntityDelete={handleDeletePatient}
                    patient={selectedPatient}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(totalItems / pageSize)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
      <PatientFormDialog
        open={createFormOpen}
        onClose={handleCreateFormClose}
        onPatientAdded={handleAddPatient}
      />
    </Container>
  );
}

export default Patients;
