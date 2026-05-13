const express = require('express');
const db = require('./database');

const app = express();
app.use(express.json());

// =============================================
// ФІЛЬМИ (movies)
// =============================================

// GET /movies — отримати всі фільми
app.get('/movies', (req, res) => {
    const movies = db.prepare('SELECT * FROM movies').all();
    res.json(movies);
});

// GET /movies/:id — отримати фільм за ID
app.get('/movies/:id', (req, res) => {
    const movie = db.prepare('SELECT * FROM movies WHERE movie_id = ?').get(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Фільм не знайдено' });
    res.json(movie);
});

// POST /movies — додати новий фільм
app.post('/movies', (req, res) => {
    const { title, genre, release_year, duration_min, rating } = req.body;
    if (!title) return res.status(400).json({ error: 'Назва фільму обовязкова' });
    const result = db.prepare(
        'INSERT INTO movies (title, genre, release_year, duration_min, rating) VALUES (?, ?, ?, ?, ?)'
    ).run(title, genre, release_year, duration_min, rating);
    res.status(201).json({ message: 'Фільм додано', movie_id: result.lastInsertRowid });
});

// PUT /movies/:id — оновити фільм
app.put('/movies/:id', (req, res) => {
    const { title, genre, release_year, duration_min, rating } = req.body;
    const result = db.prepare(
        'UPDATE movies SET title=?, genre=?, release_year=?, duration_min=?, rating=? WHERE movie_id=?'
    ).run(title, genre, release_year, duration_min, rating, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Фільм не знайдено' });
    res.json({ message: 'Фільм оновлено' });
});

// DELETE /movies/:id — видалити фільм
app.delete('/movies/:id', (req, res) => {
    try {
        const result = db.prepare('DELETE FROM movies WHERE movie_id=?').run(req.params.id);
        if (result.changes === 0) return res.status(404).json({ error: 'Фільм не знайдено' });
        res.json({ message: 'Фільм видалено' });
    } catch (err) {
        // Спрацює тригер prevent_movie_delete якщо є сеанси
        res.status(400).json({ error: err.message });
    }
});

// =============================================
// ЗАЛИ (halls)
// =============================================

// GET /halls — отримати всі зали
app.get('/halls', (req, res) => {
    const halls = db.prepare('SELECT * FROM halls').all();
    res.json(halls);
});

// GET /halls/:id — отримати зал за ID
app.get('/halls/:id', (req, res) => {
    const hall = db.prepare('SELECT * FROM halls WHERE hall_id = ?').get(req.params.id);
    if (!hall) return res.status(404).json({ error: 'Зал не знайдено' });
    res.json(hall);
});

// POST /halls — додати новий зал
app.post('/halls', (req, res) => {
    const { hall_name, capacity, screen_type, is_vip } = req.body;
    if (!hall_name) return res.status(400).json({ error: 'Назва залу обовязкова' });
    const result = db.prepare(
        'INSERT INTO halls (hall_name, capacity, screen_type, is_vip) VALUES (?, ?, ?, ?)'
    ).run(hall_name, capacity, screen_type, is_vip ? 1 : 0);
    res.status(201).json({ message: 'Зал додано', hall_id: result.lastInsertRowid });
});

// PUT /halls/:id — оновити зал
app.put('/halls/:id', (req, res) => {
    const { hall_name, capacity, screen_type, is_vip } = req.body;
    const result = db.prepare(
        'UPDATE halls SET hall_name=?, capacity=?, screen_type=?, is_vip=? WHERE hall_id=?'
    ).run(hall_name, capacity, screen_type, is_vip ? 1 : 0, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Зал не знайдено' });
    res.json({ message: 'Зал оновлено' });
});

// DELETE /halls/:id — видалити зал
app.delete('/halls/:id', (req, res) => {
    const result = db.prepare('DELETE FROM halls WHERE hall_id=?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Зал не знайдено' });
    res.json({ message: 'Зал видалено' });
});

// =============================================
// ПЕРСОНАЛ (staff)
// =============================================

// GET /staff — отримати весь персонал
app.get('/staff', (req, res) => {
    const staff = db.prepare('SELECT * FROM staff').all();
    res.json(staff);
});

// GET /staff/:id — отримати працівника за ID
app.get('/staff/:id', (req, res) => {
    const member = db.prepare('SELECT * FROM staff WHERE staff_id = ?').get(req.params.id);
    if (!member) return res.status(404).json({ error: 'Працівника не знайдено' });
    res.json(member);
});

// POST /staff — додати працівника
app.post('/staff', (req, res) => {
    const { first_name, last_name, position, phone, hire_date } = req.body;
    if (!first_name || !last_name) return res.status(400).json({ error: 'Імя та прізвище обовязкові' });
    const result = db.prepare(
        'INSERT INTO staff (first_name, last_name, position, phone, hire_date) VALUES (?, ?, ?, ?, ?)'
    ).run(first_name, last_name, position, phone, hire_date);
    res.status(201).json({ message: 'Працівника додано', staff_id: result.lastInsertRowid });
});

// PUT /staff/:id — оновити працівника
app.put('/staff/:id', (req, res) => {
    const { first_name, last_name, position, phone, hire_date } = req.body;
    const result = db.prepare(
        'UPDATE staff SET first_name=?, last_name=?, position=?, phone=?, hire_date=? WHERE staff_id=?'
    ).run(first_name, last_name, position, phone, hire_date, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Працівника не знайдено' });
    res.json({ message: 'Працівника оновлено' });
});

// DELETE /staff/:id — видалити працівника
app.delete('/staff/:id', (req, res) => {
    const result = db.prepare('DELETE FROM staff WHERE staff_id=?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Працівника не знайдено' });
    res.json({ message: 'Працівника видалено' });
});

// =============================================
// СЕАНСИ (sessions)
// =============================================

// GET /sessions — отримати всі сеанси з назвою фільму і залу
app.get('/sessions', (req, res) => {
    const sessions = db.prepare(`
        SELECT s.session_id, m.title AS movie_name, h.hall_name,
               st.first_name || ' ' || st.last_name AS staff_name,
               s.start_time, s.price
        FROM sessions s
        JOIN movies m ON s.movie_id = m.movie_id
        JOIN halls h ON s.hall_id = h.hall_id
        JOIN staff st ON s.staff_id = st.staff_id
    `).all();
    res.json(sessions);
});

// GET /sessions/:id — отримати сеанс за ID
app.get('/sessions/:id', (req, res) => {
    const session = db.prepare('SELECT * FROM sessions WHERE session_id = ?').get(req.params.id);
    if (!session) return res.status(404).json({ error: 'Сеанс не знайдено' });
    res.json(session);
});

// POST /sessions — додати сеанс
app.post('/sessions', (req, res) => {
    const { movie_id, hall_id, staff_id, start_time, price } = req.body;
    if (!movie_id || !hall_id) return res.status(400).json({ error: 'movie_id та hall_id обовязкові' });
    const result = db.prepare(
        'INSERT INTO sessions (movie_id, hall_id, staff_id, start_time, price) VALUES (?, ?, ?, ?, ?)'
    ).run(movie_id, hall_id, staff_id, start_time, price);
    res.status(201).json({ message: 'Сеанс додано', session_id: result.lastInsertRowid });
});

// PUT /sessions/:id — оновити сеанс
app.put('/sessions/:id', (req, res) => {
    const { movie_id, hall_id, staff_id, start_time, price } = req.body;
    const result = db.prepare(
        'UPDATE sessions SET movie_id=?, hall_id=?, staff_id=?, start_time=?, price=? WHERE session_id=?'
    ).run(movie_id, hall_id, staff_id, start_time, price, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Сеанс не знайдено' });
    res.json({ message: 'Сеанс оновлено' });
});

// DELETE /sessions/:id — видалити сеанс
app.delete('/sessions/:id', (req, res) => {
    const result = db.prepare('DELETE FROM sessions WHERE session_id=?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Сеанс не знайдено' });
    res.json({ message: 'Сеанс видалено' });
});

// =============================================
// КВИТКИ (tickets)
// =============================================

// GET /tickets — отримати всі квитки
app.get('/tickets', (req, res) => {
    const tickets = db.prepare(`
        SELECT t.ticket_id, m.title AS movie_name, h.hall_name,
               s.start_time, t.row_num, t.seat_num, t.status, t.purchase_time
        FROM tickets t
        JOIN sessions s ON t.session_id = s.session_id
        JOIN movies m ON s.movie_id = m.movie_id
        JOIN halls h ON s.hall_id = h.hall_id
    `).all();
    res.json(tickets);
});

// GET /tickets/:id — отримати квиток за ID
app.get('/tickets/:id', (req, res) => {
    const ticket = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?').get(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Квиток не знайдено' });
    res.json(ticket);
});

