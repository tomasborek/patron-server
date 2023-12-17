import { PrismaClient } from '@prisma/client';

interface IDatabase {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  getClient: () => PrismaClient;
}

export default class Database implements IDatabase {
  private client: PrismaClient;
  private static instance: Database;
  constructor() {
    if (Database.instance) {
      throw new Error('Instance already exists');
    }
    this.client = new PrismaClient();
  }

  connect() {
    return this.client.$connect();
  }
  disconnect() {
    return this.client.$disconnect();
  }
  getClient() {
    return this.client;
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
