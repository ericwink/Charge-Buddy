import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form';

export default function EditComment({ comment, rating, stationID, commentID, editComment }) {

    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false)
        setNewComment(comment)
    }

    const handleSave = () => {
        editComment(stationID, commentID, newComment, newRating)
        setShow(false)
    }
    const handleShow = () => setShow(true);
    const [newComment, setNewComment] = useState(comment)
    const [newRating, setNewRating] = useState(rating)

    return (
        <>
            <Button size='sm' variant='outline' onClick={handleShow}>
                <i class="fa-solid fa-pencil"></i></Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Select value={newRating} onChange={(e) => setNewRating(e.target.value)} size='sm' aria-label="Default select example">
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </Form.Select>

                    <InputGroup className="mb-1 dropshadow">
                        <Form.Control as='textarea' value={newComment} onChange={(e) => setNewComment(e.target.value)}></Form.Control>
                    </InputGroup>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="success" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}