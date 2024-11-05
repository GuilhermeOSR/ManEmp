import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, TextField, CssBaseline, Box, Paper, Grid } from '@mui/material';
import ChangeHistory from './ChangeHistory';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


const EditEmployes: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

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
                    setEmployee(docSnap.data());
                    generatePDF(docSnap.data());
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setEmployee((prev: any) => ({ ...prev, [name]: value }));
        generatePDF({ ...employee, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new Error("ID do funcionário inválido.");
            }
            const employeeDoc = doc(db, 'employees', id);
            const oldEmployeeData = { ...employee };
            await updateDoc(employeeDoc, employee);

            const changeHistoryData = {
                employeeId: id,
                date: new Date().toISOString(),
                field: 'Nome',
                oldValue: oldEmployeeData.name,
                newValue: employee.name
            };

            await setDoc(doc(collection(db, 'changeHistory')), changeHistoryData);

            alert('Funcionário atualizado com sucesso!');
        } catch (error) {
            console.error("Erro ao atualizar funcionário:", error);
            alert("Erro ao atualizar funcionário.");
        }
    };

    const generatePDF = async (employeeData: any) => {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
    
        const { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
        page.drawText(`Nome: ${employeeData.name || ''}`, { x: 50, y: height - 50, size: 12, font, color: rgb(0, 0, 0) });
        page.drawText(`Email: ${employeeData.email || ''}`, { x: 50, y: height - 70, size: 12, font });
        page.drawText(`Telefone: ${employeeData.phone || ''}`, { x: 50, y: height - 90, size: 12, font });
        page.drawText(`Gênero: ${employeeData.gender || ''}`, { x: 50, y: height - 110, size: 12, font });
        page.drawText(`Cargo: ${employeeData.position || ''}`, { x: 50, y: height - 130, size: 12, font });
        page.drawText(`Data de Admissão: ${employeeData.admissionDate || ''}`, { x: 50, y: height - 150, size: 12, font });
        page.drawText(`Setor: ${employeeData.sector || ''}`, { x: 50, y: height - 170, size: 12, font });
        page.drawText(`Salário: ${employeeData.salary || ''}`, { x: 50, y: height - 190, size: 12, font });
    
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        setPdfBlob(pdfBlob);
    };

    if (loading) {
        return <Typography>Carregando...</Typography>;
    }

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
                                <TextField
                                    name="name"
                                    label="Nome"
                                    value={employee?.name || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
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
                                    name="gender"
                                    label="Gênero"
                                    value={employee?.gender || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    required
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
                                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                                    <Viewer fileUrl={URL.createObjectURL(pdfBlob)} />
                                </Worker>
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