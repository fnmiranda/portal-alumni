const prisma = require('../database/prisma');

/**
 * Controller responsável pela gestão de Alumni
 * JA (Ferreira): Foco em Listagem
 * TD (Domingos): Foco em Cadastro e Filtros
 */

// --- LISTAGEM (Tarefa do JA) ---
const listAlumni = async (req, res, next) => {
  try {
    const { course, graduationYear, city } = req.query;

    // Criamos um objeto de filtro dinâmico
    const where = {};
    if (course) where.course = course;
    if (graduationYear) where.graduationYear = Number(graduationYear);
    if (city) where.city = { contains: city, mode: 'insensitive' }; // Busca flexível

    const alumni = await prisma.alumnus.findMany({
      where,
      orderBy: { fullName: 'asc' },
    });

    return res.status(200).json(alumni);
  } catch (error) {
    next(error);
  }
};

// --- CADASTRO (Tarefa do TD) ---
const createAlumnus = async (req, res, next) => {
  try {
    // Os dados já chegam validados pelo Zod através do middleware do Miranda
    const data = req.body;

    const newAlumnus = await prisma.alumnus.create({
      data: {
        ...data,
        // Caso queira tratar algum campo específico antes de salvar
      },
    });

    return res.status(201).json(newAlumnus);
  } catch (error) {
    next(error); // Envia para o error.middleware.js do Miranda
  }
};

module.exports = {
  listAlumni,
  createAlumnus,
};
