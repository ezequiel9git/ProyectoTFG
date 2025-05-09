import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CitaEditModal = ({ show, onHide, onSave, onDelete, cita, pacientes }) => {
  const [formData, setFormData] = useState({
    paciente: '',
    fecha_inicio: '',
    fecha_fin: '',
    descripcion: '',
  });

  useEffect(() => {
    if (cita) {
      setFormData({
        paciente: cita.paciente,
        fecha_inicio: cita.fecha_inicio,
        fecha_fin: cita.fecha_fin,
        descripcion: cita.descripcion || '',
      });
    }
  }, [cita]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cita</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
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
            <Form.Label>Fecha y hora de inicio</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha y hora de fin</Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="danger" onClick={onDelete}>
              Eliminar
            </Button>
            <Button type="submit" variant="primary">
              Guardar Cambios
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CitaEditModal;
