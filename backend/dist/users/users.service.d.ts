import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        nickname: string;
        password: string;
        id: number;
    }>;
    findByEmail(email: string): Promise<{
        email: string;
        nickname: string;
        password: string;
        id: number;
    } | null>;
    findById(id: number): Promise<{
        email: string;
        nickname: string;
        password: string;
        id: number;
    } | null>;
}
