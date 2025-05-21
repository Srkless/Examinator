import React, { useEffect } from 'react';
import Logout from '../components/Logout';

export default function LogoutPage() {

  useEffect(() => {
    localStorage.removeItem('token');
  }, []);

  return <Logout />;
}
