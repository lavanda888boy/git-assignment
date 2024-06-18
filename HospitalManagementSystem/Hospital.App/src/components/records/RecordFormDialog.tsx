import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  TextField,
  Button,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import RegularRecordService from "../../api/services/RegularRecordService";
import DiagnosisRecordService from "../../api/services/DiagnosisRecordService";
import { useEffect, useState } from "react";
import { Illness } from "../../models/Illness";
import IllnessService from "../../api/services/IllnessService";
import PatientService from "../../api/services/PatientService";
import { Patient } from "../../models/Patient";

interface RecordFormDialogProps {
  isOpened: boolean;
  onClose: () => void;
  onRecordAdded?: (record: any) => void;
}

interface NewRecordData {
  examinedPatientId: number | null;
  responsibleDoctorId: number;
  examinationNotes: string;
  diagnosedIllnessId?: number | null;
  prescribedMedicine?: string;
  treatmentDuration?: number;
}

function RecordFormDialog({
  isOpened: open,
  onClose,
  onRecordAdded,
}: RecordFormDialogProps) {
  const regularRecordService: RegularRecordService = new RegularRecordService();
  const diagnosisRecordsService: DiagnosisRecordService =
    new DiagnosisRecordService();

  const patientService: PatientService = new PatientService();
  const illnessService: IllnessService = new IllnessService();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [illnesses, setIllnesses] = useState<Illness[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientService.getAllPatients(1, 20);
        setPatients(response.items);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchIllnesses = async () => {
      try {
        const response = await illnessService.getAllIllnesses();
        setIllnesses(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchIllnesses();
  }, []);

  const formik = useFormik({
    initialValues: {
      isDiagnosis: false,
      examinedPatientId: null,
      examinationNotes: "",
      diagnosedIllnessId: null,
      prescribedMedicine: "",
      treatmentDuration: 1,
    },

    validationSchema: Yup.object({
      examinedPatientId: Yup.number().required("Patient is required"),
      examinationNotes: Yup.string()
        .max(1800, "Examination notes must be precise")
        .required("Examination notes are required"),
      diagnosedIllnessId: Yup.number().test(
        "isDiagnosis",
        "Diagnosed illness is required",
        function (value) {
          const isDiagnosis = this.parent.isDiagnosis;
          if (isDiagnosis) {
            return Yup.number()
              .required("Diagnosed illness is required")
              .isValidSync(value);
          } else return Yup.string().isValidSync(value);
        }
      ),
      prescribedMedicine: Yup.string().test(
        "isDiagnosis",
        "Prescribed medicine is required",
        function (value) {
          const isDiagnosis = this.parent.isDiagnosis;
          if (isDiagnosis) {
            return Yup.string()
              .max(
                30,
                "Prescribed medicine name should be no longer than 30 characters"
              )
              .required("Prescribed medicine is required")
              .isValidSync(value);
          } else return Yup.string().isValidSync(value);
        }
      ),
      treatmentDuration: Yup.number().test(
        "isDiagnosis",
        "Treatment duration is required",
        function (value) {
          const isDiagnosis = this.parent.isDiagnosis;
          if (isDiagnosis) {
            return Yup.number()
              .max(30, "Treatment duration should be no longer than 30 days")
              .min(1, "Treatment duration should be no shorter than 1 day")
              .required("Treatment duration is required")
              .isValidSync(value);
          } else return Yup.string().isValidSync(value);
        }
      ),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        let recordData: NewRecordData = {
          examinedPatientId: values.examinedPatientId,
          responsibleDoctorId: 1,
          examinationNotes: values.examinationNotes,
        };
        let newRecord;

        if (!values.isDiagnosis) {
          const id = await regularRecordService.addRegularRecord(recordData);
          newRecord = await regularRecordService.getRegularRecordById(id);
        } else {
          recordData.diagnosedIllnessId = values.diagnosedIllnessId;
          recordData.prescribedMedicine = values.prescribedMedicine;
          recordData.treatmentDuration = values.treatmentDuration;

          const id = await diagnosisRecordsService.addDiagnosisRecord(
            recordData
          );
          newRecord = await diagnosisRecordsService.getDiagnosisRecordById(id);
        }

        onRecordAdded && onRecordAdded(newRecord);

        resetForm();
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Record creation/edit</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to add a new record or update an
            existing one.
          </DialogContentText>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "3% 3% 0% 3%",
              backgroundColor: "white",
            }}
            onSubmit={formik.handleSubmit}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.isDiagnosis}
                  onChange={formik.handleChange("isDiagnosis")}
                />
              }
              label="Is this a diagnosis record?"
            />
            <InputLabel htmlFor="examinedPatientId">
              Examined patient
            </InputLabel>
            <Select
              id="examinedPatientId"
              name="examinedPatientId"
              value={formik.values.examinedPatientId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.examinedPatientId &&
                Boolean(formik.errors.examinedPatientId)
              }
              fullWidth
              sx={{ mb: 2 }}
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.name} {patient.surname}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.examinedPatientId &&
              formik.errors.examinedPatientId && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                  {formik.errors.examinedPatientId}
                </Typography>
              )}
            <InputLabel htmlFor="examinationNotes">
              Examination notes
            </InputLabel>
            <TextField
              id="examinationNotes"
              value={formik.values.examinationNotes}
              placeholder="Enter some examination notes"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.examinationNotes &&
                Boolean(formik.errors.examinationNotes)
              }
              helperText={
                formik.touched.examinationNotes &&
                formik.errors.examinationNotes
              }
              fullWidth
              multiline
              rows={3}
              sx={{ mt: 0, mb: 1 }}
            />
            {formik.values.isDiagnosis && (
              <>
                <InputLabel htmlFor="diagnosedIllnessId">
                  Diagnosed illness
                </InputLabel>
                <Select
                  id="diagnosedIllnessId"
                  name="diagnosedIllnessId"
                  value={formik.values.diagnosedIllnessId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.diagnosedIllnessId &&
                    Boolean(formik.errors.diagnosedIllnessId)
                  }
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {illnesses.map((illness) => (
                    <MenuItem key={illness.id} value={illness.id}>
                      {illness.name}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.diagnosedIllnessId &&
                  formik.errors.diagnosedIllnessId && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                      {formik.errors.diagnosedIllnessId}
                    </Typography>
                  )}
                <InputLabel htmlFor="prescribedMedicine">
                  Prescribed medicine
                </InputLabel>
                <TextField
                  id="prescribedMedicine"
                  value={formik.values.prescribedMedicine}
                  placeholder="Enter prescribed medicine"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.prescribedMedicine &&
                    Boolean(formik.errors.prescribedMedicine)
                  }
                  helperText={
                    formik.touched.prescribedMedicine &&
                    formik.errors.prescribedMedicine
                  }
                  fullWidth
                  sx={{ mt: 0, mb: 1 }}
                />
                <InputLabel htmlFor="treatmentDuration">
                  Treatment duration
                </InputLabel>
                <TextField
                  id="treatmentDuration"
                  type="number"
                  value={formik.values.treatmentDuration}
                  placeholder="Enter treatment duration"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.treatmentDuration &&
                    Boolean(formik.errors.treatmentDuration)
                  }
                  helperText={
                    formik.touched.treatmentDuration &&
                    formik.errors.treatmentDuration
                  }
                  fullWidth
                  sx={{ mt: 0, mb: 1 }}
                />
              </>
            )}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mx: 20 }}
            >
              Submit form
            </Button>
            <Button onClick={onClose} color="primary" sx={{ mt: 1, mx: 20 }}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default RecordFormDialog;