// POST /tickets — продати квиток
app.post('/tickets', (req, res) => {
    const { session_id, row_num, seat_num, status } = req.body;
    if (!session_id || !row_num || !seat_num) {
        return res.status(400).json({ error: 'session_id, row_num, seat_num обовязкові' });
    }
    try {
        const purchase_time = new Date().toISOString();
        const result = db.prepare(
            'INSERT INTO tickets (session_id, row_num, seat_num, purchase_time, status) VALUES (?, ?, ?, ?, ?)'
        ).run(session_id, row_num, seat_num, purchase_time, status || 'Sold');
        res.status(201).json({ message: 'Квиток продано', ticket_id: result.lastInsertRowid });
    } catch (err) {
        // Спрацює тригер check_seat_occupied якщо місце зайняте
        res.status(400).json({ error: err.message });
    }
});

// PUT /tickets/:id — оновити статус квитка
app.put('/tickets/:id', (req, res) => {
    const { status } = req.body;
    const result = db.prepare(
        'UPDATE tickets SET status=? WHERE ticket_id=?'
    ).run(status, req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Квиток не знайдено' });
    res.json({ message: 'Квиток оновлено' });
});

// DELETE /tickets/:id — видалити квиток
app.delete('/tickets/:id', (req, res) => {
    const result = db.prepare('DELETE FROM tickets WHERE ticket_id=?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Квиток не знайдено' });
    res.json({ message: 'Квиток видалено' });
});

// =============================================
// ЗАПУСК СЕРВЕРА
// =============================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🎬 Cinema API запущено на http://localhost:${PORT}`);
    console.log('');
    console.log('Доступні маршрути:');
    console.log('  GET    /movies        - всі фільми');
    console.log('  POST   /movies        - додати фільм');
    console.log('  PUT    /movies/:id    - оновити фільм');
    console.log('  DELETE /movies/:id    - видалити фільм');
    console.log('  GET    /halls         - всі зали');
    console.log('  GET    /staff         - весь персонал');
    console.log('  GET    /sessions      - всі сеанси');
    console.log('  GET    /tickets       - всі квитки');
    console.log('  POST   /tickets       - продати квиток');
});
aaaaaa!!!