import { PrismaClient, Role, UserStatus, EmployeeStatus } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  await prisma.refreshToken.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();
  await prisma.jobTitle.deleteMany();
  await prisma.department.deleteMany();

  console.log('Database cleaned.');

  const departmentsData = [
    { name: 'Executive', description: 'C-Level and Directors' },
    { name: 'Engineering', description: 'Product development and engineering' },
    {
      name: 'Human Resources',
      description: 'People operations and recruiting',
    },
    { name: 'Sales', description: 'Revenue and account management' },
    { name: 'Marketing', description: 'Brand and growth' },
  ];

  const departments = await Promise.all(
    departmentsData.map((d) => prisma.department.create({ data: d }))
  );
  console.log(`Created ${departments.length} departments.`);

  const titlesData = [
    { title: 'CEO', min: 200000, max: 500000 },
    { title: 'CTO', min: 180000, max: 400000 },
    { title: 'Engineering Manager', min: 140000, max: 220000 },
    { title: 'Senior Software Engineer', min: 110000, max: 180000 },
    { title: 'Software Engineer', min: 70000, max: 130000 },
    { title: 'HR Director', min: 90000, max: 160000 },
    { title: 'Sales Representative', min: 50000, max: 100000 },
  ];

  const jobTitles = await Promise.all(
    titlesData.map((t) =>
      prisma.jobTitle.create({
        data: {
          title: t.title,
          minSalary: t.min,
          maxSalary: t.max,
        },
      })
    )
  );
  console.log(`Created ${jobTitles.length} job titles.`);

  const passwordHash = await hash('password123');

  const random = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@airy.local',
      username: 'admin',
      name: 'System Admin',
      password: passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log('Created Admin user.');

  const employeeCount = 20;

  for (let i = 0; i < employeeCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const username = faker.internet
      .username({ firstName, lastName })
      .toLowerCase();

    const jobTitle = random(jobTitles);
    let role: Role = Role.USER;
    if (
      jobTitle.title.includes('Director') ||
      jobTitle.title.includes('CTO') ||
      jobTitle.title.includes('CEO')
    )
      role = Role.ADMIN;
    else if (jobTitle.title.includes('Manager')) role = Role.MANAGER;
    else if (jobTitle.title.includes('HR')) role = Role.HR;

    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: `${firstName} ${lastName}`,
        password: passwordHash,
        role,
        status: UserStatus.ACTIVE,
      },
    });

    await prisma.employee.create({
      data: {
        firstName,
        lastName,
        email,
        personalEmail: faker.internet.email(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        dateOfBirth: faker.date.birthdate({ min: 22, max: 60, mode: 'age' }),
        status: EmployeeStatus.ACTIVE,
        hireDate: faker.date.past({ years: 5 }),
        userId: user.id,
        departmentId: random(departments).id,
        jobTitleId: jobTitle.id,
      },
    });

    await prisma.refreshToken.create({
      data: {
        token: faker.string.uuid(),
        userId: user.id,
        deviceInfo: faker.internet.userAgent(),
        ipAddress: faker.internet.ipv4(),
        expiresAt: faker.date.future(),
      },
    });
  }

  console.log(`Created ${employeeCount} employees with user accounts.`);
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
