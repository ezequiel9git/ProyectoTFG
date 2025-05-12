import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const CitaFormModal = ({ show, onHide, onSubmit, pacientes, fechaInicial }) => {
  const [formData, setFormData] = useState({
    paciente: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
  });

  useEffect(() => {
    if (fechaInicial) {
      setFormData(prev => ({
        ...prev,
        fecha_inicio: `${fechaInicial}T09:00`,
        fecha_fin: `${fechaInicial}T09:30`,
      }));
    }
  }, [fechaInicial]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Agendar Cita</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Paciente</Form.Label>
            <Form.Select
              name="paciente"
              value={formData.paciente}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Inicio</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fin</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onHide}>Cancelar</Button>
          <Button type="submit" variant="primary">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CitaFormModal;
