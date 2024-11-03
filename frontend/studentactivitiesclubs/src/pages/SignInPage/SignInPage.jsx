import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import './SignInPage.css'

function SignInPage() {
    const navigate = useNavigate();
  
    return (
      <div>
        <Header title="Sign In" />
  
        <main style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Sign In</h2>
          <form>
            <label>
              Email:
              <input type="email" name="email" required />
            </label>
            <br />
            <label>
              Password:
              <input type="password" name="password" required />
            </label>
            <br />
            <button type="submit">Sign In</button>
          </form>
  
          <button style={{ marginTop: '20px' }} onClick={() => navigate('/')}>
            Go Back
          </button>
        </main>
  
        <Footer />
      </div>
    );
  }

export default SignInPage;