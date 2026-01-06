const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Semeando dados...');

  await prisma.alumnus.createMany({
    data: [
      {
        fullName: 'José Arthur Ferreira',
        email: 'jose.arthur@exemplo.com',
        phone: '86999999999',
        birthDate: new Date('2000-01-01'),
        course: 'Engenharia de Computação',
        graduationYear: 2023,
        country: 'Brasil',
        city: 'Teresina',
        role: 'Arquiteto de Software',
        company: 'IME Júnior',
        bio: 'Arquiteto inicial do sistema Alumni.'
      },
      {
        fullName: 'Thiago Domingos',
        email: 'thiago.d@exemplo.com',
        phone: '86988888888',
        birthDate: new Date('1999-05-15'),
        course: 'Ciência da Computação',
        graduationYear: 2022,
        country: 'Brasil',
        city: 'Teresina',
        role: 'Desenvolvedor Fullstack',
        company: 'Tech Solutions'
      }
    ]
  });

  console.log('✅ Banco de dados semeado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
