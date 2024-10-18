import React, { useEffect } from 'react';
import { ListGroup, Button, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';

const EmergencyContactList = ({ contacts, error, fetchContacts, onDelete }) => {
    // const [contacts, setContacts] = useState([]);
    // const [error, setError] = useState('');


    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_END_POINT}/emergency-contacts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Coookie': Cookies.get('tokken')
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete contact');
            }

            onDelete(id); // Call the callback to update the list
            fetchContacts();
        } catch (error) {
            console.error('Error deleting contact:', error);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div>
            <h2>Emergency Contacts</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <ListGroup>
                {contacts.map(contact => (
                    <ListGroup.Item key={contact._id} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{contact.name}</strong> ({contact.relationship}) - {contact.phone} - {contact.emailId}
                        </div>
                        <Button variant="danger" onClick={() => handleDelete(contact._id)}>Delete</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default EmergencyContactList;
