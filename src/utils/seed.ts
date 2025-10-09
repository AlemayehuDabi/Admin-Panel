// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const categories = [
  "Architecture & Design",
  "Structural Engineering",
  "Electrical Systems",
  "Plumbing & Water Systems",
  "Carpentry & Woodwork",
  "Masonry & Concrete",
  "HVAC (Heating, Ventilation, Air Conditioning)",
  "Painting & Finishing",
  "Heavy Machinery & Equipment",
  "Project Management"
];

const roleTemplates: Record<string, string[]> = {
  "Architecture & Design": ["Architect", "Interior Designer", "Landscape Architect", "CAD Technician"],
  "Structural Engineering": ["Structural Engineer", "Site Engineer", "Steel Detailer", "Civil Engineer"],
  "Electrical Systems": ["Electrician", "Electrical Engineer", "Wiring Specialist", "Power Technician"],
  "Plumbing & Water Systems": ["Plumber", "Pipefitter", "Drainage Specialist", "Waterproofing Expert"],
  "Carpentry & Woodwork": ["Carpenter", "Joiner", "Cabinet Maker", "Formwork Specialist"],
  "Masonry & Concrete": ["Bricklayer", "Concrete Worker", "Stone Mason", "Tile Setter"],
  "HVAC (Heating, Ventilation, Air Conditioning)": ["HVAC Technician", "Ventilation Engineer", "Refrigeration Specialist", "Duct Installer"],
  "Painting & Finishing": ["Painter", "Plasterer", "Wallpaper Installer", "Decorator"],
  "Heavy Machinery & Equipment": ["Crane Operator", "Bulldozer Operator", "Excavator Operator", "Forklift Operator"],
  "Project Management": ["Project Manager", "Construction Manager", "Site Supervisor", "Safety Officer"]
};

async function step1() {
  for (const categoryName of categories) {
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        description: faker.lorem.sentence(),
      },
    });

    const roles = roleTemplates[categoryName] || Array.from({ length: 10 }, () => faker.person.jobTitle());

    for (const roleName of roles) {
      const role = await prisma.role.create({
        data: {
          name: roleName,
          description: faker.lorem.sentence(),
          categoryId: category.id,
        },
      });

      // 3-5 specialities for each role
      for (let i = 0; i < faker.number.int({ min: 3, max: 5 }); i++) {
        const speciality = await prisma.speciality.create({
          data: {
            name: `${roleName} Speciality ${i + 1}`,
            description: faker.lorem.sentence(),
            roleId: role.id,
          },
        });

        // 2-4 work types per speciality
        for (let j = 0; j < faker.number.int({ min: 2, max: 4 }); j++) {
          await prisma.workType.create({
            data: {
              name: `${speciality.name} WorkType ${j + 1}`,
              description: faker.lorem.sentence(),
              specialityId: speciality.id,
            },
          });
        }
      }
    }
  }
}



