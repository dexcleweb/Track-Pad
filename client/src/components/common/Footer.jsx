import { FaInstagram, FaYoutube, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const styles = {
    footer: {
      marginTop: "4rem",
      padding: "2rem 1.5rem 1rem",
      borderTop: "1px solid rgba(255,255,255,0.1)",
      background: "#0f172a",
      color: "#fff",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1.5rem",
    },
    brand: {
      flex: 1,
      minWidth: "250px",
    },
    title: {
      margin: 0,
      fontSize: "1.4rem",
      fontWeight: 700,
    },
    description: {
      marginTop: "0.5rem",
      color: "#94a3b8",
      lineHeight: 1.6,
    },
    socials: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
    },
    icon: {
      width: "44px",
      height: "44px",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textDecoration: "none",
      fontSize: "1.2rem",
      transition: "0.3s ease",
    },
    bottom: {
      marginTop: "1.5rem",
      paddingTop: "1rem",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      textAlign: "center",
      color: "#94a3b8",
      fontSize: "0.9rem",
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <h3 style={styles.title}>TrackPad</h3>
          <p style={styles.description}>
            Smart digital products, study resources, and productivity tools
            designed to help you learn faster and achieve more.
          </p>
        </div>

        <div style={styles.socials}>
          <a
            href="https://instagram.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.icon}
          >
            <FaInstagram />
          </a>

          <a
            href="https://youtube.com/@yourchannel"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.icon}
          >
            <FaYoutube />
          </a>

          <a
            href="mailto:otp@trackkpad.com"
            style={styles.icon}
          >
            <FaEnvelope />
          </a>
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} TrackPad. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;