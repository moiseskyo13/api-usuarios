import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json()); // Middleware para processar JSON no corpo das requisições

// Conectar ao MongoDB
const uri = "mongodb+srv://moiseskyo6543210:Mmwl8842@cluster0.rjqzz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
  .then(() => console.log('Conectado ao MongoDB Atlas!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB', err));

// Definição do esquema e modelo
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Endpoint para adicionar usuários (POST)
app.post('/usuarios', async (req, res) => {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
        // Verificar se o email já está cadastrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email já está em uso.' });
        }

        const user = new User({ email, password });
        await user.save(); // Salvar no MongoDB
        res.status(201).json({ message: 'Usuário criado com sucesso!', user });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao salvar o usuário: ' + err.message });
    }
});

// Endpoint para listar usuários (GET)
app.get('/usuarios', async (req, res) => {
    try {
        // Buscar usuários no MongoDB, mas retornando apenas os campos 'email' e 'password'
        const users = await User.find({}, 'email password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar usuários: ' + err.message });
    }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