async function workerSeed() {
  // 1. Fetch all existing categories, roles, specialities, work types
  const categories = await prisma.category.findMany();
  const roles = await prisma.role.findMany();
  const specialities = await prisma.speciality.findMany();
  const workTypes = await prisma.workType.findMany();

  for (let i = 0; i < 250; i++) {
    // 2. Create user
    const user = await prisma.user.create({
      data: {
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        passwordHash: faker.internet.password(),
        role: "WORKER",
        status: "ACTIVE",
        verification: "APPROVED",
      },
    });

    // 3. Pick a random category and role
    const category = faker.helpers.arrayElement(categories);
    const categoryRoles = roles.filter(r => r.categoryId === category.id);
    const role = faker.helpers.arrayElement(categoryRoles);

    // 4. Create Worker
    const worker = await prisma.worker.create({
      data: {
        userId: user.id,
        categoryId: category.id,
        professionalRole: role?.name,
        profilePhoto: faker.image.avatar(),
        skills: getRandomItems(["Plumbing", "Masonry", "Wiring", "Painting", "HVAC", "Carpentry"], 3),
        workType: getRandomItems(["Residential", "Commercial", "Industrial", "Infrastructure"], 2),
        experience: `${faker.number.int({ min: 1, max: 20 })} years`,
        badges: getRandomItems(["Certified", "Trusted", "Expert", "Recommended"], 2),
        portfolio: [faker.image.url(), faker.image.url()],
        availability: { days: ["Mon", "Tue", "Wed", "Thu", "Fri"], hours: "9-5" },
        roleId: role?.id,
      },
    });

    // 5. Assign 3–5 random specialities (many-to-many)
    const chosenSpecialities = getRandomItems(specialities, faker.number.int({ min: 3, max: 5 }));
    for (const speciality of chosenSpecialities) {
      await prisma.workerSpeciality.create({
        data: {
          workerId: worker.id,
          specialityId: speciality.id,
        },
      });
    }

    // 6. Assign 2–4 random work types (many-to-many)
    const chosenWorkTypes = getRandomItems(workTypes, faker.number.int({ min: 2, max: 4 }));
    for (const workType of chosenWorkTypes) {
      await prisma.workerWorkType.create({
        data: {
          workerId: worker.id,
          workTypeId: workType.id,
        },
      });
    }

    // 7. Optionally: create 0–2 licenses
    const licenseCount = faker.number.int({ min: 0, max: 2 });
    for (let l = 0; l < licenseCount; l++) {
      await prisma.license.create({
        data: {
          workerId: worker.id,
          name: faker.helpers.arrayElement(["Electrical License", "Plumbing License", "HVAC License"]),
          issuedAt: faker.date.past(),
          expiresAt: faker.date.future(),
          documentUrl: faker.internet.url(),
        },
      });
    }

    if ((i + 1) % 50 === 0) console.log(`Created ${i + 1} workers...`);
  }

  console.log("✅ 250 Workers seeded successfully!");
}

function getRandomItems<T>(arr: T[], n: number): T[] {
  return faker.helpers.arrayElements(arr, n);
}



async function companySeed() {
  for (let i = 0; i < 100; i++) {
    // 1. Create user
    const user = await prisma.user.create({
      data: {
        fullName: faker.company.name(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        passwordHash: faker.internet.password(),
        role: "COMPANY",
        status: "ACTIVE",
        verification: "APPROVED",
      },
    });

    // 2. Create company linked to user
    await prisma.company.create({
      data: {
        userId: user.id,
        companyLogo: faker.image.avatar(),
        businessLocation: faker.location.city(),
        verificationDocuments: [
          faker.internet.url(),
          faker.internet.url(),
        ],
      },
    });

    if ((i + 1) % 20 === 0) console.log(`Created ${i + 1} companies...`);
  }

  console.log("✅ 100 Companies seeded successfully!");
}



async function JobSeed() {
  // 1. Fetch all company IDs
  const companies = await prisma.company.findMany();

  for (const company of companies) {
    // 2. Create 1–5 jobs per company
    const jobsCount = faker.number.int({ min: 1, max: 5 });

    for (let i = 0; i < jobsCount; i++) {
      await prisma.job.create({
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.paragraph(),
          requiredSkills: faker.helpers.arrayElements(
            ["Carpentry", "Plumbing", "Electrical", "Painting", "Masonry", "HVAC"],
            faker.number.int({ min: 2, max: 5 })
          ),
          jobLocation: faker.location.city(),
          payRate: faker.number.float({ min: 100, max: 2000, fractionDigits: 2 }),
          jobType: faker.helpers.arrayElement(["Full-time", "Part-time", "Contract"]),
          startDate: faker.date.soon({ days: 30 }),
          duration: faker.date.soon({ days: 90 }),
          numbersNeedWorker: faker.number.int({ min: 1, max: 5 }),
          additionalInfo: faker.lorem.sentence(),
          status: "ACTIVE",
          companyId: company.id,
        },
      });
    }
  }

  console.log("✅ Jobs seeded for all companies");
}



