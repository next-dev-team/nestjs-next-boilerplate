import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '@schema/entities/user.entity';

export class UserSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const userRepository = this.dataSource.getRepository(User);

    // Check if super admin already exists
    const existingSuperAdmin = await userRepository.findOne({
      where: { email: 'admin@example.com' },
    });

    if (!existingSuperAdmin) {
      const superAdmin = userRepository.create({
        email: 'admin@example.com',
        password: await bcrypt.hash('Admin123!', 10),
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
        isEmailVerified: true,
      });

      await userRepository.save(superAdmin);
      console.log('✅ Super Admin created: admin@example.com / Admin123!');
    }

    // Check if test user exists
    const existingUser = await userRepository.findOne({
      where: { email: 'user@example.com' },
    });

    if (!existingUser) {
      const user = userRepository.create({
        email: 'user@example.com',
        password: await bcrypt.hash('User123!', 10),
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
        isActive: true,
        isEmailVerified: true,
      });

      await userRepository.save(user);
      console.log('✅ Test User created: user@example.com / User123!');
    }
  }
}
