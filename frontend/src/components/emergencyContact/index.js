import React, { useState } from 'react';
import AddEmergencyContact from './AddEmergencyContact';
import EmergencyContactList from './EmergencyContactList';
import Cookies from 'js-cookie';

const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState('');

    const fetchContacts = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_END_POINT}/emergency-contacts`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Coookie': Cookies.get('tokken')
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch emergency contacts');
            }

            const data = await response.json();
            setContacts(data);
        } catch (error) {
            setError(error.message);
            console.error('Error fetching contacts:', error);
        }
    };


    const handleAddContact = (newContact) => {
        setContacts(prev => [...prev, newContact]);
    };

    const handleDeleteContact = (id) => {
        setContacts(prev => prev.filter(contact => contact._id !== id));
    };

    return (
        <div className='container m-5'>
            <AddEmergencyContact onAdd={handleAddContact} />
            <EmergencyContactList contacts={contacts} error={error} fetchContacts={fetchContacts} onDelete={handleDeleteContact} />
        </div>
    );
};

export default EmergencyContacts;
