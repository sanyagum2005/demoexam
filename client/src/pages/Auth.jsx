import './Auth.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Auth() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                await axios.post('/api/register', { fio: username, phone, email, login, password });
                setIsRegistering(false);
            } else {
                const response = await axios.post('/api/login', { login, password });
                localStorage.setItem('id', response.data.id);
                localStorage.setItem('role', response.data.role);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="auth-container">
            <p className="error">{error}</p>
            {isRegistering ? (
                <>
                <h2 className="auth-title">Регистрация</h2>
                <form className='auth-form' onSubmit={handleFormSubmit}>
                    <input className='auth-input' type="text" placeholder='Имя пользователя' value={username} onChange={(e) => setUsername(e.target.value)} required />
                    <input className='auth-input' type="tel" placeholder='Номер телефона' value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    <input className='auth-input' type="email" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input className='auth-input' type="text" placeholder='Логин' value={login} onChange={(e) => setLogin(e.target.value)} required />
                    <input className='auth-input' type="password" placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className='auth-btn'>Зарегистрироваться</button>
                    <p className="auth-guess" onClick={() => setIsRegistering(false)}>Уже зарегистрированы? Войти</p>
                </form>
                </>
            ) : (
                <>
                <h2 className="auth-title">Авторизация</h2>
                <form className='auth-form' onSubmit={handleFormSubmit}>
                    <input className='auth-input' type="text" placeholder='Логин' value={login} onChange={(e) => setLogin(e.target.value)} required />
                    <input className='auth-input' type="password" placeholder='Пароль' value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className='auth-btn'>Войти</button>
                    <p className="auth-guess" onClick={() => setIsRegistering(true)}>Нет аккаунта? Зарегистрироваться</p>
                </form>
                </>
            )}
        </div>
    )
}