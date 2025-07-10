# 🚀 Backend Setup Guide

## Il problema è che il backend non è attivo sulla porta 8080!

### 1. **Verifica se il backend esiste**
```bash
# Cerca file del backend
find /var/www -name "*backend*" -o -name "*api*" -o -name "*server*"
find /home -name "*backend*" -o -name "*api*" -o -name "*server*"
find /opt -name "*backend*" -o -name "*api*" -o -name "*server*"
```

### 2. **Se il backend è Node.js**
```bash
# Cerca package.json
find / -name "package.json" -path "*/backend/*" 2>/dev/null
find / -name "package.json" -path "*/api/*" 2>/dev/null

# Avvia il backend
cd /path/to/backend
npm install
npm start
# oppure
node server.js
# oppure
npm run dev
```

### 3. **Se il backend è Python**
```bash
# Cerca file Python
find / -name "*.py" -path "*backend*" 2>/dev/null
find / -name "app.py" -o -name "main.py" -o -name "server.py" 2>/dev/null

# Avvia il backend
cd /path/to/backend
python3 app.py
# oppure
python3 -m uvicorn main:app --host 0.0.0.0 --port 8080
```

### 4. **Se il backend è Java**
```bash
# Cerca file JAR
find / -name "*.jar" -path "*backend*" 2>/dev/null

# Avvia il backend
java -jar backend.jar --server.port=8080
```

### 5. **Configurazione richiesta per il backend**

Il backend DEVE:
- ✅ Ascoltare sulla porta **8080**
- ✅ Supportare **HTTPS** (o HTTP con proxy Apache)
- ✅ Accettare richieste da `https://notificamy.com`
- ✅ Avere gli endpoint API sotto `/api/v1/`

### 6. **Esempio configurazione CORS (Node.js)**
```javascript
app.use(cors({
  origin: ['https://notificamy.com', 'https://notificamy.com:8080'],
  credentials: true
}));

app.listen(8080, () => {
  console.log('Backend running on port 8080');
});
```

### 7. **Creare un servizio systemd**
```bash
# Crea il file di servizio
sudo nano /etc/systemd/system/notificamy-backend.service
```

Contenuto:
```ini
[Unit]
Description=NotifyMe Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/backend
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
```

Poi:
```bash
sudo systemctl daemon-reload
sudo systemctl enable notificamy-backend
sudo systemctl start notificamy-backend
sudo systemctl status notificamy-backend
```