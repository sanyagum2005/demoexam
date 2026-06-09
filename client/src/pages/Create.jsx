import './Create.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Create() {
    const [courseName, setCourseName] = useState('Основы алгоритмизации и программирования');
    const [payment, setPayment] = useState('Наличными');
    const [startDate, setStartDate] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('id');
        await axios.post(`/api/applications/${userId}`, {
            name: courseName,
            startDate,
            payment: payment,
        });

        alert('Заявка создана!')
        navigate('/dashboard');
    }

    return (
        <>
        <h1 className="create-title">Создание заявки</h1>
        <div className="create-container">
            <form className='create-form' onSubmit={handleSubmit}>
                <h3>Выберите курс</h3>
                <select className='course-select name-select' value={courseName} onChange={(e) => setCourseName(e.target.value)}>
                    <option value="Основы алгоритмизации и программирования">Аудитория</option>
                    <option value="Основы веб-дизайна">Коворкинг</option>
                    <option value="Основы проектирования баз данных">Кинозал</option>
                </select>
                <h3>Способ оплаты</h3>
                <select className='course-select payment-select' value={payment} onChange={(e) => setPayment(e.target.value)}>
                    <option value="Наличными">Наличными</option>
                    <option value="По номеру телефона">По номеру телефона</option>
                </select>
                <h3>Дата начала</h3>
                <input type="datetime-local" className='course-select date-select' placeholder='ДД.ММ.ГГГГ' required onChange={(e) => setStartDate(e.target.value)} />
                <button type="submit" className='create-btn'>Отправить</button>
            </form>
        </div>
        </>
    )
}