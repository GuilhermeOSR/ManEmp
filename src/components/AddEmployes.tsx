import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Grid, Typography, Paper } from '@mui/material';
import { Document, Page, Text, View, Image, PDFDownloadLink, StyleSheet, pdf } from '@react-pdf/renderer';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDF_WORKER_URL = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#ffffff' },
  section: { marginBottom: 10, borderColor: '#19B5FE', borderWidth: 2, borderStyle: 'solid', padding: 10 },
  title: { fontSize: 24, marginBottom: 10, color: '#19B5FE', textAlign: 'center', fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 16, marginBottom: 5, color: '#19B5FE', fontFamily: 'Helvetica-Bold' },
  text: { fontSize: 14, marginBottom: 5, fontFamily: 'Helvetica' },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 10 },
  footer: { marginTop: 20, textAlign: 'center', fontSize: 12, color: '#666' },
  image: { width: 100, height: 100, marginBottom: 10, borderRadius: 50, alignSelf: 'center' },
});

// Define a interface para as propriedades de MyDocument
interface MyDocumentProps {
  name: string;
  email: string;
  phone: string;
  position: string;
  admissionDate: string;
  sector: string;
  salary: string;
  profileImage: string | null; 
}

const MyDocument: React.FC<MyDocumentProps> = ({ name, email, phone, position, admissionDate, sector, salary, profileImage }) => (
  <Document>
    <Page style={styles.page}>


        {profileImage && <Image src={profileImage} style={styles.image} />}
    
      <View style={styles.section}>
        <Text style={styles.subtitle}>Informações Pessoais</Text>
        <View style={styles.divider} />
        <Text style={styles.text}>Nome: {name}</Text>
        <Text style={styles.text}>E-mail: {email}</Text>
        <Text style={styles.text}>Telefone: {phone}</Text>
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
  const [position, setPosition] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [sector, setSector] = useState('');
  const [salary, setSalary] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null); // Estado para a imagem
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string); // Armazena a URL da imagem
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
      const usersCollectionRef = collection(db, 'users');
      await addDoc(usersCollectionRef, {
        name,
        email,
        phone,
        position,
        admissionDate,
        sector,
        salary,
      });

      alert('Usuário adicionado com sucesso!');
      setName('');
      setEmail('');
      setPhone('');
      setPosition('');
      setAdmissionDate('');
      setSector('');
      setSalary('');
      setProfileImage(null); // Limpa a imagem após o envio
      setPdfBlob(null); // Limpa o PDF após o envio
    } catch (error) {
      console.error("Erro ao adicionar usuário: ", error);
      alert('Erro ao adicionar usuário. Tente novamente.');
    }
  };

  // useEffect para gerar o PDF sempre que os dados mudam
  useEffect(() => {
    const generatePdfBlob = async () => {
      if (name || email || phone || position || admissionDate || sector || salary || profileImage) {
        const blob = await pdf(<MyDocument name={name} email={email} phone={phone} position={position} admissionDate={admissionDate} sector={sector} salary={salary} profileImage={profileImage} />).toBlob();
        setPdfBlob(URL.createObjectURL(blob));
      }
    };

    generatePdfBlob();
  }, [name, email, phone, position, admissionDate, sector, salary, profileImage]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '16px', margin: '20px' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Adicionar Funcionário
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField
                  label="Nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  fullWidth
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
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Telefone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Cargo"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Data de Admissão"
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Setor"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Salário"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  fullWidth
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  Adicionar Funcionário
                </Button>
              </Grid>
              <Grid item xs={12}>
                <PDFDownloadLink
                  document={<MyDocument name={name} email={email} phone={phone} position={position} admissionDate={admissionDate} sector={sector} salary={salary} profileImage={profileImage} />}
                  fileName="cadastro-funcionario.pdf"
                  style={{ textDecoration: 'none' }}
                >
                  <Button variant="contained" color="secondary" fullWidth>
                    Baixar PDF do Funcionário
                  </Button>
                </PDFDownloadLink>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper elevation={3} style={{ padding: '16px', margin: '20px', height: '100%'  }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Visualizador de PDF
          </Typography>
          {pdfBlob ? (
            <div style={{ height: '600px'}}>
              <Worker workerUrl={PDF_WORKER_URL}>
                <Viewer fileUrl={pdfBlob} />
              </Worker>
            </div>
          ) : (
            <Typography variant="body1" color="textSecondary">
              Preencha os detalhes à esquerda para visualizar o PDF.
            </Typography>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FormAddUser;