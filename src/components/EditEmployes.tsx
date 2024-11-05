import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase'; // Ajuste o caminho conforme necessário
import { doc, getDoc, updateDoc, setDoc, collection } from 'firebase/firestore';
import { useParams, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, TextField, CssBaseline, Box, Paper } from '@mui/material';
import ChangeHistory from './ChangeHistory';

const EditEmployes: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!id || typeof id !== 'string' || id.trim() === '') {
                throw new Error("ID do funcionário inválido.");
            }
            const employeeDoc = doc(db, 'employees', id);
            const oldEmployeeData = { ...employee }; // Salvar os dados antigos aqui
            await updateDoc(employeeDoc, employee);

            // Salvar no histórico de alterações
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


                    {id ? <ChangeHistory employeeId={id} /> : <Typography>Funcionário não encontrado.</Typography>}
                </Paper>
            </Box>
        </div>
    );
};

export default EditEmployes;