




import React, { useEffect, useState } from 'react';
import { db, storage } from '../services/firebase'; // Assumindo que você tenha configurado o Firebase Storage
import { collection, doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useParams, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, TextField, CssBaseline, Box, Paper, Grid } from '@mui/material';
import ChangeHistory from './ChangeHistory';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import '../Styles/estilopdfedit.css'
import '../Styles/profileimage.css'
import '../Styles/cadastroestilo.css'
import '../App.css'
import { Document, Page, Text, View, Image, PDFDownloadLink, StyleSheet, pdf } from '@react-pdf/renderer';



interface EmployeeData {
    name: string;
    profileImage?: string;
    phone: string;
    address: string;
    email: string;
    birthDate: string;
    position: string;
    admissionDate: string;
    sector: string;
    salary: string;

  }
  
  const PDFDocumentComponentEdit: React.FC<{ employeeData: EmployeeData }> = ({ employeeData }) => {
    const { name, profileImage, phone, address, email, birthDate, position, admissionDate, sector, salary } = employeeData;
  
    const styles = StyleSheet.create({
        page: {
            padding: 10,
            backgroundColor: '#fff',
            fontFamily: 'Helvetica',
            borderWidth: 1,
            borderColor: '#1976d2',
            height: '100vh',
            width: '100%',
          },
          profileContainer: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          },
          name: {
            fontSize: 24,
            color: '#1976d2',
            fontWeight: 'bold',
          },
          profileImage: {
            width: 100,
            height: 100,
            borderColor: '#1976d2',
            borderWidth: 2,
          },
          section: {
            marginBottom: 20,
            padding: 12,
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 6,
            backgroundColor: '#fff',
          },
          sectionTitle: {
            fontSize: 14,
            color: '#1976d2',
            fontWeight: 'bold',
            marginBottom: 6,
            textTransform: 'uppercase',
          },
          text: {
            fontSize: 12,
            color: '#333',
            marginBottom: 4,
          },
          footer: {
            fontSize: 10,
            color: '#666',
            textAlign: 'center',
            marginTop: 10,
          },
    });
  
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.profileContainer}>
            <Text style={styles.name}>{name}</Text>
            {profileImage && <Image src={profileImage} style={styles.profileImage} />}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações de Contato</Text>
            <Text style={styles.text}>Telefone: {phone}</Text>
            <Text style={styles.text}>Endereço: {address}</Text>
            <Text style={styles.text}>E-mail: {email}</Text>
            <Text style={styles.text}>Data de Nascimento: {birthDate}</Text>
          </View>
  
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações do Funcionário</Text>
            <Text style={styles.text}>Cargo: {position}</Text>
            <Text style={styles.text}>Data de Admissão: {admissionDate}</Text>
            <Text style={styles.text}>Setor: {sector}</Text>
            <Text style={styles.text}>Salário: {salary}</Text>
          </View>
  
          <Text style={styles.footer}>© 2024 Empresa XYZ. Todos os direitos reservados.</Text>
        </Page>
      </Document>
    );
  };

