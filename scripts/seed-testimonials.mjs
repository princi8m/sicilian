import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const testimonials = [
  {
    name: "David Marshall",
    body: "Proud to have been selected for this prestigious festival! Perfect all the way around.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/002/039/925/thumb/a7567e01ea-avatar.jpg?1618789460",
    rating: 5,
    reviewedAt: new Date("2026-06-01"),
    featured: true,
    order: 1,
  },
  {
    name: "Ava Della Pietra",
    body: "I'm honored and thrilled to have won the award for \"Best Music Video\" for my music video, \"Marionette!\" Thank you to everyone at the Berlin Indie Film Festival for considering my work and for providing such a wonderful experience.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/003/384/223/thumb/da95d8ee9a-avatar.jpg?1696465514",
    rating: 5,
    reviewedAt: new Date("2026-05-01"),
    featured: true,
    order: 2,
  },
  {
    name: "Emmanuelle Legendre",
    body: "Je remercie ce festival pour son intérêt pour Nos refuges. Mais je n'ai pas eu d'autres nouvelles de leur part ensuite, sauf une réponse à mon mail qui invitait à une rencontre. Ce n'était pas très clair pour moi de savoir si le film allait être montré à des spectateurs, que ce soit en ligne ou lors d'une projection en salle.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/003/092/631/thumb/1eca883c2a-avatar.jpg?1733871743",
    rating: 4,
    reviewedAt: new Date("2026-05-01"),
    featured: true,
    order: 3,
  },
  {
    name: "Zac La Roc",
    body: "Wonderful festival. Eclectic taste curated to perfection. Not clout chasing — just lovers of cinema.",
    avatarPath: "https://secure.gravatar.com/avatar/c1f3c5a1acdeb702469f18ec2bd5deb7?d=https%3A%2F%2Fpublic-assets.filmfreeway.com%2Fusers%2Fdefault_avatars4%2Fuser-avatar-10.gif&r=pg&s=150",
    rating: 5,
    reviewedAt: new Date("2026-04-01"),
    featured: true,
    order: 4,
  },
  {
    name: "Joshua Meszaros",
    body: "The Berlin Indie Film Festival is a wonderfully organized event that provides a reliable platform for independent filmmakers. We are truly grateful for awarding our feature documentary Tango with the Wolf the title of Best Mobile Feature Film.\n\nThis recognition means a great deal to us, and we are very proud to receive your award. Our documentary was created to give a voice to people living with addiction and impulse control disorders. We deeply appreciate the opportunity to help bring awareness to this important topic.\n\nThank you for supporting our work and helping it reach a wider audience.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/004/483/513/thumb/69eaf27666-avatar.jpg?1750458516",
    rating: 5,
    reviewedAt: new Date("2026-04-01"),
    featured: true,
    order: 5,
  },
  {
    name: "Akiko Matsumoto",
    body: "I was honored that my film was chosen, standing out amid an impressive selection of diverse and creative works. The festival provided a vibrant platform for filmmakers to connect and share their passion for storytelling.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/002/772/966/thumb/de37a9dbbc-avatar.jpg?1735567653",
    rating: 5,
    reviewedAt: new Date("2026-04-01"),
    featured: true,
    order: 6,
  },
  {
    name: "Hendric Weiner",
    body: "I'm incredibly happy to be part of this film festival — especially with two of my short films selected. From the very first contact, the team has been warm, professional, and genuinely supportive. You can truly feel the passion for cinema and the dedication to emerging filmmakers.\n\nWhat stood out most was the welcoming atmosphere, the thoughtful communication, and the great opportunities to connect with other creatives. Festivals like this don't just screen films — they create community, inspiration, and momentum for storytellers.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/004/289/376/thumb/852ba31359-avatar.jpg?1753093594",
    rating: 5,
    reviewedAt: new Date("2026-02-01"),
    featured: true,
    order: 7,
  },
  {
    name: "Scott West",
    body: "5 Stars! Great communication!! Very well run and responsive film festival for independent film makers!! Great exposure for indy projects.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/004/436/806/thumb/cdf425bdd4-avatar.jpg?1775118002",
    rating: 5,
    reviewedAt: new Date("2026-02-01"),
    featured: true,
    order: 8,
  },
  {
    name: "Uwe Schwarzwalder",
    body: "Great film festival and fun to be part of. We're honoured to be award winner. Big thanks!",
    avatarPath: null,
    rating: 5,
    reviewedAt: new Date("2026-01-01"),
    featured: true,
    order: 9,
  },
  {
    name: "Andrea de Santis",
    body: "Berlin Indie Film Festival was a smooth and professional experience. Communication was clear, the team was responsive, and the overall process on FilmFreeway was straightforward. I appreciated the festival's focus on independent voices and the respectful way filmmakers are treated.\n\nThank you to the programmers and organizers for the work behind the scenes — I'd be happy to submit again.",
    avatarPath: "https://filmfreeway-production-storage-01-connector.filmfreeway.com/users/avatars/003/831/842/thumb/35bb0a0f66-avatar.jpg?1766418669",
    rating: 5,
    reviewedAt: new Date("2026-01-01"),
    featured: true,
    order: 10,
  },
];

async function main() {
  await prisma.testimonial.deleteMany();
  const result = await prisma.testimonial.createMany({ data: testimonials });
  console.log(`Inserted ${result.count} testimonials.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
