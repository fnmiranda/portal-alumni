const prisma = require('../database/prisma');

// --- LISTAGEM ---
const listAlumni = async (req, res, next) => {
  try {
    const { course, graduationYear, city } = req.query;

    const where = {};
    if (course) where.course = course;
    if (graduationYear) where.graduationYear = Number(graduationYear);
    if (city) where.city = { contains: city, mode: 'insensitive' };

    const alumni = await prisma.alumnus.findMany({
      where,
      orderBy: { fullName: 'asc' },
    });

    return res.status(200).json(alumni);
  } catch (error) {
    next(error);
  }
};

// --- CADASTRO ---
const createAlumnus = async (req, res, next) => {
  try {
    // req.body já foi validado pelo middleware de validação
    const data = req.body;

    // Se houver arquivo, o Multer salvou no Cloudinary e colocou o link em req.file.path
    if (req.file) {
      data.profilePicture = req.file.path;
    }

    const newAlumnus = await prisma.alumnus.create({
      data: data, // Não precisa de ...data se data já for o objeto
    });

    return res.status(201).json(newAlumnus);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listAlumni,
  createAlumnus,
};
