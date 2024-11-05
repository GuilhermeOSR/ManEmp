import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Grid, Typography, Paper, Divider } from '@mui/material';
import { Document, Page, Text, View, Image, PDFDownloadLink, StyleSheet, pdf } from '@react-pdf/renderer';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDF_WORKER_URL = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#ffffff' },
  section: { marginBottom: 5, borderColor: '#19B5FE', borderWidth: 1, padding: 8 },
  title: { fontSize: 20, marginBottom: 5, color: '#19B5FE', textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 14, marginBottom: 3, color: '#19B5FE', fontFamily: 'Helvetica-Bold' },
  text: { fontSize: 12, marginBottom: 3, fontFamily: 'Helvetica' },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 5 },
  footer: { marginTop: 10, textAlign: 'center', fontSize: 10, color: '#666' },
  image: { width: 80, height: 80, marginBottom: 8, borderRadius: 40, alignSelf: 'center' },
});

// Define a interface para as propriedades de MyDocument
interface MyDocumentProps {
  name: string;
  email: string;
  phone: string;
  gender: string;
  position: string;
  admissionDate: string;
  sector: string;
  salary: string;
  profileImage: string | null; 
}

const MyDocument: React.FC<MyDocumentProps> = ({ name, email, phone, gender, position, admissionDate, sector, salary, profileImage }) => (
  <Document>
    <Page style={styles.page}>
      {profileImage && <Image src={profileImage} style={styles.image} />}
      <View style={styles.section}>
        <Text style={styles.subtitle}>Informações Pessoais</Text>
        <View style={styles.divider} />
        <Text style={styles.text}>Nome: {name}</Text>
        <Text style={styles.text}>E-mail: {email}</Text>
        <Text style={styles.text}>Telefone: {phone}</Text>
        <Text style={styles.text}>Genero: {gender}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subtitle}>Detalhes do Emprego</Text>
        <View style={styles.divider} />
        <Text style={styles.text}>Cargo: {position}</Text>
        <Text style={styles.text}>Data de Admissão: {admissionDate}</Text>
        <Text style={styles.text}>Setor: {sector}</Text>
        <Text style={styles.text}>Salário: {salary}</Text>
      </View>
    </Page>
  </Document>
);

const FormAddUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');

  const [position, setPosition] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [sector, setSector] = useState('');
  const [salary, setSalary] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null); 
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !email) {
      alert("Nome e e-mail são obrigatórios!");
      return;
    }
    try {
      const usersCollectionRef = collection(db, 'employees');
      await addDoc(usersCollectionRef, {
        name,
        email,
        phone,
        gender,
        position,
        admissionDate,
        sector,
        salary,
        profileImage,
      });
      alert('Usuário adicionado com sucesso!');
      setName('');
      setEmail('');
      setPhone('');
      setGender('');
      setPosition('');
      setAdmissionDate('');
      setSector('');
      setSalary('');
      setProfileImage(null); 
      setPdfBlob(null); 
    } catch (error) {
      console.error("Erro ao adicionar usuário: ", error);
      alert('Erro ao adicionar usuário. Tente novamente.');
    }
  };

  useEffect(() => {
    const generatePdfBlob = async () => {
      if (name || email || phone || gender || position || admissionDate || sector || salary || profileImage) {
        const blob = await pdf(<MyDocument name={name} email={email} phone={phone} gender={gender} position={position} admissionDate={admissionDate} sector={sector} salary={salary} profileImage={profileImage} />).toBlob();
        setPdfBlob(URL.createObjectURL(blob));
      }
    };
    generatePdfBlob();
  }, [name, email, phone, gender, position, admissionDate, sector, salary, profileImage]);

  return (
    <div style={{ marginTop: '70px' }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={5}>
          <Paper elevation={3} style={{ padding: '10px', margin: '10px' }}>
            <Typography variant="h6" gutterBottom>
              Adicionar Funcionário
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    label="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="E-mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Telefone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Gênero"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Divider />
                <Grid item xs={12}>
                  <TextField
                    label="Cargo"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Data de Admissão"
                    type="date"
                    value={admissionDate}
                    onChange={(e) => setAdmissionDate(e.target.value)}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Setor"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Salário"
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ width: '100%' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth size="small">
                    Adicionar Funcionário
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} style={{ padding: '10px', margin: '10px' }}>
            <Typography variant="h6" gutterBottom>
              Pré-visualização do PDF
            </Typography>
            {pdfBlob && (
              <div style={{ height: '800px' }}>
                <Worker workerUrl={PDF_WORKER_URL}>
                  <Viewer fileUrl={pdfBlob} />
                </Worker>
                <PDFDownloadLink
                    document={<MyDocument name={name} email={email} phone={phone} gender={gender} position={position} admissionDate={admissionDate} sector={sector} salary={salary} profileImage={profileImage} />}
                    fileName="cadastro-funcionario.pdf"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="contained" color="secondary" fullWidth size="small">
                      Baixar PDF do Funcionário
                    </Button>
                  </PDFDownloadLink>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default FormAddUser;