import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, writeBatch, getDoc, doc, setDoc } from 'firebase/firestore';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

// Função para atualizar dados do funcionário
const updateEmployee = async (id: string, updatedData: any) => {
    const employeeRef = doc(db, 'employees', id);
    const employeeSnapshot = await getDoc(employeeRef);

    if (!employeeSnapshot.exists()) {
        console.error("Funcionário não encontrado:", id);
        return;
    }

    const oldData = employeeSnapshot.data();
    const changes = [];
    for (const key in updatedData) {
        if (updatedData[key] !== oldData[key]) {
            changes.push({
                field: key,
                oldValue: oldData[key],
                newValue: updatedData[key],
                date: new Date().toISOString(),
                employeeId: id,
            });
        }
    }

    if (changes.length > 0) {
        const batch = writeBatch(db);
        changes.forEach(change => {
            batch.set(doc(collection(db, 'changeHistory')), change);
        });
        await batch.commit();
    }

    await setDoc(employeeRef, updatedData, { merge: true });
};

const ChangeHistory: React.FC<{ employeeId: string }> = ({ employeeId }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyCollection = collection(db, 'changeHistory');
                const q = query(historyCollection, where('employeeId', '==', employeeId));
                const querySnapshot = await getDocs(q);

                const historyData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date,
                    description: `${doc.data().field} alterado de "${doc.data().oldValue}" para "${doc.data().newValue}"`
                }));

                // Ordenar o histórico de alterações pela data (em ordem decrescente)
                const sortedHistory = historyData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                setHistory(sortedHistory);
            } catch (error) {
                console.error("Erro ao buscar histórico:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [employeeId]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    if (loading) return <Typography>Carregando histórico...</Typography>;

    return (
        <div>
            <Typography variant="h6" component="h3">Histórico de Alterações</Typography>
            <List>
                {history.length > 0 ? (
                    history.map((change) => (
                        <ListItem key={change.id}>
                            <ListItemText
                                primary={change.description}
                                secondary={`Data: ${formatDate(change.date)}`} 
                            />
                        </ListItem>
                    ))
                ) : (
                    <Typography>Nenhuma alteração registrada.</Typography>
                )}
            </List>
        </div>
    );
};

export default ChangeHistory;