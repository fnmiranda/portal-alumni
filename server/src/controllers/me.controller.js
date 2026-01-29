const prisma = require('../database/prisma');
const { cloudinary } = require('../config/cloudinary');

function getUserModel() {
  return prisma.user || prisma.users;
}

function getAlumnusModel() {
  return prisma.alumnus || prisma.alumni;
}

async function me(req, res, next) {
  try {
    const User = getUserModel();
    const u = await User.findUnique({ where: { id: req.user.id } });

    if (!u) return res.status(404).json({ message: 'Usuário não encontrado.' });

    return res.status(200).json({
      id: u.id,
      email: u.email,
      fullName: u.fullName ?? u.full_name,
    });
  } catch (err) {
    next(err);
  }
}

async function upsertProfile(req, res, next) {
  try {
    const User = getUserModel();
    const Alumnus = getAlumnusModel();

    const u = await User.findUnique({ where: { id: req.user.id } });
    if (!u) return res.status(404).json({ message: 'Usuário não encontrado.' });

    const fullName = u.fullName ?? u.full_name;
    const data = req.body;

    // --- LÓGICA DE UPLOAD E REMOÇÃO DE IMAGEM ---

    // undefined = não mexe no banco (mantém a atual)
    // null = apaga a foto do banco
    // string = salva a nova url
    let profilePictureUrl = undefined;

    // CASO 1: Usuário enviou uma nova foto
    if (req.file) {
      try {
        // Converte o Buffer (RAM) para Base64 string
        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        // Envia para o Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'alumni_profiles',
          resource_type: 'auto',
        });

        profilePictureUrl = result.secure_url;
      } catch (uploadError) {
        throw new Error('Falha ao processar a imagem do perfil.');
      }
    }
    // CASO 2: Usuário pediu para remover a foto (e não enviou uma nova)
    else if (data.removePhoto === 'true' || data.removePhoto === true) {
      profilePictureUrl = null;
    }

    // mapeia campos do front -> campos do model Alumnus
    const mapped = {
      fullName,
      email: u.email,
      preferredName: data.preferredName || null,
      phone: data.phone,
      birthDate: data.birthDate ? new Date(data.birthDate) : undefined,

      country: data.country,
      state: data.state || null,
      city: data.city || null,
      addressComp: data.addressComplement || null,

      course: data.course,
      graduationYear: data.graduationYear,

      company: data.company || null,
      role: data.role || null,
      yearsOfExperience: data.yearsOfExperience ?? null,

      linkedinUrl: data.linkedinUrl || null,
      bio: data.bio || null,
      skills: Array.isArray(data.skills) ? data.skills : [],

      // Lógica crucial:
      // Se for undefined (nada mudou), essa chave nem entra no objeto (Prisma ignora).
      // Se for null (remover), entra como null e limpa o banco.
      // Se for string (nova foto), entra a URL nova.
      ...(profilePictureUrl !== undefined && { profilePicture: profilePictureUrl }),
    };

    const tryUpsert = async (key) => {
      return Alumnus.upsert({
        where: { [key]: u.id },
        create: { [key]: u.id, ...mapped },
        update: mapped,
      });
    };

    let profile;
    try {
      profile = await tryUpsert('userId');
    } catch (e) {
      const msg = String(e?.message || '');
      if (msg.includes('Unknown argument') || msg.includes('Unknown arg')) {
        profile = await tryUpsert('user_id');
      } else {
        throw e;
      }
    }

    return res.status(200).json({
      ...profile,
      company: profile.company ?? profile.company ?? null,
      addressComplement:
        profile.addressComp ?? profile.addressComplement ?? null,
    });
  } catch (err) {
    next(err);
  }
}

async function getMyProfile(req, res, next) {
  try {
    const userId = req.userId || req.user?.id || req.user?.sub;
    let profile = null;

    try {
      profile = await prisma.alumnus.findUnique({ where: { userId } });
    } catch (_) { }

    if (!profile) {
      try {
        profile = await prisma.alumnus.findUnique({
          where: { user_id: userId },
        });
      } catch (_) { }
    }

    if (!profile) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    return res.status(200).json({
      ...profile,
      company: profile.company ?? profile.company ?? null,
      addressComplement:
        profile.addressComp ?? profile.addressComplement ?? null,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { me, upsertProfile, getMyProfile };
