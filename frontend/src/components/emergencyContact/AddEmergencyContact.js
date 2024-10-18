import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';

const AddEmergencyContact = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [relationship, setRelationship] = useState('');
    const [phone, setPhone] = useState('');
    const [emailId, setEmailId] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const contactDetails = { name, relationship, phone, emailId };

        try {
            const response = await fetch(`${process.env.REACT_APP_END_POINT}/emergency-contacts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Coookie': Cookies.get('tokken')
                },
                body: JSON.stringify(contactDetails)
            });

            if (!response.ok) {
                throw new Error('Failed to add emergency contact');
            }

            const data = await response.json();
            setSuccess('Emergency contact added successfully!');
            onAdd(data); // Call the callback to update the list
            setName('');
            setRelationship('');
            setPhone('');
            setEmailId('');
        } catch (error) {
            setError(error.message);
            console.error('Error adding contact:', error);
        }
    };

    return (
        <div className="mb-4">
            <h2>Add Emergency Contact</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        placeholder="Enter name"
                    />
                </Form.Group>
                <Form.Group controlId="formRelationship">
                    <Form.Label>Relationship</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={relationship} 
                        onChange={(e) => setRelationship(e.target.value)} 
                        required 
                        placeholder="Enter relationship"
                    />
                </Form.Group>
                <Form.Group controlId="formPhone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        required 
                        placeholder="Enter phone number"
                    />
                </Form.Group>
                <Form.Group controlId="formEmailId">
                    <Form.Label>Email ID</Form.Label>
                    <Form.Control 
                        type="email" 
                        value={emailId} 
                        onChange={(e) => setEmailId(e.target.value)} 
                        required 
                        placeholder="Enter email ID"
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Add Contact</Button>
            </Form>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        </div>
    );
};

export default AddEmergencyContact;
