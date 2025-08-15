import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/user.api";
import { Link } from 'react-router-dom';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await registerUser(name, email, password);
      
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      alert(`Account created successfully! Welcome, ${name}!`); 
      
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    alert(`${provider} registration integration coming soon!`);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #faf5ff 100%)',
      padding: '1rem'
    },
    backgroundBlob1: {
      position: 'absolute',
      top: '-10rem',
      right: '-10rem',
      width: '20rem',
      height: '20rem',
      background: 'linear-gradient(135deg, #60a5fa, #a855f7)',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(3rem)',
      opacity: '0.2',
      animation: 'blob 7s infinite'
    },
    backgroundBlob2: {
      position: 'absolute',
      bottom: '-10rem',
      left: '-10rem',
      width: '20rem',
      height: '20rem',
      background: 'linear-gradient(135deg, #f472b6, #fb923c)',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(3rem)',
      opacity: '0.2',
      animation: 'blob 7s infinite',
      animationDelay: '2s'
    },
    backgroundBlob3: {
      position: 'absolute',
      top: '10rem',
      left: '10rem',
      width: '20rem',
      height: '20rem',
      background: 'linear-gradient(135deg, #fbbf24, #ef4444)',
      borderRadius: '50%',
      mixBlendMode: 'multiply',
      filter: 'blur(3rem)',
      opacity: '0.2',
      animation: 'blob 7s infinite',
      animationDelay: '4s'
    },
    mainContent: {
      position: 'relative',
      width: '100%',
      maxWidth: '28rem'
    },
    logoSection: {
      textAlign: 'center',
      marginBottom: '2rem'
    },
    logoIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '1rem'
    },
    logoCircle: {
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    },
    logoText: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent'
    },
    logoSubtext: {
      color: '#4b5563',
      marginTop: '0.5rem'
    },
    card: {
      backdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      border: 'none',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '2rem'
    },
    cardHeader: {
      textAlign: 'center',
      marginBottom: '1.5rem'
    },
    cardTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    cardDescription: {
      color: '#4b5563'
    },
    socialButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0.75rem',
      marginBottom: '1.5rem'
    },
    socialButton: {
      height: '3rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '0.875rem',
      fontWeight: '500',
      color:'black'
    },
    separator: {
      position: 'relative',
      marginBottom: '1.5rem'
    },
    separatorLine: {
      height: '1px',
      backgroundColor: '#e5e7eb',
      width: '100%'
    },
    separatorText: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '0 0.5rem',
      fontSize: '0.75rem',
      color: '#6b7280',
      textTransform: 'uppercase'
    },
    formGroup: {
      marginBottom: '1.25rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    inputContainer: {
      position: 'relative'
    },
    input: {
      width: '100%',
      height: '3rem',
      paddingLeft: '2.5rem',
      paddingRight: '2.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      outline: 'none',
      color:'black'
    },
    inputIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '1.25rem',
      height: '1.25rem',
      color: '#9ca3af'
    },
    passwordToggle: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#9ca3af',
      cursor: 'pointer',
      padding: '0.25rem'
    },
    termsRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem'
    },
    checkbox: {
      width: '1rem',
      height: '1rem',
      marginRight: '0.5rem'
    },
    submitButton: {
      width: '100%',
      height: '3rem',
      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
      color: 'white',
      border: 'none',
      borderRadius: '0.5rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      marginBottom: '1.5rem'
    },
    submitButtonDisabled: {
      opacity: '0.5',
      cursor: 'not-allowed'
    },
    loginText: {
      textAlign: 'center',
      fontSize: '0.875rem',
      color: '#4b5563'
    },
    loginLink: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '500'
    },
    footer: {
      textAlign: 'center',
      marginTop: '2rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    footerLinks: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '0.5rem'
    },
    footerLink: {
      color: '#6b7280',
      textDecoration: 'none',
      transition: 'color 0.2s'
    },
    spinner: {
      width: '1.25rem',
      height: '1.25rem',
      border: '2px solid white',
      borderTop: '2px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          .social-button:hover {
            border-color: #d1d5db !important;
            background-color: #f9fafb !important;
          }
          
          .input:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
          
          .submit-button:hover:not(:disabled) {
            background: linear-gradient(135deg, #1d4ed8, #6d28d9) !important;
            transform: scale(1.02) !important;
          }
          
          .footer-link:hover {
            color: #374151 !important;
          }
        `}
      </style>
      
      <div style={styles.container}>
        {/* Background decorative elements */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          <div style={styles.backgroundBlob1}></div>
          <div style={styles.backgroundBlob2}></div>
          <div style={styles.backgroundBlob3}></div>
        </div>

        <div style={styles.mainContent}>
          {/* Logo and Brand */}
          

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Create your account</h2>
              <p style={styles.cardDescription}>Join thousands of users who trust ShortLink Pro</p>
            </div>
            
            {/* Social Register Buttons */}
            <div style={styles.socialButtons}>
              <button
                className="social-button"
                style={styles.socialButton}
                onClick={() => handleSocialRegister("Google")}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                className="social-button"
                style={styles.socialButton}
                onClick={() => handleSocialRegister("GitHub")}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            <div style={styles.separator}>
              <div style={styles.separatorLine}></div>
              <span style={styles.separatorText}>Or register with email</span>
            </div>

            {/* Register Form */}
            <form onSubmit={handleRegister}>
              <div style={styles.formGroup}>
                <label htmlFor="name" style={styles.label}>Full Name</label>
                <div style={styles.inputContainer}>
                  <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    className="input"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="email" style={styles.label}>Email</label>
                <div style={styles.inputContainer}>
                  <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <input
                    className="input"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="password" style={styles.label}>Password</label>
                <div style={styles.inputContainer}>
                  <svg style={styles.inputIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    className="input"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    style={styles.input}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={styles.passwordToggle}
                  >
                    {showPassword ? (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464M9.878 9.878l-.002-.002m4.242 4.242L16.536 16.536m-2.418-2.418l.002.002m-4.242-4.242L2.343 2.343m7.535 7.535L16.536 16.536" />
                      </svg>
                    ) : (
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div style={styles.termsRow}>
                <input
                  id="terms"
                  type="checkbox"
                  style={styles.checkbox}
                  required
                />
                <label htmlFor="terms" style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                  I agree to the <span style={{ color: '#2563eb', fontWeight: '500' }}>Terms of Service</span> and <span style={{ color: '#2563eb', fontWeight: '500' }}>Privacy Policy</span>
                </label>
              </div>

              <button
                className="submit-button"
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.submitButton,
                  ...(isLoading ? styles.submitButtonDisabled : {})
                }}
              >
                {isLoading ? (
                  <>
                    <div style={styles.spinner}></div>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div style={styles.loginText}>
              Already have an account?{" "}
              <Link to="/login" style={styles.loginLink}>
  Sign in here
</Link>
            </div>
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <p>© 2024 ShortLink Pro. All rights reserved.</p>
            <div style={styles.footerLinks}>
              <a href="#" className="footer-link" style={styles.footerLink}>Privacy</a>
              <a href="#" className="footer-link" style={styles.footerLink}>Terms</a>
              <a href="#" className="footer-link" style={styles.footerLink}>Support</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
