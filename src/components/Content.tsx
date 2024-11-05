import React from 'react';
import { Box, Typography, Button, useMediaQuery, useTheme, Stack, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function Content() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (

        <Box
            sx={{
                marginTop: '70px',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh',
                backgroundColor: theme.palette.background.default,
                px: isMobile ? 2 : 4,
            }}
        >

 
            <Paper
                elevation={3}
                sx={{
                    padding: isMobile ? 2 : 4,
                    borderRadius: 4,
                    maxWidth: 500,
                    width: '100%',
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                
                <Typography variant="h4" sx={{ mb: 4, color: theme.palette.text.secondary }}>
                    Escolha uma das opções abaixo para começar:
                </Typography>
                
                <Stack spacing={2} direction="column" alignItems="center">
                    <Button
                        variant="contained"
                        component={Link}
                        to="/add-employee"
                        sx={{
                            backgroundColor: '#19B5FE',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1DA1F2',
                            },
                            width: '100%',
                            maxWidth: 300,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Cadastrar Usuário
                    </Button>
                    
                    <Button
                        variant="outlined"
                        component={Link}
                        to="/AddEmployes"
                        sx={{
                            color: '#19B5FE',
                            borderColor: '#19B5FE',
                            '&:hover': {
                                backgroundColor: '#e3f4fd',
                                borderColor: '#1DA1F2',
                            },
                            width: '100%',
                            maxWidth: 300,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        Gerenciar Usuários
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
}

export default Content;