async function workerJobApplicationSeed() {
  // 1. Fetch all jobs
  const jobs = await prisma.job.findMany({
    include: { applications: true },
  });

  // 2. Fetch all workers
  const workers = await prisma.worker.findMany();

  for (const job of jobs) {
    // 3. Determine how many workers can be assigned (max numbersNeedWorker)
    const availableSlots = job.numbersNeedWorker - job.applications.length;
    if (availableSlots <= 0) continue;

    // 4. Pick random workers who haven't applied yet
    const workersNotApplied = workers.filter(
      (w) => !job.applications.some((app) => app.workerId === w.id)
    );

    const chosenWorkers = faker.helpers.arrayElements(
      workersNotApplied,
      Math.min(availableSlots, workersNotApplied.length)
    );

    for (const worker of chosenWorkers) {
      await prisma.workerJobApplication.create({
        data: {
          workerId: worker.id,
          jobId: job.id,
          status: faker.helpers.arrayElement(["PENDING", "ACCEPTED", "REJECTED"]),
          appliedAt: faker.date.recent({ days: 30 }),
        },
      });
    }
  }

  console.log("✅ WorkerJobApplications seeded successfully");
}


async function walletSeed() {
  // 1. Fetch users who can have a wallet
  const users = await prisma.user.findMany({
    where: {
      role: { in: ["WORKER", "COMPANY"] },
    },
    include: { wallet: true },
  });

  for (const user of users) {
    // Skip if wallet already exists
    if (user.wallet) continue;

    // 2. Create wallet
    await prisma.wallet.create({
      data: {
        userId: user.id,
        balance: parseFloat(faker.finance.amount({ min: 0, max: 10000, dec: 2 })),
        currency: "ETB",
      },
    });
  }

  console.log("✅ Wallets created for WORKER and COMPANY users");
}



async function transactionSeed() {
  const wallets = await prisma.wallet.findMany();

  for (const wallet of wallets) {
    let currentBalance = wallet.balance;

    const transactionsCount = faker.number.int({ min: 3, max: 10 });

    for (let i = 0; i < transactionsCount; i++) {
      // Randomly choose type
      const type = faker.helpers.arrayElement(["DEPOSIT", "WITHDRAWAL"]) as "DEPOSIT" | "WITHDRAWAL";

      // Determine amount
      let amount = type === "DEPOSIT"
        ? parseFloat(faker.finance.amount({ min: 100, max: 5000, dec: 2 }))
        : parseFloat(faker.finance.amount({ min: 50, max: 3000, dec: 2 }));

      // Ensure wallet balance doesn't go negative
      if (type === "WITHDRAWAL" && amount > currentBalance) {
        amount = currentBalance; // withdraw remaining balance
      }

      // Skip if balance is zero and withdrawal
      if (type === "WITHDRAWAL" && currentBalance === 0) continue;

      // Create transaction
      await prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type,
          amount,
        },
      });

      // Update balance
      currentBalance = type === "DEPOSIT" ? currentBalance + amount : currentBalance - amount;
    }

    // Finally, update wallet balance
    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: currentBalance },
    });
  }

  console.log("✅ Transactions created for all wallets!");
}





async function runAllSeedsWithDelay() {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  await step1();
  console.log("Step 1 done. Waiting 2 minutes...");
  await delay(2 * 60 * 1000);

  await workerSeed();
  console.log("Worker seed done. Waiting 2 minutes...");
  await delay(2 * 60 * 1000);

  await companySeed();
  console.log("Company seed done. Waiting 2 minutes...");
  await delay(2 * 60 * 1000);

  await JobSeed();
  console.log("Job seed done. Waiting 2 minutes...");
  await delay(2 * 60 * 1000);

  await workerJobApplicationSeed();
  console.log("WorkerJobApplication seed done. Waiting 2 minutes...");
  await delay(2 * 60 * 1000);

  await walletSeed();
  console.log("Wallet seed done. Waiting 2 minutes...");
  await delay(2 * 60 * 1000);

  await transactionSeed();
  console.log("Transaction seed done. All seeding complete!");

  await prisma.$disconnect();
}

workerJobApplicationSeed()
  .then(() => {
    console.log("✅ All seeds executed successfully");
  })
  .catch((error) => {
    console.error("Error occurred while seeding:", error);
  });