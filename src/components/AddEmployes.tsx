import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { TextField, Button, Grid, Typography, Paper, Modal, Box, Divider, LinearProgress} from '@mui/material';
import { Document, Page, Text, View, Image, PDFDownloadLink, StyleSheet, pdf } from '@react-pdf/renderer';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '../Styles/profileimage.css';
import '../Styles/cadastroestilo.css';
import PDFDocumentComponent from './PDFDocumentComponente';
import '../App.css'



const FormAddUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [position, setPosition] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [sector, setSector] = useState('');
  const [salary, setSalary] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [pdfBlob, setPdfBlob] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1); // Controle das etapas

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const usersCollectionRef = collection(db, 'employees');
      await addDoc(usersCollectionRef, {
        name,
        email,
        phone,
        gender,
        birthDate,
        address,
        position,
        admissionDate,
        sector,
        salary,
        profileImage,
      });
      setName('');
      setEmail('');
      setPhone('');
      setGender('');
      setBirthDate('');
      setAddress('');
      setPosition('');
      setAdmissionDate('');
      setSector('');
      setSalary('');
      setProfileImage(null);
      setPdfBlob(null);
    } catch (error) {
      console.error('Erro ao adicionar usuário: ', error);
      alert('Erro ao adicionar usuário. Tente novamente.');
    }
  };

  // Função para validar se todos os campos da etapa 1 estão preenchidos
  const validateStep1 = () => {
    return name && email && birthDate && address; // Aqui você pode adicionar ou remover campos obrigatórios conforme necessário
  };

  // Função para validar se todos os campos da etapa 2 estão preenchidos
  const validateStep2 = () => {
    return position && admissionDate && sector && salary;
  };

  // Função para validar se os campos da etapa atual estão preenchidos
  const isNextStepEnabled = () => {
    if (currentStep === 1) {
      return validateStep1();
    } else if (currentStep === 2) {
      return validateStep2();
    }
    return true;
  };

  const nextStep = () => {
    if (currentStep < 3 && isNextStepEnabled()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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


  useEffect(() => {
    const generatePdfBlob = async () => {
      if (name || email || phone || gender || birthDate || address || position || admissionDate || sector || salary || profileImage) {
        const blob = await pdf(
          <PDFDocumentComponent
            name={name}
            email={email}
            phone={phone}
            gender={gender}
            birthDate={birthDate}
            address={address}
            position={position}
            admissionDate={admissionDate}
            sector={sector}
            salary={salary}
            profileImage={profileImage}
        />
        ).toBlob();
        setPdfBlob(URL.createObjectURL(blob));
      }
    };
    generatePdfBlob();
  }, [name, email, phone, gender, birthDate, address, position, admissionDate, sector, salary, profileImage]);

  const isFormValid = () => {
    if (currentStep === 1) {
      return name && email && birthDate && address; // Verifique os campos da etapa 1
    } else if (currentStep === 2) {
      return position && admissionDate && sector && salary; // Verifique os campos da etapa 2
    } else if (currentStep === 3) {
      return name && email && phone && gender && birthDate && address && position && admissionDate && sector && salary; // Para a etapa 3, verifique todos os campos
    }
    return false;
  };

  return (
    <div className="container">
    <div style={{ marginTop: '70px', width: '100%'}}>
      <Grid container spacing={1}>
    
        <Grid item xs={12} md={5}>
          
        <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>

  
          <Typography variant="h5" gutterBottom style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Adicionar Funcionário</span>
            <span style={{ fontSize: '14px', color: '#1976d2' }}>Passo {currentStep}/3</span>
          </Typography>
        <LinearProgress
              variant="determinate"
              value={(currentStep / 3) * 100}  // Progresso calculado
              style={{ marginTop: '10px' }}
            />
            <form onSubmit={handleSubmit} className="form-container">
              {/* Etapa 1: Informações Pessoais */}
              {currentStep === 1 && (
                <>
                  <Typography gutterBottom>Informações de Contato</Typography>
                  <Grid container spacing={1} className="grid-container">
                    <Grid item xs={12}  >
                    <div className="CampoNomeImg">
                  <TextField label="Nome" className="campoNome" value={name} onChange={(e) => setName(e.target.value)} fullWidth size="small" required />

                    <div className="fotoContent">
                      
                    <label htmlFor="file-upload" className="custom-file-upload">
                      <span>+</span>
                      {profileImage && <img src={profileImage} alt="Profile Preview" className="image-preview" />}

                    </label>
                    <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
                    
                    </div>
                  </div>
                </Grid>
                    <Grid item xs={12}>
                      <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth size="small" required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Data de Nascimento" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} fullWidth InputLabelProps={{ shrink: true }} size="small" required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Endereço" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth size="small" />
                    </Grid>
                  </Grid>
                </>
              )}

              {/* Etapa 2: Cargo e Setor */}
              {currentStep === 2 && (
                <>
                  <Typography gutterBottom>Informações do Funcionário</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <TextField label="Cargo" value={position} onChange={(e) => setPosition(e.target.value)} fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Data de Admissão" type="date" value={admissionDate} onChange={(e) => setAdmissionDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Setor" value={sector} onChange={(e) => setSector(e.target.value)} fullWidth size="small" />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Salário" value={salary} onChange={(e) => setSalary(e.target.value)} fullWidth size="small" />
                    </Grid>
                  </Grid>
                </>
              )}

              {/* Etapa 3: Confirmação */}
              {currentStep === 3 && (
                <>
                  <Typography gutterBottom>Confirmar Dados</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Resumo do Cadastro</Typography>
                      <Typography><strong>Nome:</strong> {name}</Typography>
                      <Typography><strong>Email:</strong> {email}</Typography>
                      <Typography><strong>Telefone:</strong> {phone}</Typography>
                      <Typography><strong>Endereço:</strong> {address}</Typography>
                      <Typography><strong>Cargo:</strong> {position}</Typography>
                      <Typography><strong>Setor:</strong> {sector}</Typography>
                      <Typography><strong>Salário:</strong> {salary}</Typography>
                    </Grid>
                  </Grid>
                </>
              )}

              {/* Botões de Navegação */}
              <Grid container spacing={1} justifyContent="space-between">
                <Grid item  sx={{marginTop: '10px'}}>
                  {currentStep > 1 && <Button variant="contained" onClick={prevStep}>Voltar</Button>}
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={nextStep}
                    disabled={!isNextStepEnabled()} // Desabilitar botão "Próximo" se a validação falhar
                    sx={{marginTop: '10px'}}
                  >
                    {currentStep === 3 ?  <Button type="submit" variant="contained" color="primary" fullWidth size="small">Adicionar Funcionário</Button> : 'Próximo'}
                    
                  </Button>
                  
                </Grid>
                {currentStep === 3 && (
                  <PDFDownloadLink
                  document={<PDFDocumentComponent name={name} email={email} phone={phone} gender={gender} birthDate={birthDate} address={address} position={position} admissionDate={admissionDate} sector={sector} salary={salary} profileImage={profileImage} />}
                  fileName="funcionario.pdf"
                  
                  onClick={(e) => {
                    if (!isFormValid) {
                      e.preventDefault(); // Previne o download se o formulário não for válido
                    }
                    
                  }}
                >
                  <Button
                   sx={{ marginTop: '20px', width: '100%'}}
                    variant="contained"
                    color="secondary"
                    fullWidth
       
                    disabled={!isFormValid} // Desabilita o botão se o formulário não estiver válido
                  >
                    Baixar PDF
                  </Button>
                </PDFDownloadLink>
)}
              </Grid>

            </form>

                  
          </Paper>
        </Grid>

        {/* Exibição do PDF gerado */}
        <Grid item xs={12} md={7}>
          {pdfBlob && (
            <div className="pdf-viewer-container">
              <h3>Pré-visualização</h3>
              <Worker workerUrl={'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'}>
                <Viewer fileUrl={pdfBlob} />
              </Worker>
            </div>
          )}
        </Grid>
      </Grid>
    </div>
    </div>
  );
};

export default FormAddUser;