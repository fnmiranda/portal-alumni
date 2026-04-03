const prisma = require('../database/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { z } = require('zod');

// Importando os serviços de e-mail corretamente do arquivo vizinho
const { 
  sendPasswordResetEmail, 
  sendConfirmationEmail 
} = require('../services/emailService');

const registerSchema = z.object({
  fullName: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres")
});

function getUserModel() {
  return prisma.user || prisma.users;
}

function isCamelCaseModel(User) {
  return User === prisma.user;
}

function getFieldNames(User) {
  if (isCamelCaseModel(User)) {
    return {
      fullName: 'fullName',
      passwordHash: 'passwordHash',
      resetToken: 'resetPasswordToken',
      resetExpires: 'resetPasswordExpires',
    };
  }

  return {
    fullName: 'full_name',
    passwordHash: 'password_hash',
    resetToken: 'reset_password_token',
    resetExpires: 'reset_password_expires',
  };
}

function toPublicUser(u) {
  if (!u) return null;
  return {
    id: u.id,
    fullName: u.fullName ?? u.full_name,
    email: u.email,
  };
}

async function register(req, res, next) {
  try {
    const { fullName, email, password } = registerSchema.parse(req.body);
    const User = getUserModel();
    
    // Fallback dinâmico para garantir que ache a tabela de pendentes no Prisma
    const PendingUserModel = prisma.pendingUser || prisma.pending_user || prisma.pending_users;

    const existing = await User.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Usuário já cadastrado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    await PendingUserModel.upsert({
      where: { email },
      update: { 
        full_name: fullName, 
        password_hash: passwordHash, 
        code_hash: verificationToken,
        expires_at: expiresAt 
      },
      create: {
        email,
        full_name: fullName,
        password_hash: passwordHash,
        code_hash: verificationToken,
        expires_at: expiresAt
      }
    });

    sendConfirmationEmail(email, fullName, verificationToken).catch(err => {
      console.error("Erro ao enviar e-mail de confirmação em background:", err);
    });

    return res.status(201).json({ message: "Link de confirmação enviado para o seu e-mail." });
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    // Agora aceitamos o token tanto pelo corpo (POST) quanto pela URL (GET)
    const token = req.body.token || req.query.token; 

    if (!token) {
      return res.status(400).json({ message: "Nenhum token foi fornecido." });
    }

    const User = getUserModel();
    const fields = getFieldNames(User);
    const PendingUserModel = prisma.pendingUser || prisma.pending_user || prisma.pending_users;

    // 1. Buscar registro pendente APENAS pelo token
    const pending = await PendingUserModel.findFirst({ where: { code_hash: token } });

    if (!pending) {
      return res.status(400).json({ message: "Token inválido ou e-mail já confirmado." });
    }

    if (new Date() > pending.expires_at) {
      return res.status(400).json({ message: "Este link expirou. Tente se cadastrar novamente." });
    }

    // 2. Transação: Mover para a tabela definitiva e apagar da pendente
    await prisma.$transaction(async (tx) => {
      const TxPendingUserModel = tx.pendingUser || tx.pending_user || tx.pending_users;
      const TxUserModel = tx.user || tx.users;

      // Cria o usuário na tabela principal
      await TxUserModel.create({
        data: {
          email: pending.email,
          [fields.fullName]: pending.full_name,
          [fields.passwordHash]: pending.password_hash,
          email_verified: true // Marca como verificado conforme nosso novo schema!
        }
      });

      // Remove da tabela de pendentes usando o ID que acabamos de encontrar
      await TxPendingUserModel.delete({ where: { id: pending.id } });
    });

    return res.status(200).json({ message: "E-mail confirmado com sucesso! Você já pode fazer login." });
  } catch (err) {
    if (err?.code === 'P2002') {
      return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const User = getUserModel();
    const fields = getFieldNames(User);
    const { email, password } = req.body;

    const found = await User.findUnique({ where: { email } });

    if (!found) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const hash = found[fields.passwordHash];
    const ok = await bcrypt.compare(password, hash);

    if (!ok) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ sub: found.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    return res.status(200).json({
      token,
      user: toPublicUser(found),
    });
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const User = getUserModel();
    const fields = getFieldNames(User);
    const { email } = req.body;

    const found = await User.findUnique({ where: { email } });

    const genericResponse = {
      message: 'Se o e-mail existir no sistema, as instruções de recuperação foram enviadas.',
    };

    if (!found) return res.status(200).json(genericResponse);

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await User.update({
      where: { id: found.id },
      data: {
        [fields.resetToken]: token,
        [fields.resetExpires]: expiresAt,
      },
    });

    const userName = found[fields.fullName] || 'usuário';
    
    sendPasswordResetEmail(found.email, userName, token).catch(err => {
      console.error("Erro ao enviar e-mail de recuperação em background:", err);
    });

    return res.status(200).json(genericResponse);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const User = getUserModel();
    const fields = getFieldNames(User);
    const { token, password } = req.body;

    const found = await User.findFirst({
      where: {
        [fields.resetToken]: token,
        [fields.resetExpires]: {
          gt: new Date(),
        },
      },
    });

    if (!found) {
      return res.status(400).json({ message: 'Token inválido ou expirado.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.update({
      where: { id: found.id },
      data: {
        [fields.passwordHash]: passwordHash,
        [fields.resetToken]: null,
        [fields.resetExpires]: null,
      },
    });

    return res.status(200).json({ message: 'Senha redefinida com sucesso.' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
};