import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Principal />
  )
}

function Principal() {
  // --- 1. ESTADO DEL CRUD ---
  // Inicializamos con un par de registros de ejemplo
  const [items, setItems] = useState([
    { id: '1', nombre: 'Prueba 1', descripcion: 'CRUD' },
    { id: '2', nombre: 'Prueba 2', descripcion: 'Gemini' }
  ]);

  // Estado del formulario (sirve tanto para Crear como para Editar)
  const [formData, setFormData] = useState({ id: '', nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);

  // --- 2. MANEJADORES DE EVENTOS ---
  
  // Escucha los cambios en los inputs y actualiza el estado del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Enviar formulario (Crear o Editar)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica de campos vacíos
    if (!formData.nombre.trim() || !formData.descripcion.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (isEditing) {
      // UPDATE: Reemplaza el elemento editado en el array
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === formData.id ? formData : item))
      );
    } else {
      // CREATE: Agrega un nuevo elemento con un ID generado
      const newItem = {
        id: Math.random().toString(36).substring(2, 9),
        nombre: formData.nombre,
        descripcion: formData.descripcion
      };
      setItems((prevItems) => [...prevItems, newItem]);
    }

    resetForm();
  };

  // DELETE: Elimina un registro por ID
  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este registro?')) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      
      // Si el elemento eliminado estaba en el formulario de edición, lo limpiamos
      if (formData.id === id) {
        resetForm();
      }
    }
  };

  // READ: Carga los datos del elemento seleccionado en el formulario para editarlo
  const handleEdit = (item) => {
    setIsEditing(true);
    setFormData(item);
  };

  // Resetear el formulario al estado inicial vacio
  const resetForm = () => {
    setFormData({ id: '', nombre: '', descripcion: '' });
    setIsEditing(false);
  };

  // --- 3. RENDERIZADO ---
  return (   
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* Logos decorativos (aprovechando tus imports) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
        <img src={viteLogo} className="logo" alt="Vite logo" style={{ height: '40px' }} />
        <img src={reactLogo} className="logo react" alt="React logo" style={{ height: '40px' }} />
      </div>

      <h1 style={{ textAlign: 'center', color: '#ddd8d8' }}>CRUD Panel Principal</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '30px', marginTop: '30px' }}>
        
        {/* COLUMNA IZQUIERDA: Formulario */}
        <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', height: 'fit-content' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem' }}>
            {isEditing ? 'Editar Registro' : 'Nuevo Registro'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre del proyecto"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Breve descripción..."
                rows="3"
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                style={{ flex: 1, padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* COLUMNA DERECHA: Lista de registros */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem', marginBottom: '20px' }}>Registros Activos</h2>
          
          {items.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', textAlign: 'center' }}>No hay registros disponibles.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {items.map((item) => (
                <div 
                  key={item.id} 
                  style={{ padding: '15px', border: '1px solid #eee', borderRadius: '6px', backgroundColor: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.05rem', color: '#222' }}>{item.nombre}</h3>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>{item.descripcion}</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ padding: '5px 10px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;