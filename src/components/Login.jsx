
import { useState } from 'react';

export default function Login({ onLogin, onRegister }) {
  const [role, setRole] = useState('cliente');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Completa todos los campos.');
      return;
    }

    if (!email.includes('@')) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    // Autenticación simulada: todavía no valida cuentas reales.
    onLogin?.(role, email);
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <h1>Iniciar sesión</h1>

        <p className="login-subtitle">
          Bienvenido a MesaNova. Ingresa tus datos
          para continuar.
        </p>

        <div className="login-roles">
          <button
            type="button"
            className={role === 'cliente' ? 'selected' : ''}
            onClick={() => setRole('cliente')}
          >
            Cliente
          </button>

          <button
            type="button"
            className={role === 'admin' ? 'selected' : ''}
            onClick={() => setRole('admin')}
          >
            Administrador
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">
            Correo electrónico
          </label>

          <input
            id="login-email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="login-password">
            Contraseña
          </label>

          <div className="password-field">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button className="primary full" type="submit">
            Iniciar sesión
          </button>
        </form>

        <p className="login-register">
          ¿No tienes una cuenta?{' '}
          <button type="button" onClick={onRegister}>
            Crear cuenta
          </button>
        </p>
      </div>
    </section>
  );
}
