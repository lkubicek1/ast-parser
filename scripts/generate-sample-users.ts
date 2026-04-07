import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { faker } from '@faker-js/faker';

const SAMPLE_COUNT = 12;
const SAMPLE_SEED = 42;

faker.seed(SAMPLE_SEED);

type SampleUser = {
  name: string;
  email: string;
  age: number;
};

function toAscii(value: string): string {
  return value.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
}

function toEmailHandle(value: string): string {
  return toAscii(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '') || 'user';
}

function createSampleUser(index: number): SampleUser {
  const firstName = toAscii(faker.person.firstName());
  const lastName = toAscii(faker.person.lastName());
  const name = `${firstName} ${lastName}`;

  return {
    name,
    email: `${toEmailHandle(`${firstName}.${lastName}.${index + 1}`)}@example.com`,
    age: faker.number.int({ min: 20, max: 80 }),
  };
}

const sampleUsers = Array.from({ length: SAMPLE_COUNT }, (_, index) => createSampleUser(index)).sort((left, right) =>
  left.name.localeCompare(right.name),
);

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(currentDirectory, '../src/data/sampleUsers.json');

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(sampleUsers, null, 2)}\n`);

console.log(`Generated ${sampleUsers.length} sample users at ${outputPath}`);
