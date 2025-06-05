import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FcCalendar, FcClock, FcBusinessman, FcOk, FcDocument, FcCancel } from 'react-icons/fc';

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
      <Modal.Header closeButton style={{ background: '#f5f7fa', borderBottom: '2px solid #e3e6ea' }}>
        <Modal.Title>
          <FcCalendar style={{ marginRight: 8, fontSize: 28 }} />
          Agendar Cita
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body style={{ background: '#f9fafb' }}>
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

          <Form.Group>
            <Form.Label>
              <FcDocument style={{ marginRight: 6, fontSize: 20 }} />
              Descripción (opcional)
            </Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              style={{ borderRadius: 8, borderColor: '#e3e6ea' }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer style={{ background: '#f9fafb', borderTop: '2px solid #e3e6ea' }}>
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
            Guardar
          </Button>
          <Button
            variant="outline-danger"
            onClick={onHide}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 500,
              borderRadius: 8,
              borderWidth: 2,
            }}
          >
            <FcCancel style={{ fontSize: 22 }} />
            Cancelar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CitaFormModal;
