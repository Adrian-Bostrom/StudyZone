
const Footer = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <div style={styles.section}>
                </div>
                <div style={styles.section}>
                    <h4>Quick Links:</h4>
                    <ul style={styles.list}>
                        <li><a href="/contact" style={styles.link}>Contact</a></li>
                        <li><a href="/faq" style={styles.link}>FAQ</a></li>
                    </ul>
                </div>
                <div style={styles.section}>
                    <div style={styles.socialIcons}>
                    </div>
                </div>
            </div>
            <div style={styles.bottomBar}>
                <p>&copy; {new Date().getFullYear()} StudyZone. All rights reserved.</p>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#282c34',
        color: '#fff',
        padding: '20px 0',
        textAlign: 'center',
    },
    container: {
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    section: {
        flex: '1',
        margin: '10px',
        minWidth: '200px',
    },
    list: {
        listStyle: 'none',
        padding: 0,
    },
    link: {
        color: '#61dafb',
        textDecoration: 'none',
    },
    socialIcons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    icon: {
        color: '#61dafb',
        textDecoration: 'none',
    },
    bottomBar: {
        marginTop: '20px',
        borderTop: '1px solid #444',
        paddingTop: '10px',
    },
};

export default Footer;