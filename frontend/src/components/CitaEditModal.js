import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FcCalendar, FcClock, FcBusinessman, FcOk, FcEmptyTrash, FcDocument } from 'react-icons/fc';

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
      <Modal.Header closeButton style={{ background: '#f5f7fa', borderBottom: '2px solid #e3e6ea' }}>
        <Modal.Title>
          <FcCalendar style={{ marginRight: 8, fontSize: 28 }} />
          Editar Cita
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: '#f9fafb' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <FcBusinessman style={{ marginRight: 6, fontSize: 20 }} />
              Paciente
            </Form.Label>
            <Form.Select
              name="paciente"
              value={formData.paciente}
              onChange={handleChange}
              required
              style={{ borderRadius: 8, borderColor: '#e3e6ea' }}
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
            <Form.Label>
              <FcClock style={{ marginRight: 6, fontSize: 20 }} />
              Fecha y hora de inicio
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
              style={{ borderRadius: 8, borderColor: '#e3e6ea' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FcClock style={{ marginRight: 6, fontSize: 20, transform: 'rotate(180deg)' }} />
              Fecha y hora de fin
            </Form.Label>
            <Form.Control
              type="datetime-local"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              required
              style={{ borderRadius: 8, borderColor: '#e3e6ea' }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <FcDocument style={{ marginRight: 6, fontSize: 20 }} />
              Descripción (opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              style={{ borderRadius: 8, borderColor: '#e3e6ea' }}
            />
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <Button
              type="submit"
              variant="primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 500,
                borderRadius: 8,
                background: 'linear-gradient(90deg, #4e9af1 0%, #6ed6f7 100%)',
                border: 'none',
              }}
            >
              <FcOk style={{ fontSize: 22 }} />
              Guardar Cambios
            </Button>
            <Button
              variant="outline-danger"
              onClick={onDelete}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontWeight: 500,
                borderRadius: 8,
                borderWidth: 2,
              }}
            >
              <FcEmptyTrash style={{ fontSize: 22 }} />
              Eliminar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CitaEditModal;
