import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete'; 
import { Link } from 'react-router-dom';

interface Employee {
    id: string;
    name: string;
    email: string;
    gender: string;
    phone?: string;
    position?: string;
    admissionDate?: string;
    sector?: string;
    salary?: number;
}

const ListEmployes: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const employeesCollection = collection(db, 'employees');
                const snapshot = await getDocs(employeesCollection);
                const employeesList = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Employee[];
                setEmployees(employeesList);
            } catch (error) {
                console.error("Erro ao buscar funcionários:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'employees', id));
            setEmployees(employees.filter(employee => employee.id !== id)); // Remove o funcionário da lista local
            setOpenDialog(false); // Fecha o diálogo
        } catch (error) {
            console.error("Erro ao excluir funcionário:", error);
        }
    };

    const handleDialogOpen = (id: string) => {
        setDeleteId(id);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setDeleteId(null);
    };

    return (
        <TableContainer component={Paper} sx={{ margin: '20px', maxWidth: '100%' }}>
            <Typography variant="h5" component="h2" sx={{ padding: '16px' }}>
                Lista de Funcionários
            </Typography>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Nome</strong></TableCell>
                        <TableCell><strong>Email</strong></TableCell>
                        <TableCell><strong>Telefone</strong></TableCell>
                        <TableCell><strong>Genero</strong></TableCell>
                        <TableCell><strong>Cargo</strong></TableCell>
                        <TableCell><strong>Data de Admissão</strong></TableCell>
                        <TableCell><strong>Setor</strong></TableCell>
                        <TableCell><strong>Salário</strong></TableCell>
                        <TableCell><strong>Ações</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {employees.length > 0 ? (
                        employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.phone || '-'}</TableCell>
                                <TableCell>{employee.gender || '-'}</TableCell>
                                <TableCell>{employee.position || '-'}</TableCell>
                                <TableCell>{employee.admissionDate || '-'}</TableCell>
                                <TableCell>{employee.sector || '-'}</TableCell>
                                <TableCell>{(Number(employee.salary)).toFixed(2) || '-'}</TableCell>
                                <TableCell>
                                    <Link to={`/edit/${employee.id}`}>
                                        <IconButton color="primary">
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                    <IconButton onClick={() => handleDialogOpen(employee.id)} color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                                <Typography variant="body1">Nenhum funcionário cadastrado.</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>


            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Confirmação de Exclusão</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja demitir esse funcionário?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={() => deleteId && handleDelete(deleteId)} color="secondary">
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
};

export default ListEmployes;