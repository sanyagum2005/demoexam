import './Admin.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

export default function Admin() {
    const [apps, setApps] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (!localStorage.getItem('id')) navigate('/');
            if (localStorage.getItem('role') === 'user') navigate('/dashboard');

            const response = await axios.get('/api/admin/applications');
            setApps(response.data);
        })();
    }, []);

    const handleChangeStatus = async (id, newStatus) => {
        await axios.put(`/api/admin/applications/${id}`, { status: newStatus })
        setApps((prev) => prev.map((app) => app.id === id ? {...app, status: newStatus} : app))
    }

    return (
        <>
        <h1>Список всех заявок</h1>
        <LogoutButton />
        <div className="admin-container">
            {apps.map((app) => (
                <div key={app.id} className="application">
                    <h3 className="course-title">{app.course_name} (ID: {app.id})</h3>
                    <h4 className="course-user">{app.fio}, {app.email}, {app.phone} (ID: {app.user_id})</h4>
                    <div className="course-date">Идёт с {new Date(app.start_date).toLocaleString()}</div>
                    <div className="course-payment">Способ оплаты: {app.payment}</div>
                    <div className="app-status">Статус:</div>
                    <select value={app.status} onChange={(e) => handleChangeStatus(app.id, e.target.value)}>
                        <option value="Новая">Новая</option>
                        <option value="Идет обучение">Идет обучение</option>
                        <option value="Обучение завершено">Обучение завершено</option>
                    </select>
                    {app.review && (
                        <>
                        <div className="review-title">Отзыв от клиента:</div>
                        <div className="review">{app.review}</div>
                        </>
                    )}
                </div>
            ))}
        </div>
        </>
    )
}