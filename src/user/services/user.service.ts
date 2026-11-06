export class UsersService {
    async create() {
        try {
            return { message: "HOLA MUNDO - CREATE" }
            
        } catch (error) {
            
            throw error;
        }
    }

    async update() {
        return { message: "HOLA MUNDO - UPDATE" }
    }

    async delete() {
        return { message: "HOLA MUNDO - delete" }
    }

    async findOne() {
        return { message: "HOLA MUNDO - findOne" }
    }

    async findAll() {
        return { message: "HOLA MUNDO - findAll" }
    }
}