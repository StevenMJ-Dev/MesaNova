
import { useState } from 'react';

export default function Register({ onRegister, onLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function updateField(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (Object.values(form).some((value) => !value.trim())) {
      setError('Completa todos los campos.');
      return;
    }

    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    // Registro simulado: todavía no guarda cuentas reales.
    onRegister?.({
      name: form.name,
      email: form.email,
    });
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <h1>Crear cuenta</h1>

        <p className="login-subtitle">
          Regístrate en MesaNova y comienza a disfrutar
          de una experiencia gastronómica única.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-name">
            Nombre completo
          </label>
          <input
            id="register-name"
            name="name"
            type="text"
            placeholder="Ingresa tu nombre completo"
            value={form.name}
            onChange={updateField}
            autoComplete="name"
            required
          />

          <label htmlFor="register-email">
            Correo electrónico
          </label>
          <input
            id="register-email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />

          <label htmlFor="register-password">
            Contraseña
          </label>
          <div className="password-field">
            <input
              id="register-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              value={form.password}
              onChange={updateField}
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <label htmlFor="register-confirm">
            Confirmar contraseña
          </label>
          <input
            id="register-confirm"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repite tu contraseña"
            value={form.confirmPassword}
            onChange={updateField}
            autoComplete="new-password"
            required
          />

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="primary full" type="submit">
            Crear cuenta
          </button>
        </form>

        <p className="login-register">
          ¿Ya tienes una cuenta?{' '}
          <button type="button" onClick={onLogin}>
            Iniciar sesión
          </button>
        </p>
      </div>
    </section>
  );
}
