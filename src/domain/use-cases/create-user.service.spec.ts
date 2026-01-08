import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserService } from './create-user.service';
import { UserRepositoryOrm } from 'src/infrastructure/repository/user-repository-orm';
import { UserDuplicatedException } from '../exceptions/user-duplicated-exception';
import * as bcrypt from 'bcrypt';
import { DeepPartial } from 'typeorm';
import { IUser } from 'src/domain/entities/user-entity.interface';

jest.mock('bcrypt');

describe('CreateUserService', () => {
	let service: CreateUserService;
	let userRepository: jest.Mocked<UserRepositoryOrm>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateUserService,
				{
					provide: UserRepositoryOrm,
					useValue: {
						createUser: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<CreateUserService>(CreateUserService);
		userRepository = module.get(UserRepositoryOrm) as jest.Mocked<UserRepositoryOrm>;
	});

	it('returns DeepPartial<IUser> with password undefined', async () => {
		const mockSavedUser: DeepPartial<IUser> = {
			id: 'uuid-1',
			username: 'testuser',
			firstName: 'Test',
			lastName: 'User',
			email: 'test@example.com',
			passwordHash: 'hashedPassword123',
			isActive: true,
		};
		(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
		userRepository.createUser.mockResolvedValue(mockSavedUser);

		const result = await service.execute({
			username: 'testuser',
			firstName: 'Test',
			lastName: 'User',
			email: 'test@example.com',
			password: 'plainPassword',
		});

		expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 6);
		expect(userRepository.createUser).toHaveBeenCalledWith({
			username: 'testuser',
			firstName: 'Test',
			lastName: 'User',
			email: 'test@example.com',
			passwordHash: 'hashedPassword123',
			isActive: true,
		});

		// Ensure returned object hides password
		expect((result as any).password).toBeUndefined();
		// And preserves saved user fields
		expect(result).toMatchObject(mockSavedUser);
	});

	it('throws UserDuplicatedException when creating duplicate user', async () => {
		const mockSavedUser: DeepPartial<IUser> = {
			id: 'uuid-2',
			username: 'dupuser',
			firstName: 'Dup',
			lastName: 'User',
			email: 'dup@example.com',
			passwordHash: 'hashedPassword123',
			isActive: true,
		};

		(bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
		userRepository.createUser
			.mockResolvedValueOnce(mockSavedUser)
			.mockResolvedValueOnce(null as any);

		// First creation succeeds
		const first = await service.execute({
			username: 'dupuser',
			firstName: 'Dup',
			lastName: 'User',
			email: 'dup@example.com',
			password: 'plainPassword',
		});
		expect(first).toMatchObject(mockSavedUser);

		// Second creation (duplicate) throws
		await expect(
			service.execute({
				username: 'dupuser',
				firstName: 'Dup',
				lastName: 'User',
				email: 'dup@example.com',
				password: 'plainPassword',
			}),
		).rejects.toBeInstanceOf(UserDuplicatedException);
	});
});

