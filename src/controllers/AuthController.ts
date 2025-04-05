import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '@src/repositories/UserRepository';
import { User, UserDto } from '@src/models/User';

export class AuthController {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(req: Request, res: Response): Promise<Response> {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Пароли не совпадают' });
    }

    try {
      const existingUser = await this.userRepository.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь уже существует' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser: User = {
        username,
        password: hashedPassword,
      };

      const createdUser: UserDto = await this.userRepository.create(newUser);

      const token = jwt.sign(
        {
          id: createdUser.id,
          username: createdUser.username,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
      );

      return res.status(201).json({
        message: 'Пользователь успешно зарегистрирован',
        token,
        user: createdUser,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка сервера', error: err });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;

    try {
      const user = await this.userRepository.findByUsername(username);
      if (!user) {
        return res.status(400).json({ message: 'Неверные данные авторизации' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверные данные авторизации' });
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' },
      );

      const userDto: UserDto = {
        id: user.id!,
        username: user.username,
        created_at: user.created_at!,
      };

      return res.status(200).json({ token, user: userDto });
    } catch (err) {
      return res.status(500).json({ message: 'Ошибка сервера', error: err });
    }
  }
}
