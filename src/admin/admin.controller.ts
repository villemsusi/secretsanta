import { Controller, Get, Redirect, Render, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { or } from 'sequelize';


@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly userService: UserService,
    ) { }

    @Get()
    @Render('admin')
    async admin(@Req() request: Request): Promise<any> {
        if (request.cookies['santa_auth']) {
            const auth = request.cookies['santa_auth'];
            let user = await this.userService.findOne({ where: { decryptionCode: auth } });
            if (user && user.isAdmin) {
                const users = await this.userService.findAll({ order: [['name', 'ASC']], include: [{ model: User }] });
                const validation = await this.adminService.validateSantas();
                return { info: 'Admin page', isAdmin: true, users: users, validationResult: validation };
            }
        }
        return { info: 'Admin page' };
    }

    @Get('generate')
    @Redirect('/admin')
    async generateSantas(@Req() request: Request): Promise<any> {
        if (request.cookies['santa_auth']) {
            const auth = request.cookies['santa_auth'];
            let user = await this.userService.findOne({ where: { decryptionCode: auth } });

            if (user && user.isAdmin) {
                await this.adminService.assignSantas();
                user = await this.userService.findOne({ where: { name: user.name } });
                request.res.cookie('santa_auth', user.decryptionCode, { maxAge: 5184000000, httpOnly: true });
                return;
            }
        }
        // Make sure that a list can be generated even without an admin user.
        let users = await this.userService.findAll({ where: { isAdmin: true } });
        if (users.length === 0) {
            await this.adminService.assignSantas();
        }
    }
}
