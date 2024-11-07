import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

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

interface PDFDocumentProps {
  name: string;
  email: string;
  phone: string;
  gender: string;
  birthDate: string;
  address: string;
  position: string;
  admissionDate: string;
  sector: string;
  salary: string;
  profileImage: string | null;
}

const PDFDocumentComponent: React.FC<PDFDocumentProps> = ({
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
}) => (
  <Document>
    <Page style={styles.page}>
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




export default PDFDocumentComponent;