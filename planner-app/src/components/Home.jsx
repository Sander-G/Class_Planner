import { initializeFirebaseApp } from '../../firebaseConfig';

export default function Home() {
  const handleLogout = async () => {
    try {
      const { auth } = await initializeFirebaseApp();
      await auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Home</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