const EditEmployes: React.FC  = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
    const [newPhoto, setNewPhoto] = useState<File | null>(null); // Novo estado para a foto
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

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!id) {
                console.error("ID do funcionário não foi fornecido.");
                setLoading(false);
                return;
            }

            try {
                const employeeDoc = doc(db, 'employees', id);
                const docSnap = await getDoc(employeeDoc);
                if (docSnap.exists()) {
                    const employeeData = docSnap.data();
                    setEmployee(employeeData);
                    setProfileImage(employeeData?.photoURL || null);
                    generatePDF(employeeData);
                } else {
                    console.error("Funcionário não encontrado");
                }
            } catch (error) {
                console.error("Erro ao buscar funcionário:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    useEffect(() => {
        if (employee) {
            generatePDF(employee);
        }
    }, [employee]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEmployee((prev: any) => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setNewPhoto(event.target.files[0]);
        }
    };



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new Error("ID do funcionário inválido.");
            }
    
            const employeeDoc = doc(db, 'employees', id);
    
            // Obtemos os dados atuais do funcionário antes de qualquer alteração
            const employeeSnapshot = await getDoc(employeeDoc);
            const oldEmployeeData = employeeSnapshot.exists() ? employeeSnapshot.data() : null;
    
            // Verifica se existem dados antigos para comparar
            if (!oldEmployeeData) {
                throw new Error("Funcionário não encontrado.");
            }
    
            // Agora, verificamos as alterações em cada campo
            const changedFields: any[] = [];
    
            if (oldEmployeeData.name !== employee.name) {
                changedFields.push({
                    field: 'Nome',
                    oldValue: oldEmployeeData.name,
                    newValue: employee.name
                });
            }
    
            if (oldEmployeeData.email !== employee.email) {
                changedFields.push({
                    field: 'E-mail',
                    oldValue: oldEmployeeData.email,
                    newValue: employee.email
                });
            }
    
            if (oldEmployeeData.phone !== employee.phone) {
                changedFields.push({
                    field: 'Telefone',
                    oldValue: oldEmployeeData.phone,
                    newValue: employee.phone
                });
            }
    
            if (oldEmployeeData.position !== employee.position) {
                changedFields.push({
                    field: 'Cargo',
                    oldValue: oldEmployeeData.position,
                    newValue: employee.position
                });
            }
    
            // Agora, se houver mudanças, registramos no histórico
            if (changedFields.length > 0) {
                const batch = writeBatch(db); // Usando batch para eficiência
    
                changedFields.forEach(change => {
                    const changeHistoryData = {
                        employeeId: id,
                        date: new Date().toISOString(),
                        field: change.field,
                        oldValue: change.oldValue,
                        newValue: change.newValue
                    };
    
                    const changeHistoryRef = collection(db, 'changeHistory');
                    batch.set(doc(changeHistoryRef), changeHistoryData); // Adiciona as alterações no batch
                });
    
                // Comita todas as alterações no histórico
                await batch.commit();
            }
    
            // Upload da nova foto, se houver
            let photoURL = employee?.photoURL || null;
            if (newPhoto) {
                const photoRef = ref(storage, `employees/${id}/${newPhoto.name}`);
                await uploadBytes(photoRef, newPhoto);
                photoURL = await getDownloadURL(photoRef);
            }
    
            // Atualiza o documento do funcionário com a nova URL da foto
            await updateDoc(employeeDoc, { ...employee, photoURL });
    
            alert('Funcionário atualizado com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            alert("Erro ao atualizar funcionário.");
        }
    };

    const generatePDF = async (employeeData: any) => {
        try {
            const blob = await pdf(
                <PDFDocumentComponentEdit employeeData={employeeData} />
            ).toBlob();
            if (blob) {
                setPdfBlob(blob);
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
        }
    };

    if (loading) {
        return <Typography>Carregando...</Typography>;
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setNewPhoto(file);
            setProfileImage(URL.createObjectURL(file)); // Define a URL de pré-visualização
        }
    };

    return (
        <div>
            <CssBaseline />
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>TAUGOR</Link>
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ padding: '20px', marginTop: '64px' }}>
                <Paper sx={{ padding: '20px' }}>
                    <Typography variant="h5" component="h2">Editar Funcionário</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <form onSubmit={handleSubmit}>
                                <Grid item xs={12}>
                                    <div className="CampoNomeImg">
                                        <TextField label="Nome" name="name" className="campoNome" value={employee?.name || ''} onChange={handleChange}  fullWidth size="small" required />
                                        <div className="fotoContent">
                                            <label htmlFor="file-upload" className="custom-file-upload">
                                                <span>+</span>
                                                {profileImage && <img src={profileImage} alt="Profile Preview" className="image-preview" />}
                                            </label>
                                            <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} />
                                        </div>
                                    </div>
                                </Grid>
                                <TextField
                                    name="email"
                                    label="Email"
                                    value={employee?.email || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    name="phone"
                                    label="Telefone"
                                    value={employee?.phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                
                                <TextField
                                    name="position"
                                    label="Cargo"
                                    value={employee?.position || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    name="admissionDate"
                                    label="Data de Admissão"
                                    type="date"
                                    value={employee?.admissionDate || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                                <TextField
                                    name="sector"
                                    label="Setor"
                                    value={employee?.sector || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    name="salary"
                                    label="Salário"
                                    type="number"
                                    value={employee?.salary || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <Button type="submit" variant="contained" color="primary">Salvar</Button>
                            </form>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h6" component="h3">Pré-visualização de PDF</Typography>
                            {pdfBlob && (
                                <div className="pdf-container">
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                    <Viewer fileUrl={URL.createObjectURL(pdfBlob)} />
                                </Worker>
                                </div>
                            )}
                        </Grid>
                    </Grid>
                    {id ? <ChangeHistory employeeId={id} /> : <Typography>Funcionário não encontrado.</Typography>}
                </Paper>
            </Box>
        </div>
    );
};

export default EditEmployes;