import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import {fetchClubs} from '../../api/clubs'
import './LandingPage.css';

function LandingPage() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getClubs = async () => {
      setLoading(true); 
      try {
        const clubsData = await fetchClubs(); 
        setClubs(clubsData); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };

    getClubs(); 
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Header title="Welcome to the Landing Page" />
      <main>
        <div>
          <h2>Our Clubs</h2>
          <div className="card-container">
            {clubs.map((club) => (
              <div key={club.id} className="card">
                <h3>{club.title}</h3>
                <img src={club.imageUrl} alt={club.title} />
              </div>
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;
