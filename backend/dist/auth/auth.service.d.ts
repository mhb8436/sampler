import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<{
        email: string;
        nickname: string;
        id: number;
    } | null>;
    login(loginUserDto: LoginUserDto): Promise<{
        access_token: string;
    }>;
    signup(data: CreateUserDto): Promise<{
        email: string;
        nickname: string;
        password: string;
        id: number;
    }>;
}
